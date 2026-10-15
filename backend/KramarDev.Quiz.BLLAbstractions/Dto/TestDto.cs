
namespace KramarDev.Quiz.BLLAbstractions.Dto;

public sealed record TestDto
{
    public int TestId { get; init; }

    public int QuestionCount { get; init; }

    public int SecondsLeft { get; init; }

    public string TopicName { get; init; }

    public string TopicColor { get; init; }

    public QuestionDto Question { get; init; }
}
