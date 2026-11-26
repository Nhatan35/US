import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Bug,
  FileCode2,
  Kanban,
  PenTool,
  Scissors,
  SlidersHorizontal,
  Spade,
  Users,
} from 'lucide-react';

const LAB_CATALOG = [
  {
    id: 'story-writer',
    code: 'L1',
    title: 'Story Writer & INVEST Checker',
    module: 'M1, M3',
    desc: 'Viết User Story theo chuẩn Connextra, chấm điểm tức thì theo 14 quy tắc INVEST, chế độ Story Doctor chữa bệnh án và lưu vào Backlog.',
    to: '/labs/story-writer',
    icon: PenTool,
    ready: true,
    phase: 'P2',
  },
  {
    id: 'gherkin',
    code: 'L2',
    title: 'Acceptance Criteria & Gherkin Builder',
    module: 'M3',
    desc: 'Soạn kịch bản Given/When/Then kiểm tra cú pháp tự động, đối chiếu bảng phủ 7 loại kịch bản và xuất tệp .feature / Markdown.',
    to: '/labs/gherkin',
    icon: FileCode2,
    ready: true,
    phase: 'P2',
  },
  {
    id: 'splitting',
    code: 'L3',
    title: 'Story Splitting Trainer (SPIDR)',
    module: 'M3',
    desc: 'Thực hành chia Epic lớn thành các lát cắt dọc theo SPIDR, tự động cảnh báo chia ngang tầng kỹ thuật và so sánh lời giải mẫu.',
    to: '/labs/splitting',
    icon: Scissors,
    ready: true,
    phase: 'P2',
  },
  {
    id: 'persona',
    code: 'L7',
    title: 'Persona, Empathy Map & Journey Map',
    module: 'M2',
    desc: 'Tạo Persona từ dữ liệu phỏng vấn (đồng bộ sang Story Writer), vẽ Empathy Map 6 ô và chuyển cơ hội trên Journey Map thành Story.',
    to: '/labs/persona',
    icon: Users,
    ready: true,
    phase: 'P2',
  },
  {
    id: 'prioritization',
    code: 'L4',
    title: 'Prioritization Simulator (MoSCoW / RICE / WSJF)',
    module: 'M4',
    desc: 'Xếp ưu tiên story theo giới hạn capacity và xem báo cáo mô phỏng hậu quả hài lòng, doanh thu, rủi ro và pháp lý.',
    to: '/labs/prioritization',
    icon: SlidersHorizontal,
    ready: true,
    phase: 'P3',
  },
  {
    id: 'poker',
    code: 'L5',
    title: 'Planning Poker cùng 4 đồng đội ảo',
    module: 'M4',
    desc: 'Ước lượng tương đối cùng Senior Dev, Junior Dev, QA và Designer với câu hỏi làm rõ PO và vòng bỏ phiếu đồng thuận.',
    to: '/labs/planning-poker',
    icon: Spade,
    ready: true,
    phase: 'P3',
  },
  {
    id: 'velocity',
    code: 'L6',
    title: 'Velocity Forecaster & Kịch bản "Nếu..."',
    module: 'M4',
    desc: 'Vẽ biểu đồ Burnup 3 đường (lạc quan/trung bình/bi quan), mô phỏng tăng phạm vi hoặc giảm nhân sự để dự báo dạng khoảng.',
    to: '/labs/velocity',
    icon: BarChart3,
    ready: true,
    phase: 'P3',
  },
  {
    id: 'story-map',
    code: 'L10',
    title: 'Story Mapping Board',
    module: 'M7',
    desc: 'Bản đồ 2 chiều Backbone → Tasks → Stories qua 3 Release, tự động kiểm tra Walking Skeleton cho MVP và xuất Markdown.',
    to: '/labs/story-map',
    icon: Kanban,
    ready: true,
    phase: 'P3',
  },
  {
    id: 'antipattern',
    code: 'L9',
    title: 'Anti-pattern Hunter (Săn lỗi Backlog)',
    module: 'M6',
    desc: 'Kiểm toán backlog thực tế, phát hiện chính xác 6 loại anti-pattern kinh điển và xem bản đồ lỗi chi tiết.',
    to: '/labs/antipattern',
    icon: Bug,
    ready: true,
    phase: 'P4',
  },
];

export function LabsHubPage() {
  return (
    <div className="stack-lg">
      <div className="stack-sm">
        <h1 style={{ fontSize: '1.5rem' }}>Phòng thực hành tương tác (Labs)</h1>
        <p className="secondary">
          Thực hành trực tiếp các kỹ năng viết User Story, Gherkin, chia nhỏ Epic và thấu hiểu người dùng. Mọi dữ liệu Persona và Story được đồng bộ giữa các Lab.
        </p>
      </div>

      <div className="grid-2">
        {LAB_CATALOG.map((lab) => {
          const Icon = lab.icon;
          return (
            <div
              key={lab.id}
              className="card stack-md"
              style={{ opacity: lab.ready ? 1 : 0.72 }}
            >
              <div className="row-between">
                <span className="badge badge-primary">
                  {lab.code} · {lab.module}
                </span>
                {lab.ready ? (
                  <span className="badge badge-success">Sẵn sàng</span>
                ) : (
                  <span className="badge badge-muted">{lab.phase}</span>
                )}
              </div>

              <div className="row" style={{ alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'var(--primary-soft)',
                    color: 'var(--primary)',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={19} />
                </div>
                <div className="stack-sm" style={{ gap: 4 }}>
                  <h2 style={{ fontSize: '1.05rem' }}>{lab.title}</h2>
                  <p className="secondary" style={{ fontSize: '0.86rem' }}>
                    {lab.desc}
                  </p>
                </div>
              </div>

              <div>
                {lab.ready ? (
                  <Link to={lab.to} className="btn btn-primary btn-sm">
                    Mở công cụ <ArrowRight size={14} />
                  </Link>
                ) : (
                  <span className="muted" style={{ fontSize: '0.82rem' }}>
                    Dự kiến mở khóa ở giai đoạn {lab.phase}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
