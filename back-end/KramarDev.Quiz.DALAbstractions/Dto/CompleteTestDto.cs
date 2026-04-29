
namespace KramarDev.Quiz.DALAbstractions.Dto;

public sealed record CompleteTestDto(
    string UserName,
    int TestId,
    int FinalScore,
    int FinalWeightedScore,
    int AnsweredCount,
    int EarnedPoints);
