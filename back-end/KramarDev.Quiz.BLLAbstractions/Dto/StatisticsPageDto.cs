
namespace KramarDev.Quiz.BLLAbstractions.Dto;

public sealed record StatisticsPageDto
{
    public RowDto[] Rows { get; init; } = [];

    public int TotalCount { get; init; }
}

public sealed record RowDto
{
    public int Rank { get; init; }

    public string User { get; init; }

    public string TopicName { get; init; }

    public string TopicThemeColor { get; init; }

    public int QuestionTotal { get; init; }

    public int AnsweredCount { get; init; }

    public int FinalScore { get; init; }

    public int FinalWeightedScore { get; init; }

    public DateTime Date { get; init; }
}
