import { TestDto } from "../dto/TestDto";
import { CurrentTest } from "../models/CurrentTest";

export function mapCurrentTest(dto: TestDto): CurrentTest {
    return {
        questionText: dto.question.text,
        questionAnswer1: dto.question.answer1,
        questionAnswer2: dto.question.answer2,
        questionAnswer3: dto.question.answer3,
        questionAnswer4: dto.question.answer4,
        testId: dto.testId,
        testName: dto.topicName,
        number: dto.question.number,
        questionId: dto.question.questionId,
        testQuestionId: dto.question.testQuestionId,
        secondsLeft: dto.secondsLeft,
        totalQuestions: dto.questionCount,
        testColor: dto.topicColor,
    } as CurrentTest
}