
namespace KramarDev.Quiz.DAL.Repositories;

public sealed class QuestionRepository(QuizDbContext dbCtx) : IQuestionRepository
{
    private readonly QuizDbContext Ctx = dbCtx;

    public Task<AnswerResultDto[]> GetAnswersAsync(int testId,
        string userName, CancellationToken cancellationToken = default)
    {
        return (from tq in Ctx.TestQuestions
                join q in Ctx.Questions on tq.QuestionId equals q.Id
                join t in Ctx.Tests on tq.TestId equals t.Id
                where tq.TestId == testId && t.Username == userName
                orderby tq.Id ascending
                select new AnswerResultDto
                {
                    QuestionText = q.Text,
                    Answer = GetAnswer(tq.AnswerNumber, q),
                    CorrectAnswer = GetAnswer(q.CorrectAnswerNumber, q),
                    Complexity = q.Difficulty
                }).ToArrayAsync(cancellationToken);
    }

    public Task<QuestionDto> SelectNextQuestionAsync(int testId,
        string userName, CancellationToken cancellationToken = default)
    {
        return (from tq in Ctx.TestQuestions
                join q in Ctx.Questions on tq.QuestionId equals q.Id
                join t in Ctx.Tests on tq.TestId equals t.Id
                where tq.TestId == testId && t.Username == userName && tq.AnswerDate == null
                orderby tq.Id ascending
                select new QuestionDto
                {
                    Number = Ctx.TestQuestions.Count(tq2 => tq2.TestId == tq.TestId && tq2.AnswerDate != null),
                    Text = q.Text,
                    Answer1 = q.Answer1,
                    Answer2 = q.Answer2,
                    Answer3 = q.Answer3,
                    Answer4 = q.Answer4,
                    QuestionId = q.Id,
                    TestId = testId,
                    TestQuestionId = tq.Id
                }).FirstOrDefaultAsync(cancellationToken);
    }

    public Task<int[]> GetAllQuestionsAsync(string topicName,
        Difficulty difficulty, CancellationToken cancellationToken = default)
    {
        return (from t in Ctx.Topics
                join q in Ctx.Questions on t.Id equals q.TopicId
                where t.Name == topicName &&
                      q.Difficulty == (byte)difficulty &&
                      q.IsActive
                select q.Id).ToArrayAsync(cancellationToken);
    }

    public Task UpdateTestQuestionDateAndSaveAsync(int testId,
        int testQuestionId, CancellationToken cancellationToken = default)
    {
        return Ctx.TestQuestions
                .Where(tq => tq.TestId == testId && tq.Id == testQuestionId)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(tq => tq.RequestDate, DateTime.UtcNow), cancellationToken);
    }

    public Task IncrementQuestionCounterAsync(
        int questionId, bool isCorrectAnswer, CancellationToken cancellationToken = default)
    {
        if (isCorrectAnswer)
        {
            return Ctx.Questions
                    .Where(q => q.Id == questionId)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(q => q.CorrectAnswerCount, (a) => a.CorrectAnswerCount + 1), cancellationToken);
        }
        else
        {
            return Ctx.Questions
                    .Where(q => q.Id == questionId)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(q => q.WrongAnswerCount, (a) => a.WrongAnswerCount + 1), cancellationToken);
        }
    }

    private static string GetAnswer(int? answerNumber, Question q)
    {
        return answerNumber switch
        {
            1 => q.Answer1,
            2 => q.Answer2,
            3 => q.Answer3,
            4 => q.Answer4,
            _ => null,
        };
    }
}
