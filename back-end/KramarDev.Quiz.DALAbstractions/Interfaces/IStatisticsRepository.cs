namespace KramarDev.Quiz.DALAbstractions.Interfaces;

public interface IStatisticsRepository
{
    Task<RowDto[]> SelectByFilterAsync(int topicId, int scoreThreshold, int pageSize, int pageNumber, CancellationToken cancellationToken = default);

    Task<int> GetTotalCountAsync(int topicId, int scoreThreshold, CancellationToken cancellationToken = default);

    Task<ProfileDto> GetProfileAsync(string userName, CancellationToken cancellationToken = default);

    Task HideTestsForUserAndSaveAsync(string userName, CancellationToken cancellationToken = default);

    Task<MistakeDto[]> GetMostMissedQuestionsAsync(int topicId, bool byTotal, int topCount, CancellationToken cancellationToken = default);
}
