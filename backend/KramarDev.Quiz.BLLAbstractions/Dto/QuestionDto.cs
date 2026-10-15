namespace KramarDev.Quiz.BLLAbstractions.Dto;

public sealed record QuestionDto
{
    public int Number { get; init; }

    public int TestId { get; init; }

    public int QuestionId { get; init; }

    public int TestQuestionId { get; init; }

    public string Text { get; init; }

    public string Answer1 { get; init; }

    public string Answer2 { get; init; }

    public string Answer3 { get; init; }

    public string Answer4 { get; init; }

    public int SecondsLeft { get; set; }
}
