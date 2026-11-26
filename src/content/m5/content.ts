import type { LessonData, QuizData } from '@/types/course';

export const M5_LESSONS: LessonData[] = [
  {
    id: 'm5-1',
    moduleId: 'm5',
    code: '5.1',
    title: 'Xác định Stakeholder & Ma trận Power/Interest',
    minutes: 6,
    bookRef: 'Chương 5 — Working with Stakeholders',
    body: `## Không phải mọi Stakeholder đều cần giao tiếp theo cùng một cách

**Ma trận Power (Quyền lực) × Interest (Mức quan tâm)** chia stakeholder thành 4 nhóm:
1. **Quyền lực cao – Quan tâm cao (Manage Closely):** CEO, chủ sản phẩm, trưởng vận hành → mời vào workshop, cập nhật sát sao.
2. **Quyền lực cao – Quan tâm thấp (Keep Satisfied):** Pháp chế, giám đốc tài chính → báo cáo tóm tắt ngắn gọn các điểm rủi ro/chi phí.
3. **Quyền lực thấp – Quan tâm cao (Keep Informed):** Lễ tân, nhân viên CSKH → khai thác nỗi đau thực tế hằng ngày, thông báo lịch ra mắt.
4. **Quyền lực thấp – Quan tâm thấp (Monitor):** Cập nhật định kỳ qua bản tin chung.
`,
    glossaryTerms: ['Stakeholder'],
    checks: [
      {
        id: 'c5-1-1',
        type: 'single',
        prompt: 'Bộ phận Pháp chế có quyền chặn phát hành sản phẩm nếu vi phạm dữ liệu cá nhân, nhưng không theo dõi sprint hằng ngày. Họ thuộc ô nào?',
        options: [
          'Manage Closely',
          'Keep Satisfied (Quyền lực cao – Quan tâm thấp)',
          'Keep Informed',
          'Monitor',
        ],
        answer: 1,
        explain: 'Cần giữ họ hài lòng bằng cách tham vấn sớm các quy định bắt buộc và báo cáo ngắn gọn khi đến mốc tuân thủ.',
        skill: 'stakeholder',
      },
    ],
  },
  {
    id: 'm5-2',
    moduleId: 'm5',
    code: '5.2',
    title: 'Khai thác yêu cầu & Kỹ thuật 5 Whys tách Nhu cầu khỏi Giải pháp',
    minutes: 7,
    bookRef: 'Chương 5 — Elicitation Techniques',
    body: `## Stakeholder hay mang "Giải pháp" đến — việc của bạn là tìm "Nhu cầu"

Khi trưởng phòng kinh doanh nói *"Thêm cho anh nút xuất Excel"*, đừng vội ghi ngay thành story. Hãy dùng câu hỏi mở và **5 Whys**:
- *"Anh định dùng file Excel đó để làm việc gì ạ?"* → Tổng hợp doanh số tuần gửi sếp.
- *"Hiện tại mỗi tuần anh mất bao lâu cho việc này?"* → Gần 2 tiếng và hay sai công thức.
- *"Nếu hệ thống gửi báo cáo doanh số tự động mỗi sáng thứ Hai thì sao?"* → Quá tuyệt vời!

### Tránh 2 lỗi đặt câu hỏi
- ❌ **Câu hỏi dẫn dắt:** *"Anh có muốn thêm nút lọc màu xanh này không?"*
- ❌ **Hỏi quá nhiều câu Đóng (Có/Không):** Không khai thác được bối cảnh.
`,
    checks: [
      {
        id: 'c5-2-1',
        type: 'single',
        prompt: 'Câu hỏi nào sau đây là câu hỏi MỞ tốt nhất để khai thác nhu cầu thực sự?',
        options: [
          'Anh có cần nút xuất Excel không?',
          'Anh có đồng ý giao diện này đẹp không?',
          'Hiện tại bước nào trong quy trình lập báo cáo tuần đang tốn thời gian nhất của anh?',
          'Anh muốn cột này nằm bên trái hay bên phải?',
        ],
        answer: 2,
        explain: 'Câu hỏi mở khơi gợi nỗi đau thực tế thay vì ép stakeholder trả lời Có/Không hoặc chọn giải pháp UI.',
        skill: 'stakeholder',
      },
    ],
  },
  {
    id: 'm5-3',
    moduleId: 'm5',
    code: '5.3',
    title: 'Quản lý kỳ vọng, Nói "Chưa phải lúc" & Đàm phán Trade-off',
    minutes: 6,
    bookRef: 'Chương 5 — Managing Expectations',
    body: `## Nghệ thuật nói "Không" mà vẫn giữ niềm tin

Nói *"Không làm được đâu"* làm đối phương phòng thủ. Thay vào đó, hãy dùng công thức **Thừa nhận → Dữ liệu → Phương án Trade-off**:
1. **Thừa nhận mục tiêu:** *"Em hiểu chiến dịch khuyến mãi tháng tới rất quan trọng với doanh số."*
2. **Đưa dữ liệu năng lực:** *"Sprint này team đã kín 30/30 điểm cho luồng đặt lịch MVP."*
3. **Đề xuất lựa chọn:** *"Nếu đưa khuyến mãi lên ngay bây giờ, anh chọn tạm hoãn tính năng Check-in QR hay dời ngày ra mắt thêm 2 tuần ạ?"*

Bằng cách này, stakeholder thấy sự minh bạch và cùng chịu trách nhiệm ra quyết định ưu tiên.
`,
    checks: [
      {
        id: 'c5-3-1',
        type: 'single',
        prompt: 'Cách phản hồi chuyên nghiệp nhất khi CEO muốn nhét thêm 1 tính năng lớn vào giữa sprint đang chạy là gì?',
        options: [
          'Nhận luôn và ép team làm thêm giờ cả cuối tuần',
          'Từ chối gay gắt và đóng cửa họp',
          'Thừa nhận giá trị ý tưởng, trình bày tác động lên mục tiêu sprint hiện tại và đề xuất đưa lên đầu sprint kế tiếp (hoặc đổi chỗ 1 story tương đương)',
          'Âm thầm nhận nhưng không làm',
        ],
        answer: 2,
        explain: 'Minh bạch về trade-off (phạm vi – thời gian – chất lượng) giúp bảo vệ team mà vẫn đồng hành cùng mục tiêu kinh doanh.',
        skill: 'stakeholder',
      },
    ],
  },
  {
    id: 'm5-4',
    moduleId: 'm5',
    code: '5.4',
    title: 'Xử lý xung đột giữa các Stakeholder & Sprint Review hiệu quả',
    minutes: 5,
    bookRef: 'Chương 5 — Conflict Resolution & Feedback',
    body: `## Khi Giám đốc Kinh doanh và Trưởng IT bất đồng

Nguyên tắc hòa giải:
1. **Quay về mục tiêu sản phẩm chung** (ví dụ: giảm thời gian chờ 50% & ra mắt an toàn đúng pháp luật).
2. **Tách con người khỏi vấn đề:** Dùng dữ liệu rủi ro, RICE/WSJF thay vì "ai to tiếng hơn".
3. **Tìm lát cắt kết hợp:** Ví dụ chia đôi năng lực sprint — 60% cho tính năng kinh doanh cốt lõi, 40% cho nâng cấp bảo mật nền tảng.
4. **Dùng Sprint Review để demo phần mềm chạy thật**, thu thập phản hồi sớm và chuyển hóa thành story mới vào backlog.
`,
    checks: [
      {
        id: 'c5-4-1',
        type: 'truefalse',
        prompt: 'Đúng hay Sai: Khi 2 stakeholder tranh cãi thứ tự ưu tiên, cách tốt nhất là đưa cuộc thảo luận quay về mục tiêu sản phẩm chung và dữ liệu khách quan.',
        answer: true,
        explain: 'Đúng. Mục tiêu chung và dữ liệu (RICE/WSJF, rủi ro, số liệu người dùng) giúp hạ nhiệt mâu thuẫn cá nhân.',
        skill: 'stakeholder',
      },
    ],
  },
];

export const M5_QUIZ: QuizData = {
  id: 'quiz-m5',
  moduleId: 'm5',
  title: 'Kiểm tra Module 5: Làm việc với Stakeholder',
  description: 'Đánh giá kỹ năng lập bản đồ stakeholder, đặt câu hỏi 5 Whys, đàm phán trade-off và hòa giải xung đột.',
  passScore: 80,
  xpReward: 35,
  questions: [
    {
      id: 'qm5-1',
      type: 'single',
      prompt: 'Stakeholder nói "Làm cho chị 1 màn hình có 12 bộ lọc giống phần mềm cũ". Bước tiếp theo tốt nhất là:',
      options: [
        'Copy y nguyên 12 bộ lọc vào User Story',
        'Hỏi sâu xem hằng ngày chị dùng những bộ lọc nào nhiều nhất và để ra quyết định gì',
        'Báo dev tự thiết kế lại theo ý dev',
        'Từ chối vì phần mềm cũ lỗi thời',
      ],
      answer: 1,
      explain: 'Tìm nhu cầu thật giúp bỏ đi các bộ lọc thừa và thiết kế trải nghiệm gọn hơn.',
      skill: 'stakeholder',
    },
    {
      id: 'qm5-2',
      type: 'order',
      prompt: 'Sắp xếp 3 bước trong công thức đàm phán nói "chưa phải lúc" hiệu quả:',
      items: [
        'Thừa nhận mục tiêu và giá trị yêu cầu của stakeholder',
        'Trình bày dữ liệu năng lực (capacity) và phạm vi đang cam kết',
        'Đề xuất 2 phương án trade-off để stakeholder cùng chọn',
      ],
      explain: 'Thừa nhận → Dữ liệu → Phương án Trade-off tạo tinh thần hợp tác thay vì đối đầu.',
      skill: 'stakeholder',
    },
    {
      id: 'qm5-3',
      type: 'truefalse',
      prompt: 'Đúng hay Sai: Nhóm Stakeholder "Quyền lực thấp – Quan tâm cao" (như nhân viên lễ tân) không cần phỏng vấn vì họ không có quyền quyết định ngân sách.',
      answer: false,
      explain: 'Sai. Họ là người vận hành trực tiếp hằng ngày, nắm rõ nhất các nỗi đau và trường hợp ngoại lệ thực tế.',
      skill: 'stakeholder',
    },
  ],
};
