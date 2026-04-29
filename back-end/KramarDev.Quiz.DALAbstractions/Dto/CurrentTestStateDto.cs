
namespace KramarDev.Quiz.DALAbstractions.Dto;

public sealed record CurrentTestStateDto
{
    public int TestId { get; init; }

    public int TopicId { get; init; }

    public int TotalQuestions { get; init; }

    public DateTime StartDate { get; init; }

    public QuestionDto CurrentQuestion { get; init; }
}
