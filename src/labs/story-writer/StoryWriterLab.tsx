import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  Plus,
  Save,
  Sparkles,
  Stethoscope,
  Trash2,
  XCircle,
} from 'lucide-react';
import { checkUserStory, type InvestLetter } from '@/lib/checker/investChecker';
import { useProgressStore } from '@/lib/store/progressStore';

interface SickStoryCase {
  id: string;
  label: string;
  role: string;
  want: string;
  benefit: string;
  acceptanceCriteria: string[];
  estimate: number | '?' | '';
  dependsOn: string;
  sampleFix: {
    role: string;
    want: string;
    benefit: string;
    acceptanceCriteria: string[];
  };
}

const SICK_STORIES: SickStoryCase[] = [
  {
    id: 'sick-1',
    label: 'Bệnh án 1: "As a user" + áp đặt UI',
    role: 'người dùng',
    want: 'bấm nút màu xanh gọi API /doctors để tìm kiếm bác sĩ nhanh và đẹp',
    benefit: 'tìm kiếm bác sĩ',
    acceptanceCriteria: ['Hiển thị kết quả nhanh'],
    estimate: 5,
    dependsOn: '',
    sampleFix: {
      role: 'phụ huynh đặt khám cho con',
      want: 'lọc bác sĩ chuyên khoa Nhi còn lịch trống buổi tối',
      benefit: 'chọn được bác sĩ phù hợp mà không phải xin nghỉ làm',
      acceptanceCriteria: [
        'Kết quả chỉ hiển thị bác sĩ chuyên khoa Nhi có ít nhất 1 slot từ 18:00 trở đi.',
        'Nếu không có bác sĩ nào trống tối nay, hệ thống thông báo và gợi ý ngày gần nhất.',
      ],
    },
  },
  {
    id: 'sick-2',
    label: 'Bệnh án 2: Story kỹ thuật của Developer',
    role: 'Developer',
    want: 'tạo bảng appointments trong database SQL và viết endpoint REST',
    benefit: 'lưu dữ liệu lịch hẹn vào server',
    acceptanceCriteria: [],
    estimate: 3,
    dependsOn: '',
    sampleFix: {
      role: 'bệnh nhân đã đăng ký tài khoản',
      want: 'xem danh sách các lịch khám sắp tới của mình',
      benefit: 'chủ động sắp xếp thời gian và không bị lỡ hẹn',
      acceptanceCriteria: [
        'Hiển thị thời gian, tên bác sĩ, chuyên khoa và địa chỉ phòng khám của từng lịch.',
        'Khi bệnh nhân chưa có lịch nào, hiển thị trạng thái trống kèm nút đặt lịch ngay.',
      ],
    },
  },
  {
    id: 'sick-3',
    label: 'Bệnh án 3: Story khổng lồ gộp nhiều việc',
    role: 'khách hàng mua sắm',
    want: 'đăng ký tài khoản và tìm kiếm sản phẩm và thêm vào giỏ hàng và thanh toán bằng thẻ tín dụng hoặc ví điện tử đồng thời nhận hóa đơn PDF',
    benefit: 'mua hàng trực tuyến dễ dàng',
    acceptanceCriteria: ['Thanh toán thành công'],
    estimate: 21,
    dependsOn: 'Tích hợp cổng thanh toán',
    sampleFix: {
      role: 'khách mua hàng lần đầu',
      want: 'thanh toán đơn hàng bằng thẻ nội địa',
      benefit: 'hoàn tất mua hàng ngay mà không cần chuyển khoản thủ công',
      acceptanceCriteria: [
        'Sau khi xác thực OTP hợp lệ, đơn hàng chuyển sang trạng thái "Đã thanh toán" trong 5 giây.',
        'Nếu thẻ không đủ số dư hoặc OTP sai, đơn hàng giữ nguyên và hiển thị lý do lỗi rõ ràng.',
      ],
    },
  },
];

const INVEST_FULL: Record<InvestLetter, string> = {
  I: 'Independent',
  N: 'Negotiable',
  V: 'Valuable',
  E: 'Estimable',
  S: 'Small',
  T: 'Testable',
};

export function StoryWriterLab() {
  const [searchParams] = useSearchParams();
  const personas = useProgressStore((s) => s.personas);
  const capstoneStories = useProgressStore((s) => s.capstoneStories);
  const saveStory = useProgressStore((s) => s.saveStory);
  const deleteStory = useProgressStore((s) => s.deleteStory);
  const recordExerciseResult = useProgressStore((s) => s.recordExerciseResult);

  const [mode, setMode] = useState<'free' | 'doctor'>('free');
  const [activeSickId, setActiveSickId] = useState<string>(SICK_STORIES[0].id);
  const [showSampleFix, setShowSampleFix] = useState(false);

  const [title, setTitle] = useState('Đặt lịch khám nhi buổi tối');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(personas[0]?.id ?? '');
  const [role, setRole] = useState(personas[0]?.roleTitle ?? 'mẹ bỉm sữa đặt khám cho con');
  const [want, setWant] = useState('lọc bác sĩ chuyên khoa Nhi còn lịch trống sau 18:00');
  const [benefit, setBenefit] = useState('đưa con đi khám mà không phải xin nghỉ làm');
  const [acList, setAcList] = useState<string[]>([
    'Chỉ hiển thị bác sĩ chuyên khoa Nhi có ít nhất 1 khung giờ trống từ 18:00–20:30.',
    'Nếu tối nay không còn khung giờ trống, hệ thống báo hết lịch và gợi ý 3 khung giờ gần nhất ngày mai.',
  ]);
  const [estimate, setEstimate] = useState<number | '?' | ''>(5);
  const [dependsOn, setDependsOn] = useState('');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Support pre-filling from Journey Map "Tạo story từ đây"
  useEffect(() => {
    const preWant = searchParams.get('want');
    const preRole = searchParams.get('role');
    const preTitle = searchParams.get('title');
    if (preWant || preRole || preTitle) {
      setMode('free');
      if (preTitle) setTitle(preTitle);
      if (preRole) setRole(preRole);
      if (preWant) setWant(preWant);
      setBenefit('');
      setAcList(['', '']);
    }
  }, [searchParams]);

  const loadSickCase = (id: string) => {
    const c = SICK_STORIES.find((s) => s.id === id);
    if (!c) return;
    setActiveSickId(id);
    setTitle(c.label);
    setRole(c.role);
    setWant(c.want);
    setBenefit(c.benefit);
    setAcList(c.acceptanceCriteria.length > 0 ? [...c.acceptanceCriteria] : ['']);
    setEstimate(c.estimate);
    setDependsOn(c.dependsOn);
    setShowSampleFix(false);
  };

  const checkResult = useMemo(
    () =>
      checkUserStory({
        title,
        role,
        want,
        benefit,
        acceptanceCriteria: acList,
        estimate,
        dependsOn,
      }),
    [title, role, want, benefit, acList, estimate, dependsOn],
  );

  const handleSaveToBacklog = () => {
    const cleanAc = acList.map((a) => a.trim()).filter(Boolean);
    saveStory({
      id: `story-${Date.now()}`,
      title: title.trim() || 'User Story mới',
      personaId: selectedPersonaId || undefined,
      role: role.trim(),
      want: want.trim(),
      benefit: benefit.trim(),
      acceptanceCriteria: cleanAc,
      estimate: estimate === '' ? undefined : estimate,
      status: checkResult.score >= 85 ? 'ready' : 'refining',
      dependsOn: dependsOn.trim() ? [dependsOn.trim()] : undefined,
    });

    if (checkResult.score >= 85) {
      recordExerciseResult(
        mode === 'doctor' ? `story-doctor-${activeSickId}` : 'story-writer-lab',
        checkResult.score,
        20,
        { writing: 4, ac: 3 },
        checkResult.score === 100 ? 'invest-master' : undefined,
      );
    }

    setSavedNotice(
      `Đã lưu vào Backlog (${checkResult.score}/100 điểm${checkResult.score >= 85 ? ' · +20 XP' : ''}).`,
    );
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const activeSick = SICK_STORIES.find((s) => s.id === activeSickId);

  return (
    <div className="stack-lg">
      <div className="row-between" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div className="stack-sm">
          <h1 style={{ fontSize: '1.45rem' }}>Story Writer & INVEST Checker (14 quy tắc)</h1>
          <p className="secondary" style={{ fontSize: '0.9rem' }}>
            Viết User Story theo chuẩn Connextra, nhận chấm điểm tức thì theo 14 quy tắc INVEST và lưu thẳng vào Backlog.
          </p>
        </div>

        <div className="row">
          <button
            type="button"
            className={`btn btn-sm ${mode === 'free' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMode('free')}
          >
            <Sparkles size={14} /> Viết tự do
          </button>
          <button
            type="button"
            className={`btn btn-sm ${mode === 'doctor' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setMode('doctor');
              loadSickCase(activeSickId);
            }}
          >
            <Stethoscope size={14} /> Story Doctor (Chữa bệnh)
          </button>
        </div>
      </div>

      {mode === 'doctor' && (
        <div className="card row" style={{ flexWrap: 'wrap', gap: 10 }}>
          <strong style={{ fontSize: '0.88rem' }}>Chọn bệnh án:</strong>
          {SICK_STORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`btn btn-sm ${activeSickId === c.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => loadSickCase(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      <div className="lesson-grid" style={{ gridTemplateColumns: 'minmax(0, 1.35fr) minmax(300px, 0.9fr)' }}>
        {/* Left: Form */}
        <div className="card stack-md">
          <div className="grid-2">
            <div className="stack-sm">
              <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>Tiêu đề ngắn</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Đặt lịch khám theo khung giờ"
                style={{
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--bg)',
                }}
              />
            </div>

            <div className="stack-sm">
              <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>Chọn nhanh từ Persona</label>
              <select
                value={selectedPersonaId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedPersonaId(id);
                  const found = personas.find((p) => p.id === id);
                  if (found) setRole(found.roleTitle);
                }}
                style={{
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--surface)',
                }}
              >
                <option value="">-- Nhập vai trò thủ công --</option>
                {personas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.roleTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="stack-sm">
            <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>Là một (As a...)</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Ví dụ: phụ huynh có con nhỏ cần khám buổi tối"
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                background: 'var(--bg)',
              }}
            />
          </div>

          <div className="stack-sm">
            <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>Tôi muốn (I want...)</label>
            <textarea
              rows={2}
              value={want}
              onChange={(e) => setWant(e.target.value)}
              placeholder="Nêu 1 mục tiêu duy nhất, tránh áp đặt nút bấm hay API..."
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                background: 'var(--bg)',
                resize: 'vertical',
              }}
            />
          </div>

          <div className="stack-sm">
            <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>Để (So that...)</label>
            <textarea
              rows={2}
              value={benefit}
              onChange={(e) => setBenefit(e.target.value)}
              placeholder="Giá trị hoặc lợi ích thực sự mà người dùng đạt được..."
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                background: 'var(--bg)',
                resize: 'vertical',
              }}
            />
          </div>

          <div className="stack-sm">
            <div className="row-between">
              <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                Acceptance Criteria ({acList.filter((a) => a.trim()).length})
              </label>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setAcList((prev) => [...prev, ''])}
              >
                <Plus size={14} /> Thêm tiêu chí
              </button>
            </div>
            {acList.map((ac, idx) => (
              <div key={idx} className="row">
                <input
                  type="text"
                  value={ac}
                  onChange={(e) =>
                    setAcList((prev) => prev.map((v, i) => (i === idx ? e.target.value : v)))
                  }
                  placeholder={`Tiêu chí ${idx + 1} (gồm cả trường hợp thành công và trường hợp lỗi)...`}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg)',
                    fontSize: '0.88rem',
                  }}
                />
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Xóa tiêu chí"
                  onClick={() => setAcList((prev) => prev.filter((_, i) => i !== idx))}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="grid-2">
            <div className="stack-sm">
              <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>Ước lượng (Story Point)</label>
              <select
                value={String(estimate)}
                onChange={(e) => {
                  const v = e.target.value;
                  setEstimate(v === '' ? '' : v === '?' ? '?' : Number(v));
                }}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--surface)',
                }}
              >
                <option value="">Chưa ước lượng</option>
                {[1, 2, 3, 5, 8, 13, 21].map((n) => (
                  <option key={n} value={n}>
                    {n} điểm
                  </option>
                ))}
                <option value="?">? (Chưa rõ)</option>
              </select>
            </div>

            <div className="stack-sm">
              <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>Phụ thuộc (nếu có)</label>
              <input
                type="text"
                value={dependsOn}
                onChange={(e) => setDependsOn(e.target.value)}
                placeholder="Để trống nếu độc lập"
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--bg)',
                }}
              />
            </div>
          </div>

          <div className="row" style={{ flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveToBacklog}>
              <Save size={15} /> Lưu vào Backlog
            </button>
            {mode === 'doctor' && activeSick && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowSampleFix((v) => !v)}
              >
                {showSampleFix ? 'Ẩn lời giải mẫu' : 'Xem lời giải mẫu'}
              </button>
            )}
            {savedNotice && (
              <span className="badge badge-success">{savedNotice}</span>
            )}
          </div>

          {mode === 'doctor' && showSampleFix && activeSick && (
            <div
              className="example-box good stack-sm"
              style={{ marginTop: 4, fontSize: '0.88rem' }}
            >
              <strong>✅ Phiên bản đã chữa mẫu:</strong>
              <p>
                Là <strong>{activeSick.sampleFix.role}</strong>, tôi muốn{' '}
                <strong>{activeSick.sampleFix.want}</strong> để{' '}
                <strong>{activeSick.sampleFix.benefit}</strong>.
              </p>
              <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                {activeSick.sampleFix.acceptanceCriteria.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Live INVEST Checker */}
        <aside className="card stack-md" style={{ position: 'sticky', top: 80 }}>
          <div className="row-between">
            <h2 style={{ fontSize: '1.05rem' }}>Điểm INVEST</h2>
            <span
              className={`badge ${
                checkResult.score >= 85
                  ? 'badge-success'
                  : checkResult.score >= 60
                    ? 'badge-warning'
                    : 'badge-danger'
              }`}
              style={{ fontSize: '0.92rem', padding: '4px 11px' }}
            >
              {checkResult.score}/100
            </span>
          </div>

          <div className="grid-3" style={{ gap: 8 }}>
            {(Object.keys(INVEST_FULL) as InvestLetter[]).map((letter) => {
              const st = checkResult.letters[letter];
              const cls =
                st === 'pass'
                  ? 'badge-success'
                  : st === 'warn'
                    ? 'badge-warning'
                    : 'badge-danger';
              return (
                <div
                  key={letter}
                  className={`badge ${cls}`}
                  style={{
                    justifyContent: 'center',
                    padding: '7px 6px',
                    borderRadius: 'var(--radius-sm)',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <strong style={{ fontSize: '0.95rem' }}>{letter}</strong>
                  <span style={{ fontSize: '0.68rem', opacity: 0.9 }}>
                    {INVEST_FULL[letter]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="stack-sm">
            <strong style={{ fontSize: '0.88rem' }}>
              Nhận xét ({checkResult.findings.length})
            </strong>
            {checkResult.findings.length === 0 ? (
              <div
                style={{
                  padding: 12,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--success-soft)',
                  color: 'var(--success)',
                  fontSize: '0.86rem',
                }}
                className="row"
              >
                <CheckCircle2 size={18} />
                <span>Xuất sắc! Story đạt đủ 14 quy tắc hình thức INVEST.</span>
              </div>
            ) : (
              checkResult.findings.map((f, idx) => (
                <div
                  key={`${f.ruleId}-${idx}`}
                  style={{
                    padding: 10,
                    borderRadius: 'var(--radius-sm)',
                    background:
                      f.severity === 'fail' ? 'var(--danger-soft)' : 'var(--warning-soft)',
                    border: `1px solid ${
                      f.severity === 'fail'
                        ? 'var(--danger-border)'
                        : 'var(--warning-border)'
                    }`,
                    fontSize: '0.83rem',
                  }}
                  className="stack-sm"
                >
                  <div className="row" style={{ alignItems: 'flex-start' }}>
                    {f.severity === 'fail' ? (
                      <XCircle size={15} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
                    ) : (
                      <AlertTriangle size={15} color="var(--warning)" style={{ flexShrink: 0, marginTop: 2 }} />
                    )}
                    <div>
                      <strong>{f.ruleId}:</strong> {f.message}
                    </div>
                  </div>
                  <div className="secondary">💡 {f.suggestion}</div>
                  <Link to={f.lessonLink} style={{ fontSize: '0.78rem' }}>
                    Xem lại bài học →
                  </Link>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      {/* Saved Backlog preview */}
      {capstoneStories.length > 0 && (
        <div className="card stack-md">
          <h2 style={{ fontSize: '1.08rem' }}>
            Backlog đã lưu ({capstoneStories.length} story)
          </h2>
          <div className="stack-sm">
            {capstoneStories.map((st) => (
              <div
                key={st.id}
                className="row-between"
                style={{
                  padding: 12,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  gap: 12,
                }}
              >
                <div className="stack-sm" style={{ gap: 3 }}>
                  <div className="row">
                    <strong>{st.title}</strong>
                    <span className={`badge ${st.status === 'ready' ? 'badge-success' : 'badge-warning'}`}>
                      {st.status}
                    </span>
                    {st.estimate && <span className="badge badge-muted">{st.estimate} pt</span>}
                  </div>
                  <p className="secondary" style={{ fontSize: '0.86rem' }}>
                    Là <em>{st.role}</em>, tôi muốn <em>{st.want}</em> để <em>{st.benefit}</em>.
                  </p>
                  <span className="muted" style={{ fontSize: '0.78rem' }}>
                    {st.acceptanceCriteria.length} Acceptance Criteria
                  </span>
                </div>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Xóa story"
                  onClick={() => deleteStory(st.id)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
