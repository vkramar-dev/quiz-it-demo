import { QuestionDto } from "./QuestionDto";

export interface TestDto {
    testId: number;
    topicName: string;
    secondsLeft: number;
    questionCount: number;
    question: QuestionDto;
    topicColor: string;
}