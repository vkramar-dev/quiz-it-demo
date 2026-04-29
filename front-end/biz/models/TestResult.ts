import { Answer } from "./Answer";

export interface TestResult {
    topicName: string;
    finalScore: number;
    totalPoints: number;
    earnedPoints: number;
    answeredCount: number;
    answers: Answer[];
}