using KramarDev.Quiz.DALAbstractions.Enum;

namespace KramarDev.Quiz.DALAbstractions.Repositories;

public interface IQuestionRepository
{
    Task<AnswerResultDto[]> GetAnswersAsync(
        int testId, string userName, CancellationToken cancellationToken = default);

    Task<QuestionDto> SelectNextQuestionAsync(
        int testId, string userName, CancellationToken cancellationToken = default);

    Task<int[]> GetAllQuestionsAsync(string topicName,
        Difficulty difficulty, CancellationToken cancellationToken = default);

    Task UpdateTestQuestionDateAndSaveAsync(int testId,
        int testQuestionId, CancellationToken cancellationToken = default);

    Task IncrementQuestionCounterAsync(
        int questionId, bool isCorrectAnswer, CancellationToken cancellationToken = default);
}