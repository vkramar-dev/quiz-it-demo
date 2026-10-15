using FluentAssertions;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using KramarDev.Quiz.DAL.Database;
using KramarDev.Quiz.DAL;
using KramarDev.Quiz.BLL.Services;

namespace QuizIT.Tests;

public class StatisticsServiceIntegrationTests
{
    [Fact]
    public async Task HideAsync_MarksOnlyUserTestsAsHidden_InSqliteInMemory()
    {
        using var connection = new SqliteConnection("Data Source=:memory:");
        connection.Open();

        var options = new DbContextOptionsBuilder<QuizDbContext>()
            .UseSqlite(connection)
            .Options;

        // create schema
        using (var ctx = new QuizDbContext(options))
        {
            ctx.Database.EnsureCreated();
            await TestDataSeeder.SeedTestDataAsync(ctx);
        }

        // exercise: call BLL (UnitOfWork -> StatisticsRepository)
        using (var ctx = new QuizDbContext(options))
        {
            var uow = new UnitOfWork(ctx);
            var svc = new TestService(uow, null);

            await svc.HideAsync("alice", CancellationToken.None);
        }

        // assert: only alice's tests were hidden
        using (var ctx = new QuizDbContext(options))
        {
            var aliceTests = await ctx.Tests.Where(t => t.Username == "alice").ToArrayAsync();
            aliceTests.Should().NotBeEmpty();
            aliceTests.Should().OnlyContain(t => t.IsHidden);

            var bobTest = await ctx.Tests.FirstAsync(t => t.Username == "bob");
            bobTest.IsHidden.Should().BeFalse();
        }
    }
}