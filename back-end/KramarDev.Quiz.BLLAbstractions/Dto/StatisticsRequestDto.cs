namespace KramarDev.Quiz.BLLAbstractions.Dto;

public sealed record StatisticsRequestDto(
    int TopicId,
    int ScoreThreshold,
    int PageSize,
    int PageNumber);
