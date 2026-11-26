import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Download, Plus, Trash2 } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';

interface MapStory {
  id: string;
  activityId: string;
  release: 1 | 2 | 3;
  title: string;
}

interface ActivityCol {
  id: string;
  name: string;
  task: string;
}

const ACTIVITIES: ActivityCol[] = [
  { id: 'act-1', name: '1. Tìm bác sĩ', task: 'Tìm & Lọc' },
  { id: 'act-2', name: '2. Đặt lịch', task: 'Chọn khung giờ' },
  { id: 'act-3', name: '3. Thanh toán', task: 'Trả phí khám' },
  { id: 'act-4', name: '4. Đi khám', task: 'Check-in & Chờ' },
  { id: 'act-5', name: '5. Sau khám', task: 'Xem kết quả' },
];

const INITIAL_STORIES: MapStory[] = [
  { id: 'sm-1', activityId: 'act-1', release: 1, title: 'Lọc theo chuyên khoa & chi nhánh' },
  { id: 'sm-2', activityId: 'act-1', release: 2, title: 'Xem đánh giá sao của bác sĩ' },
  { id: 'sm-3', activityId: 'act-2', release: 1, title: 'Chọn slot trống & xác nhận đặt' },
  { id: 'sm-4', activityId: 'act-2', release: 2, title: 'Đổi giờ / hủy lịch tự động' },
  { id: 'sm-5', activityId: 'act-2', release: 3, title: 'Đặt lịch hộ người thân' },
  { id: 'sm-6', activityId: 'act-3', release: 1, title: 'Thanh toán trực tiếp tại quầy' },
  { id: 'sm-7', activityId: 'act-3', release: 2, title: 'Thanh toán qua ví MoMo / VNPay' },
  { id: 'sm-8', activityId: 'act-4', release: 1, title: 'Check-in mã QR & lấy số' },
  { id: 'sm-9', activityId: 'act-4', release: 2, title: 'Xem số thứ tự trực tuyến' },
  { id: 'sm-10', activityId: 'act-5', release: 2, title: 'Xem đơn thuốc điện tử' },
  { id: 'sm-11', activityId: 'act-5', release: 3, title: 'Nhắc lịch tái khám định kỳ' },
];

export function StoryMapLab() {
  const recordExerciseResult = useProgressStore((s) => s.recordExerciseResult);
  const [stories, setStories] = useState<MapStory[]>(INITIAL_STORIES);
  const [newTitle, setNewTitle] = useState('');
  const [newAct, setNewAct] = useState(ACTIVITIES[0].id);
  const [newRel, setNewRel] = useState<1 | 2 | 3>(1);
  const [outcomes, setOutcomes] = useState<Record<1 | 2 | 3, string>>({
    1: 'MVP (Walking Skeleton): Bệnh nhân đặt lịch online & đi khám trọn vẹn từ đầu đến cuối.',
    2: 'Release 2: Giảm 50% thời gian chờ, hỗ trợ thanh toán ví và xem đơn thuốc.',
    3: 'Release 3: Mở rộng cho bệnh nhân lớn tuổi & chăm sóc tái khám.',
  });

  const missingInMvp = ACTIVITIES.filter(
    (act) => !stories.some((s) => s.activityId === act.id && s.release === 1),
  );

  const walkingSkeletonOk = missingInMvp.length === 0;

  const moveRelease = (id: string, release: 1 | 2 | 3) => {
    setStories((prev) => prev.map((s) => (s.id === id ? { ...s, release } : s)));
  };

  const addStory = () => {
    if (!newTitle.trim()) return;
    setStories((prev) => [
      ...prev,
      { id: `sm-${Date.now()}`, activityId: newAct, release: newRel, title: newTitle.trim() },
    ]);
    setNewTitle('');
  };

  const exportMarkdown = () => {
    const lines = ['# User Story Map — MediBook', ''];
    for (const rel of [1, 2, 3] as const) {
      lines.push(`## Release ${rel} — ${outcomes[rel]}`);
      for (const act of ACTIVITIES) {
        const items = stories.filter((s) => s.release === rel && s.activityId === act.id);
        if (items.length > 0) {
          lines.push(`- **${act.name}:** ${items.map((i) => i.title).join('; ')}`);
        }
      }
      lines.push('');
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'story-map-medibook.md';
    a.click();
    URL.revokeObjectURL(url);
    if (walkingSkeletonOk) {
      recordExerciseResult('story-map-lab', 100, 25, { backlog: 6 }, 'mapmaker');
    }
  };

  return (
    <div className="stack-lg">
      <div className="row-between" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div className="stack-sm">
          <h1 style={{ fontSize: '1.45rem' }}>User Story Mapping Board</h1>
          <p className="secondary" style={{ fontSize: '0.9rem' }}>
            Trục ngang là hành trình người dùng (Backbone), trục dọc là mức ưu tiên theo Release. Đảm bảo Release 1 (MVP) tạo thành <strong>Walking Skeleton</strong> xuyên suốt mọi bước.
          </p>
        </div>

        <button type="button" className="btn btn-primary btn-sm" onClick={exportMarkdown}>
          <Download size={14} /> Xuất Story Map (.md)
        </button>
      </div>

      {/* Walking Skeleton Status */}
      <div
        className="card row"
        style={{
          background: walkingSkeletonOk ? 'var(--success-soft)' : 'var(--warning-soft)',
          borderColor: walkingSkeletonOk ? 'var(--success-border)' : 'var(--warning-border)',
          fontSize: '0.9rem',
        }}
      >
        {walkingSkeletonOk ? (
          <>
            <CheckCircle2 size={18} color="var(--success)" />
            <span>
              <strong>Walking Skeleton hợp lệ!</strong> Release 1 (MVP) đã có ít nhất 1 story ở đủ cả 5 bước hành trình.
            </span>
          </>
        ) : (
          <>
            <AlertTriangle size={18} color="var(--warning)" />
            <span>
              <strong>Cảnh báo Walking Skeleton:</strong> Release 1 đang trống ở bước{' '}
              <strong>{missingInMvp.map((a) => a.name).join(', ')}</strong>. Hãy kéo/chuyển ít nhất 1 story cơ bản lên Release 1 để người dùng đi trọn hành trình.
            </span>
          </>
        )}
      </div>

      {/* Add Story Bar */}
      <div className="card row" style={{ flexWrap: 'wrap', gap: 10 }}>
        <select
          value={newAct}
          onChange={(e) => setNewAct(e.target.value)}
          style={{
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-strong)',
            background: 'var(--surface)',
          }}
        >
          {ACTIVITIES.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <select
          value={newRel}
          onChange={(e) => setNewRel(Number(e.target.value) as 1 | 2 | 3)}
          style={{
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-strong)',
            background: 'var(--surface)',
          }}
        >
          <option value={1}>Release 1 (MVP)</option>
          <option value={2}>Release 2</option>
          <option value={3}>Release 3</option>
        </select>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Nhập thẻ story mới (ví dụ: Xem tóm tắt phiếu khám cơ bản)..."
          style={{
            flex: 1,
            minWidth: 220,
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-strong)',
            background: 'var(--bg)',
          }}
        />
        <button type="button" className="btn btn-primary btn-sm" onClick={addStory}>
          <Plus size={14} /> Thêm thẻ
        </button>
      </div>

      {/* 2D Story Map Grid */}
      <div className="card stack-md" style={{ overflowX: 'auto' }}>
        {/* Backbone header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '150px repeat(5, minmax(170px, 1fr))',
            gap: 10,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '0.82rem', padding: 8 }} className="muted">
            BACKBONE
          </div>
          {ACTIVITIES.map((act) => (
            <div
              key={act.id}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary)',
                color: '#fff',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>{act.name}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.88 }}>{act.task}</div>
            </div>
          ))}
        </div>

        {/* Release Swimlanes */}
        {([1, 2, 3] as const).map((rel) => (
          <div
            key={rel}
            style={{
              display: 'grid',
              gridTemplateColumns: '150px repeat(5, minmax(170px, 1fr))',
              gap: 10,
              paddingTop: 12,
              borderTop: '2px dashed var(--border-strong)',
            }}
          >
            <div className="stack-sm">
              <span className={`badge ${rel === 1 ? 'badge-success' : 'badge-muted'}`}>
                Release {rel} {rel === 1 ? '(MVP)' : ''}
              </span>
              <textarea
                rows={3}
                value={outcomes[rel]}
                onChange={(e) =>
                  setOutcomes((prev) => ({ ...prev, [rel]: e.target.value }))
                }
                style={{
                  fontSize: '0.74rem',
                  padding: 6,
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  resize: 'vertical',
                }}
              />
            </div>

            {ACTIVITIES.map((act) => {
              const cellStories = stories.filter(
                (s) => s.activityId === act.id && s.release === rel,
              );
              return (
                <div
                  key={act.id}
                  style={{
                    minHeight: 90,
                    padding: 8,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-muted)',
                  }}
                  className="stack-sm"
                >
                  {cellStories.map((st) => (
                    <div
                      key={st.id}
                      style={{
                        padding: 8,
                        borderRadius: 6,
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        fontSize: '0.8rem',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                      className="stack-sm"
                    >
                      <div style={{ fontWeight: 500 }}>{st.title}</div>
                      <div className="row-between" style={{ gap: 4 }}>
                        <select
                          aria-label="Chuyển release"
                          value={st.release}
                          onChange={(e) =>
                            moveRelease(st.id, Number(e.target.value) as 1 | 2 | 3)
                          }
                          style={{
                            fontSize: '0.72rem',
                            padding: '2px 4px',
                            borderRadius: 4,
                            border: '1px solid var(--border-strong)',
                            background: 'var(--bg)',
                          }}
                        >
                          <option value={1}>R1 (MVP)</option>
                          <option value={2}>R2</option>
                          <option value={3}>R3</option>
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            setStories((prev) => prev.filter((x) => x.id !== st.id))
                          }
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: 2,
                          }}
                          aria-label="Xóa thẻ"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
