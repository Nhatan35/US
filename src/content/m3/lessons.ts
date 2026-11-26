import type { LessonData } from '@/types/course';

export const M3_LESSONS: LessonData[] = [
  {
    id: 'm3-1',
    moduleId: 'm3',
    code: '3.1',
    title: 'Cấu trúc User Story chuẩn Connextra (Who – What – Why)',
    minutes: 6,
    bookRef: 'Chương 3 — Writing Effective User Stories',
    body: `## Ba thành phần vàng của một User Story

Template phổ biến nhất (Connextra):

> **Là một** [vai trò / persona], **tôi muốn** [hành động / nhu cầu], **để** [giá trị / lợi ích].

- **Who (Ai):** Gắn với một persona cụ thể (xem Module 2).
- **What (Muốn gì):** Nêu **mục tiêu** (1 mục tiêu duy nhất), không chỉ định nút bấm hay cấu trúc DB.
- **Why (Để làm gì):** Phần hay bị bỏ qua nhất nhưng lại là **la bàn** giúp team sáng tạo giải pháp tốt hơn khi gặp khó khăn kỹ thuật.

> Hãy mở **[Story Writer](/labs/story-writer)** song song để thực hành kiểm tra câu chuyện của bạn theo 14 quy tắc tự động!
`,
    examples: [
      {
        title: 'Nhắc lịch tái khám',
        bad: 'Là bệnh nhân, tôi muốn nhận thông báo để tôi biết thông báo.',
        badReason: 'Phần "Để" lặp lại phần "Tôi muốn", không nêu lợi ích thật.',
        good: 'Là bác Hòa (bệnh nhân cao tuổi), tôi muốn nhận tin nhắn SMS nhắc lịch trước 24 giờ để không quên ngày tái khám định kỳ.',
        goodReason: 'Rõ persona, rõ kênh phù hợp với người lớn tuổi và rõ giá trị giảm bỏ lỡ lịch.',
      },
    ],
    glossaryTerms: ['User Story'],
    checks: [
      {
        id: 'c3-1-1',
        type: 'single',
        prompt: 'Vì sao phần "Để... (So that...)" lại cực kỳ quan trọng trong User Story?',
        options: [
          'Để câu chuyện trông dài hơn',
          'Để giải thích giá trị/mục đích thật sự, giúp team ưu tiên và tìm giải pháp thay thế khi cần',
          'Chỉ là quy định hình thức không có tác dụng thực tế',
          'Để QA biết cách viết SQL',
        ],
        answer: 1,
        explain: 'Hiểu rõ "Why" giúp cả đội biết giá trị cốt lõi cần bảo vệ và có thể đề xuất cách làm gọn hơn mà vẫn đạt mục tiêu.',
        skill: 'writing',
      },
    ],
  },
  {
    id: 'm3-2',
    moduleId: 'm3',
    code: '3.2',
    title: '6 tiêu chí INVEST để đánh giá chất lượng Story',
    minutes: 8,
    bookRef: 'Chương 3 — The INVEST Criteria',
    body: `## Bộ lọc chất lượng của Bill Wake

| Chữ | Ý nghĩa | Dấu hiệu vi phạm | Cách sửa |
|---|---|---|---|
| **I** | **Independent** (Độc lập) | Phải làm xong Story A mới test được Story B | Gộp nhẹ hoặc chia lại theo lát cắt dọc |
| **N** | **Negotiable** (Thương lượng được) | Khóa cứng UI/API ngay trong story | Viết nhu cầu, để chi tiết trao đổi cùng team |
| **V** | **Valuable** (Có giá trị) | Story chỉ phục vụ kỹ thuật nội bộ | Viết lại theo giá trị người dùng hoặc chuyển thành Task |
| **E** | **Estimable** (Ước lượng được) | Team giơ thẻ "?" vì quá mơ hồ | Làm rõ AC hoặc tách Spike điều tra ngắn |
| **S** | **Small** (Nhỏ gọn) | Ước lượng ≥ 13 điểm, không xong trong 1 sprint | Áp dụng SPIDR để chia nhỏ |
| **T** | **Testable** (Kiểm thử được) | Dùng từ mơ hồ: "nhanh, đẹp, dễ dùng" | Viết Acceptance Criteria đo lường được |
`,
    glossaryTerms: ['INVEST'],
    checks: [
      {
        id: 'c3-2-1',
        type: 'match',
        prompt: 'Ghép mỗi tình huống vi phạm với chữ cái INVEST tương ứng:',
        pairs: [
          ['Story ước lượng 21 điểm, mất 3 tuần mới xong', 'Small (S)'],
          ['AC ghi "Hệ thống phải chạy thật nhanh và đẹp"', 'Testable (T)'],
          ['Story chỉ định cứng phải dùng dropdown màu xanh', 'Negotiable (N)'],
          ['Story chỉ tạo bảng DB, không có giá trị cho user', 'Valuable (V)'],
        ],
        explain: 'Nhận diện nhanh tiêu chí INVEST bị vi phạm giúp bạn sửa story ngay trước khi đưa vào sprint.',
        skill: 'writing',
      },
    ],
  },
  {
    id: 'm3-3',
    moduleId: 'm3',
    code: '3.3',
    title: 'Viết Acceptance Criteria (AC) sắc bén & kiểm thử được',
    minutes: 7,
    bookRef: 'Chương 3 — Acceptance Criteria',
    body: `## Acceptance Criteria là bản hợp đồng "Hoàn thành"

Một bộ AC tốt cần:
1. **Kiểm thử được (Pass/Fail rõ ràng):** Tránh "tốt, nhanh, thân thiện".
2. **Tập trung kết quả, không mô tả từng cú click:** Nêu *điều gì xảy ra*, không viết như hướng dẫn bấm chuột 20 bước.
3. **Bao phủ cả Happy Path lẫn Unhappy Path:** Luôn hỏi về dữ liệu sai, giá trị biên, mất quyền, trạng thái rỗng và lỗi mạng.

### 2 định dạng phổ biến
- **Checklist quy tắc (Rule-oriented):** Ngắn gọn, phù hợp cho quy tắc xác thực dữ liệu, phân quyền.
- **Kịch bản Gherkin (Scenario-oriented):** Rất mạnh cho luồng nghiệp vụ nhiều điều kiện (xem bài 3.4).
`,
    glossaryTerms: ['Acceptance Criteria (AC)'],
    checks: [
      {
        id: 'c3-3-1',
        type: 'multi',
        prompt: 'Chọn TẤT CẢ các đặc điểm của một bộ Acceptance Criteria tốt:',
        options: [
          'Có thể kiểm chứng rõ ràng Đạt / Không đạt',
          'Bao gồm cả trường hợp thành công và trường hợp lỗi/biên',
          'Dùng các từ như "nhanh chóng, mượt mà, hiện đại"',
          'Tập trung vào hành vi & kết quả mong đợi thay vì chi tiết code',
        ],
        answer: [0, 1, 3],
        explain: 'AC tốt phải cụ thể, kiểm thử được và phủ các trường hợp ngoại lệ quan trọng.',
        skill: 'ac',
      },
    ],
  },
  {
    id: 'm3-4',
    moduleId: 'm3',
    code: '3.4',
    title: 'Gherkin & BDD: Given – When – Then',
    minutes: 7,
    bookRef: 'Chương 3 — Behavior-Driven Development',
    body: `## Ngôn ngữ chung giữa Business, Dev và QA

Cú pháp **Gherkin** mô tả ví dụ cụ thể theo 3 bước:
- **Given (Cho rằng):** Bối cảnh / trạng thái ban đầu.
- **When (Khi):** **Một** hành động kích hoạt duy nhất.
- **Then (Thì):** Kết quả quan sát được, kiểm chứng được.

\`\`\`gherkin
Scenario: Đặt lịch thất bại khi slot đã có người đặt
  Given bác sĩ Minh chỉ còn slot 18:00
    And bệnh nhân khác vừa đặt thành công slot 18:00
  When chị Lan xác nhận đặt slot 18:00
  Then hệ thống hiển thị thông báo "Khung giờ đã hết"
    And hệ thống gợi ý 3 khung giờ trống gần nhất
\`\`\`

Khi có nhiều bộ dữ liệu cùng quy tắc, dùng **Scenario Outline** kết hợp bảng **Examples**. Thực hành ngay tại **[Gherkin Builder](/labs/gherkin)**!
`,
    glossaryTerms: ['Gherkin (Given / When / Then)'],
    checks: [
      {
        id: 'c3-4-1',
        type: 'single',
        prompt: 'Trong một Scenario Gherkin chuẩn, nên có bao nhiêu bước "When" chính?',
        options: ['Không cần bước When', 'Đúng 1 bước When chính', 'Càng nhiều bước When nối tiếp nhau càng tốt', 'Ít nhất 3 bước When'],
        answer: 1,
        explain: 'Mỗi Scenario chỉ nên kiểm thử 1 hành vi/hành động chính (1 When) để khi test fail biết ngay nguyên nhân.',
        skill: 'ac',
      },
    ],
  },
  {
    id: 'm3-5',
    moduleId: 'm3',
    code: '3.5',
    title: 'Phân biệt Acceptance Criteria, DoR và DoD',
    minutes: 5,
    bookRef: 'Chương 3 — Ready & Done',
    body: `## Ba khái niệm rất dễ nhầm lẫn

| Khái niệm | Phạm vi áp dụng | Thời điểm kiểm tra | Ví dụ |
|---|---|---|---|
| **Definition of Ready (DoR)** | Chung cho cả team | Trước khi đưa story vào Sprint | Đã có AC, ước lượng ≤ 8 điểm, không bị chặn |
| **Acceptance Criteria (AC)** | Riêng từng User Story | Khi kiểm thử & nghiệm thu story đó | Hủy lịch dưới 2h sẽ hiện cảnh báo phí |
| **Definition of Done (DoD)** | Chung cho mọi Story | Trước khi kéo story sang cột Done | Qua code review, pass automated test, deploy staging |
`,
    glossaryTerms: ['Definition of Ready (DoR)', 'Definition of Done (DoD)', 'Acceptance Criteria (AC)'],
    checks: [
      {
        id: 'c3-5-1',
        type: 'single',
        prompt: '"Mọi code phải được review bởi ít nhất 1 thành viên khác và pass CI pipeline" thuộc về khái niệm nào?',
        options: ['Acceptance Criteria của 1 story', 'Definition of Ready (DoR)', 'Definition of Done (DoD)', 'User Persona'],
        answer: 2,
        explain: 'Đây là tiêu chuẩn chất lượng chung áp dụng cho mọi story trước khi hoàn thành → Definition of Done.',
        skill: 'ac',
      },
    ],
  },
  {
    id: 'm3-6',
    moduleId: 'm3',
    code: '3.6',
    title: 'Chia nhỏ Story theo Lát cắt dọc (SPIDR) & Xử lý NFR',
    minutes: 8,
    bookRef: 'Chương 3 — Splitting Stories & NFRs',
    body: `## Đừng cắt bánh theo từng lớp kem!

Sai lầm lớn nhất khi chia Epic là **cắt ngang theo tầng kỹ thuật** (Story UI, Story API, Story Database). Không một mảnh nào trong số đó tự mang lại giá trị hay demo được cho khách hàng.

Thay vào đó, hãy **cắt dọc (Vertical Slice)** bằng khung **SPIDR**:
- **S — Spike:** Tách phần điều tra kỹ thuật chưa rõ (time-box 1–2 ngày).
- **P — Paths:** Chia theo từng nhánh luồng (ví dụ: thanh toán thẻ trước, ví điện tử sau).
- **I — Interfaces:** Giao diện đơn giản trước, giao diện nâng cao sau.
- **D — Data:** Một nhóm dữ liệu phổ biến trước, mở rộng loại dữ liệu khác sau.
- **R — Rules:** Quy tắc nghiệp vụ cơ bản trước, quy tắc ngoại lệ/khuyến mãi sau.

\`\`\`mermaid
flowchart TD
    E["Epic: Thanh toán (21pt)"] --> S1["Story 1: Thanh toán thẻ ATM (5pt)"]
    E --> S2["Story 2: Thanh toán ví MoMo (5pt)"]
    E --> S3["Story 3: Áp mã giảm giá (3pt)"]
    E --> S4["Story 4: Xuất hóa đơn VAT (5pt)"]
\`\`\`

Thực hành chia Epic ngay tại **[Story Splitting Trainer](/labs/splitting)**!
`,
    glossaryTerms: ['Vertical Slice', 'Epic'],
    checks: [
      {
        id: 'c3-6-1',
        type: 'single',
        prompt: 'Chữ "P" trong bộ kỹ thuật chia nhỏ story SPIDR đại diện cho điều gì?',
        options: [
          'Priority (Ưu tiên)',
          'Paths (Chia theo các nhánh luồng xử lý)',
          'Personas (Chân dung người dùng)',
          'Points (Điểm ước lượng)',
        ],
        answer: 1,
        explain: 'SPIDR = Spike, Paths, Interfaces, Data, Rules.',
        skill: 'splitting',
      },
    ],
  },
];
