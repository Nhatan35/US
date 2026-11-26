import { useState } from 'react';
import { Award, CheckCircle2, Printer, RotateCcw, XCircle } from 'lucide-react';
import { ALL_QUIZZES } from '@/content';
import { QuizQuestionCard } from '@/components/QuizQuestionCard';
import { SkillRadarChart } from '@/components/SkillRadarChart';
import { gradeQuiz, type QuestionAnswer, type QuizGradeReport } from '@/lib/quiz/scoring';
import { getLevelForXp, useProgressStore } from '@/lib/store/progressStore';
import { ROLE_LABELS } from '@/types/course';

// Build a balanced 10-question final exam from across M1-M7
const FINAL_EXAM_QUESTIONS = ALL_QUIZZES.flatMap((q) => q.questions.slice(0, 2)).slice(0, 10);

export function Module9ExamPage() {
  const skills = useProgressStore((s) => s.skills);
  const xp = useProgressStore((s) => s.xp);
  const role = useProgressStore((s) => s.role);
  const finalExamScore = useProgressStore((s) => s.finalExamScore);
  const recordFinalExam = useProgressStore((s) => s.recordFinalExam);

  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({});
  const [report, setReport] = useState<QuizGradeReport | null>(null);

  const level = getLevelForXp(xp);
  const passed = (report?.scorePercent ?? finalExamScore ?? 0) >= 80;

  const handleSubmit = () => {
    const graded = gradeQuiz(FINAL_EXAM_QUESTIONS, answers);
    setReport(graded);
    recordFinalExam(graded.scorePercent);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="stack-lg">
      <div className="card stack-sm" style={{ borderTop: '4px solid #ef4444' }}>
        <span className="badge badge-danger" style={{ alignSelf: 'flex-start' }}>
          M9 · Tổng kết & Thi cuối khóa
        </span>
        <h1 style={{ fontSize: '1.5rem' }}>Bài thi tổng hợp & Chứng nhận hoàn thành</h1>
        <p className="secondary" style={{ fontSize: '0.92rem' }}>
          10 câu hỏi tổng hợp xuyên suốt 7 module cốt lõi. Đạt ≥ 80% để mở khóa <strong>Chứng nhận hoàn thành</strong> có thể in và nhận +100 XP!
        </p>
      </div>

      {/* Printable Certificate when passed */}
      {passed && (
        <div
          className="card stack-md"
          style={{
            border: '2px solid var(--primary)',
            background:
              'linear-gradient(135deg, rgba(79,70,229,0.08), rgba(16,185,129,0.06))',
            textAlign: 'center',
            padding: 32,
          }}
        >
          <Award size={44} color="var(--primary)" style={{ margin: '0 auto' }} />
          <div style={{ fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase' }} className="muted">
            Chứng nhận tự hoàn thành khóa học thực hành
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--primary)' }}>
            The Art of Crafting User Stories
          </h2>
          <p className="secondary">
            Chứng nhận học viên vai trò <strong>{ROLE_LABELS[role]}</strong> đã hoàn thành xuất sắc bài thi cuối khóa với điểm cao nhất{' '}
            <strong>{Math.max(report?.scorePercent ?? 0, finalExamScore ?? 0)}%</strong> · Cấp độ{' '}
            <strong>{level.name}</strong> ({xp} XP).
          </p>
          <div style={{ maxWidth: 360, margin: '0 auto', width: '100%' }}>
            <SkillRadarChart skills={skills} height={220} />
          </div>
          <div className="muted" style={{ fontSize: '0.8rem' }}>
            Ngày cấp: {new Date().toISOString().slice(0, 10)} · User Story Craft
          </div>
          <div>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => window.print()}>
              <Printer size={14} /> In / Lưu chứng nhận PDF
            </button>
          </div>
        </div>
      )}

      {report && (
        <div
          className="card row-between"
          style={{
            background: report.scorePercent >= 80 ? 'var(--success-soft)' : 'var(--danger-soft)',
            borderColor: report.scorePercent >= 80 ? 'var(--success-border)' : 'var(--danger-border)',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div className="row">
            {report.scorePercent >= 80 ? (
              <CheckCircle2 size={24} color="var(--success)" />
            ) : (
              <XCircle size={24} color="var(--danger)" />
            )}
            <div>
              <strong>
                Điểm thi lần này: {report.scorePercent}% ({report.correctCount}/{report.totalCount} câu đúng)
              </strong>
              <div className="secondary" style={{ fontSize: '0.86rem' }}>
                {report.scorePercent >= 80
                  ? 'Chúc mừng bạn đã tốt nghiệp khóa thực hành User Story Craft!'
                  : 'Cần đạt tối thiểu 80%. Hãy xem lại giải thích bên dưới và thử lại.'}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setAnswers({});
              setReport(null);
            }}
          >
            <RotateCcw size={14} /> Thi lại
          </button>
        </div>
      )}

      <div className="stack-md">
        {FINAL_EXAM_QUESTIONS.map((q, idx) => (
          <QuizQuestionCard
            key={q.id}
            question={q}
            index={idx}
            value={answers[q.id]}
            onChange={(val) => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
            revealed={report !== null}
          />
        ))}
      </div>

      {!report && (
        <div className="row-between">
          <span className="muted" style={{ fontSize: '0.86rem' }}>
            Đã trả lời {Object.keys(answers).length}/{FINAL_EXAM_QUESTIONS.length} câu
          </span>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            Nộp bài thi cuối khóa
          </button>
        </div>
      )}
    </div>
  );
}
