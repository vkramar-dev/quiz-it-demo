namespace KramarDev.Quiz.BLLAbstractions.Dto;

public sealed record MistakesRequestDto(
    int TopicId,
    bool ByTotal,
    int TopCount);

