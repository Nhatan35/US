import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Award, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { getModuleById, getQuizByModule } from '@/content';
import { QuizQuestionCard } from '@/components/QuizQuestionCard';
import { gradeQuiz, type QuestionAnswer, type QuizGradeReport } from '@/lib/quiz/scoring';
import { useProgressStore } from '@/lib/store/progressStore';

export function QuizPage() {
  const { moduleId = '' } = useParams();
  const mod = getModuleById(moduleId);
  const quiz = getQuizByModule(moduleId);

  const recordQuizResult = useProgressStore((s) => s.recordQuizResult);
  const bestScore = useProgressStore((s) => (quiz ? s.quizScores[quiz.id] : undefined));

  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({});
  const [report, setReport] = useState<QuizGradeReport | null>(null);

  if (!mod || !quiz) {
    return (
      <div className="card stack-md">
        <h2>Chưa có bài Quiz cho module này</h2>
        <Link to="/modules" className="btn btn-secondary btn-sm">
          Quay lại danh sách Module
        </Link>
      </div>
    );
  }

  const handleSubmit = () => {
    const graded = gradeQuiz(quiz.questions, answers);
    setReport(graded);
    recordQuizResult(quiz.id, graded.scorePercent, quiz.xpReward, graded.skillDeltas);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setAnswers({});
    setReport(null);
  };

  const passed = report ? report.scorePercent >= quiz.passScore : false;

  return (
    <div className="stack-lg">
      <div>
        <Link to={`/modules/${mod.id}`} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
          <ArrowLeft size={15} /> Quay lại {mod.code} · {mod.title}
        </Link>
      </div>

      <div className="card stack-sm">
        <div className="row-between" style={{ flexWrap: 'wrap' }}>
          <span className="badge badge-primary">
            {quiz.questions.length} câu hỏi · Ngưỡng đạt {quiz.passScore}%
          </span>
          {bestScore !== undefined && (
            <span className="badge badge-muted">Điểm cao nhất: {bestScore}%</span>
          )}
        </div>
        <h1 style={{ fontSize: '1.45rem' }}>{quiz.title}</h1>
        <p className="secondary" style={{ fontSize: '0.92rem' }}>
          {quiz.description}
        </p>
      </div>

      {report && (
        <div
          className="card stack-md"
          style={{
            background: passed ? 'var(--success-soft)' : 'var(--danger-soft)',
            borderColor: passed ? 'var(--success-border)' : 'var(--danger-border)',
          }}
        >
          <div className="row-between" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div className="row">
              {passed ? (
                <CheckCircle2 size={28} color="var(--success)" />
              ) : (
                <XCircle size={28} color="var(--danger)" />
              )}
              <div>
                <h2 style={{ fontSize: '1.2rem' }}>
                  {passed
                    ? `Chúc mừng! Bạn đạt ${report.scorePercent}%`
                    : `Bạn đạt ${report.scorePercent}% — Chưa đạt ngưỡng ${quiz.passScore}%`}
                </h2>
                <p className="secondary" style={{ fontSize: '0.88rem' }}>
                  Đúng {report.correctCount}/{report.totalCount} câu.{' '}
                  {passed
                    ? `Điểm kỹ năng và XP (+${quiz.xpReward} XP lần đầu đạt) đã được cập nhật.`
                    : 'Xem giải thích chi tiết bên dưới rồi thử làm lại nhé!'}
                </p>
              </div>
            </div>

            <div className="row">
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleRetry}>
                <RotateCcw size={15} /> Làm lại
              </button>
              <Link to="/" className="btn btn-primary btn-sm">
                <Award size={15} /> Về Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="stack-md">
        {quiz.questions.map((q, idx) => (
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
            Đã trả lời {Object.keys(answers).length}/{quiz.questions.length} câu
          </span>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            Nộp bài & Chấm điểm
          </button>
        </div>
      )}
    </div>
  );
}
