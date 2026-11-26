import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Persona, SkillKey, UserRole, UserStory } from '@/types/course';
import { reviewCardSm2, type CardSchedule, type ReviewRating } from '@/lib/srs/sm2';

export const PROGRESS_SCHEMA_VERSION = 3;

export interface LevelInfo {
  name: string;
  minXp: number;
  nextXp: number | null;
}

export const LEVELS: LevelInfo[] = [
  { name: 'Story Novice', minXp: 0, nextXp: 150 },
  { name: 'Story Writer', minXp: 150, nextXp: 450 },
  { name: 'Story Crafter', minXp: 450, nextXp: 900 },
  { name: 'Backlog Master', minXp: 900, nextXp: 1600 },
  { name: 'Story Artisan', minXp: 1600, nextXp: null },
];

export function getLevelForXp(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i];
  }
  return LEVELS[0];
}

export interface ProgressSnapshot {
  version: number;
  theme: 'light' | 'dark';
  role: UserRole;
  onboardingDone: boolean;
  preTestSkills: Record<SkillKey, number> | null;
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  lastVisitedPath: string | null;
  lessonsDone: string[];
  lessonNotes: Record<string, string>;
  quizScores: Record<string, number>;
  exerciseScores: Record<string, number>;
  skills: Record<SkillKey, number>;
  badges: string[];
  personas: Persona[];
  capstoneStories: UserStory[];
  flashcards: Record<string, CardSchedule>;
  finalExamScore: number | null;
}

interface ProgressActions {
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setRole: (role: UserRole) => void;
  setLastVisitedPath: (path: string) => void;
  completeOnboarding: (role: UserRole, initialSkills: Record<SkillKey, number>) => void;
  markLessonDone: (lessonId: string) => void;
  saveLessonNote: (lessonId: string, note: string) => void;
  recordQuizResult: (
    quizId: string,
    scorePercent: number,
    xpReward: number,
    skillUpdates: Partial<Record<SkillKey, number>>,
  ) => void;
  recordExerciseResult: (
    exerciseId: string,
    score: number,
    xpReward: number,
    skillUpdates: Partial<Record<SkillKey, number>>,
    badge?: string,
  ) => void;
  savePersona: (persona: Persona) => void;
  deletePersona: (id: string) => void;
  saveStory: (story: UserStory) => void;
  deleteStory: (id: string) => void;
  reviewFlashcard: (cardId: string, rating: ReviewRating) => void;
  recordFinalExam: (scorePercent: number) => void;
  touchActivity: () => void;
  exportSnapshot: () => string;
  importSnapshot: (json: string) => { ok: true } | { ok: false; error: string };
  resetProgress: () => void;
}

export type ProgressState = ProgressSnapshot & ProgressActions;

const INITIAL_SKILLS: Record<SkillKey, number> = {
  empathy: 15,
  writing: 15,
  ac: 15,
  splitting: 15,
  prioritizing: 15,
  estimating: 15,
  stakeholder: 15,
  backlog: 15,
};

const DEFAULT_PERSONAS: Persona[] = [
  {
    id: 'p-lan',
    name: 'Chị Lan',
    roleTitle: 'Mẹ bỉm sữa bận rộn đặt khám cho con',
    ageGroup: '32 tuổi',
    techLevel: 'Cao',
    quote: 'Tôi chỉ có thể đưa con đi khám sau 18h, chờ ở phòng khám 2 tiếng là ác mộng.',
    goals: ['Đặt lịch bác sĩ nhi ngoài giờ hành chính', 'Biết trước thời gian chờ dự kiến'],
    painPoints: ['Gọi tổng đài giờ cao điểm luôn bận', 'Phải mang sổ khám giấy dễ quên'],
    context: 'Dùng điện thoại một tay khi trông con, ưu tiên thao tác dưới 2 phút.',
  },
  {
    id: 'p-hoa',
    name: 'Bác Hòa',
    roleTitle: 'Bệnh nhân cao tuổi khám định kỳ',
    ageGroup: '68 tuổi',
    techLevel: 'Thấp',
    quote: 'Chữ nhỏ quá bác không đọc nổi, bấm nhầm là sợ mất lịch hẹn.',
    goals: ['Tái khám đúng bác sĩ quen mỗi tháng', 'Có người nhà đặt hộ khi cần'],
    painPoints: ['Ứng dụng nhiều bước phức tạp', 'Hay quên giờ hẹn nếu không có nhắc bằng SMS/gọi'],
    context: 'Dùng smartphone cơ bản, cần chữ to, tương phản rõ và ít thao tác.',
  },
];

export const INITIAL_SNAPSHOT: ProgressSnapshot = {
  version: PROGRESS_SCHEMA_VERSION,
  theme: 'light',
  role: 'ba',
  onboardingDone: false,
  preTestSkills: null,
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  lastVisitedPath: null,
  lessonsDone: [],
  lessonNotes: {},
  quizScores: {},
  exerciseScores: {},
  skills: { ...INITIAL_SKILLS },
  badges: [],
  personas: [...DEFAULT_PERSONAS],
  capstoneStories: [],
  flashcards: {},
  finalExamScore: null,
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function calcNextStreak(lastDate: string | null, currentStreak: number, today: string): number {
  if (!lastDate) return 1;
  if (lastDate === today) return Math.max(1, currentStreak);
  const prev = new Date(`${lastDate}T00:00:00Z`).getTime();
  const curr = new Date(`${today}T00:00:00Z`).getTime();
  const diffDays = Math.round((curr - prev) / 86_400_000);
  if (diffDays === 1) return currentStreak + 1;
  return 1;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...INITIAL_SNAPSHOT,

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setRole: (role) => set({ role }),
      setLastVisitedPath: (path) => set({ lastVisitedPath: path }),

      completeOnboarding: (role, initialSkills) => {
        const today = todayIso();
        set((s) => ({
          role,
          onboardingDone: true,
          preTestSkills: { ...initialSkills },
          skills: { ...initialSkills },
          xp: s.onboardingDone ? s.xp : s.xp + 25,
          streak: calcNextStreak(s.lastActiveDate, s.streak, today),
          lastActiveDate: today,
        }));
      },

      touchActivity: () => {
        const today = todayIso();
        set((s) => ({
          streak: calcNextStreak(s.lastActiveDate, s.streak, today),
          lastActiveDate: today,
        }));
      },

      markLessonDone: (lessonId) => {
        const state = get();
        const alreadyDone = state.lessonsDone.includes(lessonId);
        const today = todayIso();
        set({
          lessonsDone: alreadyDone ? state.lessonsDone : [...state.lessonsDone, lessonId],
          xp: alreadyDone ? state.xp : state.xp + 10,
          streak: calcNextStreak(state.lastActiveDate, state.streak, today),
          lastActiveDate: today,
        });
      },

      saveLessonNote: (lessonId, note) =>
        set((s) => ({
          lessonNotes: { ...s.lessonNotes, [lessonId]: note },
        })),

      recordQuizResult: (quizId, scorePercent, xpReward, skillUpdates) => {
        const state = get();
        const prevBest = state.quizScores[quizId] ?? -1;
        const bestScore = Math.max(prevBest, scorePercent);
        const passedFirstTime = prevBest < 80 && scorePercent >= 80;
        const nextSkills = { ...state.skills };

        for (const [key, delta] of Object.entries(skillUpdates) as [SkillKey, number][]) {
          nextSkills[key] = Math.min(100, Math.max(0, (nextSkills[key] ?? 0) + delta));
        }

        const nextBadges = new Set(state.badges);
        if (scorePercent === 100) nextBadges.add('perfect-quiz');
        if (passedFirstTime) nextBadges.add('first-quiz-pass');

        const today = todayIso();
        set({
          quizScores: { ...state.quizScores, [quizId]: bestScore },
          xp: state.xp + (passedFirstTime ? xpReward : scorePercent > prevBest ? 5 : 0),
          skills: nextSkills,
          badges: Array.from(nextBadges),
          streak: calcNextStreak(state.lastActiveDate, state.streak, today),
          lastActiveDate: today,
        });
      },

      recordExerciseResult: (exerciseId, score, xpReward, skillUpdates, badge) => {
        const state = get();
        const prevBest = state.exerciseScores[exerciseId] ?? -1;
        const nextSkills = { ...state.skills };
        for (const [key, delta] of Object.entries(skillUpdates) as [SkillKey, number][]) {
          nextSkills[key] = Math.min(100, Math.max(0, (nextSkills[key] ?? 0) + delta));
        }
        const nextBadges = new Set(state.badges);
        if (badge) nextBadges.add(badge);
        const today = todayIso();
        set({
          exerciseScores: { ...state.exerciseScores, [exerciseId]: Math.max(prevBest, score) },
          xp: state.xp + (prevBest < 0 ? xpReward : score > prevBest ? 5 : 0),
          skills: nextSkills,
          badges: Array.from(nextBadges),
          streak: calcNextStreak(state.lastActiveDate, state.streak, today),
          lastActiveDate: today,
        });
      },

      savePersona: (persona) =>
        set((s) => {
          const exists = s.personas.some((p) => p.id === persona.id);
          const personas = exists
            ? s.personas.map((p) => (p.id === persona.id ? persona : p))
            : [...s.personas, persona];
          const nextBadges = new Set(s.badges);
          if (personas.length >= 4) nextBadges.add('empath');
          return { personas, badges: Array.from(nextBadges) };
        }),

      deletePersona: (id) =>
        set((s) => ({ personas: s.personas.filter((p) => p.id !== id) })),

      saveStory: (story) =>
        set((s) => {
          const exists = s.capstoneStories.some((st) => st.id === story.id);
          const capstoneStories = exists
            ? s.capstoneStories.map((st) => (st.id === story.id ? story : st))
            : [...s.capstoneStories, story];
          return { capstoneStories };
        }),

      deleteStory: (id) =>
        set((s) => ({ capstoneStories: s.capstoneStories.filter((st) => st.id !== id) })),

      reviewFlashcard: (cardId, rating) => {
        const today = todayIso();
        set((s) => ({
          flashcards: {
            ...s.flashcards,
            [cardId]: reviewCardSm2(s.flashcards[cardId], rating, today),
          },
          xp: s.xp + 2,
          streak: calcNextStreak(s.lastActiveDate, s.streak, today),
          lastActiveDate: today,
        }));
      },

      recordFinalExam: (scorePercent) => {
        const today = todayIso();
        set((s) => {
          const prev = s.finalExamScore ?? -1;
          const nextBadges = new Set(s.badges);
          if (scorePercent >= 80) nextBadges.add('story-artisan-graduate');
          return {
            finalExamScore: Math.max(prev, scorePercent),
            xp: s.xp + (prev < 80 && scorePercent >= 80 ? 100 : 0),
            badges: Array.from(nextBadges),
            streak: calcNextStreak(s.lastActiveDate, s.streak, today),
            lastActiveDate: today,
          };
        });
      },

      exportSnapshot: () => {
        const s = get();
        const snapshot: ProgressSnapshot = {
          version: PROGRESS_SCHEMA_VERSION,
          theme: s.theme,
          role: s.role,
          onboardingDone: s.onboardingDone,
          preTestSkills: s.preTestSkills,
          xp: s.xp,
          streak: s.streak,
          lastActiveDate: s.lastActiveDate,
          lastVisitedPath: s.lastVisitedPath,
          lessonsDone: s.lessonsDone,
          lessonNotes: s.lessonNotes,
          quizScores: s.quizScores,
          exerciseScores: s.exerciseScores,
          skills: s.skills,
          badges: s.badges,
          personas: s.personas,
          capstoneStories: s.capstoneStories,
          flashcards: s.flashcards,
          finalExamScore: s.finalExamScore,
        };
        return JSON.stringify(snapshot, null, 2);
      },

      importSnapshot: (json) => {
        try {
          const parsed = JSON.parse(json) as Partial<ProgressSnapshot>;
          if (!parsed || typeof parsed !== 'object' || typeof parsed.version !== 'number') {
            return { ok: false, error: 'Tệp không đúng định dạng sao lưu của User Story Craft.' };
          }
          if (!Array.isArray(parsed.lessonsDone) || typeof parsed.xp !== 'number') {
            return { ok: false, error: 'Dữ liệu tiến độ bị thiếu hoặc không hợp lệ.' };
          }
          set({
            ...INITIAL_SNAPSHOT,
            ...parsed,
            version: PROGRESS_SCHEMA_VERSION,
            skills: { ...INITIAL_SKILLS, ...(parsed.skills ?? {}) },
            personas: Array.isArray(parsed.personas) && parsed.personas.length > 0
              ? parsed.personas
              : [...DEFAULT_PERSONAS],
          });
          return { ok: true };
        } catch {
          return { ok: false, error: 'Không thể đọc tệp JSON. Vui lòng kiểm tra lại.' };
        }
      },

      resetProgress: () =>
        set({
          ...INITIAL_SNAPSHOT,
          skills: { ...INITIAL_SKILLS },
          personas: [...DEFAULT_PERSONAS],
        }),
    }),
    {
      name: 'user-stories-craft-progress-v1',
      version: PROGRESS_SCHEMA_VERSION,
    },
  ),
);
