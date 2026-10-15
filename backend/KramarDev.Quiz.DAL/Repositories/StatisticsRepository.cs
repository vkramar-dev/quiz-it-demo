using KramarDev.Quiz.DALAbstractions.Interfaces;

namespace KramarDev.Quiz.DAL.Repositories;

public class StatisticsRepository(QuizDbContext dbCtx) : IStatisticsRepository
{
    private readonly QuizDbContext Ctx = dbCtx;

    public async Task<RowDto[]> SelectByFilterAsync(int topicId,
        int scoreThreshold, int pageSize, int pageNumber, CancellationToken cancellationToken = default)
    {
        return await (from t in Ctx.Tests
                      join te in Ctx.Topics
                        on t.TopicId equals te.Id
                      orderby t.FinalScore descending
                      where (topicId == 0 || t.TopicId == topicId) &&
                              t.State == TestState.Completed &&
                              !t.IsHidden &&
                              t.FinalScore >= scoreThreshold
                      select new RowDto
                      {
                          User = t.Username,
                          TopicName = te.Name,
                          TopicThemeColor = te.ThemeColor,
                          QuestionTotal = t.QuestionCount,
                          AnsweredCount = t.AnsweredCount,
                          FinalScore = t.FinalScore,
                          FinalWeightedScore = t.FinalWeightedScore,
                          Date = t.FinishDate.Value
                      })
                      .Skip(pageSize * pageNumber)
                      .Take(pageSize)
                      .ToArrayAsync(cancellationToken);
    }

    public async Task<int> GetTotalCountAsync(int topicId,
        int scoreThreshold, CancellationToken cancellationToken = default)
    {
        return await (from t in Ctx.Tests
                      where (topicId == 0 || t.TopicId == topicId) &&
                            t.State == TestState.Completed &&
                            !t.IsHidden &&
                            t.FinalScore >= scoreThreshold
                      select t).CountAsync(cancellationToken);
    }

    public async Task<ProfileDto> GetProfileAsync(string userName, CancellationToken cancellationToken = default)
    {
        // Summary
        var summary = await (from t in Ctx.Tests
                             where t.Username == userName && t.State == TestState.Completed && !t.IsHidden
                             group t by 1 into g
                             select new ProfileSummaryDto
                             {
                                 TotalAttemptCount = g.Count(),
                                 AverageScore = (int)g.Average(t => t.FinalScore),
                                 BestScore = (int)g.Max(t => t.FinalScore),
                                 AnswerCount = g.Sum(t => t.AnsweredCount)
                             }).FirstOrDefaultAsync(cancellationToken);

        if (summary == null)
        {
            summary = new ProfileSummaryDto
            {
                TotalAttemptCount = 0,
                AverageScore = 0,
                BestScore = 0,
                AnswerCount = 0
            };
        }

        // Performance by topic
        var topics = await (from t in Ctx.Tests
                            join te in Ctx.Topics on t.TopicId equals te.Id
                            where
                                t.Username == userName &&
                                t.State == TestState.Completed &&
                                !t.IsHidden
                            group t by new { te.Name, te.ThemeColor } into grp
                            select new PerformanceByTopicDto
                            {
                                Topic = grp.Key.Name,
                                Color = grp.Key.ThemeColor,
                                AttemptCount = grp.Count(),
                                Best = grp.Max(g => g.FinalScore),
                                Average = (int)grp.Average(g => g.FinalScore)
                            }).ToArrayAsync(cancellationToken);

        // Attempts
        var attempts = await (from t in Ctx.Tests
                              join te in Ctx.Topics on t.TopicId equals te.Id
                              where
                                t.Username == userName &&
                                t.State == TestState.Completed &&
                                !t.IsHidden
                              orderby t.FinishDate descending
                              select new AttemptDto
                              {
                                  Topic = te.Name,
                                  Date = t.FinishDate.Value,
                                  AnsweredCount = t.AnsweredCount,
                                  QuestionCount = t.QuestionCount,
                                  Score = t.FinalScore
                              }).Take(3).ToArrayAsync(cancellationToken);

        return new ProfileDto
        {
            Summary = summary,
            Topics = topics,
            Attempts = attempts
        };
    }

    public Task HideTestsForUserAndSaveAsync(string userName, CancellationToken cancellationToken)
    {
        return Ctx.Tests
            .Where(t => !t.IsHidden && t.Username == userName)
            .ExecuteUpdateAsync(setters => setters.SetProperty(t => t.IsHidden, true), cancellationToken);
    }

    public Task<MistakeDto[]> GetMostMissedQuestionsAsync(
        int topicId, bool byTotal, int topCount, CancellationToken cancellationToken = default)
    {
        var query = Ctx.Questions
                        .Where(q =>
                            (topicId == 0 || q.TopicId == topicId) &&
                            q.IsActive &&
                            q.WrongAnswerCount > 3);

        query = byTotal
            ? query.OrderByDescending(q => q.WrongAnswerCount)
                   .ThenByDescending(q => (double)q.WrongAnswerCount / (q.CorrectAnswerCount + 1))
                   .ThenBy(q => q.Id)
            : query.OrderByDescending(q => (double)q.WrongAnswerCount / (q.CorrectAnswerCount + 1))
                   .ThenByDescending(q => q.WrongAnswerCount)
                   .ThenBy(q => q.Id);

        return query
            .Take(topCount)
            .Select(q => new MistakeDto
            {
                QuestionText = q.Text,
                TopicName = q.Topic.Name,
                TotalAnswers = q.CorrectAnswerCount + q.WrongAnswerCount,
                WrongAnswerCount = q.WrongAnswerCount,
                CorrectAnswerCount = q.CorrectAnswerCount
            })
            .ToArrayAsync(cancellationToken);
    }
}
