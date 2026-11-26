export interface CaseRubricItem {
  id: string;
  criterion: string;
  maxPoints: number;
}

export interface CaseStudy {
  id: string;
  code: string;
  moduleId: string;
  title: string;
  company: string;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  context: string;
  dossier: { label: string; content: string }[];
  tasks: string[];
  recommendedLab?: { label: string; to: string };
  expertSolution: string[];
  rubric: CaseRubricItem[];
  reflectionPrompt: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs1',
    code: 'CS1',
    moduleId: 'm1',
    title: '80 trang tài liệu SRS chuyển sang Agile Backlog',
    company: 'Công ty phần mềm gia công FinSoft',
    difficulty: 'Cơ bản',
    context:
      'Khách hàng vừa gửi một file SRS dài 80 trang với 240 câu "Hệ thống phải..." và yêu cầu team Scrum bắt đầu Sprint 1 vào thứ Hai tuần sau.',
    dossier: [
      {
        label: 'Trích đoạn SRS (mục 3.2)',
        content:
          'REQ-101: Hệ thống phải cho phép xuất báo cáo giao dịch định dạng PDF khổ A4. REQ-102: Hệ thống phải mã hóa mật khẩu bằng thuật toán bcrypt. REQ-103: Hệ thống phải có nút màu xanh "Duyệt" ở góc phải màn hình.',
      },
      {
        label: 'Email từ PM khách hàng',
        content:
          '"Bên anh đã viết rất kỹ trong SRS rồi, team em cứ chia đều ra các sprint để code y nguyên là được."',
      },
    ],
    tasks: [
      'Chuyển REQ-101 và REQ-103 thành User Story tập trung giá trị người dùng (bỏ chi tiết nút màu xanh/khổ A4 ra khỏi phần Card).',
      'Xác định REQ-102 nên đặt ở đâu (User Story riêng, NFR/Constraint hay Definition of Done?).',
      'Viết 3 câu hỏi bạn cần trao đổi lại với khách hàng trong buổi Conversation đầu tiên.',
    ],
    recommendedLab: { label: 'Mở Story Writer', to: '/labs/story-writer' },
    expertSolution: [
      'REQ-101 → "Là kiểm soát viên giao dịch, tôi muốn xuất báo cáo giao dịch trong kỳ ra tệp dễ in ấn để nộp lưu trữ cuối tháng."',
      'REQ-102 (mã hóa bcrypt) → KHÔNG ép thành User Story; đưa vào ràng buộc bảo mật chung (NFR / Definition of Done).',
      'REQ-103 → Tìm nhu cầu thật: "Là trưởng nhóm vận hành, tôi muốn phê duyệt nhanh các giao dịch hợp lệ để không làm chậm tiến độ thanh toán của khách."',
      'Thay vì chuyển đổi cả 80 trang một lần, chỉ tinh chỉnh trước phần ưu tiên cao cho 2 sprint đầu tiên (theo DEEP).',
    ],
    rubric: [
      { id: 'r1', criterion: 'Viết lại được đúng góc nhìn người dùng (không bắt đầu bằng "Hệ thống phải")', maxPoints: 3 },
      { id: 'r2', criterion: 'Phân biệt đúng yêu cầu phi chức năng (bcrypt) với User Story', maxPoints: 3 },
      { id: 'r3', criterion: 'Đặt câu hỏi làm rõ giá trị & phạm vi thay vì nhận code mù quáng', maxPoints: 3 },
    ],
    reflectionPrompt: 'Ở công ty bạn hiện tại, tài liệu yêu cầu có đang bị viết theo kiểu SRS đội lốt User Story không?',
  },
  {
    id: 'cs4',
    code: 'CS4',
    moduleId: 'm4',
    title: '"Cái gì cũng Must have" trước deadline 6 tuần',
    company: 'Chuỗi phòng khám An Khang (MediBook)',
    difficulty: 'Trung bình',
    context:
      'Còn đúng 6 tuần (3 sprint × 2 tuần) trước ngày khai trương chi nhánh mới. Ban giám đốc gửi danh sách 25 tính năng (tổng 140 Story Point) và ghi chú: "Tất cả đều là MUST HAVE".',
    dossier: [
      {
        label: 'Số liệu Velocity 6 sprint gần nhất',
        content: '26, 31, 28, 33, 30, 29 điểm/sprint → Trung bình ~29.5 điểm/sprint (3 sprint làm được tối đa ~85–95 điểm).',
      },
      {
        label: 'Ràng buộc pháp lý',
        content: 'Bắt buộc phải có màn hình đồng ý xử lý dữ liệu cá nhân (Nghị định 13) trước khi ra mắt công khai.',
      },
    ],
    tasks: [
      'Dùng Velocity Forecaster để chứng minh khoảng năng lực thực tế của team trong 3 sprint tới.',
      'Phân nhóm lại 140 điểm sao cho nhóm Must ≤ 60% năng lực (~55 điểm), giữ lại luồng cốt lõi + tuân thủ pháp lý.',
      'Soạn một email ngắn (~150 chữ) gửi Giám đốc trình bày dữ liệu và đề xuất 2 phương án Trade-off.',
    ],
    recommendedLab: { label: 'Mở Velocity Forecaster', to: '/labs/velocity' },
    expertSolution: [
      'Dữ liệu rõ ràng: 3 sprint chỉ thực hiện được 78–99 điểm (trung bình ~89 điểm), thiếu ~50 điểm so với 140 điểm yêu cầu.',
      'Phương án A (Giữ ngày khai trương 6 tuần): Ra mắt MVP ~80 điểm gồm Tìm bác sĩ, Đặt lịch, Đồng ý Nghị định 13, Check-in QR, SMS nhắc lịch. Chuyển Thanh toán ví & Mini-game sang Release 2 sau 1 tháng.',
      'Phương án B (Giữ đủ 140 điểm): Dời ngày ra mắt thêm 2 sprint (~4 tuần).',
      'Giọng văn hợp tác: thừa nhận tầm quan trọng của ngày khai trương, không nói "không làm được" suông mà để Giám đốc chọn phương án dựa trên dữ liệu.',
    ],
    rubric: [
      { id: 'r1', criterion: 'Dùng đúng dữ liệu Velocity dạng khoảng thay vì đoán cảm tính', maxPoints: 3 },
      { id: 'r2', criterion: 'Đề xuất ít nhất 2 phương án Trade-off rõ ràng (Phạm vi vs Thời gian)', maxPoints: 3 },
      { id: 'r3', criterion: 'Giọng văn tôn trọng, hợp tác, không đối đầu', maxPoints: 3 },
    ],
    reflectionPrompt: 'Lần gần nhất sếp hoặc khách hàng yêu cầu nhồi thêm phạm vi vào deadline cứng, bạn đã phản hồi thế nào?',
  },
  {
    id: 'cs5',
    code: 'CS5',
    moduleId: 'm5',
    title: 'Xung đột giữa Giám đốc Kinh doanh và Trưởng phòng IT',
    company: 'Sàn thương mại điện tử ShopFast',
    difficulty: 'Nâng cao',
    context:
      'Giám đốc Kinh doanh đòi dồn 100% team làm tính năng Flash Sale cho chiến dịch 12/12. Trưởng phòng IT cảnh báo hệ thống thanh toán cũ đang có lỗ hổng bảo mật nghiêm trọng và quá tải DB, cần 2 sprint để nâng cấp.',
    dossier: [
      {
        label: 'Quan điểm GĐ Kinh doanh',
        content: '"Không có Flash Sale 12/12 thì mất 30% doanh thu quý 4! Bảo mật để qua năm mới làm cũng được."',
      },
      {
        label: 'Quan điểm Trưởng IT',
        content: '"Nếu lượng truy cập 12/12 tăng gấp 5 lần mà không vá lỗi và tối ưu DB trước, hệ thống sẽ sập sau 10 phút mở bán!"',
      },
    ],
    tasks: [
      'Xác định mục tiêu chung duy nhất mà cả GĐ Kinh doanh lẫn Trưởng IT đều đồng ý.',
      'Đề xuất cách phân bổ năng lực (capacity) và chia nhỏ lát cắt cho cả Flash Sale lẫn ổn định hệ thống.',
      'Viết agenda 45 phút cho buổi họp đồng thuận giữa 2 bên.',
    ],
    recommendedLab: { label: 'Mở Prioritization Simulator', to: '/labs/prioritization' },
    expertSolution: [
      'Mục tiêu chung: "Đạt doanh thu cao nhất trong chiến dịch 12/12 MÀ KHÔNG bị sập hệ thống hay rò rỉ dữ liệu khách hàng."',
      'Dùng WSJF để lượng hóa Risk Reduction / Time Criticality của lỗ hổng bảo mật & chịu tải.',
      'Lát cắt kết hợp: Dành 50% năng lực cho các hạng mục chịu tải/bảo mật sống còn (vá lỗi thanh toán + cache trang chủ), 50% cho phiên bản Flash Sale gọn nhẹ (giảm giá cố định theo khung giờ, bỏ hiệu ứng phức tạp).',
    ],
    rubric: [
      { id: 'r1', criterion: 'Tìm ra mục tiêu kinh doanh chung kết nối 2 bên', maxPoints: 3 },
      { id: 'r2', criterion: 'Đưa ra phương án kết hợp khả thi thay vì thiên vị 1 phía', maxPoints: 3 },
      { id: 'r3', criterion: 'Dùng dữ liệu rủi ro / WSJF để thuyết phục', maxPoints: 3 },
    ],
    reflectionPrompt: 'Bạn thường đứng về phía Business hay IT khi xảy ra mâu thuẫn nợ kỹ thuật (Tech Debt) vs tính năng mới?',
  },
  {
    id: 'cs6',
    code: 'CS6',
    moduleId: 'm6',
    title: 'Dọn dẹp "Nghĩa địa Backlog" 300 item tồn đọng 3 năm',
    company: 'Công ty Logistics TransGo',
    difficulty: 'Trung bình',
    context:
      'Bạn vừa nhận vai trò Product Owner mới. Product Backlog trên Jira hiện có 312 item kéo dài từ năm 2023, nhiều ticket chỉ có 1 dòng tiêu đề mơ hồ, trùng lặp và không rõ ai yêu cầu.',
    dossier: [
      {
        label: 'Hiện trạng đo được',
        content: '180 ticket đã quá 12 tháng chưa từng được mở lại; 45 ticket không có mô tả hay AC; mỗi buổi Refinement team mất 40 phút chỉ để tranh luận ticket cũ có còn cần không.',
      },
    ],
    tasks: [
      'Thiết kế quy tắc phân loại nhanh (Giữ / Gộp / Tách / Lưu trữ-Xóa) để dọn backlog trong 2 tuần.',
      'Đề xuất bộ Definition of Ready (DoR) gồm 5 tiêu chí gọn nhẹ để ngăn rác quay lại.',
      'Cách thông báo với stakeholder khi xóa/lưu trữ các ticket cũ của họ mà không gây phản ứng tiêu cực.',
    ],
    recommendedLab: { label: 'Mở Anti-pattern Hunter', to: '/labs/antipattern' },
    expertSolution: [
      'Áp dụng quy tắc "6–12 tháng không đụng → chuyển sang trạng thái Archived/Won\'t Do" (không cần xóa vĩnh viễn để stakeholder yên tâm, nhưng làm sạch hoàn toàn backlog đang chạy).',
      'Chỉ giữ lại ~30–50 item phục vụ mục tiêu 2 quý tới; tuân thủ cấu trúc DEEP (chi tiết cho 2 sprint tới, thô cho phần sau).',
      'Thông điệp cho stakeholder: "Nếu một yêu cầu thực sự quan trọng với khách hàng lúc này, nó sẽ tự quay trở lại với ngữ cảnh mới chính xác hơn."',
    ],
    rubric: [
      { id: 'r1', criterion: 'Có tiêu chí cắt lọc dứt khoát (quy tắc thời gian + mục tiêu sản phẩm)', maxPoints: 3 },
      { id: 'r2', criterion: 'Xây dựng DoR ngắn gọn, thực tế (≤ 6 tiêu chí)', maxPoints: 3 },
      { id: 'r3', criterion: 'Có kế hoạch giao tiếp khéo léo với stakeholder', maxPoints: 3 },
    ],
    reflectionPrompt: 'Backlog hiện tại của đội bạn có bao nhiêu item và bao nhiêu % trong đó thực sự sẽ được làm trong 3 tháng tới?',
  },
];
