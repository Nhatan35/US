export type SkillKey =
  | 'empathy'
  | 'writing'
  | 'ac'
  | 'splitting'
  | 'prioritizing'
  | 'estimating'
  | 'stakeholder'
  | 'backlog';

export const SKILL_LABELS: Record<SkillKey, string> = {
  empathy: 'Tư duy người dùng',
  writing: 'Viết User Story',
  ac: 'Acceptance Criteria',
  splitting: 'Chia nhỏ Story',
  prioritizing: 'Ưu tiên hóa',
  estimating: 'Ước lượng',
  stakeholder: 'Stakeholder',
  backlog: 'Backlog & Story Map',
};

export type UserRole =
  | 'ba'
  | 'po'
  | 'dev'
  | 'qa'
  | 'designer'
  | 'beginner';

export const ROLE_LABELS: Record<UserRole, string> = {
  ba: 'Business Analyst (BA)',
  po: 'Product Owner / PM',
  dev: 'Developer',
  qa: 'QA / Tester',
  designer: 'UI/UX Designer',
  beginner: 'Mới bắt đầu với Agile',
};

export interface ModuleMeta {
  id: string;
  code: string;
  chapter?: number;
  title: string;
  subtitle: string;
  color: string;
  estimatedHours: number;
  goals: string[];
  lessonIds: string[];
  quizId?: string;
  capstoneStep?: number;
  phase: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
  ready: boolean;
}

export interface GoodBadExample {
  title: string;
  bad: string;
  badReason: string;
  good: string;
  goodReason: string;
}

export interface LessonData {
  id: string;
  moduleId: string;
  code: string;
  title: string;
  minutes: number;
  bookRef?: string;
  body: string;
  examples?: GoodBadExample[];
  commonMistakes?: string[];
  glossaryTerms?: string[];
  checks: QuizQuestion[];
}

interface BaseQuestion {
  id: string;
  prompt: string;
  explain: string;
  skill: SkillKey;
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single';
  options: string[];
  answer: number;
}

export interface MultiChoiceQuestion extends BaseQuestion {
  type: 'multi';
  options: string[];
  answer: number[];
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'truefalse';
  answer: boolean;
}

export interface OrderQuestion extends BaseQuestion {
  type: 'order';
  /** Correct order of items */
  items: string[];
}

export interface MatchQuestion extends BaseQuestion {
  type: 'match';
  /** [left, right] correct pairs */
  pairs: [string, string][];
}

export interface HighlightQuestion extends BaseQuestion {
  type: 'highlight';
  /** Text segmented into tokens; user clicks the problematic segments */
  segments: { text: string; isTarget?: boolean }[];
}

export type QuizQuestion =
  | SingleChoiceQuestion
  | MultiChoiceQuestion
  | TrueFalseQuestion
  | OrderQuestion
  | MatchQuestion
  | HighlightQuestion;

export interface QuizData {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  passScore: number;
  xpReward: number;
  questions: QuizQuestion[];
}

export interface GlossaryItem {
  term: string;
  vi: string;
  moduleId: string;
  definition: string;
  example: string;
}

export interface Persona {
  id: string;
  name: string;
  roleTitle: string;
  ageGroup: string;
  techLevel: 'Thấp' | 'Trung bình' | 'Cao';
  quote: string;
  goals: string[];
  painPoints: string[];
  context: string;
}

export interface UserStory {
  id: string;
  title: string;
  personaId?: string;
  role: string;
  want: string;
  benefit: string;
  acceptanceCriteria: string[];
  gherkin?: string;
  estimate?: number | '?';
  priority?: 'must' | 'should' | 'could' | 'wont';
  epicId?: string;
  releaseId?: string;
  status: 'idea' | 'refining' | 'ready' | 'sprint' | 'done';
  dependsOn?: string[];
}
