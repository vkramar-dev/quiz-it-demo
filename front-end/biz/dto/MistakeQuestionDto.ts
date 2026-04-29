export interface MistakeQuestionDto {
  topic: string;
  question: string;
  wrongCount: number;
  correctCount: number;
  totalCount: number;
  wrongPercentage: number;
}