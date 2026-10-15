using KramarDev.Quiz.DAL.Repositories;
using KramarDev.Quiz.DALAbstractions;
using KramarDev.Quiz.DALAbstractions.Interfaces;
using System.Data;

namespace KramarDev.Quiz.DAL;

public sealed class UnitOfWork : IUnitOfWork
{
    private readonly QuizDbContext _ctx;

    public UnitOfWork(QuizDbContext ctx)
    {
        _ctx = ctx;

        TestRepository = new TestRepository(_ctx);
        QuestionRepository = new QuestionRepository(_ctx);
        TopicRepository = new TopicRepository(_ctx);
        StatisticsRepository = new StatisticsRepository(_ctx);
    }

    public ITestRepository TestRepository { get; }

    public IQuestionRepository QuestionRepository { get; }

    public ITopicRepository TopicRepository { get; }

    public IStatisticsRepository StatisticsRepository { get; }

    public Task BeginTransactionAsync(
        IsolationLevel isolationLevel = IsolationLevel.ReadCommitted,
        CancellationToken cancellationToken = default)
    {
        return _ctx.Database.BeginTransactionAsync(isolationLevel, cancellationToken);
    }

    public Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        return _ctx.Database.CommitTransactionAsync(cancellationToken);
    }

    public Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        return _ctx.Database.RollbackTransactionAsync(cancellationToken);
    }

    public Task<int> SaveAsync(CancellationToken cancellationToken = default)
    {
        return _ctx.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateDbAsync(CancellationToken cancellationToken = default)
    {
        await _ctx.Database.MigrateAsync(cancellationToken);
        await DbInitializer.InitializeAsync(_ctx, cancellationToken);
    }

    public void Dispose()
    {
        _ctx.Dispose();
    }

    public ValueTask DisposeAsync()
    {
        return _ctx.DisposeAsync();
    }
}
