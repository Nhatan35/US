import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, CheckCircle2, FileText, Lightbulb } from 'lucide-react';
import { CASE_STUDIES, type CaseStudy } from '@/content/cases/cases';
import { useProgressStore } from '@/lib/store/progressStore';

export function CasesPage() {
  const recordExerciseResult = useProgressStore((s) => s.recordExerciseResult);
  const exerciseScores = useProgressStore((s) => s.exerciseScores);

  const [activeId, setActiveId] = useState<string>(CASE_STUDIES[0].id);
  const [submissions, setSubmissions] = useState<Record<string, string>>({});
  const [rubricScores, setRubricScores] = useState<Record<string, Record<string, number>>>({});
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const activeCase: CaseStudy =
    CASE_STUDIES.find((c) => c.id === activeId) ?? CASE_STUDIES[0];

  const currentRubric = rubricScores[activeCase.id] ?? {};
  const maxTotal = activeCase.rubric.reduce((s, r) => s + r.maxPoints, 0);
  const earnedTotal = activeCase.rubric.reduce(
    (s, r) => s + (currentRubric[r.id] ?? 0),
    0,
  );
  const pct = maxTotal > 0 ? Math.round((earnedTotal / maxTotal) * 100) : 0;

  const handleCompleteCase = () => {
    setShowSolution((prev) => ({ ...prev, [activeCase.id]: true }));
    recordExerciseResult(`case-${activeCase.id}`, Math.max(pct, 70), 40, {
      stakeholder: 4,
      writing: 4,
      prioritizing: 3,
    });
    setSavedNotice(`Đã ghi nhận hoàn thành ${activeCase.code} (+40 XP)!`);
    setTimeout(() => setSavedNotice(null), 4000);
  };

  return (
    <div className="stack-lg">
      <div className="stack-sm">
        <h1 style={{ fontSize: '1.5rem' }}>Case Study Doanh nghiệp</h1>
        <p className="secondary">
          Đọc tư liệu thực tế (email, SRS, số liệu velocity), tự đề xuất phương án giải quyết, đối chiếu lời giải chuyên gia và tự chấm theo Rubric.
        </p>
      </div>

      {/* Case Selector */}
      <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
        {CASE_STUDIES.map((cs) => {
          const done = exerciseScores[`case-${cs.id}`] !== undefined;
          return (
            <button
              key={cs.id}
              type="button"
              className={`btn btn-sm ${cs.id === activeCase.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveId(cs.id)}
            >
              {done ? <CheckCircle2 size={14} /> : <Briefcase size={14} />}
              {cs.code}: {cs.title.slice(0, 28)}...
            </button>
          );
        })}
      </div>

      {/* Active Case Workspace */}
      <div className="card stack-md" style={{ borderTop: '4px solid var(--primary)' }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: 8 }}>
          <div className="row">
            <span className="badge badge-primary">{activeCase.code}</span>
            <span className="badge badge-muted">{activeCase.company}</span>
            <span className="badge badge-warning">{activeCase.difficulty}</span>
          </div>
          {activeCase.recommendedLab && (
            <Link to={activeCase.recommendedLab.to} className="btn btn-secondary btn-sm">
              {activeCase.recommendedLab.label} <ArrowRight size={14} />
            </Link>
          )}
        </div>

        <h2 style={{ fontSize: '1.3rem' }}>{activeCase.title}</h2>
        <p className="secondary">{activeCase.context}</p>

        {/* Dossier */}
        <div className="stack-sm">
          <strong style={{ fontSize: '0.92rem' }}>
            <FileText size={15} style={{ verticalAlign: 'text-bottom', marginRight: 5 }} />
            Tư liệu tình huống:
          </strong>
          {activeCase.dossier.map((doc) => (
            <div
              key={doc.label}
              style={{
                padding: 12,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-muted)',
                borderLeft: '3px solid var(--primary)',
                fontSize: '0.88rem',
              }}
            >
              <strong>{doc.label}:</strong>
              <p className="secondary" style={{ marginTop: 4 }}>
                {doc.content}
              </p>
            </div>
          ))}
        </div>

        {/* Tasks */}
        <div className="stack-sm">
          <strong style={{ fontSize: '0.92rem' }}>Nhiệm vụ của bạn:</strong>
          <ol style={{ margin: '0 0 0 20px', padding: 0, fontSize: '0.9rem' }} className="secondary">
            {activeCase.tasks.map((t) => (
              <li key={t} style={{ marginBottom: 4 }}>
                {t}
              </li>
            ))}
          </ol>
        </div>

        {/* Submission Box */}
        <div className="stack-sm">
          <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            Bài làm / Đề xuất của bạn:
          </label>
          <textarea
            rows={7}
            value={submissions[activeCase.id] ?? ''}
            onChange={(e) =>
              setSubmissions((prev) => ({ ...prev, [activeCase.id]: e.target.value }))
            }
            placeholder="Viết lại story, phân tích phương án hoặc soạn email phản hồi tại đây..."
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-strong)',
              background: 'var(--bg)',
              resize: 'vertical',
              fontSize: '0.9rem',
            }}
          />
        </div>

        {/* Self-assessment Rubric */}
        <div className="stack-sm">
          <div className="row-between">
            <strong style={{ fontSize: '0.92rem' }}>Rubric tự chấm điểm (0–3 mỗi tiêu chí):</strong>
            <span className="badge badge-primary">
              {earnedTotal}/{maxTotal} ({pct}%)
            </span>
          </div>
          {activeCase.rubric.map((r) => (
            <div
              key={r.id}
              className="row-between"
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <span style={{ fontSize: '0.88rem' }}>{r.criterion}</span>
              <div className="row" style={{ gap: 4 }}>
                {[0, 1, 2, 3].map((pt) => (
                  <button
                    key={pt}
                    type="button"
                    className={`btn btn-sm ${
                      (currentRubric[r.id] ?? -1) === pt ? 'btn-primary' : 'btn-secondary'
                    }`}
                    style={{ minWidth: 34, padding: '4px 8px' }}
                    onClick={() =>
                      setRubricScores((prev) => ({
                        ...prev,
                        [activeCase.id]: { ...(prev[activeCase.id] ?? {}), [r.id]: pt },
                      }))
                    }
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="row" style={{ flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleCompleteCase}>
            Nộp bài & Xem phân tích chuyên gia
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() =>
              setShowSolution((prev) => ({
                ...prev,
                [activeCase.id]: !prev[activeCase.id],
              }))
            }
          >
            {showSolution[activeCase.id] ? 'Ẩn lời giải mẫu' : 'Xem gợi ý chuyên gia'}
          </button>
          {savedNotice && <span className="badge badge-success">{savedNotice}</span>}
        </div>

        {/* Expert Solution */}
        {showSolution[activeCase.id] && (
          <div className="example-box good stack-sm" style={{ fontSize: '0.88rem' }}>
            <div className="row">
              <Lightbulb size={16} color="var(--success)" />
              <strong>Phân tích & Phương án chuyên gia:</strong>
            </div>
            <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
              {activeCase.expertSolution.map((line) => (
                <li key={line} style={{ marginBottom: 4 }}>
                  {line}
                </li>
              ))}
            </ul>
            <p className="muted" style={{ marginTop: 6, fontStyle: 'italic' }}>
              💭 Suy ngẫm: {activeCase.reflectionPrompt}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
