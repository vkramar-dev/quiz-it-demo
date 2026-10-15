export interface Mistake {
  questionText: string;
  topicName: string;
  wrongAnswerCount: number;
  correctAnswerCount: number;
  totalCount: number;
  wrongPercentage: number;
}