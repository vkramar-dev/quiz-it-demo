import { TestResultDto } from "../dto/TestResultDto";
import { TestResult } from "../models/TestResult";
import { mapAnswer } from "./answerMapper";


export function mapTestResult(dto: TestResultDto): TestResult {
    return {
        topicName: dto.topicName,
        finalScore: dto.finalScore,
        answeredCount: dto.answeredCount,
        earnedPoints: dto.earnedPoints,
        totalPoints: dto.totalPoints,
        answers: dto.answers.map(a => mapAnswer(a)),
    };
}