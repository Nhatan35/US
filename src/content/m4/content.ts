import type { LessonData, QuizData } from '@/types/course';

export const M4_LESSONS: LessonData[] = [
  {
    id: 'm4-1',
    moduleId: 'm4',
    code: '4.1',
    title: 'Ưu tiên hóa với MoSCoW & Mô hình Kano',
    minutes: 7,
    bookRef: 'Chương 4 — Prioritizing User Stories',
    body: `## Khi mọi thứ đều "gấp", không có gì thực sự được ưu tiên

### 1. MoSCoW
- **Must have:** Bắt buộc phải có để sản phẩm vận hành hợp pháp và đạt mục tiêu cốt lõi. **Quy tắc vàng:** nhóm Must nên chiếm **≤ 60%** capacity để có vùng đệm rủi ro.
- **Should have:** Quan trọng, mang lại giá trị lớn nhưng có thể có giải pháp tạm thời.
- **Could have:** Tốt nếu còn thời gian (sẽ cắt đầu tiên khi trễ tiến độ).
- **Won't have (lần này):** Thống nhất rõ là **chưa làm ở bản phát hành này** để tránh tranh cãi lại.

### 2. Mô hình Kano (góc nhìn cảm xúc khách hàng)
- **Basic (Bắt buộc):** Có không làm khách khen, thiếu sẽ bị bỏ rơi (ví dụ: bảo mật OTP, không đặt trùng slot).
- **Performance (Hiệu năng):** Càng tốt càng hài lòng (tốc độ tải, số lượng bác sĩ).
- **Delighter (Gây thích thú):** Bất ngờ tích cực (tự động nhắc uống thuốc, gợi ý khung giờ ít đông).
`,
    checks: [
      {
        id: 'c4-1-1',
        type: 'single',
        prompt: 'Trong mô hình Kano, tính năng "Không cho phép 2 bệnh nhân đặt trùng 1 khung giờ bác sĩ" thuộc nhóm nào?',
        options: ['Delighter', 'Basic (Bắt buộc)', 'Indifferent', 'Reverse'],
        answer: 1,
        explain: 'Đây là kỳ vọng tối thiểu; làm tốt khách coi là hiển nhiên, nhưng làm sai sẽ mất uy tín nghiêm trọng.',
        skill: 'prioritizing',
      },
    ],
  },
  {
    id: 'm4-2',
    moduleId: 'm4',
    code: '4.2',
    title: 'Chấm điểm định lượng: RICE & WSJF',
    minutes: 7,
    bookRef: 'Chương 4 — Quantitative Prioritization',
    body: `## Giảm tranh cãi cảm tính bằng công thức

### RICE (Intercom)
$$\\text{RICE} = \\frac{\\text{Reach} \\times \\text{Impact} \\times \\text{Confidence}}{\\text{Effort}}$$
- **Reach:** Số người dùng bị tác động mỗi tháng/quý.
- **Impact:** Mức độ tác động (0.25 tối thiểu → 3 cực lớn).
- **Confidence:** Độ tự tin vào dữ liệu (50% / 80% / 100%).
- **Effort:** Công sức ước lượng (tuần-người hoặc story point).

### WSJF (Weighted Shortest Job First — SAFe)
$$\\text{WSJF} = \\frac{\\text{Business Value} + \\text{Time Criticality} + \\text{Risk Reduction}}{\\text{Job Size}}$$
WSJF đặc biệt mạnh khi có các hạng mục **nhạy cảm về thời gian hoặc pháp lý** (ví dụ: tuân thủ Nghị định 13 trước hạn).

> Thực hành ngay cả MoSCoW, RICE và WSJF cùng báo cáo mô phỏng hậu quả tại **[Prioritization Simulator](/labs/prioritization)**!
`,
    checks: [
      {
        id: 'c4-2-1',
        type: 'single',
        prompt: 'Tính năng nào sẽ có điểm WSJF cao hơn khi cùng Business Value, Time Criticality và Risk Reduction?',
        options: [
          'Tính năng có Job Size (kích thước) lớn hơn',
          'Tính năng có Job Size (kích thước) nhỏ hơn',
          'Job Size không ảnh hưởng đến WSJF',
          'Chỉ phụ thuộc vào số lượng developer',
        ],
        answer: 1,
        explain: 'WSJF chia Chi phí trì hoãn (Cost of Delay) cho Job Size → ưu tiên việc mang giá trị nhanh với kích thước nhỏ trước.',
        skill: 'prioritizing',
      },
    ],
  },
  {
    id: 'm4-3',
    moduleId: 'm4',
    code: '4.3',
    title: 'Ước lượng tương đối: Story Point & Planning Poker',
    minutes: 7,
    bookRef: 'Chương 4 — Estimating User Stories',
    body: `## Vì sao dùng Story Point thay vì "số giờ"?

Con người ước lượng **tương đối** chính xác hơn ước lượng tuyệt đối rất nhiều (so sánh "tòa nhà B cao gấp đôi tòa A" dễ hơn đoán "cao đúng 47,5 mét").

**Story Point** phản ánh 3 yếu tố:
1. **Khối lượng (Volume)** công việc.
2. **Độ phức tạp (Complexity)** nghiệp vụ & kỹ thuật.
3. **Rủi ro / Không chắc chắn (Uncertainty).**

Dãy **Fibonacci** (1, 2, 3, 5, 8, 13, 21) có khoảng cách giãn rộng dần — phản ánh thực tế là việc càng lớn thì sai số càng cao. Khi cả đội chơi **Planning Poker**, giá trị lớn nhất không phải con số mà là **cuộc thảo luận giữa người giơ thẻ cao nhất và thấp nhất**.

> Luyện chơi cùng 4 đồng đội ảo tại **[Planning Poker Lab](/labs/planning-poker)**!
`,
    glossaryTerms: ['Story Point'],
    checks: [
      {
        id: 'c4-3-1',
        type: 'single',
        prompt: 'Mục đích giá trị nhất của việc lật bài đồng thời trong Planning Poker là gì?',
        options: [
          'Tìm xem ai ước lượng sai để phê bình',
          'Tránh hiệu ứng mỏ neo (bị ảnh hưởng bởi người nói trước) và khơi ra thảo luận về rủi ro bị bỏ sót',
          'Quy đổi chính xác 1 điểm = 4 giờ làm việc',
          'Giảm thời gian họp xuống 2 phút',
        ],
        answer: 1,
        explain: 'Lật bài đồng thời giúp Junior hay QA không bị dẫn dắt bởi Senior, làm lộ ra các giả định và rủi ro ẩn.',
        skill: 'estimating',
      },
    ],
  },
  {
    id: 'm4-4',
    moduleId: 'm4',
    code: '4.4',
    title: 'Velocity & Dự báo Release dạng khoảng',
    minutes: 6,
    bookRef: 'Chương 4 — Velocity & Release Planning',
    body: `## Không bao giờ hứa 1 ngày cứng khi còn bất định

**Velocity** là tổng số Story Point hoàn thành (đạt DoD) trong mỗi sprint. Lưu ý:
- Chỉ tính các story **Done 100%**, không tính story làm dở 80%.
- **Không** dùng Velocity để so sánh hai team khác nhau (vì thang điểm chuẩn của mỗi team là riêng biệt).
- Khi dự báo ngày phát hành, luôn đưa ra **khoảng (range)** dựa trên Velocity thấp nhất – trung bình – cao nhất.

> Thử kéo thanh trượt thêm phạm vi hoặc giảm nhân sự tại **[Velocity Forecaster](/labs/velocity)**!
`,
    glossaryTerms: ['Velocity'],
    checks: [
      {
        id: 'c4-4-1',
        type: 'truefalse',
        prompt: 'Đúng hay Sai: Có thể dùng Velocity để so sánh năng suất giữa Team A (40 điểm/sprint) và Team B (25 điểm/sprint).',
        answer: false,
        explain: 'Sai. Story Point là thang đo tương đối nội bộ của từng team; dùng nó để so sánh giữa các team sẽ dẫn đến thổi phồng điểm.',
        skill: 'estimating',
      },
    ],
  },
];

export const M4_QUIZ: QuizData = {
  id: 'quiz-m4',
  moduleId: 'm4',
  title: 'Kiểm tra Module 4: Ưu tiên và Ước lượng',
  description: 'Đánh giá khả năng dùng MoSCoW, Kano, RICE, WSJF, Story Point và dự báo Velocity. Đạt ≥ 80%.',
  passScore: 80,
  xpReward: 35,
  questions: [
    {
      id: 'qm4-1',
      type: 'single',
      prompt: 'Nhóm "Must have" trong MoSCoW nên chiếm tối đa khoảng bao nhiêu % năng lực để giữ an toàn tiến độ?',
      options: ['100%', '60%', '10%', '95%'],
      answer: 1,
      explain: 'Khoảng ≤ 60% capacity cho Must have tạo vùng đệm khi có rủi ro kỹ thuật hoặc yêu cầu phát sinh.',
      skill: 'prioritizing',
    },
    {
      id: 'qm4-2',
      type: 'match',
      prompt: 'Ghép mỗi framework với tình huống phù hợp nhất:',
      pairs: [
        ['MoSCoW', 'Thống nhất nhanh phạm vi bắt buộc vs có thể cắt với stakeholder'],
        ['RICE', 'So sánh tính năng tiêu dùng dựa trên lượng người dùng tiếp cận (Reach)'],
        ['WSJF', 'Ưu tiên công việc có chi phí trì hoãn / hạn pháp lý cao và kích thước nhỏ'],
        ['Kano', 'Phân loại tính năng theo mức độ hài lòng cảm xúc của khách hàng'],
      ],
      explain: 'Không có 1 framework duy nhất cho mọi bài toán; cần chọn công cụ khớp bối cảnh.',
      skill: 'prioritizing',
    },
    {
      id: 'qm4-3',
      type: 'truefalse',
      prompt: 'Đúng hay Sai: Một story ước lượng 8 điểm làm xong 90% ở cuối sprint được cộng 7 điểm vào Velocity của sprint đó.',
      answer: false,
      explain: 'Sai. Velocity chỉ tính các story đạt 100% Definition of Done; story chưa xong được chuyển sang sprint sau.',
      skill: 'estimating',
    },
    {
      id: 'qm4-4',
      type: 'single',
      prompt: 'Backlog còn 120 điểm, Velocity 3 sprint gần nhất là 24, 30, 36. Dự báo khoảng hoàn thành hợp lý nhất là:',
      options: [
        'Chắc chắn đúng 3 sprint',
        'Từ 4 đến 5 sprint (dựa trên tốc độ 24–36 điểm/sprint)',
        'Đúng 10 sprint',
        'Không thể dự báo được gì cả',
      ],
      answer: 1,
      explain: '120 / 36 ≈ 3.3 (4 sprint lạc quan) và 120 / 24 = 5 sprint (bi quan) → dự báo khoảng 4–5 sprint.',
      skill: 'estimating',
    },
  ],
};
