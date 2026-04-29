namespace KramarDev.Quiz.BLLAbstractions.Interfaces;

public interface IStatisticsCacheService
{
    ValueTask<StatisticsPageDto> GetPageAsync(StatisticsRequestDto requestDto);
}
