import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Clock,
  Lock,
} from 'lucide-react';
import { getLessonsByModule, getModuleById, getQuizByModule } from '@/content';
import { useProgressStore } from '@/lib/store/progressStore';

export function ModuleDetailPage() {
  const { moduleId = '' } = useParams();
  const mod = getModuleById(moduleId);
  const lessonsDone = useProgressStore((s) => s.lessonsDone);
  const quizScores = useProgressStore((s) => s.quizScores);

  if (!mod) {
    return (
      <div className="card stack-md">
        <h2>Không tìm thấy Module</h2>
        <Link to="/modules" className="btn btn-secondary btn-sm">
          Quay lại danh sách Module
        </Link>
      </div>
    );
  }

  const lessons = getLessonsByModule(mod.id);
  const quiz = getQuizByModule(mod.id);
  const bestQuiz = quiz ? quizScores[quiz.id] : undefined;

  return (
    <div className="stack-lg">
      <div>
        <Link to="/modules" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
          <ArrowLeft size={15} /> Danh sách Module
        </Link>
      </div>

      <div className="card stack-md" style={{ borderTop: `4px solid ${mod.color}` }}>
        <div className="row" style={{ flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: `${mod.color}20`, color: mod.color }}>
            {mod.code}
          </span>
          {mod.chapter && (
            <span className="badge badge-muted">📖 Đọc chương {mod.chapter} trong sách gốc</span>
          )}
          <span className="badge badge-muted">
            <Clock size={13} /> ~{mod.estimatedHours} giờ
          </span>
        </div>

        <h1 style={{ fontSize: '1.55rem' }}>{mod.title}</h1>
        <p className="secondary">{mod.subtitle}</p>

        <div className="stack-sm">
          <strong style={{ fontSize: '0.9rem' }}>Mục tiêu sau khi học xong:</strong>
          <ul style={{ margin: '0 0 0 20px', padding: 0 }} className="secondary">
            {mod.goals.map((g) => (
              <li key={g} style={{ marginBottom: 4 }}>
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {!mod.ready ? (
        <div className="card stack-sm" style={{ borderStyle: 'dashed' }}>
          <div className="row">
            <Lock size={18} color="var(--text-muted)" />
            <h2 style={{ fontSize: '1.05rem' }}>
              Nội dung dự kiến hoàn thiện ở Giai đoạn {mod.phase}
            </h2>
          </div>
          <p className="secondary" style={{ fontSize: '0.9rem' }}>
            Hiện tại bạn đang ở bản nền tảng (P1) với Module 1 đầy đủ bài học và quiz 6 dạng câu hỏi.
            Sau khi duyệt P1, tôi sẽ triển khai tiếp M0, M2, M3 và bộ công cụ Story Writer / Gherkin ở P2.
          </p>
        </div>
      ) : (
        <>
          <div className="card stack-md">
            <div className="row-between">
              <h2 style={{ fontSize: '1.1rem' }}>
                <BookOpen size={18} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
                Danh sách bài học ({lessons.length})
              </h2>
            </div>

            <div className="stack-sm">
              {lessons.map((lesson) => {
                const done = lessonsDone.includes(lesson.id);
                return (
                  <Link
                    key={lesson.id}
                    to={`/modules/${mod.id}/lessons/${lesson.id}`}
                    className="row-between"
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <div className="row">
                      {done ? (
                        <CheckCircle2 size={18} color="var(--success)" />
                      ) : (
                        <Circle size={18} color="var(--text-muted)" />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.94rem' }}>
                          Bài {lesson.code}: {lesson.title}
                        </div>
                        <div className="muted" style={{ fontSize: '0.8rem' }}>
                          ⏱ {lesson.minutes} phút · {lesson.checks.length} câu kiểm tra nhanh
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={16} color="var(--text-muted)" />
                  </Link>
                );
              })}
            </div>
          </div>

          {quiz && (
            <div className="card row-between" style={{ flexWrap: 'wrap', gap: 14 }}>
              <div className="stack-sm">
                <div className="row">
                  <ClipboardCheck size={18} color="var(--primary)" />
                  <h2 style={{ fontSize: '1.08rem' }}>{quiz.title}</h2>
                </div>
                <p className="secondary" style={{ fontSize: '0.88rem' }}>
                  {quiz.questions.length} câu hỏi (đủ 6 dạng tương tác) · Đạt ≥ {quiz.passScore}% · +{quiz.xpReward} XP
                </p>
                {bestQuiz !== undefined && (
                  <span className={`badge ${bestQuiz >= quiz.passScore ? 'badge-success' : 'badge-warning'}`} style={{ alignSelf: 'flex-start' }}>
                    Điểm cao nhất của bạn: {bestQuiz}%
                  </span>
                )}
              </div>

              <Link to={`/modules/${mod.id}/quiz`} className="btn btn-primary">
                {bestQuiz !== undefined ? 'Làm lại Quiz' : 'Bắt đầu Quiz'}
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
