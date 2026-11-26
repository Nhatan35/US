export interface TemplateItem {
  id: string;
  title: string;
  category: 'Template' | 'Cheat sheet';
  module: string;
  filename: string;
  summary: string;
  content: string;
}

export const TEMPLATES: TemplateItem[] = [
  {
    id: 'tpl-story-card',
    title: 'User Story Card & Acceptance Criteria',
    category: 'Template',
    module: 'M3',
    filename: 'template-user-story.md',
    summary: 'Mẫu thẻ User Story chuẩn Connextra kèm AC checklist, Gherkin và mục kiểm tra DoR.',
    content: `# [US-001] Tiêu đề ngắn gọn (Động từ + Đối tượng)

- **Epic:** [Tên Epic]
- **Persona:** [Tên Persona cụ thể]
- **Ưu tiên (MoSCoW):** Must / Should / Could
- **Ước lượng:** [Story Point]

## User Story
Là một **[vai trò cụ thể]**,
tôi muốn **[một mục tiêu duy nhất, không áp đặt UI]**,
để **[giá trị / lợi ích đo lường được]**.

## Acceptance Criteria (Gherkin)
\`\`\`gherkin
Scenario: Trường hợp thành công (Happy path)
  Given [bối cảnh ban đầu]
  When [1 hành động kích hoạt]
  Then [kết quả kiểm thử được]

Scenario: Trường hợp lỗi / biên (Unhappy path)
  Given [điều kiện lỗi hoặc giới hạn]
  When [hành động]
  Then [thông báo lỗi rõ ràng và hành vi an toàn]
\`\`\`

## Kiểm tra Definition of Ready (DoR)
- [ ] Đạt đủ 6 tiêu chí INVEST
- [ ] Đã qua trao đổi Three Amigos (PO/BA – Dev – QA)
- [ ] Có link thiết kế UI (nếu cần) và ước lượng ≤ 8 điểm
`,
  },
  {
    id: 'tpl-persona',
    title: 'Mẫu Persona dựa trên dữ liệu',
    category: 'Template',
    module: 'M2',
    filename: 'template-persona.md',
    summary: 'Khung tạo Persona gọn nhẹ tập trung vào mục tiêu, nỗi đau và bối cảnh sử dụng.',
    content: `# Persona: [Tên gợi nhớ] — [Vai trò chính]

- **Loại Persona:** Primary / Secondary / Negative
- **Nhóm tuổi & Bối cảnh:** [Ví dụ: 32 tuổi, bận rộn, dùng điện thoại 1 tay]
- **Mức thành thạo công nghệ:** Thấp / Trung bình / Cao
- **Câu nói đặc trưng:** *"[Trích dẫn thật từ phỏng vấn]"*

## Mục tiêu (Goals)
1. 
2. 

## Nỗi đau hiện tại (Pain Points)
1. 
2. 

## Kịch bản sử dụng điển hình
- Thiết bị chính:
- Tần suất sử dụng:
- Rào cản lớn nhất:
`,
  },
  {
    id: 'tpl-dor-dod',
    title: 'Checklist Definition of Ready (DoR) & Definition of Done (DoD)',
    category: 'Template',
    module: 'M3, M6',
    filename: 'template-dor-dod.md',
    summary: 'Thỏa thuận sẵn sàng trước sprint và tiêu chuẩn hoàn thành chung của cả đội Scrum.',
    content: `# Thỏa thuận Chất lượng Team

## Definition of Ready (DoR — Trước Sprint Planning)
- [ ] Story rõ Persona và giá trị ("Để làm gì?")
- [ ] Có tối thiểu 2 Acceptance Criteria (gồm ít nhất 1 trường hợp lỗi)
- [ ] Đã được team ước lượng và kích thước ≤ 8 Story Point
- [ ] Không còn phụ thuộc ngoài đang bị chặn (blocker)
- [ ] Đã có wireframe / thiết kế hoặc thống nhất giao diện

## Definition of Done (DoD — Trước khi kéo sang Done)
- [ ] Code đã qua Peer Code Review
- [ ] Unit test & Automated test pass 100% trên CI
- [ ] QA nghiệm thu đạt toàn bộ Acceptance Criteria trên môi trường Staging
- [ ] Không còn bug nghiêm trọng (Blocker / Critical)
- [ ] PO xác nhận nghiệm thu & tài liệu liên quan đã cập nhật
`,
  },
  {
    id: 'tpl-interview',
    title: 'Kịch bản phỏng vấn Stakeholder (5 phần)',
    category: 'Template',
    module: 'M5',
    filename: 'template-stakeholder-interview.md',
    summary: 'Cấu trúc 30–45 phút phỏng vấn khai thác nhu cầu thật, tránh câu hỏi dẫn dắt.',
    content: `# Kịch bản Phỏng vấn Stakeholder

**Stakeholder:** [Tên & Chức danh] · **Thời lượng:** 30–45 phút

## 1. Mở đầu (3 phút)
- Giới thiệu mục tiêu buổi trao đổi: hiểu công việc thực tế để xây sản phẩm hỗ trợ tốt nhất.

## 2. Bối cảnh công việc (10 phút)
- Một ngày/tuần làm việc điển hình của anh/chị với quy trình này diễn ra thế nào?
- Anh/chị đang dùng những công cụ nào để hoàn thành việc đó?

## 3. Khai thác nỗi đau (15 phút)
- Bước nào tốn thời gian hoặc dễ sai sót nhất hiện nay?
- Lần gần nhất sự cố xảy ra, chuyện gì đã diễn ra và anh/chị xử lý tạm thế nào?

## 4. Đào sâu nhu cầu bằng 5 Whys (10 phút)
- Nếu có giải pháp lý tưởng, kết quả nào sẽ cho thấy nó thực sự thành công (đo bằng con số)?
- Điều gì xảy ra nếu chúng ta CHƯA làm tính năng này trong 3 tháng tới?

## 5. Kết thúc & Xác nhận (5 phút)
- Tóm tắt lại 3 điểm chính vừa nghe để xác nhận hiểu đúng.
- Hỏi: "Còn điều gì quan trọng em chưa hỏi tới không ạ?"
`,
  },
  {
    id: 'tpl-refinement',
    title: 'Agenda buổi Backlog Refinement 60 phút',
    category: 'Template',
    module: 'M6',
    filename: 'template-refinement-agenda.md',
    summary: 'Lịch trình mẫu điều phối buổi Refinement hiệu quả không bị lan man.',
    content: `# Agenda Backlog Refinement (60 phút)

- **00–05 phút:** PO nhắc lại mục tiêu Release / Sprint sắp tới.
- **05–20 phút:** Trình bày 2–3 story ưu tiên cao nhất; cả team hỏi làm rõ (Three Amigos).
- **20–40 phút:** Chốt Acceptance Criteria (happy + unhappy path) và chia nhỏ story > 8 điểm theo SPIDR.
- **40–55 phút:** Chơi Planning Poker ước lượng Story Point & ghi nhận phụ thuộc/Spike.
- **55–60 phút:** Chốt các story đạt DoR sẵn sàng cho Sprint Planning.
`,
  },
  {
    id: 'cs-invest-spidr',
    title: 'Cheat sheet: INVEST + SPIDR trên 1 trang',
    category: 'Cheat sheet',
    module: 'M3',
    filename: 'cheatsheet-invest-spidr.md',
    summary: 'Bảng tra nhanh 6 tiêu chí INVEST và 5 mẫu chia nhỏ lát cắt dọc SPIDR.',
    content: `# Cheat Sheet: INVEST & SPIDR

## INVEST — Kiểm tra chất lượng Story
| Chữ | Câu hỏi kiểm tra nhanh |
|---|---|
| **I** Independent | Có thể phát triển & test độc lập không bị kẹt bởi story khác? |
| **N** Negotiable | Tập trung nhu cầu thay vì khóa cứng nút bấm / API? |
| **V** Valuable | Mang giá trị trực tiếp cho một Persona cụ thể? |
| **E** Estimable | Team hiểu đủ rõ để ước lượng (không giơ "?")? |
| **S** Small | Đủ nhỏ để hoàn thành trọn vẹn trong 1 sprint (≤ 8 điểm)? |
| **T** Testable | Có AC cụ thể Pass/Fail rõ ràng, không dùng từ mơ hồ? |

## SPIDR — 5 cách chia nhỏ Epic theo lát cắt dọc
- **S (Spike):** Tách 1–2 ngày điều tra kỹ thuật chưa rõ.
- **P (Paths):** Tách từng nhánh luồng (thẻ ATM trước, ví MoMo sau).
- **I (Interfaces):** Giao diện đơn giản trước, nâng cao sau.
- **D (Data):** Dữ liệu phổ biến trước, loại phức tạp sau.
- **R (Rules):** Quy tắc cốt lõi trước, ngoại lệ/khuyến mãi sau.
`,
  },
  {
    id: 'cs-prioritization',
    title: 'Cheat sheet: Chọn Framework Ưu tiên (MoSCoW / Kano / RICE / WSJF)',
    category: 'Cheat sheet',
    module: 'M4',
    filename: 'cheatsheet-prioritization.md',
    summary: 'Khi nào dùng framework nào và công thức tính nhanh.',
    content: `# Cheat Sheet: Ưu tiên hóa Backlog

- **MoSCoW:** Dùng khi cần chốt phạm vi nhanh với Stakeholder. Giữ **Must ≤ 60%** capacity.
- **Kano:** Dùng khi cần phân loại kỳ vọng cảm xúc (Basic / Performance / Delighter).
- **RICE:** \`(Reach × Impact × Confidence%) / Effort\` — mạnh cho sản phẩm tiêu dùng nhiều người dùng.
- **WSJF:** \`(Business Value + Time Criticality + Risk Reduction) / Job Size\` — mạnh khi có hạn pháp lý, rủi ro cao.
`,
  },
];
