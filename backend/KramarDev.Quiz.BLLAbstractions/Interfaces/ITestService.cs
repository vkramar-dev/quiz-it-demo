namespace KramarDev.Quiz.BLLAbstractions.Interfaces;

public interface ITestService
{
    Task<TestDto> CreateTestAsync(string topicName, string userName,
        string ipAddress, CancellationToken cancellationToken = default);

    Task<AnswerResponseDto> AnswerAndNextAsync(int testId,
        int questionId, byte answerNumber, string username, CancellationToken cancellationToken = default);

    Task<TestDto> RestoreCurrentTestAsync(string userName, CancellationToken cancellationToken = default);

    Task CancelTestAsync(string userName, int testId, CancellationToken cancellationToken = default);

    Task<TestResultDto> CompleteAsync(int testId, string userName, CancellationToken cancellationToken = default);

    Task HideAsync(string userName, CancellationToken cancellationToken = default);
}
