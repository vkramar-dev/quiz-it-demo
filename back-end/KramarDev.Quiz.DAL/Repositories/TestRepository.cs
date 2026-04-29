
namespace KramarDev.Quiz.DAL.Repositories;

public class TestRepository(QuizDbContext dbCtx) : ITestRepository
{
    private readonly QuizDbContext Ctx = dbCtx;

    public async Task<int> CreateTestAsync(NewTestDto newTest, CancellationToken cancellationToken = default)
    {
        int questionAmount = newTest.QuestionIds.Length;

        Test test = new()
        {
            TopicId = newTest.TopicId,
            Username = newTest.Username,
            StartDate = newTest.StartDate,
            IpAddress = newTest.RemoteIpAddress,
            QuestionCount = questionAmount,
            TotalPoints = newTest.TotalPoints,
            State = TestState.Created
        };

        TestQuestion[] generatedQuestions = new TestQuestion[questionAmount];

        for (int i = 0; i < questionAmount; ++i)
        {
            generatedQuestions[i] = new TestQuestion
            {
                QuestionId = newTest.QuestionIds[i],
                Test = test
            };
        }

        Ctx.Tests.Add(test);
        Ctx.TestQuestions.AddRange(generatedQuestions);

        await Ctx.SaveChangesAsync(cancellationToken);

        return test.Id;
    }

    public async Task<QuestionInfoDto> GetQuestionInfoAsync(int questionId, CancellationToken cancellationToken = default)
    {
        return await (from q in Ctx.Questions
                      where q.Id == questionId
                      select new QuestionInfoDto
                      {
                          CorrectAnswerNumber = q.CorrectAnswerNumber,
                          TopicId = q.TopicId
                      }).SingleAsync(cancellationToken);
    }

    public async Task AnswerAndSaveAsync(QuestionAnswerDto answer, CancellationToken cancellationToken = default)
    {
        int rows = await Ctx.TestQuestions
            .Where(tq =>
                tq.TestId == answer.TestId &&
                tq.QuestionId == answer.QuestionId &&
                tq.AnswerDate == null &&
                tq.RequestDate != null)
            .ExecuteUpdateAsync(setters =>
                setters.SetProperty(tq => tq.AnswerNumber, answer.AnswerNumber)
                        .SetProperty(tq => tq.AnswerPoints, answer.AnswerPoints)
                        .SetProperty(tq => tq.AnswerDate, answer.AnswerDate), cancellationToken);

        if (rows == 0)
            throw new InvalidOperationException("Question was not found");
    }

    public async Task CompleteTestAndSaveAsync(CompleteTestDto dto, CancellationToken cancellationToken = default)
    {
        var (userName, testId, finalScore, finalWeightedScore, answeredCount, earnedPoints) = dto;

        int rows = await Ctx.Tests
            .Where(t =>
                t.Id == testId &&
                t.Username == userName &&
                t.State == TestState.Created &&
                t.FinishDate == null &&
                !t.IsHidden)
            .ExecuteUpdateAsync(setters =>
                setters.SetProperty(t => t.FinalScore, finalScore)
                        .SetProperty(t => t.FinalWeightedScore, finalWeightedScore)
                        .SetProperty(t => t.AnsweredCount, answeredCount)
                        .SetProperty(t => t.EarnedPoints, earnedPoints)
                        .SetProperty(t => t.FinishDate, DateTime.UtcNow)
                        .SetProperty(t => t.State, TestState.Completed), cancellationToken);

        if (rows == 0)
            throw new InvalidOperationException("Test was not found");
    }

    public async Task<int?> GetActiveTestByUserAsync(string userName, CancellationToken cancellationToken = default)
    {
        DateTime now = DateTime.UtcNow;

        int id = await (from t in Ctx.Tests
                        join tt in Ctx.Topics on t.TopicId equals tt.Id
                        where t.Username == userName &&
                           !t.FinishDate.HasValue &&
                           !t.IsHidden &&
                           t.State == TestState.Created &&
                           EF.Functions.DateDiffMinute(t.StartDate, now) < tt.DurationInMinutes
                        orderby t.StartDate descending
                        select t.Id).FirstOrDefaultAsync(cancellationToken);

        return id == 0 ? null : id;
    }

    public async Task<CurrentTestStateDto> GetCurrentTestStateAsync(int testId, CancellationToken cancellationToken = default)
    {
        var data = await (from t in Ctx.Tests
                          join tq in Ctx.TestQuestions on t.Id equals tq.TestId
                          join q in Ctx.Questions on tq.QuestionId equals q.Id
                          where t.Id == testId && tq.RequestDate.HasValue && tq.AnswerDate == null
                          select new { Question = q, tqId = tq.Id, t.StartDate, q.TopicId }).FirstOrDefaultAsync(cancellationToken);

        if (data == null)
        {
            return null;
        }

        var tqArray = await (from tq in Ctx.TestQuestions
                             where tq.TestId == testId
                             select new { tq.Id, tq.AnswerDate }).ToArrayAsync(cancellationToken);

        CurrentTestStateDto dto = new CurrentTestStateDto
        {
            TestId = testId,
            TopicId = data.TopicId,
            CurrentQuestion = new QuestionDto
            {
                Number = tqArray.Count(tq => tq.AnswerDate != null),
                TestId = testId,
                TestQuestionId = data.tqId,
                QuestionId = data.Question.Id,
                Text = data.Question.Text,
                Answer1 = data.Question.Answer1,
                Answer2 = data.Question.Answer2,
                Answer3 = data.Question.Answer3,
                Answer4 = data.Question.Answer4
            },
            TotalQuestions = tqArray.Length,
            StartDate = data.StartDate
        };

        return dto;
    }

    public async Task<bool> CanAnswerQuestionAsync(int testId, int questionId, string userName, CancellationToken cancellationToken = default)
    {
        return await (from t in Ctx.Tests
                      join tq in Ctx.TestQuestions on t.Id equals tq.TestId
                      where t.Id == testId &&
                            t.State == TestState.Created &&
                            t.Username == userName &&
                            t.FinishDate == null &&
                            !t.IsHidden &&
                            tq.QuestionId == questionId &&
                            tq.AnswerDate == null &&
                            tq.RequestDate != null
                      select t.Id).AnyAsync(cancellationToken);
    }

    public async Task CancelTestAndSaveAsync(string userName, int testId, CancellationToken cancellationToken = default)
    {
        int rows = await Ctx.Tests
            .Where(t =>
                t.Id == testId &&
                t.Username == userName &&
                t.State == TestState.Created &&
                t.FinishDate == null &&
                !t.IsHidden)
            .ExecuteUpdateAsync(setters =>
                setters.SetProperty(t => t.State, TestState.Cancelled)
                        .SetProperty(t => t.FinishDate, DateTime.UtcNow), cancellationToken);

        if (rows == 0)
            throw new InvalidOperationException("Test was not found");
    }

    public Task<TestDto> GetTestAsync(int testId, CancellationToken cancellationToken = default)
    {
        return (from t in Ctx.Tests
                where t.Id == testId
                select new TestDto
                {
                    Username = t.Username,
                    FinishDate = t.FinishDate,
                    IpAddress = t.IpAddress,
                    IsHidden = t.IsHidden,
                    StartDate = t.StartDate,
                    TopicId = t.TopicId,
                }).SingleOrDefaultAsync(cancellationToken);
    }
}
