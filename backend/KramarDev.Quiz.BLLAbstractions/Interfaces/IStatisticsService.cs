namespace KramarDev.Quiz.BLLAbstractions.Interfaces;

public interface IStatisticsService
{
    Task<ProfileDto> GetProfileAsync(string userName, CancellationToken cancellationToken = default);

    Task<StatisticsPageDto> GetStatisticsPageAsync(
        StatisticsRequestDto requestDto, CancellationToken cancellationToken = default);

    Task<MistakeDto[]> GetMistakesAsync(
        MistakesRequestDto paramDto, CancellationToken cancellationToken = default);
}
