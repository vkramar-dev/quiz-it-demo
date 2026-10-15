using KramarDev.Quiz.DAL.Database;
using KramarDev.Quiz.DAL.Database.Tables;
using KramarDev.Quiz.DALAbstractions.Enum;
using Microsoft.EntityFrameworkCore;

namespace QuizIT.Tests;

public static class TestDataSeeder
{
    public static async Task SeedTestDataAsync(QuizDbContext ctx, CancellationToken cancellationToken = default)
    {
        // avoid reseeding
        if (await ctx.Topics.AnyAsync(cancellationToken))
            return;

        // Topic 1
        var topic = new Topic
        {
            Name = "Integration Topic",
            Description = "Auto-seeded topic for tests",
            ThemeColor = "#abcdef",
            DurationInMinutes = 60,
            QuestionCount = 3,
            IsActive = true,
        };

        // Topic 2 - for cache testing with multiple questions per difficulty
        var topicCSharp = new Topic
        {
            Name = "CSharp",
            Description = "C# Programming",
            ThemeColor = "#512BD4",
            DurationInMinutes = 30,
            QuestionCount = 6,
            IsActive = true,
        };

        ctx.Topics.AddRange(topic, topicCSharp);
        await ctx.SaveChangesAsync(cancellationToken);

        // Questions for the first topic
        var questions = new[]
        {
            new Question
            {
                TopicId = topic.Id,
                Text = "What is 1+1?",
                Answer1 = "1",
                Answer2 = "2",
                Answer3 = "3",
                Answer4 = "4",
                CorrectAnswerNumber = 2,
                Difficulty = (byte)Difficulty.Easy,
            },
            new Question
            {
                TopicId = topic.Id,
                Text = "What color is the sky?",
                Answer1 = "Blue",
                Answer2 = "Green",
                Answer3 = "Red",
                Answer4 = "Yellow",
                CorrectAnswerNumber = 1,
                Difficulty = (byte)Difficulty.Medium,
            },
            new Question
            {
                TopicId = topic.Id,
                Text = "Select true statement",
                Answer1 = "True",
                Answer2 = "False",
                Answer3 = "Maybe",
                Answer4 = "Sometimes",
                CorrectAnswerNumber = 1,
                Difficulty = (byte)Difficulty.Hard,
            }
        };

        // Questions for CSharp topic (2 per difficulty level for cache testing)
        var csharpQuestions = new[]
        {
            new Question { TopicId = topicCSharp.Id, Text = "Easy Q1", Answer1 = "A", Answer2 = "B", Answer3 = "C", Answer4 = "D", CorrectAnswerNumber = 1, Difficulty = (byte)Difficulty.Easy },
            new Question { TopicId = topicCSharp.Id, Text = "Easy Q2", Answer1 = "A", Answer2 = "B", Answer3 = "C", Answer4 = "D", CorrectAnswerNumber = 1, Difficulty = (byte)Difficulty.Easy },
            new Question { TopicId = topicCSharp.Id, Text = "Medium Q1", Answer1 = "A", Answer2 = "B", Answer3 = "C", Answer4 = "D", CorrectAnswerNumber = 1, Difficulty = (byte)Difficulty.Medium },
            new Question { TopicId = topicCSharp.Id, Text = "Medium Q2", Answer1 = "A", Answer2 = "B", Answer3 = "C", Answer4 = "D", CorrectAnswerNumber = 1, Difficulty = (byte)Difficulty.Medium },
            new Question { TopicId = topicCSharp.Id, Text = "Hard Q1", Answer1 = "A", Answer2 = "B", Answer3 = "C", Answer4 = "D", CorrectAnswerNumber = 1, Difficulty = (byte)Difficulty.Hard },
            new Question { TopicId = topicCSharp.Id, Text = "Hard Q2", Answer1 = "A", Answer2 = "B", Answer3 = "C", Answer4 = "D", CorrectAnswerNumber = 1, Difficulty = (byte)Difficulty.Hard },
        };

        ctx.Questions.AddRange(questions);
        ctx.Questions.AddRange(csharpQuestions);
        await ctx.SaveChangesAsync(cancellationToken);

        // Tests (completed) for two users
        var testAlice = new Test
        {
            TopicId = topic.Id,
            Username = "alice",
            StartDate = DateTime.UtcNow.AddMinutes(-30),
            FinishDate = DateTime.UtcNow.AddMinutes(-10),
            QuestionCount = questions.Length,
            AnsweredCount = questions.Length,
            TotalPoints = 100,
            FinalScore = 75,
            FinalWeightedScore = 75,
            EarnedPoints = 75,
            State = TestState.Completed,
            IsHidden = false,
            IpAddress = "127.0.0.1"
        };

        var testBob = new Test
        {
            TopicId = topic.Id,
            Username = "bob",
            StartDate = DateTime.UtcNow.AddMinutes(-25),
            FinishDate = DateTime.UtcNow.AddMinutes(-5),
            QuestionCount = questions.Length,
            AnsweredCount = questions.Length,
            TotalPoints = 100,
            FinalScore = 90,
            FinalWeightedScore = 90,
            EarnedPoints = 90,
            State = TestState.Completed,
            IsHidden = false,
            IpAddress = "127.0.0.2"
        };

        ctx.Tests.AddRange(testAlice, testBob);
        await ctx.SaveChangesAsync(cancellationToken);

        // TestQuestions linking tests and questions (one-to-many)
        var tqs = questions.Select((q, idx) => new TestQuestion
        {
            TestId = testAlice.Id,
            QuestionId = q.Id,
            RequestDate = DateTime.UtcNow.AddMinutes(-29 + idx),
            AnswerDate = DateTime.UtcNow.AddMinutes(-28 + idx),
            AnswerNumber = q.CorrectAnswerNumber,
            AnswerPoints = 25 // arbitrary
        }).ToList();

        tqs.AddRange(questions.Select((q, idx) => new TestQuestion
        {
            TestId = testBob.Id,
            QuestionId = q.Id,
            RequestDate = DateTime.UtcNow.AddMinutes(-24 + idx),
            AnswerDate = DateTime.UtcNow.AddMinutes(-23 + idx),
            AnswerNumber = q.CorrectAnswerNumber,
            AnswerPoints = 30
        }));

        ctx.TestQuestions.AddRange(tqs);
        await ctx.SaveChangesAsync(cancellationToken);
    }
}