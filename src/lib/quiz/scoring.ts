import type { QuizQuestion, SkillKey } from '@/types/course';

export type QuestionAnswer =
  | number // single
  | number[] // multi, highlight (selected segment indices)
  | boolean // truefalse
  | string[] // order (ordered item strings)
  | Record<string, string>; // match (left -> right)

export function isQuestionCorrect(question: QuizQuestion, answer: QuestionAnswer | undefined): boolean {
  if (answer === undefined) return false;

  switch (question.type) {
    case 'single':
      return answer === question.answer;

    case 'truefalse':
      return answer === question.answer;

    case 'multi': {
      if (!Array.isArray(answer)) return false;
      const expected = [...question.answer].sort((a, b) => a - b);
      const actual = [...(answer as number[])].sort((a, b) => a - b);
      return expected.length === actual.length && expected.every((v, i) => v === actual[i]);
    }

    case 'order': {
      if (!Array.isArray(answer)) return false;
      const actual = answer as string[];
      return (
        actual.length === question.items.length &&
        question.items.every((item, idx) => actual[idx] === item)
      );
    }

    case 'match': {
      if (typeof answer !== 'object' || Array.isArray(answer) || answer === null) return false;
      const map = answer as Record<string, string>;
      return question.pairs.every(([left, right]) => map[left] === right);
    }

    case 'highlight': {
      if (!Array.isArray(answer)) return false;
      const expected = question.segments
        .map((seg, idx) => (seg.isTarget ? idx : -1))
        .filter((idx) => idx >= 0);
      const actual = [...(answer as number[])].sort((a, b) => a - b);
      return expected.length === actual.length && expected.every((v, i) => v === actual[i]);
    }
  }
}

export interface QuizGradeReport {
  correctCount: number;
  totalCount: number;
  scorePercent: number;
  results: Record<string, boolean>;
  skillDeltas: Partial<Record<SkillKey, number>>;
}

export function gradeQuiz(
  questions: QuizQuestion[],
  answers: Record<string, QuestionAnswer>,
): QuizGradeReport {
  const results: Record<string, boolean> = {};
  const skillHits: Partial<Record<SkillKey, number>> = {};
  let correctCount = 0;

  for (const q of questions) {
    const ok = isQuestionCorrect(q, answers[q.id]);
    results[q.id] = ok;
    if (ok) {
      correctCount += 1;
      skillHits[q.skill] = (skillHits[q.skill] ?? 0) + 3;
    }
  }

  const totalCount = questions.length;
  const scorePercent = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);

  return {
    correctCount,
    totalCount,
    scorePercent,
    results,
    skillDeltas: skillHits,
  };
}
