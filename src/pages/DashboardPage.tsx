import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Flame,
  Lock,
  Play,
  Sparkles,
} from 'lucide-react';
import { ALL_LESSONS, MODULES, getLessonsByModule } from '@/content';
import { FLASHCARDS } from '@/content/flashcards';
import { isCardDue } from '@/lib/srs/sm2';
import { SkillRadarChart } from '@/components/SkillRadarChart';
import { getLevelForXp, useProgressStore } from '@/lib/store/progressStore';

export function DashboardPage() {
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const lessonsDone = useProgressStore((s) => s.lessonsDone);
  const quizScores = useProgressStore((s) => s.quizScores);
  const skills = useProgressStore((s) => s.skills);
  const onboardingDone = useProgressStore((s) => s.onboardingDone);
  const flashcards = useProgressStore((s) => s.flashcards);
  const lastVisitedPath = useProgressStore((s) => s.lastVisitedPath);

  const today = new Date().toISOString().slice(0, 10);
  const dueFlashcards = FLASHCARDS.filter((c) => isCardDue(flashcards[c.id], today)).length;

  const level = getLevelForXp(xp);
  const nextLesson =
    ALL_LESSONS.find((l) => !lessonsDone.includes(l.id)) ?? ALL_LESSONS[0];
  const continueHref = !onboardingDone
    ? '/onboarding'
    : (lastVisitedPath ?? `/modules/${nextLesson.moduleId}/lessons/${nextLesson.id}`);

  const readyLessonsCount = ALL_LESSONS.length;
  const doneCount = lessonsDone.length;
  const overallPercent =
    readyLessonsCount === 0 ? 0 : Math.round((doneCount / readyLessonsCount) * 100);

  return (
    <div className="stack-lg">
      {/* Hero Banner */}
      <div
        className="card"
        style={{
          background:
            'linear-gradient(135deg, rgba(79,70,229,0.12), rgba(124,58,237,0.06))',
          borderColor: 'var(--primary-border)',
        }}
      >
        <div className="row-between" style={{ flexWrap: 'wrap', gap: 16 }}>
          <div className="stack-sm" style={{ maxWidth: 640 }}>
            <div className="row" style={{ flexWrap: 'wrap' }}>
              <span className="badge badge-primary">
                <Award size={14} /> {level.name}
              </span>
              <span className="badge badge-warning">
                <Flame size={14} /> Chuỗi {streak} ngày
              </span>
              <span className="badge badge-muted">
                <Sparkles size={14} /> {xp} XP
                {level.nextXp ? ` / ${level.nextXp} XP` : ' (Tối đa)'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.55rem' }}>
              Chào mừng bạn đến với User Story Craft
            </h1>
            <p className="secondary" style={{ fontSize: '0.94rem' }}>
              Lộ trình học tương tác bám sát cuốn{' '}
              <strong>The Art of Crafting User Stories</strong> (Christopher Lee, Packt 2024).
              Bắt đầu từ Module 1 để nắm mô hình 3C, phân biệt Story/Task/Epic và làm bài kiểm tra 6 dạng câu hỏi.
            </p>
          </div>

          <Link to={continueHref} className="btn btn-primary">
            <Play size={16} />
            {!onboardingDone
              ? 'Làm test đầu vào (M0)'
              : doneCount === 0
                ? 'Bắt đầu Module 1'
                : 'Tiếp tục học'}
          </Link>
        </div>
      </div>

      {/* Main 2-column grid */}
      <div className="grid-2">
        {/* Progress & Next action */}
        <div className="stack-md">
          <div className="card stack-md">
            <div className="row-between">
              <h2 style={{ fontSize: '1.08rem' }}>Tiến độ hiện tại</h2>
              <span className="badge badge-primary">{overallPercent}% bài đã mở</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${overallPercent}%` }} />
            </div>
            <div className="row-between muted" style={{ fontSize: '0.84rem' }}>
              <span>
                Đã học {doneCount}/{readyLessonsCount} bài học sẵn sàng
              </span>
              <span>
                Quiz M1: {quizScores['quiz-m1'] !== undefined ? `${quizScores['quiz-m1']}%` : 'Chưa làm'}
              </span>
            </div>
          </div>

          <div className="card stack-md">
            <div className="row-between">
              <h2 style={{ fontSize: '1.08rem' }}>Bài học gợi ý tiếp theo</h2>
              <BookOpen size={18} color="var(--primary)" />
            </div>
            <div className="stack-sm">
              <span className="badge badge-primary" style={{ alignSelf: 'flex-start' }}>
                Module 1 · Bài {nextLesson.code}
              </span>
              <h3 style={{ fontSize: '1.02rem' }}>{nextLesson.title}</h3>
              <p className="muted" style={{ fontSize: '0.85rem' }}>
                ⏱ {nextLesson.minutes} phút đọc · {nextLesson.checks.length} câu kiểm tra nhanh
              </p>
            </div>
            <div className="row" style={{ flexWrap: 'wrap' }}>
              <Link
                to={`/modules/${nextLesson.moduleId}/lessons/${nextLesson.id}`}
                className="btn btn-primary btn-sm"
              >
                Mở bài học <ArrowRight size={15} />
              </Link>
              <Link to="/review" className="btn btn-secondary btn-sm">
                🔁 {dueFlashcards} flashcard đến hạn
              </Link>
              <Link to="/capstone" className="btn btn-secondary btn-sm">
                🎯 Capstone MediBook
              </Link>
            </div>
          </div>
        </div>

        {/* 8-Skill Radar */}
        <div className="card stack-sm">
          <div className="row-between">
            <h2 style={{ fontSize: '1.08rem' }}>Biểu đồ 8 kỹ năng cốt lõi</h2>
            <Link to="/profile" style={{ fontSize: '0.82rem' }}>
              Chi tiết
            </Link>
          </div>
          <SkillRadarChart skills={skills} height={250} />
          <p className="muted" style={{ fontSize: '0.8rem', textAlign: 'center' }}>
            Điểm kỹ năng tăng tự động khi bạn hoàn thành quiz và bài tập thực hành.
          </p>
        </div>
      </div>

      {/* Modules overview */}
      <div className="card stack-md">
        <div className="row-between">
          <h2 style={{ fontSize: '1.1rem' }}>Lộ trình 10 Module</h2>
          <Link to="/modules" className="btn btn-ghost btn-sm">
            Xem tất cả <ArrowRight size={15} />
          </Link>
        </div>

        <div className="stack-sm">
          {MODULES.map((mod) => {
            const lessons = getLessonsByModule(mod.id);
            const completed = lessons.filter((l) => lessonsDone.includes(l.id)).length;
            const pct = lessons.length === 0 ? 0 : Math.round((completed / lessons.length) * 100);
            const quizScore = mod.quizId ? quizScores[mod.quizId] : undefined;

            return (
              <Link
                key={mod.id}
                to={`/modules/${mod.id}`}
                className="row-between"
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  textDecoration: 'none',
                  color: 'inherit',
                  opacity: mod.ready ? 1 : 0.72,
                }}
              >
                <div className="row" style={{ minWidth: 0, flex: 1 }}>
                  <span
                    className="badge"
                    style={{
                      background: `${mod.color}20`,
                      color: mod.color,
                      minWidth: 38,
                      justifyContent: 'center',
                    }}
                  >
                    {mod.code}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.93rem' }}>{mod.title}</div>
                    <div
                      className="muted"
                      style={{
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {mod.chapter ? `Chương ${mod.chapter} · ` : ''}
                      {mod.subtitle}
                    </div>
                  </div>
                </div>

                <div className="row" style={{ flexShrink: 0 }}>
                  {mod.ready ? (
                    <>
                      {quizScore !== undefined && quizScore >= 80 && (
                        <span className="badge badge-success">
                          <CheckCircle2 size={13} /> Quiz {quizScore}%
                        </span>
                      )}
                      <span className="badge badge-primary">{pct}%</span>
                    </>
                  ) : (
                    <span className="badge badge-muted">
                      <Lock size={12} /> {mod.phase}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
