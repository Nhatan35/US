import type { LessonData, QuizData } from '@/types/course';

export const M7_LESSONS: LessonData[] = [
  {
    id: 'm7-1',
    moduleId: 'm7',
    code: '7.1',
    title: 'User Story Mapping & Walking Skeleton',
    minutes: 7,
    bookRef: 'Chương 7 — User Stories in Practice',
    body: `## Thoát khỏi "danh sách phẳng" bằng bản đồ 2 chiều

Một Product Backlog dạng danh sách 1 chiều rất dễ làm cả đội **mất bức tranh toàn cảnh** về hành trình người dùng. **User Story Mapping** (Jeff Patton) giải quyết điều đó bằng 2 trục:
- **Trục ngang (Backbone):** Chuỗi hoạt động chính từ trái sang phải (*Tìm bác sĩ → Đặt lịch → Thanh toán → Đi khám → Sau khám*).
- **Trục dọc:** Các User Story chi tiết xếp từ **quan trọng nhất ở trên** xuống thấp dần ở dưới.

### Walking Skeleton (Bộ khung biết đi)
Đường cắt **Release 1 (MVP)** phải chọn ít nhất 1 story tối giản ở **mọi cột Backbone** để người dùng có thể đi trọn hành trình từ đầu đến cuối ngay ở phiên bản đầu tiên.

> Thực hành xây bản đồ và kiểm tra Walking Skeleton ngay tại **[Story Mapping Board](/labs/story-map)**!
`,
    glossaryTerms: ['User Story Mapping', 'MVP (Minimum Viable Product)'],
    checks: [
      {
        id: 'c7-1-1',
        type: 'single',
        prompt: 'Trong User Story Mapping, trục ngang (Backbone) biểu diễn điều gì?',
        options: [
          'Danh sách các lập trình viên',
          'Hành trình các hoạt động chính của người dùng theo trình tự thời gian',
          'Độ khó kỹ thuật tăng dần',
          'Số điểm Story Point',
        ],
        answer: 1,
        explain: 'Backbone kể lại câu chuyện hành trình người dùng từ trái sang phải.',
        skill: 'backlog',
      },
    ],
  },
  {
    id: 'm7-2',
    moduleId: 'm7',
    code: '7.2',
    title: 'MVP, MMP và Lập kế hoạch Release theo Outcome',
    minutes: 6,
    bookRef: 'Chương 7 — Release Planning',
    body: `## Giao Outcome (Kết quả), không chỉ giao Output (Tính năng)

- **MVP (Minimum Viable Product):** Phiên bản gọn nhất để kiểm chứng giả thuyết với người dùng thật và học hỏi nhanh nhất.
- **MMP (Minimum Marketable Product):** Phiên bản tối thiểu đủ chất lượng để bán/phát hành rộng rãi ra thị trường.

Mỗi lát cắt Release trên Story Map nên gắn với một **Outcome đo lường được**, ví dụ:
- ❌ Output: *"Release 1 có 12 tính năng."*
- ✅ Outcome: *"Release 1 cho phép bệnh nhân đặt khám & check-in QR, giảm 30% cuộc gọi tổng đài trong tháng đầu."*
`,
    glossaryTerms: ['MVP (Minimum Viable Product)'],
    checks: [
      {
        id: 'c7-2-1',
        type: 'single',
        prompt: 'Mục tiêu nào sau đây được viết theo hướng Outcome (kết quả) thay vì Output (đầu ra)?',
        options: [
          'Hoàn thành 15 User Story trong tháng 12',
          'Viết xong 8 API và 5 màn hình mới',
          'Giảm tỉ lệ bệnh nhân bỏ lỡ lịch hẹn (no-show) từ 18% xuống dưới 10%',
          'Đạt 100% độ phủ code',
        ],
        answer: 2,
        explain: 'Outcome đo sự thay đổi tích cực trong hành vi người dùng hoặc chỉ số kinh doanh.',
        skill: 'prioritizing',
      },
    ],
  },
  {
    id: 'm7-3',
    moduleId: 'm7',
    code: '7.3',
    title: 'User Story cho Sản phẩm Kỹ thuật (API) & Hệ thống Tuân thủ',
    minutes: 7,
    bookRef: 'Chương 7 — Context-Specific Stories',
    body: `## Khi "người dùng" là Developer đối tác hoặc hệ thống pháp lý

### 1. Sản phẩm API / Nền tảng
Người tiêu thụ API chính là **Developer của đối tác tích hợp**!
- ✅ *"Là **lập trình viên đối tác logistics**, tôi muốn nhận mã lỗi chuẩn hóa kèm hướng dẫn khắc phục khi gọi API tạo vận đơn bị sai tham số để tôi tích hợp và debug nhanh hơn."*
- AC tập trung vào: HTTP status code, schema JSON, rate limit, idempotency, tài liệu OpenAPI.

### 2. Ngành có quy định nghiêm ngặt (Ngân hàng, Y tế)
Các yêu cầu như **audit log**, **phân quyền tối thiểu**, **đồng ý xử lý dữ liệu (Nghị định 13)** có thể viết thành story tuân thủ (vai trò: *Cán bộ kiểm toán / Pháp chế*) hoặc gắn vào AC và DoD.
`,
    checks: [
      {
        id: 'c7-3-1',
        type: 'truefalse',
        prompt: 'Đúng hay Sai: Khi xây dựng một nền tảng Open API cho bên thứ 3 tích hợp, "Lập trình viên đối tác tích hợp" là một Persona người dùng hợp lệ.',
        answer: true,
        explain: 'Đúng! Khác với việc viết task nội bộ cho dev trong team, đối với sản phẩm API thì developer bên ngoài chính là khách hàng sử dụng sản phẩm.',
        skill: 'writing',
      },
    ],
  },
  {
    id: 'm7-4',
    moduleId: 'm7',
    code: '7.4',
    title: 'Ánh xạ Story vào Jira, UX & Kiểm thử tự động BDD',
    minutes: 5,
    bookRef: 'Chương 7 — Tooling & BDD Traceability',
    body: `## Đưa User Story vào vận hành hằng ngày

1. **Trong Jira / Azure DevOps:**
   - **Summary:** Tiêu đề ngắn (động từ + đối tượng, ví dụ: *Lọc bác sĩ theo chuyên khoa*).
   - **Description:** Câu User Story + bối cảnh + link thiết kế Figma.
   - **Acceptance Criteria:** Checklist hoặc kịch bản Gherkin rõ ràng.
   - **Story Points, Epic Link, Labels (persona / release).**
2. **Truy vết Story ↔ Kiểm thử:** Kịch bản Gherkin viết trong AC có thể trở thành đặc tả sống (Living Documentation) và chạy tự động bằng Cucumber/Playwright.
`,
    checks: [
      {
        id: 'c7-4-1',
        type: 'single',
        prompt: 'Khi đưa User Story lên Jira, nên đặt gì vào ô Tiêu đề (Summary)?',
        options: [
          'Dán nguyên cả câu dài 40 từ "Là một... tôi muốn... để..."',
          'Tên ngắn gọn, dễ quét trên bảng Kanban (ví dụ: "Hủy lịch khám trước 2 giờ") và đặt câu Story đầy đủ trong phần Description',
          'Chỉ ghi mã số ST-01',
          'Ghi tên lập trình viên thực hiện',
        ],
        answer: 1,
        explain: 'Tiêu đề ngắn giúp quét bảng Sprint/Backlog cực nhanh, còn cấu trúc đầy đủ và AC nằm trong phần mô tả.',
        skill: 'backlog',
      },
    ],
  },
];

export const M7_QUIZ: QuizData = {
  id: 'quiz-m7',
  moduleId: 'm7',
  title: 'Kiểm tra Module 7: User Story trong thực tế',
  description: 'Kiểm tra kỹ năng Story Mapping, cắt MVP Walking Skeleton, viết story cho API và ánh xạ vào công cụ thực tế.',
  passScore: 80,
  xpReward: 40,
  questions: [
    {
      id: 'qm7-1',
      type: 'single',
      prompt: 'Một bản cắt Release 1 (MVP) trên Story Map bỏ trống hoàn toàn cột "Thanh toán" và "Đi khám" trong hành trình 5 bước. Vấn đề ở đây là gì?',
      options: [
        'Không có vấn đề gì',
        'Vi phạm nguyên tắc Walking Skeleton — người dùng không thể đi trọn hành trình để nhận giá trị thật',
        'Do cột Backbone quá ít',
        'Cần xóa cột Thanh toán khỏi sản phẩm',
      ],
      answer: 1,
      explain: 'MVP nên là một Walking Skeleton hoàn chỉnh dù tối giản (ví dụ: thanh toán tại quầy ở R1, ví điện tử ở R2).',
      skill: 'backlog',
    },
    {
      id: 'qm7-2',
      type: 'single',
      prompt: 'Khi viết User Story cho sản phẩm Open API, điều nào sau đây nên xuất hiện trong Acceptance Criteria?',
      options: [
        'Màu sắc nút bấm trên màn hình',
        'Mã trạng thái HTTP, cấu trúc lỗi JSON, giới hạn tần suất (rate limit) và thời gian phản hồi',
        'Font chữ tiêu đề',
        'Sở thích cá nhân của lập trình viên',
      ],
      answer: 1,
      explain: 'AC của API tập trung vào hợp đồng giao tiếp (contract), mã lỗi, bảo mật và hiệu năng.',
      skill: 'ac',
    },
    {
      id: 'qm7-3',
      type: 'truefalse',
      prompt: 'Đúng hay Sai: Gherkin vừa đóng vai trò là Acceptance Criteria dễ hiểu cho kinh doanh, vừa có thể làm đầu vào cho kiểm thử tự động BDD.',
      answer: true,
      explain: 'Đúng. Đây chính là sức mạnh "Living Documentation" của BDD.',
      skill: 'ac',
    },
  ],
};
