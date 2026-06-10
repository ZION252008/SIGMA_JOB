export const QUIZ_QUESTION_COUNT = 5;
export const QUIZ_PASS_THRESHOLD = 4;

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}
