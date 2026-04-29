
namespace KramarDev.Quiz.DALAbstractions.Dto;

public sealed record RowDto
{
    public string User { get; init; }

    public string TopicName { get; init; }

    public string TopicThemeColor { get; init; }

    public int QuestionTotal { get; init; }

    public int AnsweredCount { get; init; }

    public int FinalScore { get; init; }

    public int FinalWeightedScore { get; init; }

    public DateTime Date { get; init; }
}
