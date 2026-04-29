import { AnswerDto } from "./AnswerDto";

export interface TestResultDto {
    topicName: string;
    finalScore: number;
    totalPoints: number;
    earnedPoints: number;
    answeredCount: number;
    answers: AnswerDto[];
}