namespace KramarDev.Quiz.DALAbstractions.Dto;

public sealed record ProfileDto
{
    public ProfileSummaryDto Summary { get; init; }

    public PerformanceByTopicDto[] Topics { get; init; } = [];

    public AttemptDto[] Attempts { get; init; } = [];
}

public sealed record ProfileSummaryDto
{
    public int TotalAttemptCount { get; init; }

    public int AverageScore { get; init; }

    public int BestScore { get; init; }

    public int AnswerCount { get; init; }
}

public sealed record PerformanceByTopicDto
{
    public string Topic { get; init; }

    public int Best { get; init; }

    public int Average { get; init; }

    public int AttemptCount { get; init; }

    public string Color { get; init; }
}

public sealed record AttemptDto
{
    public string Topic { get; init; }

    public DateTime Date { get; init; }

    public int AnsweredCount { get; init; }

    public int QuestionCount { get; init; }

    public int Score { get; init; }
}
