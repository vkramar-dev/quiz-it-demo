using FluentAssertions;
using KramarDev.Quiz.BLL.Services;
using KramarDev.Quiz.DAL;
using KramarDev.Quiz.DAL.Database;
using KramarDev.Quiz.BLLAbstractions.Dto;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using KramarDev.Quiz.DALAbstractions;

namespace QuizIT.Tests.StatisticsService;

public class GetStatisticsPageTest
{
    [Fact]
    public async Task GetStatisticsPageAsync_ReturnsPagedResults_WithCorrectRanking()
    {
        using var connection = new SqliteConnection("Data Source=:memory:");
        connection.Open();

        var options = new DbContextOptionsBuilder<QuizDbContext>()
            .UseSqlite(connection)
            .Options;

        int topicId;
        using (var ctx = new QuizDbContext(options))
        {
            ctx.Database.EnsureCreated();
            await TestDataSeeder.SeedTestDataAsync(ctx);
            topicId = ctx.Topics.First().Id;
        }

        var services = new ServiceCollection();
        services.AddMemoryCache();
        services.AddScoped<QuizDbContext>(_ => new QuizDbContext(options));
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        var serviceProvider = services.BuildServiceProvider();
        var scopeFactory = serviceProvider.GetRequiredService<IServiceScopeFactory>();
        var memoryCache = serviceProvider.GetRequiredService<IMemoryCache>();

        using (var ctx = new QuizDbContext(options))
        {
            var uow = new UnitOfWork(ctx);
            var cache = new StatisticsCacheService(scopeFactory, memoryCache);
            var statisticsService = new KramarDev.Quiz.BLL.Services.StatisticsService(uow, cache);

            int scoreThreshold = 0;
            int pageSize = 10;
            int pageNumber = 0;

            var result = await statisticsService.GetStatisticsPageAsync(
                new StatisticsRequestDto(topicId, scoreThreshold, pageSize, pageNumber), CancellationToken.None);

            result.Should().NotBeNull();
            result.Rows.Should().NotBeNull();
            result.Rows.Should().NotBeEmpty();
            result.TotalCount.Should().BeGreaterThan(0);

            result.Rows.Should().OnlyContain(r => !string.IsNullOrEmpty(r.User));
            result.Rows.Should().OnlyContain(r => !string.IsNullOrEmpty(r.TopicName));
            result.Rows.Should().OnlyContain(r => r.QuestionTotal > 0);
            result.Rows.Should().OnlyContain(r => r.Rank > 0);

            var ranks = result.Rows.Select(r => r.Rank).ToArray();
            ranks.Should().BeInAscendingOrder();
        }
    }

    [Fact]
    public async Task GetStatisticsPageAsync_FiltersResultsByScoreThreshold()
    {
        using var connection = new SqliteConnection("Data Source=:memory:");
        connection.Open();

        var options = new DbContextOptionsBuilder<QuizDbContext>()
            .UseSqlite(connection)
            .Options;

        int topicId;
        using (var ctx = new QuizDbContext(options))
        {
            ctx.Database.EnsureCreated();
            await TestDataSeeder.SeedTestDataAsync(ctx);
            topicId = ctx.Topics.First().Id;
        }

        var services = new ServiceCollection();
        services.AddMemoryCache();
        services.AddScoped<QuizDbContext>(_ => new QuizDbContext(options));
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        var serviceProvider = services.BuildServiceProvider();
        var scopeFactory = serviceProvider.GetRequiredService<IServiceScopeFactory>();
        var memoryCache = serviceProvider.GetRequiredService<IMemoryCache>();

        using (var ctx = new QuizDbContext(options))
        {
            var uow = new UnitOfWork(ctx);
            var cache = new StatisticsCacheService(scopeFactory, memoryCache);
            var statisticsService = new KramarDev.Quiz.BLL.Services.StatisticsService(uow, cache);

            int highScoreThreshold = 80;
            int pageSize = 10;
            int pageNumber = 0;

            var result = await statisticsService.GetStatisticsPageAsync(
                new StatisticsRequestDto(topicId, highScoreThreshold, pageSize, pageNumber), CancellationToken.None);

            result.Should().NotBeNull();
            result.Rows.Should().OnlyContain(r => r.FinalScore >= highScoreThreshold);
        }
    }

    [Fact]
    public async Task GetStatisticsPageAsync_ReturnsPaginatedResults()
    {
        using var connection = new SqliteConnection("Data Source=:memory:");
        connection.Open();

        var options = new DbContextOptionsBuilder<QuizDbContext>()
            .UseSqlite(connection)
            .Options;

        int topicId;
        using (var ctx = new QuizDbContext(options))
        {
            ctx.Database.EnsureCreated();
            await TestDataSeeder.SeedTestDataAsync(ctx);
            topicId = ctx.Topics.First().Id;
        }

        var services = new ServiceCollection();
        services.AddMemoryCache();
        services.AddScoped<QuizDbContext>(_ => new QuizDbContext(options));
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        var serviceProvider = services.BuildServiceProvider();
        var scopeFactory = serviceProvider.GetRequiredService<IServiceScopeFactory>();
        var memoryCache = serviceProvider.GetRequiredService<IMemoryCache>();

        using (var ctx = new QuizDbContext(options))
        {
            var uow = new UnitOfWork(ctx);
            var cache = new StatisticsCacheService(scopeFactory, memoryCache);
            var statisticsService = new KramarDev.Quiz.BLL.Services.StatisticsService(uow, cache);

            int scoreThreshold = 0;
            int pageSize = 1;

            var page0 = await statisticsService.GetStatisticsPageAsync(
                new StatisticsRequestDto(topicId, scoreThreshold, pageSize, 0), CancellationToken.None);
            var page1 = await statisticsService.GetStatisticsPageAsync(
                new StatisticsRequestDto(topicId, scoreThreshold, pageSize, 1), CancellationToken.None);

            page0.Rows.Should().HaveCount(1);
            page1.Rows.Should().HaveCount(1);
            page0.Rows[0].User.Should().NotBe(page1.Rows[0].User);
            page0.TotalCount.Should().Be(page1.TotalCount);
        }
    }
}
