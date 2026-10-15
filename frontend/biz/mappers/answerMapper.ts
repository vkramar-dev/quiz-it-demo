import { AnswerDto } from "../dto/AnswerDto";
import { Answer } from "../models/Answer";

export function mapAnswer(dto: AnswerDto): Answer {
    return {
        answer: dto.answer,
        complexity: dto.complexity,
        correctAnswer: dto.correctAnswer,
        questionText: dto.questionText,
    } as Answer
}