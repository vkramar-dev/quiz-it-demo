namespace KramarDev.Quiz.DALAbstractions.Dto;

public sealed record MistakeDto
{
    public string QuestionText { get; init; }

    public string TopicName { get; init; }

    public int TotalAnswers { get; init; }

    public int WrongAnswerCount { get; init; }

    public int CorrectAnswerCount { get; init; }
}
