import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Compass } from 'lucide-react';
import { ROLE_LABELS, type QuizQuestion, type SkillKey, type UserRole } from '@/types/course';
import { QuizQuestionCard } from '@/components/QuizQuestionCard';
import { SkillRadarChart } from '@/components/SkillRadarChart';
import { isQuestionCorrect, type QuestionAnswer } from '@/lib/quiz/scoring';
import { useProgressStore } from '@/lib/store/progressStore';

const PRETEST_QUESTIONS: QuizQuestion[] = [
  {
    id: 'pre-empathy',
    type: 'single',
    skill: 'empathy',
    prompt: 'Khi viết User Story, vì sao nên tránh bắt đầu bằng "Là người dùng (As a user)..."?',
    options: [
      'Vì từ "người dùng" quá dài',
      'Vì mỗi nhóm người dùng có mục tiêu và nỗi đau khác nhau; viết chung chung làm mất ngữ cảnh ưu tiên',
      'Vì Jira không hỗ trợ cụm từ này',
      'Không có vấn đề gì, viết "As a user" luôn tốt nhất',
    ],
    answer: 1,
    explain: 'Persona cụ thể giúp team hiểu đúng bối cảnh sử dụng và đưa ra quyết định thiết kế chính xác.',
  },
  {
    id: 'pre-writing',
    type: 'single',
    skill: 'writing',
    prompt: 'Câu nào sau đây là User Story tốt nhất theo tiêu chí INVEST?',
    options: [
      'Là Developer, tôi muốn tạo bảng orders trong PostgreSQL để lưu đơn hàng.',
      'Hệ thống phải có nút Export màu xanh ở góc trên.',
      'Là kế toán trưởng, tôi muốn xuất báo cáo doanh thu tháng để gửi ban giám đốc trước cuộc họp.',
      'Là khách hàng, tôi muốn mua hàng nhanh và đẹp.',
    ],
    answer: 2,
    explain: 'Phương án C nêu rõ đối tượng cụ thể, nhu cầu không áp đặt UI và giá trị kinh doanh rõ ràng.',
  },
  {
    id: 'pre-ac',
    type: 'single',
    skill: 'ac',
    prompt: 'Acceptance Criteria nào sau đây đạt tiêu chí kiểm thử được (Testable)?',
    options: [
      'Trang tìm kiếm phải tải thật nhanh và thân thiện.',
      'Khi bệnh nhân chọn khung giờ đã có người đặt, hệ thống báo "Khung giờ đã hết" và gợi ý 3 slot gần nhất.',
      'Hệ thống hoạt động mượt mà trên mọi thiết bị.',
      'Mật khẩu phải đủ an toàn.',
    ],
    answer: 1,
    explain: 'AC tốt mô tả điều kiện cụ thể và hành vi quan sát/kiểm chứng được thay vì dùng tính từ mơ hồ.',
  },
  {
    id: 'pre-splitting',
    type: 'single',
    skill: 'splitting',
    prompt: 'Cách chia nhỏ Epic "Thanh toán online" nào sau đây là LÁT CẮT DỌC (Vertical Slice)?',
    options: [
      'Story 1: Làm UI thanh toán · Story 2: Làm API thanh toán · Story 3: Thiết kế DB',
      'Story 1: Thanh toán thẻ ATM nội địa · Story 2: Thanh toán ví MoMo · Story 3: Áp mã giảm giá',
      'Story 1: Code backend · Story 2: Viết unit test · Story 3: QA kiểm thử',
      'Không nên chia nhỏ, để cả Epic làm trong 3 sprint',
    ],
    answer: 1,
    explain: 'Lát cắt dọc đi xuyên qua UI–Logic–DB để mỗi story con đều mang giá trị và demo được độc lập.',
  },
  {
    id: 'pre-prioritizing',
    type: 'single',
    skill: 'prioritizing',
    prompt: 'Trong framework MoSCoW, nguyên tắc thực hành tốt cho nhóm "Must have" là gì?',
    options: [
      'Mọi yêu cầu của sếp đều phải là Must have (100%)',
      'Nhóm Must have nên chiếm tối đa khoảng 60% tổng năng lực (capacity) để còn vùng đệm rủi ro',
      'Must have chỉ dành cho các tính năng làm đẹp giao diện',
      'Không cần phân nhóm Won\'t have',
    ],
    answer: 1,
    explain: 'Nếu 100% là Must have thì khi phát sinh rủi ro team không còn phạm vi linh hoạt để bảo vệ ngày ra mắt.',
  },
  {
    id: 'pre-estimating',
    type: 'single',
    skill: 'estimating',
    prompt: 'Story Point đo lường điều gì?',
    options: [
      'Số giờ làm việc chính xác của 1 lập trình viên',
      'Độ lớn tương đối kết hợp độ phức tạp, khối lượng công việc và mức độ rủi ro/không chắc chắn',
      'Số dòng code cần viết',
      'Mức độ quan trọng về mặt doanh thu',
    ],
    answer: 1,
    explain: 'Story Point là ước lượng tương đối về độ phức tạp + khối lượng + rủi ro, không phải quy đổi cứng sang số giờ.',
  },
  {
    id: 'pre-stakeholder',
    type: 'single',
    skill: 'stakeholder',
    prompt: 'Stakeholder yêu cầu: "Thêm cho anh nút xuất Excel gấp!". Phản ứng đầu tiên tốt nhất của bạn là gì?',
    options: [
      'Ghi ngay story "Thêm nút xuất Excel" vào đầu sprint',
      'Từ chối thẳng vì không có trong kế hoạch',
      'Hỏi sâu mục đích: "Anh định dùng dữ liệu Excel đó để làm việc gì ạ?" để tìm nhu cầu gốc',
      'Hứa sẽ làm ngay cuối tuần này',
    ],
    answer: 2,
    explain: 'Stakeholder thường đưa giải pháp; dùng 5 Whys để tìm nhu cầu gốc giúp tạo ra giải pháp đúng giá trị hơn.',
  },
  {
    id: 'pre-backlog',
    type: 'single',
    skill: 'backlog',
    prompt: 'Trong một Product Backlog khỏe mạnh (DEEP), các story nằm ở ĐẦU backlog nên có đặc điểm gì?',
    options: [
      'Càng mơ hồ càng tốt để dev tự sáng tạo',
      'Chi tiết phù hợp, đã có AC rõ ràng, đủ nhỏ và đã ước lượng (Ready)',
      'Tất cả 300 story trong backlog đều phải viết chi tiết như nhau ngay từ ngày đầu',
      'Chỉ chứa các bug kỹ thuật',
    ],
    answer: 1,
    explain: 'Mô hình tảng băng (DEEP): story sắp làm ở đỉnh phải chi tiết và Ready; story ở xa hơn giữ ở mức thô.',
  },
];

export function OnboardingPage() {
  const currentRole = useProgressStore((s) => s.role);
  const onboardingDone = useProgressStore((s) => s.onboardingDone);
  const completeOnboarding = useProgressStore((s) => s.completeOnboarding);
  const skills = useProgressStore((s) => s.skills);

  const [role, setRole] = useState<UserRole>(currentRole);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleFinish = () => {
    const computed: Record<SkillKey, number> = {
      empathy: 20,
      writing: 20,
      ac: 20,
      splitting: 20,
      prioritizing: 20,
      estimating: 20,
      stakeholder: 20,
      backlog: 20,
    };

    for (const q of PRETEST_QUESTIONS) {
      if (isQuestionCorrect(q, answers[q.id])) {
        computed[q.skill] = 55;
      }
    }

    completeOnboarding(role, computed);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="stack-lg">
      <div className="card stack-sm" style={{ borderTop: '4px solid var(--primary)' }}>
        <div className="row">
          <span className="badge badge-primary">
            <Compass size={14} /> Module 0 · Khởi động
          </span>
          {onboardingDone && (
            <span className="badge badge-success">
              <CheckCircle2 size={13} /> Đã hoàn thành khởi động
            </span>
          )}
        </div>
        <h1 style={{ fontSize: '1.5rem' }}>Đánh giá đầu vào & Thiết lập lộ trình</h1>
        <p className="secondary" style={{ fontSize: '0.92rem' }}>
          Chọn vai trò hiện tại của bạn và trả lời 8 câu nhanh (1 câu cho mỗi kỹ năng cốt lõi) để vẽ biểu đồ Radar xuất phát điểm. Không tính điểm đậu/rớt!
        </p>
      </div>

      {submitted && (
        <div
          className="card stack-md"
          style={{
            background: 'var(--success-soft)',
            borderColor: 'var(--success-border)',
          }}
        >
          <div className="row-between" style={{ flexWrap: 'wrap', gap: 16 }}>
            <div className="stack-sm">
              <h2 style={{ fontSize: '1.2rem' }}>
                Đã thiết lập hồ sơ học tập (+25 XP)!
              </h2>
              <p className="secondary" style={{ fontSize: '0.9rem' }}>
                Biểu đồ Radar bên phải thể hiện điểm xuất phát của bạn. Hãy bắt đầu từ Module 1 hoặc thực hành ngay trong Story Writer.
              </p>
              <div className="row" style={{ marginTop: 6 }}>
                <Link to="/modules/m1" className="btn btn-primary btn-sm">
                  Bắt đầu Module 1 <ArrowRight size={15} />
                </Link>
                <Link to="/labs/story-writer" className="btn btn-secondary btn-sm">
                  Thử Story Writer
                </Link>
              </div>
            </div>
            <div style={{ width: 320, maxWidth: '100%' }}>
              <SkillRadarChart skills={skills} height={220} />
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Role */}
      <div className="card stack-md">
        <h2 style={{ fontSize: '1.1rem' }}>1. Vai trò hiện tại của bạn</h2>
        <div className="grid-3" style={{ gap: 10 }}>
          {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
            <button
              key={r}
              type="button"
              className={`quiz-option ${role === r ? 'selected' : ''}`}
              onClick={() => setRole(r)}
            >
              <span>{ROLE_LABELS[r]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: 8-skill pre-test */}
      <div className="stack-md">
        <h2 style={{ fontSize: '1.1rem' }}>2. Bài test chẩn đoán 8 kỹ năng (8 câu)</h2>
        {PRETEST_QUESTIONS.map((q, idx) => (
          <QuizQuestionCard
            key={q.id}
            question={q}
            index={idx}
            value={answers[q.id]}
            onChange={(val) => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
            revealed={submitted}
          />
        ))}
      </div>

      {!submitted && (
        <div className="row-between">
          <span className="muted" style={{ fontSize: '0.86rem' }}>
            Đã trả lời {Object.keys(answers).length}/{PRETEST_QUESTIONS.length} câu
          </span>
          <button type="button" className="btn btn-primary" onClick={handleFinish}>
            Hoàn tất & Vẽ biểu đồ Radar
          </button>
        </div>
      )}
    </div>
  );
}
