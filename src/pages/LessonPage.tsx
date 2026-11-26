import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  StickyNote,
} from 'lucide-react';
import { GLOSSARY, getLessonById, getLessonsByModule, getModuleById } from '@/content';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { QuizQuestionCard } from '@/components/QuizQuestionCard';
import type { QuestionAnswer } from '@/lib/quiz/scoring';
import { useProgressStore } from '@/lib/store/progressStore';

export function LessonPage() {
  const { moduleId = '', lessonId = '' } = useParams();
  const mod = getModuleById(moduleId);
  const lesson = getLessonById(lessonId);
  const moduleLessons = getLessonsByModule(moduleId);

  const lessonsDone = useProgressStore((s) => s.lessonsDone);
  const markLessonDone = useProgressStore((s) => s.markLessonDone);
  const savedNote = useProgressStore((s) => s.lessonNotes[lessonId] ?? '');
  const saveLessonNote = useProgressStore((s) => s.saveLessonNote);

  const [noteDraft, setNoteDraft] = useState(savedNote);
  const [checkAnswers, setCheckAnswers] = useState<Record<string, QuestionAnswer>>({});
  const [checkRevealed, setCheckRevealed] = useState(false);

  useEffect(() => {
    setNoteDraft(savedNote);
    setCheckAnswers({});
    setCheckRevealed(false);
  }, [lessonId, savedNote]);

  if (!mod || !lesson) {
    return (
      <div className="card stack-md">
        <h2>Không tìm thấy bài học</h2>
        <Link to="/modules" className="btn btn-secondary btn-sm">
          Quay lại danh sách Module
        </Link>
      </div>
    );
  }

  const isDone = lessonsDone.includes(lesson.id);
  const currentIdx = moduleLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIdx > 0 ? moduleLessons[currentIdx - 1] : null;
  const nextLesson =
    currentIdx >= 0 && currentIdx < moduleLessons.length - 1
      ? moduleLessons[currentIdx + 1]
      : null;

  const relatedGlossary = (lesson.glossaryTerms ?? [])
    .map((term) => GLOSSARY.find((g) => g.term === term))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  return (
    <div className="stack-lg">
      {/* Header breadcrumb & progress dots */}
      <div className="row-between" style={{ flexWrap: 'wrap', gap: 10 }}>
        <Link to={`/modules/${mod.id}`} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
          <ArrowLeft size={15} /> {mod.code} · {mod.title}
        </Link>
        <div className="row" style={{ gap: 6 }}>
          {moduleLessons.map((l) => {
            const done = lessonsDone.includes(l.id);
            const active = l.id === lesson.id;
            return (
              <Link
                key={l.id}
                to={`/modules/${mod.id}/lessons/${l.id}`}
                title={`Bài ${l.code}: ${l.title}`}
                style={{
                  width: active ? 22 : 10,
                  height: 10,
                  borderRadius: 999,
                  background: active
                    ? 'var(--primary)'
                    : done
                      ? 'var(--success)'
                      : 'var(--border-strong)',
                  transition: 'width 0.2s',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Main content + side panel */}
      <div className="lesson-grid">
        <div className="stack-lg">
          <div className="card stack-md">
            <div className="row" style={{ flexWrap: 'wrap' }}>
              <span className="badge badge-primary">Bài {lesson.code}</span>
              <span className="badge badge-muted">
                <Clock size={13} /> {lesson.minutes} phút
              </span>
              {lesson.bookRef && (
                <span className="badge badge-muted">
                  <BookOpen size={13} /> {lesson.bookRef}
                </span>
              )}
              {isDone && (
                <span className="badge badge-success">
                  <CheckCircle2 size={13} /> Đã hoàn thành
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '1.5rem' }}>{lesson.title}</h1>

            <MarkdownRenderer content={lesson.body} />
          </div>

          {/* Good / Bad examples */}
          {lesson.examples && lesson.examples.length > 0 && (
            <div className="card stack-md">
              <h2 style={{ fontSize: '1.1rem' }}>So sánh Ví dụ Xấu vs Ví dụ Tốt</h2>
              {lesson.examples.map((ex) => (
                <div key={ex.title} className="stack-sm">
                  <strong style={{ fontSize: '0.94rem' }}>{ex.title}</strong>
                  <div className="example-compare">
                    <div className="example-box bad stack-sm">
                      <strong style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>
                        ❌ Cách viết chưa tốt
                      </strong>
                      <p style={{ fontSize: '0.9rem' }}>{ex.bad}</p>
                      <p className="muted" style={{ fontSize: '0.82rem' }}>
                        <em>Vì sao:</em> {ex.badReason}
                      </p>
                    </div>
                    <div className="example-box good stack-sm">
                      <strong style={{ color: 'var(--success)', fontSize: '0.85rem' }}>
                        ✅ Cách viết hiệu quả
                      </strong>
                      <p style={{ fontSize: '0.9rem' }}>{ex.good}</p>
                      <p className="muted" style={{ fontSize: '0.82rem' }}>
                        <em>Vì sao:</em> {ex.goodReason}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Common mistakes */}
          {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
            <div
              className="card stack-sm"
              style={{
                background: 'var(--warning-soft)',
                borderColor: 'var(--warning-border)',
              }}
            >
              <div className="row">
                <AlertTriangle size={18} color="var(--warning)" />
                <h2 style={{ fontSize: '1rem' }}>Lỗi thường gặp cần tránh</h2>
              </div>
              <ul style={{ margin: '4px 0 0 20px', padding: 0, fontSize: '0.9rem' }}>
                {lesson.commonMistakes.map((m) => (
                  <li key={m} style={{ marginBottom: 4 }}>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick checks */}
          {lesson.checks.length > 0 && (
            <div className="stack-md">
              <h2 style={{ fontSize: '1.1rem' }}>Kiểm tra nhanh cuối bài</h2>
              {lesson.checks.map((q, idx) => (
                <QuizQuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  value={checkAnswers[q.id]}
                  onChange={(val) =>
                    setCheckAnswers((prev) => ({ ...prev, [q.id]: val }))
                  }
                  revealed={checkRevealed}
                />
              ))}
              <div className="row">
                {!checkRevealed ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCheckRevealed(true)}
                  >
                    Kiểm tra đáp án
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setCheckAnswers({});
                      setCheckRevealed(false);
                    }}
                  >
                    Làm lại kiểm tra nhanh
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mark done + navigation */}
          <div className="card row-between" style={{ flexWrap: 'wrap', gap: 12 }}>
            {prevLesson ? (
              <Link
                to={`/modules/${mod.id}/lessons/${prevLesson.id}`}
                className="btn btn-secondary btn-sm"
              >
                <ArrowLeft size={15} /> Bài {prevLesson.code}
              </Link>
            ) : (
              <span />
            )}

            <div className="row" style={{ flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn btn-sm ${isDone ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => markLessonDone(lesson.id)}
              >
                <CheckCircle2 size={15} />
                {isDone ? 'Đã hoàn thành (+10 XP)' : 'Đánh dấu hoàn thành (+10 XP)'}
              </button>

              {nextLesson ? (
                <Link
                  to={`/modules/${mod.id}/lessons/${nextLesson.id}`}
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    if (!isDone) markLessonDone(lesson.id);
                  }}
                >
                  Bài tiếp: {nextLesson.code} <ArrowRight size={15} />
                </Link>
              ) : (
                <Link
                  to={`/modules/${mod.id}/quiz`}
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    if (!isDone) markLessonDone(lesson.id);
                  }}
                >
                  <ClipboardCheck size={15} /> Làm Quiz Module {mod.code}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right sticky sidebar: Notes & Glossary */}
        <aside className="stack-md" style={{ position: 'sticky', top: 80 }}>
          <div className="card stack-sm">
            <div className="row">
              <StickyNote size={16} color="var(--primary)" />
              <h3 style={{ fontSize: '0.95rem' }}>Ghi chú của tôi</h3>
            </div>
            <textarea
              rows={6}
              placeholder="Ghi lại ý tâm đắc khi đọc sách hoặc ví dụ trong công việc của bạn..."
              value={noteDraft}
              onChange={(e) => {
                setNoteDraft(e.target.value);
                saveLessonNote(lesson.id, e.target.value);
              }}
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                background: 'var(--bg)',
                resize: 'vertical',
                fontSize: '0.86rem',
              }}
            />
            <span className="muted" style={{ fontSize: '0.75rem' }}>
              Tự động lưu vào trình duyệt.
            </span>
          </div>

          {relatedGlossary.length > 0 && (
            <div className="card stack-sm">
              <h3 style={{ fontSize: '0.95rem' }}>Thuật ngữ trong bài</h3>
              {relatedGlossary.map((g) => (
                <div
                  key={g.term}
                  style={{
                    paddingTop: 8,
                    borderTop: '1px solid var(--border)',
                    fontSize: '0.84rem',
                  }}
                >
                  <strong>{g.term}</strong>{' '}
                  <span className="muted">({g.vi})</span>
                  <p className="secondary" style={{ marginTop: 3 }}>
                    {g.definition}
                  </p>
                </div>
              ))}
              <Link to="/glossary" style={{ fontSize: '0.82rem', marginTop: 4 }}>
                Xem toàn bộ từ điển thuật ngữ →
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
