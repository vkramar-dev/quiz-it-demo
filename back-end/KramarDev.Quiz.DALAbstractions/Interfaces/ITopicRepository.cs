namespace KramarDev.Quiz.DALAbstractions.Repositories;

public interface ITopicRepository
{
    Task<TopicDto[]> GetTopicsAsync(CancellationToken cancellationToken = default);

    Task<TopicDto> GetTopicByTestIdAsync(int testId, CancellationToken cancellationToken = default);
}
