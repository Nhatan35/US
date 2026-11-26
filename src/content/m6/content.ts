import type { LessonData, QuizData } from '@/types/course';

export const M6_LESSONS: LessonData[] = [
  {
    id: 'm6-1',
    moduleId: 'm6',
    code: '6.1',
    title: 'Backlog Refinement & Mô hình DEEP',
    minutes: 6,
    bookRef: 'Chương 6 — User Story Refinement',
    body: `## Giữ Product Backlog luôn "khỏe mạnh"

**Backlog Refinement** nên chiếm khoảng **5–10% năng lực của sprint** (ví dụ 1 tiếng mỗi tuần) để đảm bảo luôn có ít nhất **1–2 sprint story ở trạng thái Ready** trước Sprint Planning.

### 4 đặc tính của Backlog DEEP (Roman Pichler)
- **D — Detailed appropriately:** Chi tiết ở đỉnh backlog (sắp làm), thô ở đáy (tương lai xa) — như một tảng băng trôi.
- **E — Estimated:** Các mục gần đỉnh đã được ước lượng.
- **E — Emergent:** Liên tục tiến hóa khi học thêm từ người dùng (thêm mới, sửa, xóa).
- **P — Prioritized:** Luôn sắp xếp theo giá trị giảm dần.
`,
    glossaryTerms: ['Backlog Refinement', 'Product Backlog'],
    checks: [
      {
        id: 'c6-1-1',
        type: 'single',
        prompt: 'Chữ "D" (Detailed appropriately) trong DEEP khuyên chúng ta điều gì?',
        options: [
          'Viết chi tiết AC cho tất cả 300 story ngay từ đầu dự án',
          'Chỉ viết chi tiết cho các story nằm gần đỉnh backlog sắp làm; story ở xa giữ ở mức thô',
          'Không bao giờ viết chi tiết cho bất kỳ story nào',
          'Xóa hết story cũ hơn 1 tuần',
        ],
        answer: 1,
        explain: 'Viết chi tiết quá sớm cho story 6 tháng sau nữa mới làm sẽ gây lãng phí lớn khi sản phẩm thay đổi.',
        skill: 'backlog',
      },
    ],
  },
  {
    id: 'm6-2',
    moduleId: 'm6',
    code: '6.2',
    title: 'Buổi Three Amigos: Business – Dev – QA cùng soi Story',
    minutes: 6,
    bookRef: 'Chương 6 — Collaborative Refinement',
    body: `## Ba góc nhìn chặn lỗi trước khi viết 1 dòng code

Trước khi story vào Sprint, **Three Amigos** (PO/BA + Developer + QA) ngồi cùng nhau 15–30 phút để kiểm tra chéo:
- **PO / BA hỏi:** *"Giá trị cốt lõi là gì? Có thể cắt bớt phạm vi nào mà vẫn đạt mục tiêu?"*
- **Developer hỏi:** *"Có phụ thuộc hệ thống ngoài (HIS, cổng thanh toán) hay rủi ro hiệu năng nào không?"*
- **QA hỏi:** *"Điều gì xảy ra nếu dữ liệu rỗng, nhập sai, hai người thao tác cùng lúc hoặc mất mạng?"*

Chi phí sửa 1 hiểu nhầm trong buổi Three Amigos chỉ mất **5 phút nói chuyện**, rẻ hơn hàng chục lần so với sửa bug sau khi đã code xong!
`,
    checks: [
      {
        id: 'c6-2-1',
        type: 'single',
        prompt: 'Ba vai trò cốt lõi trong kỹ thuật "Three Amigos" là gì?',
        options: [
          'CEO – CTO – CFO',
          'Business (PO/BA) – Development (Dev) – Testing (QA)',
          '3 lập trình viên Senior',
          'Marketing – Sales – CSKH',
        ],
        answer: 1,
        explain: 'Kết hợp góc nhìn giá trị (Business), khả thi kỹ thuật (Dev) và trường hợp biên/kiểm thử (QA).',
        skill: 'backlog',
      },
    ],
  },
  {
    id: 'm6-3',
    moduleId: 'm6',
    code: '6.3',
    title: 'Đo chất lượng Story & Cải tiến qua Retrospective',
    minutes: 6,
    bookRef: 'Chương 6 — Continuous Improvement',
    body: `## Những dấu hiệu cảnh báo chất lượng User Story đang có vấn đề

Theo dõi 4 chỉ số sau ở mỗi Sprint Retrospective:
1. **Tỉ lệ Carry-over cao:** Story không xong trong sprint → thường do story quá lớn (vi phạm Small) hoặc ẩn rủi ro.
2. **Story phình to giữa sprint (Scope creep):** Đang code mới phát hiện thêm 5 quy tắc ẩn → thiếu Conversation / Three Amigos.
3. **Tỉ lệ bị QA / PO trả lại cao:** Hiểu sai kỳ vọng → AC quá mơ hồ hoặc thiếu ví dụ cụ thể.
4. **Nhiều câu hỏi hỏi đi hỏi lại trên Slack/Jira:** Thiếu DoR trước khi kéo vào sprint.
`,
    checks: [
      {
        id: 'c6-3-1',
        type: 'single',
        prompt: 'Nếu 3 sprint liên tiếp team bị 40% story không kịp xong (carry-over), nguyên nhân gốc hay gặp nhất liên quan đến User Story là gì?',
        options: [
          'Story quá lớn chưa chia nhỏ và/hoặc thiếu làm rõ AC trước sprint',
          'Team dùng sai màu thẻ trên Jira',
          'Tiêu đề story quá ngắn',
          'Do dùng quá nhiều Persona',
        ],
        answer: 0,
        explain: 'Story lớn + chưa qua refinement kỹ là nguyên nhân hàng đầu gây carry-over.',
        skill: 'backlog',
      },
    ],
  },
  {
    id: 'm6-4',
    moduleId: 'm6',
    code: '6.4',
    title: 'Nhận diện các Anti-pattern phổ biến & Vệ sinh Backlog',
    minutes: 7,
    bookRef: 'Chương 6 — Story Anti-Patterns',
    body: `## 8 Anti-pattern hay gặp nhất ngoài thực tế

1. **Story kỹ thuật trá hình:** *"Là Developer, tôi muốn nâng cấp thư viện..."*
2. **Backlog nghĩa địa:** 300+ item cũ từ 2 năm trước không ai dám xóa → áp dụng quy tắc **"6 tháng không đụng → lưu trữ hoặc xóa"**.
3. **PO viết một mình:** Không có buổi trao đổi, dev đọc ticket tự suy diễn.
4. **Story khổng lồ (Epic đội lốt Story):** 1 story ôm nguyên 1 module.
5. **AC dài như kịch bản test 50 bước click chuột.**
6. **Chữ "v.v." / "etc." trong AC:** Mở đường cho vô hạn phạm vi ẩn.
7. **Gold-plating:** Tự thêm tính năng ngoài yêu cầu mà người dùng không cần.
8. **Không bao giờ đóng story:** Kéo lê qua 4 sprint vì AC liên tục thay đổi.
`,
    checks: [
      {
        id: 'c6-4-1',
        type: 'multi',
        prompt: 'Chọn TẤT CẢ các dấu hiệu là Anti-pattern trong Product Backlog:',
        options: [
          'AC kết thúc bằng "...và các trường hợp tương tự, v.v."',
          'Giữ 400 ticket cũ từ 3 năm trước chưa từng xem lại',
          'Tổ chức họp Three Amigos trước sprint',
          'PO tự viết story rồi giao thẳng không trao đổi với Dev/QA',
        ],
        answer: [0, 1, 3],
        explain: 'Ba mục 1, 2, 4 đều là anti-pattern kinh điển gây mơ hồ và phình backlog.',
        skill: 'backlog',
      },
    ],
  },
];

export const M6_QUIZ: QuizData = {
  id: 'quiz-m6',
  moduleId: 'm6',
  title: 'Kiểm tra Module 6: Refinement & Cải tiến liên tục',
  description: 'Đánh giá kiến thức về DEEP, Three Amigos, chỉ số chất lượng story và nhận diện anti-pattern.',
  passScore: 80,
  xpReward: 35,
  questions: [
    {
      id: 'qm6-1',
      type: 'single',
      prompt: 'Hoạt động Backlog Refinement nên chiếm khoảng bao nhiêu % tổng thời gian của một sprint?',
      options: ['0% (chỉ họp ở Sprint Planning)', '5% – 10%', '50%', '80%'],
      answer: 1,
      explain: 'Khoảng 5–10% capacity là mức cân bằng giúp backlog luôn sẵn sàng mà không làm gián đoạn quá nhiều việc phát triển.',
      skill: 'backlog',
    },
    {
      id: 'qm6-2',
      type: 'truefalse',
      prompt: 'Đúng hay Sai: Xóa hoặc lưu trữ các story đã nằm im hơn 6–12 tháng không được ưu tiên là một thói quen vệ sinh backlog tốt.',
      answer: true,
      explain: 'Đúng. Nếu ý tưởng đó thực sự quan trọng, nó sẽ tự quay lại khi cần; giữ hàng trăm item chết làm chậm việc tìm kiếm và ưu tiên.',
      skill: 'backlog',
    },
    {
      id: 'qm6-3',
      type: 'highlight',
      prompt: 'Bấm chọn các dấu hiệu Anti-pattern trong mô tả AC sau:',
      segments: [
        { text: 'Hệ thống hỗ trợ xuất báo cáo định dạng PDF, Excel ' },
        { text: 'v.v.', isTarget: true },
        { text: ' và tự động ' },
        { text: 'gắn thêm hiệu ứng pháo hoa khi tải xong dù khách không yêu cầu', isTarget: true },
        { text: '.' },
      ],
      explain: '"v.v." gây mơ hồ phạm vi; thêm tính năng thừa không được yêu cầu là anti-pattern Gold-plating.',
      skill: 'backlog',
    },
  ],
};
