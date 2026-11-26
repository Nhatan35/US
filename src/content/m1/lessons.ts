import type { LessonData } from '@/types/course';

export const M1_LESSONS: LessonData[] = [
  {
    id: 'm1-1',
    moduleId: 'm1',
    code: '1.1',
    title: 'Từ tài liệu yêu cầu (SRS) đến User Story',
    minutes: 6,
    bookRef: 'Chương 1 — Introduction to User Stories',
    body: `## Vì sao tài liệu yêu cầu kiểu cũ hay thất bại?

Trong quy trình Waterfall truyền thống, dự án thường bắt đầu bằng một tài liệu **SRS (Software Requirements Specification)** dài 50–100 trang, liệt kê hàng trăm câu dạng *"Hệ thống phải…"* (The system shall…).

Cách làm này có 3 điểm yếu lớn:
1. **Ảo tưởng hiểu đúng:** Người viết nghĩ mình đã viết rõ, nhưng lập trình viên và tester lại hiểu theo hướng khác.
2. **Đóng băng quá sớm:** Khi thị trường hoặc người dùng thay đổi sau 3 tháng, tài liệu SRS trở nên lỗi thời.
3. **Mất mục tiêu người dùng:** Giữa hàng trăm yêu cầu kỹ thuật, cả đội dễ quên mất *ai đang dùng tính năng này và họ cần giải quyết vấn đề gì*.

## User Story ra đời để giải quyết điều gì?

Khái niệm **User Story** bắt nguồn từ Extreme Programming (XP) cuối thập niên 1990. Alistair Cockburn từng nói một câu nổi tiếng:

> *"A User Story is a promise for a conversation."* — User Story là **lời hứa cho một cuộc trò chuyện**, không phải là bản đặc tả chi tiết thay thế cho giao tiếp.

Thay vì cố viết mọi chi tiết ngay từ đầu, User Story ghi lại ngắn gọn **ai cần gì và để làm gì**, sau đó PO, BA, Dev, QA sẽ cùng trao đổi khi story sắp được phát triển.

\`\`\`mermaid
flowchart LR
    A["SRS kiểu cũ: Viết 100 trang → Chuyển giao → Ít trao đổi"] --> B["Hiểu sai, xây thứ không ai dùng"]
    C["User Story: Ghi ngắn gọn → Trò chuyện sâu → Xác nhận bằng AC"] --> D["Hiểu chung, tập trung giá trị"]
\`\`\`
`,
    examples: [
      {
        title: 'Báo cáo doanh thu cho kế toán',
        bad: 'Hệ thống phải có nút Export PDF ở góc phải màn hình Doanh thu, xuất file khổ A4, font Arial 12pt.',
        badReason: 'Áp đặt giải pháp kỹ thuật/UI, không nêu ai dùng và mục đích kinh doanh.',
        good: 'Là kế toán trưởng, tôi muốn xuất báo cáo doanh thu tháng ra định dạng dễ in ấn để gửi ban giám đốc trước cuộc họp giao ban.',
        goodReason: 'Rõ đối tượng, nhu cầu và lý do — mở ra cuộc trò chuyện về nội dung báo cáo cần gì.',
      },
    ],
    commonMistakes: [
      'Cố nhồi nhét toàn bộ đặc tả SRS vào phần mô tả của một User Story.',
      'Viết story xong giao cho dev tự đọc mà không có buổi trao đổi làm rõ.',
      'Bắt đầu câu bằng "Hệ thống phải…" thay vì góc nhìn người dùng.',
    ],
    glossaryTerms: ['User Story', 'Product Backlog'],
    checks: [
      {
        id: 'c1-1-1',
        type: 'single',
        prompt: 'Điểm khác biệt cốt lõi nhất của User Story so với tài liệu SRS truyền thống là gì?',
        options: [
          'User Story dài hơn và chi tiết hơn SRS',
          'User Story ngắn gọn, lấy giá trị người dùng làm trung tâm và mở đầu cho cuộc trò chuyện',
          'User Story chỉ do lập trình viên viết',
          'User Story loại bỏ hoàn toàn việc kiểm thử',
        ],
        answer: 1,
        explain: 'User Story là "lời hứa cho một cuộc trò chuyện", tập trung vào ai cần gì và vì sao, thay vì đặc tả cứng nhắc ngay từ đầu.',
        skill: 'writing',
      },
      {
        id: 'c1-1-2',
        type: 'truefalse',
        prompt: 'Đúng hay Sai: Khi đã viết User Story chi tiết, PO và Dev không cần trao đổi thêm trước khi code.',
        answer: false,
        explain: 'Sai. Trao đổi trực tiếp (Conversation) là phần quan trọng nhất để tạo sự hiểu chung giữa kinh doanh, phát triển và kiểm thử.',
        skill: 'writing',
      },
    ],
  },
  {
    id: 'm1-2',
    moduleId: 'm1',
    code: '1.2',
    title: 'Mô hình 3C: Card – Conversation – Confirmation',
    minutes: 7,
    bookRef: 'Chương 1 — The 3Cs of User Stories',
    body: `## Ba mảnh ghép không thể tách rời

Năm 2001, Ron Jeffries giới thiệu **mô hình 3C** để giải thích bản chất của một User Story hoàn chỉnh:

\`\`\`mermaid
flowchart LR
    C1["1. CARD (Thẻ)<br/>Ghi ngắn gọn lời nhắc"] --> C2["2. CONVERSATION (Trò chuyện)<br/>Làm rõ ngữ cảnh & biên"]
    C2 --> C3["3. CONFIRMATION (Xác nhận)<br/>Acceptance Criteria kiểm thử được"]
\`\`\`

### 1. Card (Thẻ ghi)
- Là một tấm thẻ vật lý hoặc một ticket trên Jira/Trello.
- Ghi ngắn gọn câu chuyện (*Là… tôi muốn… để…*) — vừa đủ để nhớ chủ đề, **không** cố viết thành tiểu luận.

### 2. Conversation (Cuộc trò chuyện)
- Là phần **quan trọng nhất** nhưng cũng hay bị bỏ qua nhất.
- Diễn ra giữa PO/BA, Developer, QA, Designer (thường gọi là *Three Amigos* hoặc trong buổi Refinement).
- Mục tiêu: đặt câu hỏi "Nếu thì sao?", thống nhất phạm vi, phát hiện rủi ro và trường hợp biên.

### 3. Confirmation (Xác nhận)
- Kết quả cụ thể hóa từ cuộc trò chuyện, thường viết dưới dạng **Acceptance Criteria (AC)**.
- Cho biết chính xác điều kiện nào cần thỏa mãn để story được nghiệm thu là "Hoàn thành".
`,
    examples: [
      {
        title: 'Đặt lịch khám nhi buổi tối',
        bad: 'Chỉ có 1 dòng trên Jira: "Cho phép đặt lịch khám" rồi đẩy thẳng vào Sprint cho dev làm.',
        badReason: 'Chỉ có Card sơ sài, thiếu hoàn toàn Conversation và Confirmation → dev đoán mò.',
        good: 'Card: "Là phụ huynh, tôi muốn đặt lịch khám nhi sau 18h để không phải xin nghỉ làm." → Conversation: hỏi về giờ đóng cửa, đặt trùng slot, gửi SMS → Confirmation: 4 tiêu chí AC rõ ràng.',
        goodReason: 'Đủ cả 3C, cả team có cùng hình dung về sản phẩm đầu ra.',
      },
    ],
    commonMistakes: [
      'Nghĩ rằng 1 câu "As a… I want… so that…" đã là toàn bộ User Story.',
      'Bỏ qua bước Conversation vì "team bận quá, cứ đọc ticket đi".',
      'Viết Confirmation quá mơ hồ như "chạy nhanh, giao diện đẹp".',
    ],
    glossaryTerms: ['3C Model (Card – Conversation – Confirmation)', 'Acceptance Criteria (AC)'],
    checks: [
      {
        id: 'c1-2-1',
        type: 'single',
        prompt: 'Trong mô hình 3C, thành phần nào biến những gì team đã thống nhất thành điều kiện kiểm thử được?',
        options: ['Card', 'Conversation', 'Confirmation', 'Capacity'],
        answer: 2,
        explain: 'Confirmation (thường thể hiện qua Acceptance Criteria) ghi lại các điều kiện cụ thể để xác nhận story đã làm đúng.',
        skill: 'ac',
      },
    ],
  },
  {
    id: 'm1-3',
    moduleId: 'm1',
    code: '1.3',
    title: 'Phân biệt Story, Requirement, Use Case và Task',
    minutes: 7,
    bookRef: 'Chương 1 — Comparing User Stories',
    body: `## Đừng gọi mọi thứ trong backlog là "User Story"

Một sai lầm rất phổ biến khi chuyển sang Agile là gắn nhãn "User Story" lên mọi đầu việc. Bảng sau giúp bạn phân biệt rạch ròi:

| Tiêu chí | User Story | Requirement (SRS) | Use Case | Task / Sub-task |
|---|---|---|---|---|
| **Góc nhìn** | Người dùng & giá trị | Hệ thống & đặc tả | Tương tác Actor–Hệ thống | Công việc kỹ thuật của team |
| **Mức chi tiết** | Ngắn gọn, mở dần qua trao đổi | Chi tiết ngay từ đầu | Luồng chính, luồng phụ, ngoại lệ | Rất cụ thể theo chuyên môn |
| **Giá trị độc lập** | Có (mang lại giá trị cho user) | Tùy câu | Có (1 mục tiêu hoàn chỉnh) | Không (chỉ là 1 mảnh kỹ thuật) |
| **Ví dụ** | Là bệnh nhân, tôi muốn hủy lịch trước 2h để không mất phí | Hệ thống phải cập nhật status=CANCELLED trong DB | UC-04: Hủy lịch hẹn (bước 1–6) | Viết API PATCH /appointments/:id |

### Khi nào KHÔNG cần ép thành User Story?
- **Bug:** Lỗi sai so với hành vi mong đợi → ghi nhận là Bug.
- **Technical Task:** Tạo bảng DB, cấu hình CI/CD → ghi là Task (con của Story) hoặc Technical Enabler.
- **Ràng buộc pháp lý / NFR chung:** Quy định bảo vệ dữ liệu → thường gắn vào DoD hoặc Acceptance Criteria.
`,
    examples: [
      {
        title: 'Tách Story và Task',
        bad: 'User Story: "Là Developer, tôi muốn tạo bảng bookings trong PostgreSQL để lưu lịch hẹn."',
        badReason: 'Đây là Task kỹ thuật đội lốt User Story — người dùng cuối không quan tâm bảng DB.',
        good: 'User Story: "Là bệnh nhân, tôi muốn xem lại lịch khám đã đặt để không quên giờ." → Sub-tasks: Tạo bảng bookings, Viết API GET /bookings, Dựng màn hình Lịch của tôi.',
        goodReason: 'Story mang giá trị cho người dùng; các công việc kỹ thuật nằm ở tầng Task bên dưới.',
      },
    ],
    commonMistakes: [
      'Viết "Là Developer, tôi muốn…" cho các công việc tạo DB, refactor code.',
      'Biến 1 trang Use Case cũ thành 1 User Story khổng lồ không thể xong trong 1 sprint.',
    ],
    glossaryTerms: ['User Story', 'Task / Sub-task'],
    checks: [
      {
        id: 'c1-3-1',
        type: 'single',
        prompt: 'Mục nào sau đây là một Task kỹ thuật thay vì User Story?',
        options: [
          'Bệnh nhân lọc bác sĩ theo chuyên khoa',
          'Bệnh nhân nhận SMS nhắc lịch trước 24 giờ',
          'Cấu hình Redis cache cho endpoint danh sách bác sĩ',
          'Lễ tân xác nhận bệnh nhân đã đến khám bằng mã QR',
        ],
        answer: 2,
        explain: 'Cấu hình Redis cache là đầu việc kỹ thuật nội bộ, không tự thân mô tả giá trị trực tiếp cho người dùng cuối.',
        skill: 'writing',
      },
    ],
  },
  {
    id: 'm1-4',
    moduleId: 'm1',
    code: '1.4',
    title: 'Phân cấp công việc: Theme → Epic → Feature → Story → Task',
    minutes: 6,
    bookRef: 'Chương 1 — Story Hierarchy',
    body: `## Nhìn sản phẩm từ trên cao xuống chi tiết

Để vừa giữ được tầm nhìn chiến lược vừa giao việc gọn nhẹ trong sprint, Agile thường tổ chức backlog theo cây phân cấp:

\`\`\`mermaid
flowchart TD
    T["Theme: Trải nghiệm đặt khám không chờ đợi"] --> E1["Epic: Đặt lịch trực tuyến"]
    T --> E2["Epic: Thanh toán không tiền mặt"]
    E1 --> S1["Story: Tìm bác sĩ theo chuyên khoa"]
    E1 --> S2["Story: Chọn khung giờ trống"]
    S2 --> TK1["Task: API lấy slot trống"]
    S2 --> TK2["Task: Giao diện lịch chọn giờ"]
\`\`\`

- **Theme (Chủ đề chiến lược):** Mục tiêu kinh doanh kéo dài nhiều quý (ví dụ: *Giảm 50% thời gian chờ tại phòng khám*).
- **Epic:** Khối tính năng lớn, kéo dài nhiều sprint, cần chia nhỏ trước khi làm.
- **Feature** *(tùy tổ chức)*: Nhóm các story liên quan trong một bản phát hành.
- **User Story:** Đơn vị giá trị nhỏ, hoàn thành trọn vẹn trong **1 sprint**.
- **Task / Sub-task:** Đầu việc kỹ thuật (vài giờ đến 1–2 ngày) để thực hiện Story.
`,
    commonMistakes: [
      'Đưa thẳng một Epic vào Sprint Planning mà chưa chia thành các Story nhỏ.',
      'Tạo quá nhiều tầng phân cấp rườm rà cho một team nhỏ 5 người.',
    ],
    glossaryTerms: ['Epic', 'User Story', 'Task / Sub-task'],
    checks: [
      {
        id: 'c1-4-1',
        type: 'order',
        prompt: 'Sắp xếp cấp bậc công việc từ LỚN NHẤT (chiến lược) đến NHỎ NHẤT (thực thi):',
        items: ['Theme', 'Epic', 'User Story', 'Task'],
        explain: 'Thứ tự chuẩn từ trên xuống dưới là Theme → Epic → User Story → Task.',
        skill: 'backlog',
      },
    ],
  },
  {
    id: 'm1-5',
    moduleId: 'm1',
    code: '1.5',
    title: 'User Story trong Scrum & Kanban',
    minutes: 6,
    bookRef: 'Chương 1 — User Stories in Agile Frameworks',
    body: `## Ai viết và ai sở hữu User Story?

Một hiểu lầm kinh điển là *"Chỉ Product Owner mới được viết User Story"*. Thực tế:
- **Product Owner (PO)** chịu trách nhiệm cuối cùng về **giá trị và thứ tự ưu tiên** của Product Backlog.
- **Cả team (BA, Dev, QA, Designer)** đều có thể cùng đề xuất, viết nháp và góp ý để hoàn thiện story.

## Vòng đời của một User Story trong Scrum

\`\`\`mermaid
flowchart LR
    A["Ý tưởng / Nhu cầu"] --> B["Product Backlog"]
    B --> C["Backlog Refinement<br/>(Làm rõ, chia nhỏ, ước lượng)"]
    C --> D["Sprint Planning<br/>(Chọn vào Sprint)"]
    D --> E["Thực thi & Kiểm thử<br/>(Đạt AC & DoD)"]
    E --> F["Sprint Review<br/>(Demo & nhận phản hồi)"]
\`\`\`

- Trong **Scrum**, story phải đủ nhỏ để hoàn thành trọn vẹn trong 1 Sprint (thường 1–2 tuần).
- Trong **Kanban**, không có sprint cố định; story chảy liên tục qua các cột trạng thái với giới hạn công việc đang làm (**WIP limit**) để tối ưu thời gian hoàn thành (cycle time).
`,
    commonMistakes: [
      'PO tự đóng cửa viết hết 50 story rồi "ném qua tường" cho dev ở Sprint Planning.',
      'Đem story chưa qua Refinement vào Sprint Planning làm cuộc họp kéo dài 4 tiếng.',
    ],
    glossaryTerms: ['Product Backlog', 'Backlog Refinement', 'Definition of Done (DoD)'],
    checks: [
      {
        id: 'c1-5-1',
        type: 'single',
        prompt: 'Phát biểu nào đúng nhất về quyền viết và trách nhiệm với User Story?',
        options: [
          'Chỉ PO được viết, không ai khác được sửa',
          'BA viết xong là hết trách nhiệm',
          'Bất kỳ ai trong team đều có thể cùng viết, nhưng PO chịu trách nhiệm cuối cùng về thứ tự ưu tiên và giá trị',
          'Chỉ Developer mới nên viết vì họ hiểu hệ thống nhất',
        ],
        answer: 2,
        explain: 'User Story là công cụ hợp tác của cả đội, trong khi PO giữ trách nhiệm tối ưu hóa giá trị và sắp xếp Product Backlog.',
        skill: 'backlog',
      },
    ],
  },
  {
    id: 'm1-6',
    moduleId: 'm1',
    code: '1.6',
    title: 'Lợi ích, giới hạn và khi nào cần tài liệu bổ sung',
    minutes: 5,
    bookRef: 'Chương 1 — Benefits & Boundaries',
    body: `## Điểm mạnh của User Story
- **Giữ sự tập trung vào người dùng:** Luôn trả lời câu hỏi *"Tính năng này giúp ai, giải quyết việc gì?"*.
- **Khuyến khích hợp tác:** Tạo ngôn ngữ chung giữa kinh doanh và kỹ thuật.
- **Linh hoạt với thay đổi:** Dễ sắp xếp lại ưu tiên hoặc hủy bỏ mà không tốn công viết lại cả tập tài liệu.
- **Dễ chia nhỏ để giao hàng sớm:** Mang giá trị đến tay người dùng từng phần thay vì chờ cuối dự án.

## Giới hạn cần biết (để không dùng sai chỗ)
User Story **không phải** công cụ thay thế mọi loại tài liệu khác. Bạn vẫn nên kết hợp với:
1. **Sơ đồ kiến trúc & ADR** cho các quyết định kỹ thuật lớn.
2. **Thiết kế UI/UX (Wireframe, Figma)** để mô tả trực quan luồng màn hình.
3. **Tài liệu tuân thủ / pháp lý** ở các ngành đặc thù (y tế, ngân hàng, hàng không).
4. **Quy tắc nghiệp vụ phức tạp** (bảng tính thuế, công thức lãi suất) — nên đính kèm bảng quyết định thay vì viết văn xuôi dài dòng trong story.
`,
    commonMistakes: [
      'Hiểu nhầm "Agile = không cần bất kỳ tài liệu nào".',
      'Cố nhét toàn bộ công thức tính lương 3 trang vào ô mô tả User Story thay vì đính kèm bảng quy tắc.',
    ],
    glossaryTerms: ['User Story'],
    checks: [
      {
        id: 'c1-6-1',
        type: 'multi',
        prompt: 'Chọn TẤT CẢ những tài liệu nên được dùng BỔ SUNG cùng User Story khi cần thiết:',
        options: [
          'Wireframe / nguyên mẫu thiết kế UI',
          'Bảng quy tắc nghiệp vụ phức tạp (ví dụ: bảng tính phí/thuế)',
          'Tài liệu tuân thủ pháp lý cho ngành y tế/ngân hàng',
          'Không cần bất kỳ tài liệu nào khác vì Agile cấm tài liệu',
        ],
        answer: [0, 1, 2],
        explain: 'Agile ưu tiên phần mềm chạy được hơn tài liệu rườm rà, nhưng không cấm tài liệu hữu ích hỗ trợ cho User Story.',
        skill: 'backlog',
      },
    ],
  },
];
