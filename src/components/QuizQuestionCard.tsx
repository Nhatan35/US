import { useMemo } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, XCircle } from 'lucide-react';
import type { QuizQuestion } from '@/types/course';
import { isQuestionCorrect, type QuestionAnswer } from '@/lib/quiz/scoring';

interface QuizQuestionCardProps {
  question: QuizQuestion;
  index: number;
  value: QuestionAnswer | undefined;
  onChange: (value: QuestionAnswer) => void;
  revealed: boolean;
}

function deterministicShuffle(items: string[], seed: string): string[] {
  const arr = [...items];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const j = hash % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Ensure order questions don't accidentally start in exact correct order if len > 1
  if (arr.length > 1 && arr.every((v, idx) => v === items[idx])) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}

const QUESTION_TYPE_LABEL: Record<QuizQuestion['type'], string> = {
  single: 'Chọn 1 đáp án',
  multi: 'Chọn nhiều đáp án',
  truefalse: 'Đúng / Sai',
  order: 'Sắp xếp thứ tự',
  match: 'Ghép cặp',
  highlight: 'Chọn cụm từ lỗi',
};

export function QuizQuestionCard({
  question,
  index,
  value,
  onChange,
  revealed,
}: QuizQuestionCardProps) {
  const correct = revealed ? isQuestionCorrect(question, value) : null;

  const initialShuffledOrder = useMemo(() => {
    if (question.type !== 'order') return [];
    return deterministicShuffle(question.items, question.id);
  }, [question]);

  const shuffledRights = useMemo(() => {
    if (question.type !== 'match') return [];
    return deterministicShuffle(
      question.pairs.map(([, r]) => r),
      question.id,
    );
  }, [question]);

  return (
    <div className="card stack-md">
      <div className="row-between">
        <span className="badge badge-primary">
          Câu {index + 1} · {QUESTION_TYPE_LABEL[question.type]}
        </span>
        {revealed &&
          (correct ? (
            <span className="badge badge-success">
              <CheckCircle2 size={14} /> Chính xác
            </span>
          ) : (
            <span className="badge badge-danger">
              <XCircle size={14} /> Chưa đúng
            </span>
          ))}
      </div>

      <p style={{ fontWeight: 600, fontSize: '0.98rem' }}>{question.prompt}</p>

      {/* SINGLE CHOICE */}
      {question.type === 'single' && (
        <div className="stack-sm">
          {question.options.map((opt, optIdx) => {
            const selected = value === optIdx;
            let cls = 'quiz-option';
            if (revealed) {
              if (optIdx === question.answer) cls += ' correct';
              else if (selected) cls += ' wrong';
            } else if (selected) {
              cls += ' selected';
            }
            return (
              <button
                key={optIdx}
                type="button"
                className={cls}
                disabled={revealed}
                onClick={() => onChange(optIdx)}
              >
                <span className="badge badge-muted">{String.fromCharCode(65 + optIdx)}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* MULTI CHOICE */}
      {question.type === 'multi' && (
        <div className="stack-sm">
          {question.options.map((opt, optIdx) => {
            const current = Array.isArray(value) ? (value as number[]) : [];
            const selected = current.includes(optIdx);
            const isAns = question.answer.includes(optIdx);
            let cls = 'quiz-option';
            if (revealed) {
              if (isAns) cls += ' correct';
              else if (selected) cls += ' wrong';
            } else if (selected) {
              cls += ' selected';
            }
            const toggle = () => {
              const next = selected
                ? current.filter((x) => x !== optIdx)
                : [...current, optIdx];
              onChange(next);
            };
            return (
              <button
                key={optIdx}
                type="button"
                className={cls}
                disabled={revealed}
                onClick={toggle}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  readOnly
                  style={{ accentColor: 'var(--primary)' }}
                />
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* TRUE / FALSE */}
      {question.type === 'truefalse' && (
        <div className="grid-2">
          {[
            { label: 'Đúng', val: true },
            { label: 'Sai', val: false },
          ].map(({ label, val }) => {
            const selected = value === val;
            let cls = 'quiz-option';
            if (revealed) {
              if (val === question.answer) cls += ' correct';
              else if (selected) cls += ' wrong';
            } else if (selected) {
              cls += ' selected';
            }
            return (
              <button
                key={label}
                type="button"
                className={cls}
                disabled={revealed}
                onClick={() => onChange(val)}
              >
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ORDER */}
      {question.type === 'order' && (() => {
        const current = Array.isArray(value) ? (value as string[]) : initialShuffledOrder;
        const move = (from: number, to: number) => {
          if (to < 0 || to >= current.length) return;
          const next = [...current];
          [next[from], next[to]] = [next[to], next[from]];
          onChange(next);
        };
        return (
          <div className="stack-sm">
            {current.map((item, idx) => {
              const isRightPos = revealed && question.items[idx] === item;
              return (
                <div
                  key={item}
                  className={`quiz-option ${revealed ? (isRightPos ? 'correct' : 'wrong') : ''}`}
                  style={{ justifyContent: 'space-between', cursor: 'default' }}
                >
                  <div className="row">
                    <span className="badge badge-muted">{idx + 1}</span>
                    <span>{item}</span>
                  </div>
                  {!revealed && (
                    <div className="row" style={{ gap: 4 }}>
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label="Lên trên"
                        disabled={idx === 0}
                        onClick={() => move(idx, idx - 1)}
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label="Xuống dưới"
                        disabled={idx === current.length - 1}
                        onClick={() => move(idx, idx + 1)}
                      >
                        <ArrowDown size={15} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* MATCH */}
      {question.type === 'match' && (() => {
        const current =
          value && typeof value === 'object' && !Array.isArray(value)
            ? (value as Record<string, string>)
            : {};
        return (
          <div className="stack-sm">
            {question.pairs.map(([left, rightAnswer]) => {
              const selectedRight = current[left] ?? '';
              const isOk = revealed && selectedRight === rightAnswer;
              return (
                <div
                  key={left}
                  className={`quiz-option ${revealed ? (isOk ? 'correct' : 'wrong') : ''}`}
                  style={{ justifyContent: 'space-between', flexWrap: 'wrap', cursor: 'default' }}
                >
                  <strong style={{ minWidth: 130 }}>{left}</strong>
                  <select
                    disabled={revealed}
                    value={selectedRight}
                    onChange={(e) => onChange({ ...current, [left]: e.target.value })}
                    style={{
                      flex: 1,
                      minWidth: 220,
                      padding: '7px 10px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-strong)',
                      background: 'var(--surface)',
                    }}
                  >
                    <option value="">-- Chọn mô tả tương ứng --</option>
                    {shuffledRights.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* HIGHLIGHT */}
      {question.type === 'highlight' && (() => {
        const current = Array.isArray(value) ? (value as number[]) : [];
        const toggle = (segIdx: number) => {
          if (revealed) return;
          const next = current.includes(segIdx)
            ? current.filter((x) => x !== segIdx)
            : [...current, segIdx];
          onChange(next);
        };
        return (
          <div
            style={{
              padding: 16,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--surface-muted)',
              lineHeight: 2,
              fontSize: '0.96rem',
            }}
          >
            {question.segments.map((seg, segIdx) => {
              const selected = current.includes(segIdx);
              let cls = 'highlight-token';
              if (revealed) {
                if (seg.isTarget) cls += ' correct';
                else if (selected) cls += ' wrong';
              } else if (selected) {
                cls += ' selected';
              }
              return (
                <span
                  key={segIdx}
                  role="button"
                  tabIndex={0}
                  className={cls}
                  onClick={() => toggle(segIdx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggle(segIdx);
                    }
                  }}
                >
                  {seg.text}
                </span>
              );
            })}
          </div>
        );
      })()}

      {revealed && (
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--surface-muted)',
            fontSize: '0.88rem',
          }}
        >
          <strong>Giải thích: </strong>
          {question.explain}
        </div>
      )}
    </div>
  );
}
