import { useState } from 'react';
import { Bug, CheckCircle2, RotateCcw, ShieldAlert } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';

type AntiPatternTag =
  | 'clean'
  | 'tech-story'
  | 'vague-ac'
  | 'generic-user'
  | 'epic-disguised'
  | 'gold-plating'
  | 'solution-first';

const TAG_LABELS: Record<AntiPatternTag, string> = {
  clean: '✅ Story đạt chuẩn (không lỗi)',
  'tech-story': '🔧 Story kỹ thuật trá hình (Developer/DB)',
  'vague-ac': '🌫️ AC mơ hồ / chứa "v.v."',
  'generic-user': '👤 "As a user" chung chung & thiếu giá trị',
  'epic-disguised': '🐘 Epic đội lốt Story (quá lớn)',
  'gold-plating': '✨ Gold-plating (tự thêm tính năng thừa)',
  'solution-first': '🎛️ Áp đặt giải pháp UI/kỹ thuật',
};

interface BacklogAuditItem {
  id: string;
  code: string;
  story: string;
  ac: string;
  points: number;
  expected: AntiPatternTag;
  explanation: string;
}

const BACKLOG_ITEMS: BacklogAuditItem[] = [
  {
    id: 'ap-1',
    code: 'MB-101',
    story: 'Là chị Lan (phụ huynh), tôi muốn lọc bác sĩ Nhi có lịch trống sau 18h để không phải nghỉ làm.',
    ac: 'Chỉ hiện bác sĩ Nhi còn slot >= 18:00; nếu hết slot thì báo và gợi ý 3 slot ngày mai.',
    points: 5,
    expected: 'clean',
    explanation: 'Story rõ persona, rõ giá trị, ước lượng 5 điểm vừa phải và AC có cả happy/unhappy path.',
  },
  {
    id: 'ap-2',
    code: 'MB-102',
    story: 'Là Developer, tôi muốn tạo bảng `notifications` và viết worker gửi queue Kafka để lưu log.',
    ac: 'Bảng tạo xong không lỗi migration.',
    points: 3,
    expected: 'tech-story',
    explanation: 'Đây là Technical Task nội bộ đội lốt User Story — nên chuyển thành sub-task dưới story "Nhắc lịch SMS".',
  },
  {
    id: 'ap-3',
    code: 'MB-103',
    story: 'Là lễ tân phòng khám, tôi muốn tìm hồ sơ bệnh nhân nhanh, thân thiện và hỗ trợ lọc theo SĐT, tên, v.v.',
    ac: 'Tìm kiếm chạy mượt mà, hiển thị kết quả đẹp mắt, hỗ trợ nhiều trường lọc v.v.',
    points: 5,
    expected: 'vague-ac',
    explanation: 'Chứa hàng loạt từ mơ hồ ("nhanh, mượt mà, đẹp mắt") và chữ "v.v." gây phạm vi vô hạn, không thể kiểm thử.',
  },
  {
    id: 'ap-4',
    code: 'MB-104',
    story: 'Là người dùng, tôi muốn bấm vào nút tròn màu cam ở góc dưới bên phải để mở popup chọn ngày.',
    ac: 'Nút phải có mã màu #FF6600, bo tròn 50%, kích thước 48x48px.',
    points: 2,
    expected: 'solution-first',
    explanation: 'Áp đặt chi tiết thiết kế UI cứng nhắc trong story (vi phạm Negotiable) và không nêu mục đích người dùng.',
  },
  {
    id: 'ap-5',
    code: 'MB-105',
    story: 'Là bệnh nhân, tôi muốn quản lý toàn bộ hồ sơ bệnh án, thanh toán mọi loại bảo hiểm, chat video với bác sĩ và đặt giao thuốc tận nhà.',
    ac: 'Tất cả tính năng hoạt động ổn định.',
    points: 21,
    expected: 'epic-disguised',
    explanation: 'Một Epic khổng lồ (21 điểm) gộp 4 phân hệ lớn, cần chia thành nhiều lát cắt dọc theo SPIDR.',
  },
  {
    id: 'ap-6',
    code: 'MB-106',
    story: 'Là bệnh nhân, tôi muốn nhận mã QR check-in sau khi đặt lịch thành công kèm hiệu ứng pháo hoa 3D và nhạc chuông vui nhộn.',
    ac: 'Hiển thị QR; phát nhạc chuông và hiệu ứng pháo hoa 5 giây dù phòng khám không yêu cầu.',
    points: 8,
    expected: 'gold-plating',
    explanation: 'Gold-plating: tự thêm hiệu ứng pháo hoa & âm thanh làm tăng điểm từ 3 lên 8 mà không mang lại giá trị cho bệnh nhân.',
  },
  {
    id: 'ap-7',
    code: 'MB-107',
    story: 'Là người dùng, tôi muốn xem trang cá nhân để xem trang cá nhân.',
    ac: 'Mở được trang cá nhân.',
    points: 3,
    expected: 'generic-user',
    explanation: 'Vai trò "người dùng" chung chung và phần "Để..." lặp lại nguyên văn phần "Tôi muốn", không rõ giá trị.',
  },
  {
    id: 'ap-8',
    code: 'MB-108',
    story: 'Là bác Hòa (bệnh nhân cao tuổi), tôi muốn nhận SMS nhắc lịch trước 24h để không quên giờ tái khám.',
    ac: 'Gửi SMS trước 24h; nếu lịch đã hủy trước mốc 24h thì không gửi SMS.',
    points: 5,
    expected: 'clean',
    explanation: 'Story đạt chuẩn INVEST, AC rõ ràng và có trường hợp ngoại lệ.',
  },
];

export function AntiPatternHunterLab() {
  const recordExerciseResult = useProgressStore((s) => s.recordExerciseResult);
  const [picks, setPicks] = useState<Record<string, AntiPatternTag>>({});
  const [submitted, setSubmitted] = useState(false);

  const correctCount = BACKLOG_ITEMS.filter((item) => picks[item.id] === item.expected).length;
  const scorePercent = Math.round((correctCount / BACKLOG_ITEMS.length) * 100);

  const handleSubmit = () => {
    setSubmitted(true);
    if (scorePercent >= 75) {
      recordExerciseResult(
        'antipattern-hunter',
        scorePercent,
        30,
        { backlog: 6, writing: 4 },
        scorePercent === 100 ? 'antipattern-hunter' : undefined,
      );
    }
  };

  return (
    <div className="stack-lg">
      <div className="row-between" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div className="stack-sm">
          <h1 style={{ fontSize: '1.45rem' }}>Anti-pattern Hunter (Săn lỗi Backlog)</h1>
          <p className="secondary" style={{ fontSize: '0.9rem' }}>
            Kiểm toán 8 item trong backlog MediBook trước buổi Sprint Planning: phát hiện chính xác từng Anti-pattern hoặc xác nhận Story đạt chuẩn.
          </p>
        </div>

        {submitted && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setPicks({});
              setSubmitted(false);
            }}
          >
            <RotateCcw size={14} /> Làm lại
          </button>
        )}
      </div>

      {submitted && (
        <div
          className="card row-between"
          style={{
            background: scorePercent >= 75 ? 'var(--success-soft)' : 'var(--warning-soft)',
            borderColor: scorePercent >= 75 ? 'var(--success-border)' : 'var(--warning-border)',
          }}
        >
          <div className="row">
            {scorePercent >= 75 ? (
              <CheckCircle2 size={24} color="var(--success)" />
            ) : (
              <ShieldAlert size={24} color="var(--warning)" />
            )}
            <div>
              <h2 style={{ fontSize: '1.15rem' }}>
                Kết quả săn lỗi: {correctCount}/{BACKLOG_ITEMS.length} ({scorePercent}%)
              </h2>
              <p className="secondary" style={{ fontSize: '0.88rem' }}>
                {scorePercent >= 75
                  ? 'Rất sắc bén! Bạn đã nhận diện tốt các anti-pattern trước khi chúng lọt vào Sprint (+30 XP).'
                  : 'Xem giải thích ở từng thẻ bên dưới để nắm chắc dấu hiệu nhận biết nhé.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="stack-md">
        {BACKLOG_ITEMS.map((item) => {
          const picked = picks[item.id] ?? '';
          const isOk = submitted && picked === item.expected;
          return (
            <div
              key={item.id}
              className="card stack-sm"
              style={{
                borderColor: submitted
                  ? isOk
                    ? 'var(--success-border)'
                    : 'var(--danger-border)'
                  : 'var(--border)',
              }}
            >
              <div className="row-between" style={{ flexWrap: 'wrap', gap: 8 }}>
                <div className="row">
                  <span className="badge badge-primary">{item.code}</span>
                  <span className="badge badge-muted">{item.points} pt</span>
                </div>

                <select
                  disabled={submitted}
                  value={picked}
                  onChange={(e) =>
                    setPicks((prev) => ({
                      ...prev,
                      [item.id]: e.target.value as AntiPatternTag,
                    }))
                  }
                  style={{
                    minWidth: 280,
                    padding: '7px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--surface)',
                    fontSize: '0.84rem',
                  }}
                >
                  <option value="">-- Chẩn đoán trạng thái story --</option>
                  {(Object.keys(TAG_LABELS) as AntiPatternTag[]).map((tag) => (
                    <option key={tag} value={tag}>
                      {TAG_LABELS[tag]}
                    </option>
                  ))}
                </select>
              </div>

              <p style={{ fontWeight: 500, fontSize: '0.94rem' }}>{item.story}</p>
              <p className="muted" style={{ fontSize: '0.84rem' }}>
                <strong>AC:</strong> {item.ac}
              </p>

              {submitted && (
                <div
                  style={{
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: isOk ? 'var(--success-soft)' : 'var(--danger-soft)',
                    fontSize: '0.84rem',
                  }}
                >
                  <strong>
                    {isOk ? '✅ Chính xác!' : `❌ Đáp án đúng: ${TAG_LABELS[item.expected]}`}
                  </strong>{' '}
                  — {item.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className="row-between">
          <span className="muted" style={{ fontSize: '0.86rem' }}>
            Đã chẩn đoán {Object.keys(picks).length}/{BACKLOG_ITEMS.length} item
          </span>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            <Bug size={16} /> Chấm điểm bản đồ lỗi
          </button>
        </div>
      )}
    </div>
  );
}
