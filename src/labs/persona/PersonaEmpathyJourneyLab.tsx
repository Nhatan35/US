import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HeartHandshake, Map, Plus, Save, Trash2, UserPlus } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import type { Persona } from '@/types/course';

const INTERVIEW_QUOTES = [
  '“Tôi gọi tổng đài 3 lần lúc 8h sáng đều báo máy bận, đành xin nghỉ nửa buổi đưa con đi xếp hàng.” — Chị Lan, 32t',
  '“Tôi muốn biết bác sĩ nào mát tay khám tai mũi họng cho bé 3 tuổi và có làm ngoài giờ hành chính.” — Chị Lan',
  '“Bác già rồi, chữ trên app nhỏ xíu không đọc được. Có lần bấm nhầm hủy lịch mà không biết.” — Bác Hòa, 68t',
  '“Con gái bác ở xa nhưng hay đặt lịch tái khám hộ bác, rồi nhắc bác đi đúng giờ.” — Bác Hòa',
];

const EMPATHY_QUADRANTS = [
  { key: 'says', label: 'Nói (Says)' },
  { key: 'thinks', label: 'Nghĩ (Thinks)' },
  { key: 'does', label: 'Làm (Does)' },
  { key: 'feels', label: 'Cảm thấy (Feels)' },
  { key: 'pains', label: 'Nỗi đau (Pains)' },
  { key: 'gains', label: 'Mong muốn (Gains)' },
] as const;

type QuadrantKey = (typeof EMPATHY_QUADRANTS)[number]['key'];

interface JourneyStage {
  stage: string;
  action: string;
  emotion: 1 | 2 | 3 | 4 | 5;
  pain: string;
  opportunity: string;
}

const INITIAL_JOURNEY: JourneyStage[] = [
  {
    stage: '1. Tìm bác sĩ',
    action: 'Hỏi người quen hoặc tìm Google',
    emotion: 3,
    pain: 'Không rõ bác sĩ nào còn lịch trống buổi tối',
    opportunity: 'Lọc bác sĩ theo chuyên khoa và khung giờ trống sau 18h',
  },
  {
    stage: '2. Đặt lịch',
    action: 'Gọi điện tổng đài phòng khám',
    emotion: 1,
    pain: 'Tổng đài bận liên tục giờ cao điểm',
    opportunity: 'Đặt lịch trực tuyến trong 3 bước dưới 2 phút',
  },
  {
    stage: '3. Trước giờ khám',
    action: 'Ghi chú lịch trên giấy nhớ',
    emotion: 3,
    pain: 'Dễ quên lịch hoặc quên mang sổ khám',
    opportunity: 'Gửi SMS/thông báo nhắc lịch tự động trước 24 giờ',
  },
  {
    stage: '4. Check-in tại quầy',
    action: 'Xếp hàng lấy số thứ tự',
    emotion: 2,
    pain: 'Chờ trung bình 90 phút mới đến lượt',
    opportunity: 'Quét mã QR check-in và xem số thứ tự trực tuyến',
  },
  {
    stage: '5. Sau khám',
    action: 'Cầm đơn thuốc giấy về nhà',
    emotion: 4,
    pain: 'Khó tra lại lịch sử khám lần trước',
    opportunity: 'Lưu hồ sơ đơn thuốc & lịch tái khám trong ứng dụng',
  },
];

export function PersonaEmpathyJourneyLab() {
  const personas = useProgressStore((s) => s.personas);
  const savePersona = useProgressStore((s) => s.savePersona);
  const deletePersona = useProgressStore((s) => s.deletePersona);
  const recordExerciseResult = useProgressStore((s) => s.recordExerciseResult);

  const [tab, setTab] = useState<'persona' | 'empathy' | 'journey'>('persona');

  // Persona form
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [ageGroup, setAgeGroup] = useState('27 tuổi');
  const [techLevel, setTechLevel] = useState<Persona['techLevel']>('Trung bình');
  const [quote, setQuote] = useState('');
  const [goalsText, setGoalsText] = useState('');
  const [painsText, setPainsText] = useState('');
  const [context, setContext] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  // Empathy map state
  const [notes, setNotes] = useState<Record<QuadrantKey, string[]>>({
    says: ['Gọi tổng đài toàn báo máy bận'],
    thinks: ['Không biết đến phòng khám có phải chờ 2 tiếng nữa không'],
    does: ['Mở điện thoại tìm phòng khám mở sau 18h'],
    feels: ['Lo lắng khi con sốt, mệt mỏi vì chờ đợi'],
    pains: ['Phải xin nghỉ làm, mất thời gian xếp hàng'],
    gains: ['Biết chắc giờ khám, thao tác nhanh trong 2 phút'],
  });
  const [newNoteText, setNewNoteText] = useState('');
  const [targetQuad, setTargetQuad] = useState<QuadrantKey>('pains');

  // Journey state
  const [journey, setJourney] = useState<JourneyStage[]>(INITIAL_JOURNEY);

  const handleSavePersona = () => {
    if (!name.trim() || !roleTitle.trim()) return;
    savePersona({
      id: `p-${Date.now()}`,
      name: name.trim(),
      roleTitle: roleTitle.trim(),
      ageGroup: ageGroup.trim() || 'Không rõ',
      techLevel,
      quote: quote.trim(),
      goals: goalsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      painPoints: painsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      context: context.trim(),
    });
    recordExerciseResult('persona-lab', 100, 20, { empathy: 6 });
    setName('');
    setRoleTitle('');
    setQuote('');
    setGoalsText('');
    setPainsText('');
    setContext('');
    setNotice('Đã lưu Persona! Bạn có thể chọn ngay Persona này trong Story Writer (+20 XP).');
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="stack-lg">
      <div className="row-between" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div className="stack-sm">
          <h1 style={{ fontSize: '1.45rem' }}>Bộ công cụ Thấu hiểu Người dùng</h1>
          <p className="secondary" style={{ fontSize: '0.9rem' }}>
            Tạo Persona từ dữ liệu phỏng vấn, vẽ Empathy Map và chuyển cơ hội trên User Journey Map thành User Story.
          </p>
        </div>

        <div className="row" style={{ flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn btn-sm ${tab === 'persona' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('persona')}
          >
            <UserPlus size={14} /> Persona Builder
          </button>
          <button
            type="button"
            className={`btn btn-sm ${tab === 'empathy' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('empathy')}
          >
            <HeartHandshake size={14} /> Empathy Map
          </button>
          <button
            type="button"
            className={`btn btn-sm ${tab === 'journey' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('journey')}
          >
            <Map size={14} /> User Journey Map
          </button>
        </div>
      </div>

      {/* TAB 1: PERSONA BUILDER */}
      {tab === 'persona' && (
        <div className="stack-lg">
          <div className="grid-2">
            <div className="card stack-md">
              <h2 style={{ fontSize: '1.05rem' }}>Trích đoạn phỏng vấn mẫu (MediBook)</h2>
              <p className="muted" style={{ fontSize: '0.84rem' }}>
                Đọc trích đoạn bên dưới để tổng hợp mục tiêu và nỗi đau thực tế thay vì đoán mò:
              </p>
              <div className="stack-sm">
                {INTERVIEW_QUOTES.map((q) => (
                  <div
                    key={q}
                    style={{
                      padding: 10,
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--surface-muted)',
                      fontSize: '0.85rem',
                    }}
                  >
                    {q}
                  </div>
                ))}
              </div>
            </div>

            <div className="card stack-md">
              <h2 style={{ fontSize: '1.05rem' }}>Tạo Persona mới</h2>
              <div className="grid-2">
                <input
                  type="text"
                  placeholder="Tên (ví dụ: Anh Minh)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Vai trò (ví dụ: Dân văn phòng)"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg)',
                  }}
                />
              </div>

              <div className="grid-2">
                <input
                  type="text"
                  placeholder="Độ tuổi"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg)',
                  }}
                />
                <select
                  value={techLevel}
                  onChange={(e) => setTechLevel(e.target.value as Persona['techLevel'])}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--surface)',
                  }}
                >
                  <option value="Thấp">Công nghệ: Thấp</option>
                  <option value="Trung bình">Công nghệ: Trung bình</option>
                  <option value="Cao">Công nghệ: Cao</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Câu nói đặc trưng (Quote)..."
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--bg)',
                }}
              />
              <textarea
                rows={2}
                placeholder="Mục tiêu (mỗi dòng 1 ý)..."
                value={goalsText}
                onChange={(e) => setGoalsText(e.target.value)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--bg)',
                }}
              />
              <textarea
                rows={2}
                placeholder="Nỗi đau / Pain points (mỗi dòng 1 ý)..."
                value={painsText}
                onChange={(e) => setPainsText(e.target.value)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--bg)',
                }}
              />
              <input
                type="text"
                placeholder="Bối cảnh sử dụng..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--bg)',
                }}
              />

              <div className="row" style={{ flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={!name.trim() || !roleTitle.trim()}
                  onClick={handleSavePersona}
                >
                  <Save size={15} /> Lưu Persona
                </button>
                {notice && <span className="badge badge-success">{notice}</span>}
              </div>
            </div>
          </div>

          {/* Saved Personas */}
          <div className="stack-sm">
            <h2 style={{ fontSize: '1.1rem' }}>
              Danh sách Persona hiện có ({personas.length}) — đồng bộ với Story Writer
            </h2>
            <div className="grid-2">
              {personas.map((p) => (
                <div key={p.id} className="card stack-sm">
                  <div className="row-between">
                    <div>
                      <strong style={{ fontSize: '1rem' }}>{p.name}</strong> ·{' '}
                      <span className="muted" style={{ fontSize: '0.84rem' }}>{p.ageGroup}</span>
                      <div style={{ color: 'var(--primary)', fontSize: '0.86rem', fontWeight: 600 }}>
                        {p.roleTitle}
                      </div>
                    </div>
                    <div className="row">
                      <span className="badge badge-muted">Tech: {p.techLevel}</span>
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label="Xóa persona"
                        onClick={() => deletePersona(p.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {p.quote && (
                    <p style={{ fontStyle: 'italic', fontSize: '0.85rem' }} className="secondary">
                      "{p.quote}"
                    </p>
                  )}
                  <div className="grid-2" style={{ gap: 10, fontSize: '0.82rem' }}>
                    <div>
                      <strong>Mục tiêu:</strong>
                      <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                        {p.goals.map((g) => (
                          <li key={g}>{g}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Nỗi đau:</strong>
                      <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                        {p.painPoints.map((pt) => (
                          <li key={pt}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EMPATHY MAP */}
      {tab === 'empathy' && (
        <div className="stack-md">
          <div className="card row" style={{ flexWrap: 'wrap', gap: 10 }}>
            <select
              value={targetQuad}
              onChange={(e) => setTargetQuad(e.target.value as QuadrantKey)}
              style={{
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                background: 'var(--surface)',
              }}
            >
              {EMPATHY_QUADRANTS.map((q) => (
                <option key={q.key} value={q.key}>
                  {q.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Thêm sticky note vào ô Empathy Map..."
              style={{
                flex: 1,
                minWidth: 200,
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                background: 'var(--bg)',
              }}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (!newNoteText.trim()) return;
                setNotes((prev) => ({
                  ...prev,
                  [targetQuad]: [...prev[targetQuad], newNoteText.trim()],
                }));
                setNewNoteText('');
              }}
            >
              <Plus size={14} /> Thêm note
            </button>
          </div>

          <div className="grid-2">
            {EMPATHY_QUADRANTS.map((q) => (
              <div key={q.key} className="card stack-sm">
                <strong style={{ color: 'var(--primary)' }}>{q.label}</strong>
                <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
                  {notes[q.key].map((text, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--warning-soft)',
                        border: '1px solid var(--warning-border)',
                        fontSize: '0.84rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {text}
                      <button
                        type="button"
                        onClick={() =>
                          setNotes((prev) => ({
                            ...prev,
                            [q.key]: prev[q.key].filter((_, i) => i !== idx),
                          }))
                        }
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          padding: 0,
                          color: 'var(--text-muted)',
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: USER JOURNEY MAP */}
      {tab === 'journey' && (
        <div className="card stack-md" style={{ overflowX: 'auto' }}>
          <h2 style={{ fontSize: '1.08rem' }}>
            Hành trình đặt lịch khám (MediBook) — Bấm "Tạo Story" ở mỗi cơ hội để sang Story Writer
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(195px, 1fr))', gap: 12 }}>
            {journey.map((st, idx) => (
              <div
                key={st.stage}
                style={{
                  padding: 12,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                }}
                className="stack-sm"
              >
                <strong style={{ fontSize: '0.88rem', color: 'var(--primary)' }}>{st.stage}</strong>
                <div style={{ fontSize: '0.82rem' }}>
                  <span className="muted">Hành động: </span>
                  {st.action}
                </div>
                <div className="row" style={{ gap: 4 }}>
                  <span className="muted" style={{ fontSize: '0.78rem' }}>Cảm xúc:</span>
                  {([1, 2, 3, 4, 5] as const).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() =>
                        setJourney((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, emotion: val } : item)),
                        )
                      }
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 999,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background:
                          st.emotion === val
                            ? val <= 2
                              ? 'var(--danger)'
                              : val === 3
                                ? 'var(--warning)'
                                : 'var(--success)'
                            : 'var(--surface-muted)',
                        color: st.emotion === val ? '#fff' : 'var(--text-muted)',
                      }}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>
                  <strong>Nỗi đau:</strong> {st.pain}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
                  <strong>Cơ hội:</strong> {st.opportunity}
                </div>
                <Link
                  to={`/labs/story-writer?title=${encodeURIComponent(st.stage)}&role=${encodeURIComponent(personas[0]?.roleTitle ?? 'bệnh nhân')}&want=${encodeURIComponent(st.opportunity)}`}
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: 'auto' }}
                >
                  Tạo Story <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
