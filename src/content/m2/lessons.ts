import type { LessonData } from '@/types/course';

export const M2_LESSONS: LessonData[] = [
  {
    id: 'm2-1',
    moduleId: 'm2',
    code: '2.1',
    title: 'Ai thực sự là "User"? Tránh cái bẫy "As a user"',
    minutes: 6,
    bookRef: 'Chương 2 — Understanding the User Perspective',
    body: `## Vì sao "Là người dùng..." là dấu hiệu cảnh báo?

Khi bạn viết *"Là người dùng, tôi muốn tìm kiếm bác sĩ"*, cả đội không biết người dùng đó là:
- **Chị Lan (32 tuổi):** đang ôm con sốt, dùng điện thoại 1 tay, cần tìm bác sĩ Nhi khám sau 18h trong dưới 2 phút.
- **Bác Hòa (68 tuổi):** mắt kém, cần chữ to, muốn đặt đúng bác sĩ tim mạch quen tháng trước.
- **Chị Thảo (lễ tân):** dùng máy tính bàn, cần tra lịch trống của 15 bác sĩ cùng lúc để xếp lịch cho khách gọi tổng đài.

Cùng một hành động "tìm bác sĩ", nhưng **thiết kế, tiêu chí lọc và AC hoàn toàn khác nhau** tùy vào vai trò!

### 4 nhóm "User" thường gặp
1. **End-user (Người dùng cuối):** người trực tiếp thao tác để hoàn thành mục tiêu cá nhân.
2. **Buyer / Payer (Người trả tiền):** có thể khác end-user (ví dụ: giám đốc mua phần mềm cho nhân viên dùng).
3. **Internal Operator / Admin:** lễ tân, kế toán, hỗ trợ khách hàng vận hành hệ thống.
4. **External System / Partner Developer:** khi xây API hoặc nền tảng tích hợp.
`,
    examples: [
      {
        title: 'Tìm kiếm lịch khám',
        bad: 'Là người dùng, tôi muốn tìm kiếm lịch khám để xem giờ trống.',
        badReason: 'Không rõ là bệnh nhân hay lễ tân, không rõ bối cảnh sử dụng.',
        good: 'Là chị Lan (mẹ có con nhỏ), tôi muốn lọc bác sĩ Nhi còn slot sau 18:00 để không phải xin nghỉ làm.',
        goodReason: 'Chỉ rõ persona, khung giờ ưu tiên và động lực thực tế.',
      },
    ],
    commonMistakes: [
      'Dùng "Là người dùng" cho mọi story trong backlog.',
      'Quên mất nhóm người dùng vận hành nội bộ (lễ tân, CSKH, kế toán).',
    ],
    glossaryTerms: ['Persona', 'User Story'],
    checks: [
      {
        id: 'c2-1-1',
        type: 'single',
        prompt: 'Nhược điểm lớn nhất khi viết "Là người dùng..." trong hầu hết các User Story là gì?',
        options: [
          'Vi phạm cú pháp Jira',
          'Làm mất ngữ cảnh cụ thể, khiến team không biết tối ưu thiết kế và AC cho ai',
          'Làm story dài hơn',
          'Không ước lượng được Story Point',
        ],
        answer: 1,
        explain: 'Mỗi nhóm người dùng có kỹ năng công nghệ, thiết bị và mục tiêu khác nhau — cần chỉ rõ vai trò cụ thể.',
        skill: 'empathy',
      },
    ],
  },
  {
    id: 'm2-2',
    moduleId: 'm2',
    code: '2.2',
    title: 'Xây dựng Persona dựa trên dữ liệu thực tế',
    minutes: 8,
    bookRef: 'Chương 2 — Crafting User Personas',
    body: `## Persona không phải là truyện hư cấu

Một **Persona** tốt phải dựa trên dữ liệu thật (phỏng vấn, khảo sát, nhật ký hỗ trợ, analytics), không phải do team ngồi phòng kín tự tưởng tượng.

### Cấu trúc một Persona hữu ích cho viết Story
- **Tên & Vai trò:** gợi nhớ nhanh trong cuộc họp (ví dụ: *Chị Lan — Mẹ bỉm sữa bận rộn*).
- **Mục tiêu (Goals):** điều họ muốn đạt được.
- **Nỗi đau (Pain points):** rào cản hiện tại khiến họ bực bội.
- **Bối cảnh & Mức thành thạo công nghệ:** dùng mobile hay desktop, vội vàng hay thong thả.
- **Câu nói đặc trưng (Quote):** 1 câu trích dẫn thật từ phỏng vấn.

### 3 loại Persona cần phân biệt
1. **Primary Persona (Chính):** ưu tiên tối ưu trải nghiệm số 1.
2. **Secondary Persona (Phụ):** hỗ trợ tốt nhưng không làm hỏng trải nghiệm của Primary.
3. **Negative Persona (Loại trừ):** đối tượng ta **chủ động không thiết kế cho** để tránh phình to phạm vi.

> Bạn có thể thực hành tạo Persona ngay tại **[Bộ công cụ Persona Builder](/labs/persona)** — Persona tạo ra sẽ tự đồng bộ sang Story Writer!
`,
    commonMistakes: [
      'Điền quá nhiều thông tin vô ích (cung hoàng đạo, thích uống cà phê gì) mà thiếu nỗi đau và mục tiêu.',
      'Tạo ra 12 persona rồi không ai nhớ nổi — thực tế chỉ nên có 2–4 persona chính.',
    ],
    glossaryTerms: ['Persona'],
    checks: [
      {
        id: 'c2-2-1',
        type: 'truefalse',
        prompt: 'Đúng hay Sai: Negative Persona dùng để xác định nhóm đối tượng sản phẩm CHỦ ĐỘNG không phục vụ, giúp tránh phình phạm vi.',
        answer: true,
        explain: 'Đúng. Biết rõ mình không làm cho ai giúp team nói "không" dễ dàng hơn với các tính năng lạc hướng.',
        skill: 'empathy',
      },
    ],
  },
  {
    id: 'm2-3',
    moduleId: 'm2',
    code: '2.3',
    title: 'Empathy Map & User Journey Map',
    minutes: 7,
    bookRef: 'Chương 2 — Empathy & Journey Mapping',
    body: `## Hai bản đồ giúp nhìn thấy cơ hội viết Story

### 1. Empathy Map (Bản đồ thấu cảm)
Tổng hợp dữ liệu phỏng vấn của 1 persona vào 6 ô:
- **Says** (Họ nói gì?) · **Thinks** (Họ lo lắng/suy nghĩ gì?)
- **Does** (Họ thực sự làm gì?) · **Feels** (Cảm xúc ra sao?)
- **Pains** (Nỗi đau) · **Gains** (Điều họ mong đạt được)

### 2. User Journey Map (Bản đồ hành trình)
Trải hành trình của người dùng theo trục thời gian:

\`\`\`mermaid
flowchart LR
    S1["1. Tìm bác sĩ<br/>😐 Cảm xúc: 3/5"] --> S2["2. Gọi tổng đài<br/>😡 Cảm xúc: 1/5"]
    S2 --> S3["3. Chờ tại quầy<br/>😟 Cảm xúc: 2/5"]
    S3 --> S4["4. Khám bệnh<br/>🙂 Cảm xúc: 4/5"]
    S4 --> S5["5. Tái khám<br/>😐 Cảm xúc: 3/5"]
\`\`\`

Những điểm **cảm xúc tụt thấp nhất** (như bước 2 và bước 3) chính là **mỏ vàng cơ hội** để sinh ra các User Story có giá trị cao nhất!
`,
    glossaryTerms: ['Persona'],
    checks: [
      {
        id: 'c2-3-1',
        type: 'single',
        prompt: 'Trên User Journey Map, đâu là nơi thường gợi ý các User Story ưu tiên cao nhất?',
        options: [
          'Bước người dùng đã rất hài lòng',
          'Các điểm chạm có cảm xúc tụt thấp và nhiều nỗi đau (pain points)',
          'Bước có giao diện nhiều màu sắc nhất',
          'Bước dễ code nhất',
        ],
        answer: 1,
        explain: 'Giải quyết những điểm gây ức chế lớn nhất trên hành trình người dùng tạo ra giá trị rõ rệt nhất.',
        skill: 'empathy',
      },
    ],
  },
  {
    id: 'm2-4',
    moduleId: 'm2',
    code: '2.4',
    title: 'Jobs-to-be-Done (JTBD) & Job Story',
    minutes: 6,
    bookRef: 'Chương 2 — Jobs-to-be-Done',
    body: `## Khi tình huống quan trọng hơn nhân khẩu học

Đôi khi hành vi của người dùng không phụ thuộc vào tuổi tác hay chức danh mà phụ thuộc vào **tình huống (Context)** họ đang gặp phải. Khi đó, **Job Story** rất hữu ích:

> **Khi** [tình huống cụ thể], **tôi muốn** [động cơ/hành động], **để** [kết quả mong muốn].

### So sánh nhanh
- **User Story:** *Là chị Lan (mẹ bỉm sữa), tôi muốn đặt lịch khám ngoài giờ để không phải xin nghỉ làm.*
- **Job Story:** *Khi con bị sốt đột xuất lúc 19h tối, tôi muốn biết ngay phòng khám nhi gần nhất còn bác sĩ trực để đưa con đi khám kịp thời.*

Job Story đặc biệt mạnh ở sản phẩm tiêu dùng đại chúng nơi nhiều nhóm nhân khẩu học cùng chia sẻ một "công việc cần hoàn thành" (Job).
`,
    examples: [
      {
        title: 'Đổi lịch hẹn khẩn cấp',
        bad: 'Là người dùng iOS, tôi muốn đổi giờ hẹn.',
        badReason: 'Hệ điều hành không giải thích lý do hay hoàn cảnh đổi lịch.',
        good: 'Khi có cuộc họp đột xuất trùng giờ khám, tôi muốn dời lịch sang khung giờ khác chỉ với 1 lần chạm để không phải hủy và đặt lại từ đầu.',
        goodReason: 'Làm nổi bật hoàn cảnh gấp gáp → gợi ý trải nghiệm thao tác cực nhanh.',
      },
    ],
    checks: [
      {
        id: 'c2-4-1',
        type: 'single',
        prompt: 'Cấu trúc chuẩn của một Job Story gồm 3 thành phần nào?',
        options: [
          'Given – When – Then',
          'When (Tình huống) – I want to (Động cơ) – So I can (Kết quả)',
          'Who – Where – How much',
          'Card – Conversation – Confirmation',
        ],
        answer: 1,
        explain: 'Job Story thay vai trò nhân khẩu học bằng tình huống kích hoạt (When [situation]).',
        skill: 'empathy',
      },
    ],
  },
  {
    id: 'm2-5',
    moduleId: 'm2',
    code: '2.5',
    title: 'Dùng Persona để ra quyết định & nói "Không"',
    minutes: 5,
    bookRef: 'Chương 2 — Personas in Product Decisions',
    body: `## Thiết kế cho tất cả mọi người = Thiết kế cho không ai cả

Trong thực tế, stakeholder thường đề xuất hàng chục tính năng hấp dẫn nhưng lạc hướng. Persona giúp bạn ra quyết định khách quan thay vì tranh cãi cảm tính:

1. **Kiểm tra độ khớp Persona chính:** Tính năng này giải quyết nỗi đau nào của Chị Lan hay Bác Hòa?
2. **Đánh giá đánh đổi (Trade-off):** Thêm tính năng gamification phức tạp có làm Bác Hòa (68 tuổi, công nghệ thấp) bị rối mắt không?
3. **Ưu tiên backlog:** Tính năng phục vụ Primary Persona được xếp trên tính năng chỉ phục vụ số ít Secondary Persona.
`,
    checks: [
      {
        id: 'c2-5-1',
        type: 'single',
        prompt: 'Marketing đề xuất thêm mini-game quay số trúng thưởng vào màn hình đặt lịch khám. Dựa vào Persona Bác Hòa (68t) và Chị Lan (vội vàng đặt cho con), bạn nên xử lý ra sao?',
        options: [
          'Làm ngay vì mini-game rất vui',
          'Dùng dữ liệu Persona chỉ ra rằng cả 2 nhóm ưu tiên sự nhanh gọn, rõ ràng — đề xuất hoãn hoặc tách khỏi luồng đặt lịch cốt lõi',
          'Im lặng bỏ qua email của Marketing',
          'Thêm vào nhưng ẩn nút thật nhỏ',
        ],
        answer: 1,
        explain: 'Persona là căn cứ khách quan để bảo vệ trải nghiệm cốt lõi và giải thích lý do ưu tiên với stakeholder.',
        skill: 'empathy',
      },
    ],
  },
];
