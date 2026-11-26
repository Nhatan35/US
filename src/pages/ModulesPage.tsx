import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, Clock, Lock } from 'lucide-react';
import { MODULES, getLessonsByModule } from '@/content';
import { useProgressStore } from '@/lib/store/progressStore';

export function ModulesPage() {
  const lessonsDone = useProgressStore((s) => s.lessonsDone);
  const quizScores = useProgressStore((s) => s.quizScores);

  return (
    <div className="stack-lg">
      <div className="stack-sm">
        <h1 style={{ fontSize: '1.5rem' }}>Lộ trình học 10 Module</h1>
        <p className="secondary">
          Bám sát 9 chương của cuốn <em>The Art of Crafting User Stories</em> kèm bước khởi động M0.
          Mỗi module gồm bài học tóm tắt, ví dụ tốt/xấu, quiz kiểm tra và bài tập thực hành.
        </p>
      </div>

      <div className="grid-2">
        {MODULES.map((mod) => {
          const lessons = getLessonsByModule(mod.id);
          const done = lessons.filter((l) => lessonsDone.includes(l.id)).length;
          const pct = lessons.length === 0 ? 0 : Math.round((done / lessons.length) * 100);
          const quizScore = mod.quizId ? quizScores[mod.quizId] : undefined;

          return (
            <div
              key={mod.id}
              className="card stack-md"
              style={{
                borderTop: `3px solid ${mod.color}`,
                opacity: mod.ready ? 1 : 0.78,
              }}
            >
              <div className="row-between">
                <span
                  className="badge"
                  style={{ background: `${mod.color}20`, color: mod.color }}
                >
                  {mod.code} {mod.chapter ? `· Chương ${mod.chapter}` : ''}
                </span>
                {mod.ready ? (
                  <span className="badge badge-success">Sẵn sàng</span>
                ) : (
                  <span className="badge badge-muted">
                    <Lock size={12} /> Giai đoạn {mod.phase}
                  </span>
                )}
              </div>

              <div className="stack-sm">
                <h2 style={{ fontSize: '1.1rem' }}>{mod.title}</h2>
                <p className="secondary" style={{ fontSize: '0.88rem' }}>
                  {mod.subtitle}
                </p>
              </div>

              <div className="row muted" style={{ fontSize: '0.8rem', gap: 14 }}>
                <span className="row" style={{ gap: 5 }}>
                  <Clock size={14} /> ~{mod.estimatedHours} giờ
                </span>
                {lessons.length > 0 && (
                  <span className="row" style={{ gap: 5 }}>
                    <BookOpen size={14} /> {done}/{lessons.length} bài học
                  </span>
                )}
                {quizScore !== undefined && (
                  <span className="row" style={{ gap: 5, color: 'var(--success)' }}>
                    <CheckCircle2 size={14} /> Quiz: {quizScore}%
                  </span>
                )}
              </div>

              {mod.ready && (
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${pct}%`, background: mod.color }}
                  />
                </div>
              )}

              <div>
                <Link
                  to={`/modules/${mod.id}`}
                  className={`btn btn-sm ${mod.ready ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {mod.ready ? 'Vào học' : 'Xem mục tiêu module'}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
