namespace KramarDev.Quiz.DALAbstractions.Repositories;

public interface ITestRepository
{
    Task<int> CreateTestAsync(NewTestDto newTest, CancellationToken cancellationToken = default);

    Task<QuestionInfoDto> GetQuestionInfoAsync(int questionId, CancellationToken cancellationToken = default);

    Task AnswerAndSaveAsync(QuestionAnswerDto answer, CancellationToken cancellationToken = default);

    Task CompleteTestAndSaveAsync(CompleteTestDto dto, CancellationToken cancellationToken = default);

    Task<int?> GetActiveTestByUserAsync(string userName, CancellationToken cancellationToken = default);

    Task<CurrentTestStateDto> GetCurrentTestStateAsync(int testId, CancellationToken cancellationToken = default);

    Task<bool> CanAnswerQuestionAsync(int testId, int questionId, string userName, CancellationToken cancellationToken = default);

    Task CancelTestAndSaveAsync(string userName, int testId, CancellationToken cancellationToken = default);

    Task<TestDto> GetTestAsync(int testId, CancellationToken cancellationToken = default);
}
