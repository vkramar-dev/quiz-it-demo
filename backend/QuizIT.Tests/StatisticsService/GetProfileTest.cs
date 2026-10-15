using FluentAssertions;
using KramarDev.Quiz.BLL.Services;
using KramarDev.Quiz.DAL;
using KramarDev.Quiz.DAL.Database;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;

namespace QuizIT.Tests.StatisticsService;

public class GetProfileTest
{
    [Fact]
    public async Task GetProfileAsync_ReturnsUserProfile_WithSummaryTopicsAndAttempts()
    {
        using var connection = new SqliteConnection("Data Source=:memory:");
        connection.Open();

        var options = new DbContextOptionsBuilder<QuizDbContext>()
            .UseSqlite(connection)
            .Options;

        using (var ctx = new QuizDbContext(options))
        {
            ctx.Database.EnsureCreated();
            await TestDataSeeder.SeedTestDataAsync(ctx);
        }

        var services = new ServiceCollection();
        services.AddMemoryCache();
        var serviceProvider = services.BuildServiceProvider();
        var scopeFactory = serviceProvider.GetRequiredService<IServiceScopeFactory>();
        var memoryCache = serviceProvider.GetRequiredService<IMemoryCache>();

        using (var ctx = new QuizDbContext(options))
        {
            var uow = new UnitOfWork(ctx);
            var cache = new StatisticsCacheService(scopeFactory, memoryCache);
            var statisticsService = new KramarDev.Quiz.BLL.Services.StatisticsService(uow, cache);

            var profile = await statisticsService.GetProfileAsync("alice", CancellationToken.None);

            profile.Should().NotBeNull();

            profile.Summary.Should().NotBeNull();
            profile.Summary.TotalAttemptCount.Should().BeGreaterThan(0);
            profile.Summary.AverageScore.Should().BeGreaterThanOrEqualTo(0);
            profile.Summary.BestScore.Should().BeGreaterThanOrEqualTo(0);
            profile.Summary.AnswerCount.Should().BeGreaterThan(0);

            profile.Topics.Should().NotBeNull();
            profile.Topics.Should().NotBeEmpty();
            profile.Topics.Should().OnlyContain(t => !string.IsNullOrEmpty(t.Topic));
            profile.Topics.Should().OnlyContain(t => !string.IsNullOrEmpty(t.Color));

            profile.Attempts.Should().NotBeNull();
            profile.Attempts.Should().NotBeEmpty();
            profile.Attempts.Should().OnlyContain(a => !string.IsNullOrEmpty(a.Topic));
            profile.Attempts.Should().OnlyContain(a => a.QuestionCount > 0);
        }
    }
}
