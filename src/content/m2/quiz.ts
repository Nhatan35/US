import type { QuizData } from '@/types/course';

export const M2_QUIZ: QuizData = {
  id: 'quiz-m2',
  moduleId: 'm2',
  title: 'Kiểm tra Module 2: Thấu hiểu góc nhìn người dùng',
  description: 'Kiểm tra kỹ năng xây dựng Persona, Empathy Map, User Journey và Job Story. Đạt ≥ 80% để hoàn thành.',
  passScore: 80,
  xpReward: 30,
  questions: [
    {
      id: 'qm2-1',
      type: 'single',
      prompt: 'Yếu tố nào QUAN TRỌNG NHẤT giúp một Persona thực sự hữu ích khi viết User Story?',
      options: [
        'Ảnh đại diện đẹp và sở thích cá nhân',
        'Mục tiêu, nỗi đau (pain points) và bối cảnh sử dụng dựa trên dữ liệu nghiên cứu thật',
        'Càng nhiều trang mô tả càng tốt',
        'Tên gọi nghe thật kêu',
      ],
      answer: 1,
      explain: 'Mục tiêu, nỗi đau và bối cảnh thực tế trực tiếp dẫn đường cho việc viết story và acceptance criteria.',
      skill: 'empathy',
    },
    {
      id: 'qm2-2',
      type: 'match',
      prompt: 'Ghép mỗi công cụ thấu hiểu người dùng với mục đích chính của nó:',
      pairs: [
        ['Persona', 'Đại diện nhóm người dùng mục tiêu với mục tiêu & nỗi đau'],
        ['Empathy Map', 'Tổng hợp Says / Thinks / Does / Feels của người dùng'],
        ['User Journey Map', 'Theo dõi cảm xúc & điểm nghẽn qua từng giai đoạn hành trình'],
        ['Job Story', 'Nhấn mạnh tình huống kích hoạt (When...) thay vì nhân khẩu học'],
      ],
      explain: 'Mỗi công cụ bổ trợ một góc nhìn khác nhau giúp story bám sát thực tế.',
      skill: 'empathy',
    },
    {
      id: 'qm2-3',
      type: 'truefalse',
      prompt: 'Đúng hay Sai: Người dùng cuối (end-user) và người trả tiền mua phần mềm (buyer) luôn là cùng một người.',
      answer: false,
      explain: 'Sai. Ví dụ trong phần mềm doanh nghiệp/phòng khám, giám đốc là người mua nhưng lễ tân và bệnh nhân mới là người dùng hằng ngày.',
      skill: 'empathy',
    },
    {
      id: 'qm2-4',
      type: 'highlight',
      prompt: 'Bấm chọn cụm từ thiếu tính thấu hiểu người dùng trong câu sau:',
      segments: [
        { text: 'Là ' },
        { text: 'người dùng bất kỳ', isTarget: true },
        { text: ', tôi muốn xem ' },
        { text: 'mọi thông số kỹ thuật của server', isTarget: true },
        { text: ' khi đặt lịch khám.' },
      ],
      explain: 'Vai trò quá chung chung và nội dung không phục vụ mục tiêu của người đặt khám.',
      skill: 'empathy',
    },
  ],
};
