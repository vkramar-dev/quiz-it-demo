namespace KramarDev.Quiz.DALAbstractions.Dto;

public sealed record QuestionAnswerDto
{
    public int TestId { get; init; }

    public int QuestionId { get; init; }

    public byte AnswerNumber { get; init; }

    public byte AnswerPoints { get; init; }

    public DateTime AnswerDate { get; init; }
}
