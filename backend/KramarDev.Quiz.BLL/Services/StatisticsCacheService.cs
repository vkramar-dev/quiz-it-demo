using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Concurrent;

namespace KramarDev.Quiz.BLL.Services;

public sealed class StatisticsCacheService(
    IServiceScopeFactory scopeFactory, IMemoryCache cache) : IStatisticsCacheService
{
    private static readonly MemoryCacheEntryOptions CacheOptions = new()
    {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(15)
    };

    private readonly IServiceScopeFactory _scopeFactory = scopeFactory;
    private readonly IMemoryCache _cache = cache;
    private readonly ConcurrentDictionary<string, SemaphoreSlim> _semaphoresDictionary = new();

    public ValueTask<StatisticsPageDto> GetPageAsync(StatisticsRequestDto requestDto)
    {
        string cacheKey = GetCacheKey(requestDto);

        if (_cache.TryGetValue(cacheKey, out StatisticsPageDto page))
            return new ValueTask<StatisticsPageDto>(page);

        return new ValueTask<StatisticsPageDto>(LoadStatisticsPageAsync(cacheKey, requestDto));
    }

    private async Task<StatisticsPageDto> LoadStatisticsPageAsync(string cacheKey, StatisticsRequestDto requestDto)
    {
        var (topicId, scoreThreshold, pageSize, pageNumber) = requestDto;

        SemaphoreSlim sem = _semaphoresDictionary.GetOrAdd(cacheKey, _ => new SemaphoreSlim(1, 1));

        try
        {
            await sem.WaitAsync();

            if (_cache.TryGetValue(cacheKey, out StatisticsPageDto cachedPage))
                return cachedPage;

            // pageNumber is zero-based
            int startIndex = pageNumber * pageSize + 1;

            await using var scope = _scopeFactory.CreateAsyncScope();
            var uow = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            var dalRows = await uow.StatisticsRepository.SelectByFilterAsync(
                topicId, scoreThreshold, pageSize, pageNumber);

            int totalCount = await uow.StatisticsRepository.GetTotalCountAsync(topicId, scoreThreshold);

            RowDto[] rows = DtoMapper.FromDAL(dalRows, startIndex);

            StatisticsPageDto statistics = new()
            {
                Rows = rows,
                TotalCount = totalCount
            };

            return _cache.Set(cacheKey, statistics, CacheOptions);
        }
        finally
        {
            sem.Release();
        }        
    }

    private static string GetCacheKey(StatisticsRequestDto requestDto)
    {
        return $"statistics:{requestDto.TopicId}:{requestDto.ScoreThreshold}:{requestDto.PageSize}:{requestDto.PageNumber}";
    }
}
