using KramarDev.Quiz.DALAbstractions.Interfaces;

namespace KramarDev.Quiz.DALAbstractions;

public interface IUnitOfWork : IDisposable, IAsyncDisposable
{
    ITestRepository TestRepository { get; }

    IQuestionRepository QuestionRepository { get; }

    ITopicRepository TopicRepository { get; }

    IStatisticsRepository StatisticsRepository { get; }

    Task BeginTransactionAsync(
        IsolationLevel isolationLevel = IsolationLevel.ReadCommitted,
        CancellationToken cancellationToken = default);

    Task CommitTransactionAsync(CancellationToken cancellationToken = default);

    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);

    Task<int> SaveAsync(CancellationToken cancellationToken = default);

    Task UpdateDbAsync(CancellationToken cancellationToken = default);
}
