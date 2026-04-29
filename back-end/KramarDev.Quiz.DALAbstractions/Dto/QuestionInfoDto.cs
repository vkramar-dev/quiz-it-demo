namespace KramarDev.Quiz.DALAbstractions.Dto;

public sealed record QuestionInfoDto
{
    public byte CorrectAnswerNumber { get; init; }

    public int TopicId { get; init; }
}
