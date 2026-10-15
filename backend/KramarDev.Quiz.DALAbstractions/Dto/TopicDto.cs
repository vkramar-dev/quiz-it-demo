namespace KramarDev.Quiz.DALAbstractions.Dto;

public sealed record TopicDto
{
    public int Id { get; init; }

    public string Name { get; init; }

    public string Description { get; init; }

    public int QuestionCount { get; init; }

    public int DurationInMinutes { get; init; }

    public string ThemeColor { get; init; }
}
