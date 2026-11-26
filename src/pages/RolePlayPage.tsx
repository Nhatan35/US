import { useState } from 'react';
import { CheckCircle2, MessageSquare, RotateCcw, Save, ShieldAlert } from 'lucide-react';
import {
  COMM_LABELS,
  ROLEPLAY_SCENARIOS,
  type CommDimension,
  type RolePlayChoice,
} from '@/content/roleplays/roleplays';
import { useProgressStore } from '@/lib/store/progressStore';

interface HistoryEntry {
  speaker: string;
  text: string;
  isUser?: boolean;
  feedback?: string;
  quality?: 'good' | 'ok' | 'bad';
}

const INITIAL_SCORES: Record<CommDimension, number> = {
  question: 0,
  listen: 0,
  value: 0,
  negotiate: 0,
  relation: 0,
};

export function RolePlayPage() {
  const recordExerciseResult = useProgressStore((s) => s.recordExerciseResult);
  const saveStory = useProgressStore((s) => s.saveStory);

  const [scenarioIdx, setScenarioIdx] = useState(0);
  const scenario = ROLEPLAY_SCENARIOS[scenarioIdx];

  const [nodeId, setNodeId] = useState(scenario.startNode);
  const [trust, setTrust] = useState(50);
  const [scores, setScores] = useState<Record<CommDimension, number>>({ ...INITIAL_SCORES });
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      speaker: scenario.nodes[scenario.startNode].speaker,
      text: scenario.nodes[scenario.startNode].text,
    },
  ]);
  const [savedStoryMsg, setSavedStoryMsg] = useState<string | null>(null);

  const currentNode = scenario.nodes[nodeId];

  const startScenario = (idx: number) => {
    const nextSc = ROLEPLAY_SCENARIOS[idx];
    setScenarioIdx(idx);
    setNodeId(nextSc.startNode);
    setTrust(50);
    setScores({ ...INITIAL_SCORES });
    setHistory([
      {
        speaker: nextSc.nodes[nextSc.startNode].speaker,
        text: nextSc.nodes[nextSc.startNode].text,
      },
    ]);
    setSavedStoryMsg(null);
  };

  const handleChoose = (choice: RolePlayChoice) => {
    const nextNode = scenario.nodes[choice.next];
    const nextTrust = Math.max(0, Math.min(100, trust + choice.trustDelta));
    const nextScores = { ...scores };
    for (const [k, delta] of Object.entries(choice.effects) as [CommDimension, number][]) {
      nextScores[k] = (nextScores[k] ?? 0) + delta;
    }

    setTrust(nextTrust);
    setScores(nextScores);
    setNodeId(choice.next);
    setHistory((prev) => [
      ...prev,
      {
        speaker: 'Bạn',
        text: choice.text,
        isUser: true,
        feedback: choice.feedback,
        quality: choice.quality,
      },
      {
        speaker: nextNode.speaker,
        text: nextNode.text,
      },
    ]);

    if (nextNode.ending) {
      const pts = nextNode.ending.grade === 'good' ? 100 : nextNode.ending.grade === 'neutral' ? 75 : 40;
      recordExerciseResult(
        `roleplay-${scenario.id}`,
        pts,
        nextNode.ending.grade === 'good' ? 35 : 15,
        { stakeholder: nextNode.ending.grade === 'good' ? 7 : 3 },
        nextNode.ending.grade === 'good' ? 'negotiator' : undefined,
      );
    }
  };

  return (
    <div className="stack-lg">
      <div className="row-between" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div className="stack-sm">
          <h1 style={{ fontSize: '1.45rem' }}>Nhập vai giao tiếp Stakeholder (Hội thoại rẽ nhánh)</h1>
          <p className="secondary" style={{ fontSize: '0.9rem' }}>
            Mỗi lựa chọn sẽ tác động trực tiếp đến mức tin tưởng và 5 kỹ năng giao tiếp. Chơi lại để khám phá các nhánh kết thúc khác nhau!
          </p>
        </div>

        <div className="row" style={{ flexWrap: 'wrap' }}>
          {ROLEPLAY_SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              type="button"
              className={`btn btn-sm ${idx === scenarioIdx ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => startScenario(idx)}
            >
              <MessageSquare size={14} /> {sc.code}: {sc.character.split('—')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario header + Trust meter */}
      <div className="card stack-sm">
        <div className="row-between" style={{ flexWrap: 'wrap', gap: 8 }}>
          <div>
            <span className="badge badge-primary">{scenario.code}</span>{' '}
            <strong style={{ fontSize: '1.05rem', marginLeft: 6 }}>{scenario.title}</strong>
            <div className="muted" style={{ fontSize: '0.84rem', marginTop: 2 }}>
              Nhân vật: {scenario.character} · Mục tiêu: {scenario.goal}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => startScenario(scenarioIdx)}
          >
            <RotateCcw size={14} /> Chơi lại
          </button>
        </div>

        <div className="row" style={{ gap: 12, marginTop: 6 }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, minWidth: 110 }}>
            Niềm tin: {trust}%
          </span>
          <div className="progress-bar" style={{ flex: 1 }}>
            <div
              className="progress-fill"
              style={{
                width: `${trust}%`,
                background:
                  trust >= 65 ? 'var(--success)' : trust >= 35 ? 'var(--warning)' : 'var(--danger)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Chat transcript */}
      <div className="card stack-md">
        {history.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
              maxWidth: '86%',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: msg.isUser ? 'var(--primary-soft)' : 'var(--surface-muted)',
              border: `1px solid ${msg.isUser ? 'var(--primary-border)' : 'var(--border)'}`,
            }}
            className="stack-sm"
          >
            <strong style={{ fontSize: '0.82rem', color: msg.isUser ? 'var(--primary)' : 'var(--text)' }}>
              {msg.speaker}
            </strong>
            <p style={{ fontSize: '0.92rem' }}>{msg.text}</p>
            {msg.feedback && (
              <div
                style={{
                  fontSize: '0.8rem',
                  paddingTop: 6,
                  borderTop: '1px solid var(--border)',
                  color:
                    msg.quality === 'good'
                      ? 'var(--success)'
                      : msg.quality === 'ok'
                        ? 'var(--warning)'
                        : 'var(--danger)',
                }}
              >
                {msg.quality === 'good' ? '🟢 ' : msg.quality === 'ok' ? '🟡 ' : '🔴 '}
                {msg.feedback}
              </div>
            )}
          </div>
        ))}

        {/* Choices */}
        {currentNode.choices && (
          <div className="stack-sm" style={{ paddingTop: 10, borderTop: '1px solid var(--border)' }}>
            <strong style={{ fontSize: '0.9rem' }}>Chọn phản hồi của bạn:</strong>
            {currentNode.choices.map((c, idx) => (
              <button
                key={idx}
                type="button"
                className="quiz-option"
                onClick={() => handleChoose(c)}
              >
                <span className="badge badge-muted">{String.fromCharCode(65 + idx)}</span>
                <span>{c.text}</span>
              </button>
            ))}
          </div>
        )}

        {/* Ending debrief */}
        {currentNode.ending && (
          <div
            style={{
              padding: 16,
              borderRadius: 'var(--radius-sm)',
              background:
                currentNode.ending.grade === 'good'
                  ? 'var(--success-soft)'
                  : currentNode.ending.grade === 'neutral'
                    ? 'var(--warning-soft)'
                    : 'var(--danger-soft)',
              border: `1px solid ${
                currentNode.ending.grade === 'good'
                  ? 'var(--success-border)'
                  : currentNode.ending.grade === 'neutral'
                    ? 'var(--warning-border)'
                    : 'var(--danger-border)'
              }`,
            }}
            className="stack-sm"
          >
            <div className="row">
              {currentNode.ending.grade === 'good' ? (
                <CheckCircle2 size={20} color="var(--success)" />
              ) : (
                <ShieldAlert size={20} color="var(--warning)" />
              )}
              <strong>
                Kết thúc:{' '}
                {currentNode.ending.grade === 'good'
                  ? 'Thành công xuất sắc (+35 XP)'
                  : currentNode.ending.grade === 'neutral'
                    ? 'Tạm ổn (+15 XP)'
                    : 'Chưa tối ưu — thử nhánh khác nhé!'}
              </strong>
            </div>
            <p style={{ fontSize: '0.9rem' }}>{currentNode.ending.summary}</p>
            <div style={{ fontSize: '0.85rem' }}>
              <strong>Câu nói mẫu dùng ngoài đời thật:</strong>
              <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                {currentNode.ending.takeawayPhrases.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>

            {currentNode.ending.resultingStory && (
              <div className="stack-sm" style={{ marginTop: 6 }}>
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>User Story đúc kết từ cuộc hội thoại:</strong>{' '}
                  <em>{currentNode.ending.resultingStory}</em>
                </div>
                <div className="row">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      saveStory({
                        id: `rp-story-${Date.now()}`,
                        title: `Story từ ${scenario.code}`,
                        role: 'trưởng phòng kinh doanh',
                        want: currentNode.ending!.resultingStory!,
                        benefit: 'giải quyết đúng nhu cầu gốc',
                        acceptanceCriteria: [
                          'Tự động gửi báo cáo lúc 08:00 sáng thứ Hai hằng tuần.',
                          'Gồm bảng tổng hợp doanh số theo từng nhân viên và tổng cộng.',
                        ],
                        status: 'refining',
                      });
                      setSavedStoryMsg('Đã lưu Story này vào Backlog!');
                    }}
                  >
                    <Save size={14} /> Lưu Story vào Backlog
                  </button>
                  {savedStoryMsg && <span className="badge badge-success">{savedStoryMsg}</span>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5-dimension communication bar */}
      <div className="card">
        <div className="row" style={{ flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }}>
          {(Object.keys(COMM_LABELS) as CommDimension[]).map((dim) => (
            <span key={dim} className="stat-pill">
              {COMM_LABELS[dim]}:{' '}
              <strong
                style={{
                  color:
                    scores[dim] > 0
                      ? 'var(--success)'
                      : scores[dim] < 0
                        ? 'var(--danger)'
                        : 'var(--text)',
                }}
              >
                {scores[dim] > 0 ? `+${scores[dim]}` : scores[dim]}
              </strong>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
