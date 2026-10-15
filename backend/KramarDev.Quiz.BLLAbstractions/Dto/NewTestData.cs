
namespace KramarDev.Quiz.BLLAbstractions.Dto;

public sealed record NewTestData
{
    public int[] QuestionIds { get; init; } = [];

    public int TotalPoints { get; init; }

    public int TopicId { get; init; }
}
