import { MODULES, getModuleById } from './modules';
import { M1_LESSONS } from './m1/lessons';
import { M1_QUIZ } from './m1/quiz';
import { M2_LESSONS } from './m2/lessons';
import { M2_QUIZ } from './m2/quiz';
import { M3_LESSONS } from './m3/lessons';
import { M3_QUIZ } from './m3/quiz';
import { M4_LESSONS, M4_QUIZ } from './m4/content';
import { M5_LESSONS, M5_QUIZ } from './m5/content';
import { M6_LESSONS, M6_QUIZ } from './m6/content';
import { M7_LESSONS, M7_QUIZ } from './m7/content';
import { GLOSSARY } from './glossary';
import type { LessonData, QuizData } from '@/types/course';

export const ALL_LESSONS: LessonData[] = [
  ...M1_LESSONS,
  ...M2_LESSONS,
  ...M3_LESSONS,
  ...M4_LESSONS,
  ...M5_LESSONS,
  ...M6_LESSONS,
  ...M7_LESSONS,
];

export const ALL_QUIZZES: QuizData[] = [
  M1_QUIZ,
  M2_QUIZ,
  M3_QUIZ,
  M4_QUIZ,
  M5_QUIZ,
  M6_QUIZ,
  M7_QUIZ,
];

export function getLessonsByModule(moduleId: string): LessonData[] {
  return ALL_LESSONS.filter((l) => l.moduleId === moduleId);
}

export function getLessonById(lessonId: string): LessonData | undefined {
  return ALL_LESSONS.find((l) => l.id === lessonId);
}

export function getQuizByModule(moduleId: string): QuizData | undefined {
  return ALL_QUIZZES.find((q) => q.moduleId === moduleId);
}

export { MODULES, getModuleById, GLOSSARY };
