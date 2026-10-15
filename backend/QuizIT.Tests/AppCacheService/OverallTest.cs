using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using KramarDev.Quiz.BLL.Services;
using KramarDev.Quiz.DAL;
using KramarDev.Quiz.DAL.Database;
using KramarDev.Quiz.DAL.Database.Tables;
using KramarDev.Quiz.DALAbstractions.Enum;
using KramarDev.Quiz.DALAbstractions;

namespace QuizIT.Tests.AppCacheService
{
    public class OverallTest
    {
        [Fact]
        public async Task InitializeCacheAsync_LoadsAllData_AndAllMethodsReturnCachedData()
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
            services.AddScoped<QuizDbContext>(_ => new QuizDbContext(options));
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            var serviceProvider = services.BuildServiceProvider();
            var scopeFactory = serviceProvider.GetRequiredService<IServiceScopeFactory>();
            var memoryCache = serviceProvider.GetRequiredService<IMemoryCache>();

            var cacheService = new KramarDev.Quiz.BLL.Services.ApplicationDataStore(scopeFactory);

            await cacheService.InitializeAsync();

            var topics = cacheService.GetTopics();
            topics.Should().NotBeNull();
            topics.Should().HaveCount(2);
            topics.Should().Contain(t => t.Name == "Integration Topic");
            topics.Should().Contain(t => t.Name == "CSharp");

            var csharpTopic = cacheService.GetTopicByName("CSharp");
            csharpTopic.Should().NotBeNull();
            csharpTopic.Name.Should().Be("CSharp");
            csharpTopic.QuestionCount.Should().Be(6);

            var integrationTopic = cacheService.GetTopicById(topics[0].Id);
            integrationTopic.Should().NotBeNull();

            var easyIds = cacheService.GetEasyQuestionIds("CSharp");
            easyIds.Should().NotBeNull();
            easyIds.Should().HaveCount(2);

            var middleIds = cacheService.GetMediumQuestionIds("CSharp");
            middleIds.Should().NotBeNull();
            middleIds.Should().HaveCount(2);

            var hardIds = cacheService.GetHardQuestionIds("CSharp");
            hardIds.Should().NotBeNull();
            hardIds.Should().HaveCount(2);

            var integrationEasyIds = cacheService.GetEasyQuestionIds("Integration Topic");
            integrationEasyIds.Should().NotBeNull();
            integrationEasyIds.Should().HaveCount(1);

            Action act = () => cacheService.GetTopicByName("NonExistent");
            act.Should().Throw<InvalidOperationException>()
                .WithMessage("Topic 'NonExistent' was not found.");
        }
    }
}
