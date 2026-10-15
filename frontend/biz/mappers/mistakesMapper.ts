import { MistakeDto } from "../dto/MistakeDto";
import { Mistake } from "../models/Mistake";

export function mapMistakes(mistakes: MistakeDto[]): Mistake[] {
    return mistakes.map((dto) => {
        const totalCount = dto.wrongAnswerCount + dto.correctAnswerCount;

        return {
            questionText: dto.questionText,
            topicName: dto.topicName,
            wrongAnswerCount: dto.wrongAnswerCount,
            correctAnswerCount: dto.correctAnswerCount,
            totalCount,
            wrongPercentage: totalCount > 0 ? (dto.wrongAnswerCount / totalCount) * 100 : 0,
        };
    });
}