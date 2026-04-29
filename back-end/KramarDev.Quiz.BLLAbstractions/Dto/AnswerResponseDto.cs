
namespace KramarDev.Quiz.BLLAbstractions.Dto;

public sealed record AnswerResponseDto
{
    public QuestionDto NextQuestion { get; init; }

    public TestResultDto TestResult { get; init; }
}

public sealed record TestResultDto
{
    public string TopicName { get; init; }

    public float FinalScore { get; init; }

    public int TotalPoints { get; init; }

    public int EarnedPoints { get; init; }

    public int AnsweredCount { get; init; }

    public AnswerDto[] Answers { get; init; } = [];
}

public sealed record AnswerDto
{
    public string QuestionText { get; init; }

    public string Answer { get; init; }

    public string CorrectAnswer { get; init; }

    public byte Complexity { get; init; }
}
