import { QuestionDto } from "./QuestionDto";
import { TestResultDto } from "./TestResultDto";

export interface AnswerResponseDto {
    nextQuestion: QuestionDto;
    testResult: TestResultDto;
}