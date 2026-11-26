import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Layers, Plus, Scissors, Trash2 } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';

interface SplitPattern {
  code: string;
  name: string;
  desc: string;
  example: string;
}

const SPIDR_PATTERNS: SplitPattern[] = [
  {
    code: 'S — Spike',
    name: 'Tách phần điều tra kỹ thuật',
    desc: 'Khi có rủi ro kỹ thuật chưa rõ, tách 1 Spike time-box (1–2 ngày) trước khi ước lượng story chính.',
    example: 'Spike: Thử nghiệm API đồng bộ lịch bác sĩ từ hệ thống HIS cũ.',
  },
  {
    code: 'P — Paths',
    name: 'Chia theo nhánh luồng (Workflow)',
    desc: 'Tách từng bước hoặc từng phương án xử lý thành story riêng.',
    example: 'Thanh toán thẻ nội địa → Thanh toán ví MoMo → Thanh toán trả góp.',
  },
  {
    code: 'I — Interfaces',
    name: 'Chia theo giao diện / kênh',
    desc: 'Làm phiên bản đơn giản (web/CSV/basic UI) trước, nâng cấp trải nghiệm phức tạp sau.',
    example: 'Đặt lịch trên Web trước, mở rộng sang app mobile sau.',
  },
  {
    code: 'D — Data',
    name: 'Chia theo tập dữ liệu',
    desc: 'Hỗ trợ 1 loại dữ liệu phổ biến trước rồi mở rộng các loại còn lại.',
    example: 'Hỗ trợ khám tự nguyện trước, thêm khám Bảo hiểm Y tế sau.',
  },
  {
    code: 'R — Rules',
    name: 'Chia theo quy tắc nghiệp vụ',
    desc: 'Làm quy tắc cốt lõi trước, bổ sung quy tắc khuyến mãi/giới hạn phức tạp ở story sau.',
    example: 'Cho phép hủy lịch cơ bản → Áp dụng quy tắc tính phí hủy dưới 2 giờ.',
  },
];

interface EpicChallenge {
  id: string;
  level: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  title: string;
  context: string;
  recommendedPatterns: string[];
  sampleSplits: string[];
}

const EPICS: EpicChallenge[] = [
  {
    id: 'epic-payment',
    level: 'Cơ bản',
    title: 'Epic: Thanh toán trực tuyến cho đơn hàng',
    context:
      'Khách hàng mua đồ gia dụng cần thanh toán bằng thẻ nội địa, thẻ quốc tế, ví MoMo, áp mã giảm giá và nhận hóa đơn VAT.',
    recommendedPatterns: ['P — Paths', 'R — Rules'],
    sampleSplits: [
      'Là khách mua hàng, tôi muốn thanh toán bằng thẻ nội địa ATM để hoàn tất đơn ngay.',
      'Là khách mua hàng, tôi muốn thanh toán bằng ví MoMo để không phải nhập số thẻ.',
      'Là khách mua hàng, tôi muốn áp mã giảm giá trước khi thanh toán để hưởng ưu đãi.',
      'Là khách hàng doanh nghiệp, tôi muốn yêu cầu xuất hóa đơn VAT để kê khai thuế.',
    ],
  },
  {
    id: 'epic-search',
    level: 'Trung bình',
    title: 'Epic: Tìm kiếm & lọc bác sĩ trên MediBook',
    context:
      'Bệnh nhân muốn tìm bác sĩ theo tên, chuyên khoa, chi nhánh, khung giờ trống, mức giá khám, đánh giá sao và khoảng cách GPS.',
    recommendedPatterns: ['D — Data', 'I — Interfaces'],
    sampleSplits: [
      'Là bệnh nhân, tôi muốn lọc bác sĩ theo chuyên khoa và chi nhánh để tìm nơi khám phù hợp.',
      'Là phụ huynh, tôi muốn lọc bác sĩ còn lịch trống trong ngày để đặt khám gấp.',
      'Là bệnh nhân mới, tôi muốn sắp xếp bác sĩ theo điểm đánh giá để chọn người uy tín.',
    ],
  },
  {
    id: 'epic-report',
    level: 'Nâng cao',
    title: 'Epic: Hệ thống báo cáo doanh thu chuỗi phòng khám',
    context:
      'Ban giám đốc muốn dashboard biểu đồ thời gian thực theo 6 chi nhánh, so sánh cùng kỳ, phân quyền theo giám đốc vùng và xuất Excel/PDF.',
    recommendedPatterns: ['I — Interfaces', 'R — Rules', 'D — Data'],
    sampleSplits: [
      'Là giám đốc chuỗi, tôi muốn xem bảng tổng hợp doanh thu theo ngày của từng chi nhánh.',
      'Là kế toán trưởng, tôi muốn xuất báo cáo doanh thu tháng ra file CSV để đối soát.',
      'Là quản lý chi nhánh, tôi chỉ được xem số liệu của cơ sở mình phụ trách để đảm bảo bảo mật.',
      'Là giám đốc chuỗi, tôi muốn xem biểu đồ so sánh doanh thu tháng này với cùng kỳ năm trước.',
    ],
  },
];

const HORIZONTAL_KEYWORDS = [
  'làm giao diện',
  'làm ui',
  'frontend',
  'làm api',
  'backend',
  'tạo database',
  'tạo bảng',
  'thiết kế db',
  'viết unit test',
];

export function SplittingTrainerLab() {
  const recordExerciseResult = useProgressStore((s) => s.recordExerciseResult);
  const [selectedEpicId, setSelectedEpicId] = useState(EPICS[0].id);
  const [chosenPatterns, setChosenPatterns] = useState<string[]>(['P — Paths']);
  const [childStories, setChildStories] = useState<string[]>(['', '', '']);
  const [showSolution, setShowSolution] = useState(false);
  const [submittedMsg, setSubmittedMsg] = useState<string | null>(null);

  const epic = EPICS.find((e) => e.id === selectedEpicId) ?? EPICS[0];

  const horizontalWarnings = childStories
    .map((s, idx) => {
      const lower = s.toLowerCase();
      const hit = HORIZONTAL_KEYWORDS.find((k) => lower.includes(k));
      return hit ? { idx, hit } : null;
    })
    .filter((x): x is { idx: number; hit: string } => Boolean(x));

  const validStoriesCount = childStories.filter((s) => s.trim().length >= 15).length;

  const handleComplete = () => {
    const score =
      horizontalWarnings.length === 0 && validStoriesCount >= 3 ? 100 : 75;
    recordExerciseResult(
      `split-${epic.id}`,
      score,
      25,
      { splitting: 6 },
      score === 100 ? 'vertical-splitter' : undefined,
    );
    setShowSolution(true);
    setSubmittedMsg(
      horizontalWarnings.length === 0
        ? 'Tuyệt vời! Các story con đều theo lát cắt dọc (+25 XP).'
        : 'Đã ghi nhận bài tập — chú ý tránh tách ngang theo tầng UI/API/DB nhé.',
    );
  };

  return (
    <div className="stack-lg">
      <div className="stack-sm">
        <h1 style={{ fontSize: '1.45rem' }}>Story Splitting Trainer (SPIDR)</h1>
        <p className="secondary" style={{ fontSize: '0.9rem' }}>
          Luyện chia Epic lớn thành các User Story nhỏ theo <strong>lát cắt dọc (Vertical Slice)</strong> thay vì cắt ngang theo tầng kỹ thuật.
        </p>
      </div>

      {/* SPIDR Reference */}
      <div className="card stack-sm">
        <strong style={{ fontSize: '0.92rem' }}>5 mẫu chia SPIDR (bấm để chọn áp dụng):</strong>
        <div className="grid-3" style={{ gap: 10 }}>
          {SPIDR_PATTERNS.map((p) => {
            const active = chosenPatterns.includes(p.code);
            return (
              <button
                key={p.code}
                type="button"
                onClick={() =>
                  setChosenPatterns((prev) =>
                    prev.includes(p.code)
                      ? prev.filter((x) => x !== p.code)
                      : [...prev, p.code],
                  )
                }
                style={{
                  textAlign: 'left',
                  padding: 12,
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                  background: active ? 'var(--primary-soft)' : 'var(--surface)',
                  cursor: 'pointer',
                }}
                className="stack-sm"
              >
                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--primary)' }}>
                  {p.code}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{p.name}</div>
                <div className="muted" style={{ fontSize: '0.76rem' }}>{p.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Epic Selector */}
      <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
        {EPICS.map((ep) => (
          <button
            key={ep.id}
            type="button"
            className={`btn btn-sm ${ep.id === epic.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setSelectedEpicId(ep.id);
              setChildStories(['', '', '']);
              setShowSolution(false);
              setSubmittedMsg(null);
            }}
          >
            <Layers size={14} /> {ep.title.replace('Epic: ', '')} ({ep.level})
          </button>
        ))}
      </div>

      {/* Active Epic Workspace */}
      <div className="card stack-md">
        <div className="row-between" style={{ flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.12rem' }}>{epic.title}</h2>
          <span className="badge badge-primary">{epic.level}</span>
        </div>
        <p className="secondary" style={{ fontSize: '0.92rem' }}>{epic.context}</p>

        <div className="stack-sm">
          <div className="row-between">
            <strong style={{ fontSize: '0.9rem' }}>
              Các User Story con bạn tách ra (nên ≥ 3 lát cắt dọc):
            </strong>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setChildStories((prev) => [...prev, ''])}
            >
              <Plus size={14} /> Thêm story con
            </button>
          </div>

          {childStories.map((st, idx) => (
            <div key={idx} className="row">
              <span className="badge badge-muted">{idx + 1}</span>
              <input
                type="text"
                value={st}
                onChange={(e) =>
                  setChildStories((prev) =>
                    prev.map((v, i) => (i === idx ? e.target.value : v)),
                  )
                }
                placeholder="Là [ai], tôi muốn [làm gì] để [đạt giá trị gì]..."
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--bg)',
                  fontSize: '0.88rem',
                }}
              />
              <button
                type="button"
                className="icon-btn"
                aria-label="Xóa dòng"
                onClick={() =>
                  setChildStories((prev) => prev.filter((_, i) => i !== idx))
                }
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {horizontalWarnings.length > 0 && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--warning-soft)',
              border: '1px solid var(--warning-border)',
              fontSize: '0.86rem',
            }}
            className="stack-sm"
          >
            <div className="row">
              <AlertTriangle size={16} color="var(--warning)" />
              <strong>Cảnh báo chia ngang (Horizontal Slice)!</strong>
            </div>
            {horizontalWarnings.map((w) => (
              <div key={w.idx}>
                Story #{w.idx + 1} chứa từ khóa tầng kỹ thuật (<code>{w.hit}</code>). Hãy chia theo hành trình/quy tắc để mỗi story đều demo được cho người dùng.
              </div>
            ))}
          </div>
        )}

        <div className="row" style={{ flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={validStoriesCount < 2}
            onClick={handleComplete}
          >
            <Scissors size={15} /> Nộp & So sánh lời giải mẫu
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowSolution((v) => !v)}
          >
            {showSolution ? 'Ẩn lời giải mẫu' : 'Xem gợi ý mẫu'}
          </button>
          {submittedMsg && <span className="badge badge-success">{submittedMsg}</span>}
        </div>

        {showSolution && (
          <div className="example-box good stack-sm" style={{ fontSize: '0.88rem' }}>
            <div className="row">
              <CheckCircle2 size={16} color="var(--success)" />
              <strong>
                Lời giải mẫu (Pattern gợi ý: {epic.recommendedPatterns.join(', ')})
              </strong>
            </div>
            <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
              {epic.sampleSplits.map((s) => (
                <li key={s} style={{ marginBottom: 4 }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
