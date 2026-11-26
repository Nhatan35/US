import { describe, expect, it } from 'vitest';
import { gradeQuiz, isQuestionCorrect } from './scoring';
import { M1_QUIZ } from '@/content/m1/quiz';

describe('Quiz scoring engine (6 question types)', () => {
  it('grades single, truefalse, multi, order, match, and highlight accurately', () => {
    const perfectAnswers = {
      'qm1-1': 1,
      'qm1-2': false,
      'qm1-3': [2, 0], // unordered should still pass
      'qm1-4': [
        'Đưa ý tưởng vào Product Backlog',
        'Làm rõ, chia nhỏ và ước lượng trong Backlog Refinement',
        'Chọn story đã Ready vào Sprint Planning',
        'Phát triển, kiểm thử đạt AC & DoD',
        'Demo và thu thập phản hồi ở Sprint Review',
      ],
      'qm1-5': {
        Card: 'Ghi chú ngắn gọn làm lời nhắc cho chủ đề cần làm',
        Conversation: 'Trao đổi giữa PO, Dev, QA để thống nhất chi tiết',
        Confirmation: 'Tiêu chí chấp nhận giúp kiểm chứng khi nào story xong',
        Epic: 'Khối công việc lớn cần chia nhỏ thành nhiều story',
      },
      'qm1-6': [1, 3, 5],
    };

    const report = gradeQuiz(M1_QUIZ.questions, perfectAnswers);
    expect(report.correctCount).toBe(6);
    expect(report.scorePercent).toBe(100);
    expect(report.skillDeltas.writing).toBeGreaterThan(0);
  });

  it('rejects partial multi-choice and wrong highlight selections', () => {
    const multiQ = M1_QUIZ.questions.find((q) => q.type === 'multi')!;
    const highlightQ = M1_QUIZ.questions.find((q) => q.type === 'highlight')!;

    expect(isQuestionCorrect(multiQ, [0])).toBe(false);
    expect(isQuestionCorrect(highlightQ, [1, 3])).toBe(false);
    expect(isQuestionCorrect(highlightQ, [0, 1, 3, 5])).toBe(false);
  });
});
