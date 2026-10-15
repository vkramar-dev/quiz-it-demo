namespace KramarDev.Quiz.DAL.Repositories;

public sealed class TopicRepository(QuizDbContext dbCtx) : ITopicRepository
{
    private readonly QuizDbContext Ctx = dbCtx;

    public async Task<TopicDto[]> GetTopicsAsync(CancellationToken cancellationToken = default)
    {
        return await (from t in Ctx.Topics
                      where t.IsActive
                      select new TopicDto
                      {
                          Id = t.Id,
                          Name = t.Name,
                          Description = t.Description,
                          QuestionCount = t.QuestionCount,
                          DurationInMinutes = t.DurationInMinutes,
                          ThemeColor = t.ThemeColor,
                      }).ToArrayAsync(cancellationToken);
    }

    public async Task<TopicDto> GetTopicByTestIdAsync(int testId, CancellationToken cancellationToken = default)
    {
        return await (from te in Ctx.Topics
                      join t in Ctx.Tests on te.Id equals t.TopicId
                      where t.Id == testId
                      select new TopicDto
                      {
                          Id = te.Id,
                          Name = te.Name,
                          Description = te.Description,
                          QuestionCount = te.QuestionCount,
                          DurationInMinutes = te.DurationInMinutes,
                          ThemeColor = te.ThemeColor,
                      }).SingleAsync(cancellationToken);
    }
}
