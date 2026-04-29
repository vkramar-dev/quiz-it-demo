using Microsoft.Extensions.DependencyInjection;

namespace KramarDev.Quiz.BLL.Services;

public sealed class ApplicationDataStore(IServiceScopeFactory scopeFactory) : IApplicationDataStore
{
    private readonly IServiceScopeFactory _scopeFactory = scopeFactory;

    private TopicDto[] _topics = [];
    private Dictionary<int, TopicDto> _topicsById = [];
    private Dictionary<string, TopicDto> _topicsByName = new(StringComparer.OrdinalIgnoreCase);

    private Dictionary<string, int[]> _easyQuestionIds = new(StringComparer.OrdinalIgnoreCase);
    private Dictionary<string, int[]> _mediumQuestionIds = new(StringComparer.OrdinalIgnoreCase);
    private Dictionary<string, int[]> _hardQuestionIds = new(StringComparer.OrdinalIgnoreCase);

    private readonly SemaphoreSlim _initializeLock = new(1, 1);
    private volatile bool _isInitialized;

    public async Task InitializeAsync()
    {
        if (_isInitialized)
            return;

        await _initializeLock.WaitAsync();

        try
        {
            if (_isInitialized)
            {
                return;
            }

            await using var scope = _scopeFactory.CreateAsyncScope();
            var uow = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

            var dalTopics = await uow.TopicRepository.GetTopicsAsync();
            TopicDto[] topics = DtoMapper.FromDAL(dalTopics);

            var topicsById = new Dictionary<int, TopicDto>(topics.Length);
            var topicsByName = new Dictionary<string, TopicDto>(topics.Length, StringComparer.OrdinalIgnoreCase);

            var easyQuestionIds = new Dictionary<string, int[]>(topics.Length, StringComparer.OrdinalIgnoreCase);
            var mediumQuestionIds = new Dictionary<string, int[]>(topics.Length, StringComparer.OrdinalIgnoreCase);
            var hardQuestionIds = new Dictionary<string, int[]>(topics.Length, StringComparer.OrdinalIgnoreCase);

            for (int i = 0; i < topics.Length; ++i)
            {
                TopicDto topic = topics[i];

                topicsById[topic.Id] = topic;
                topicsByName[topic.Name] = topic;

                easyQuestionIds[topic.Name] = await uow.QuestionRepository
                    .GetAllQuestionsAsync(topic.Name, Difficulty.Easy);

                mediumQuestionIds[topic.Name] = await uow.QuestionRepository
                    .GetAllQuestionsAsync(topic.Name, Difficulty.Medium);

                hardQuestionIds[topic.Name] = await uow.QuestionRepository
                    .GetAllQuestionsAsync(topic.Name, Difficulty.Hard);
            }

            _topics = topics;
            _topicsById = topicsById;
            _topicsByName = topicsByName;
            _easyQuestionIds = easyQuestionIds;
            _mediumQuestionIds = mediumQuestionIds;
            _hardQuestionIds = hardQuestionIds;

            _isInitialized = true;
        }
        finally
        {
            _initializeLock.Release();
        }
    }

    public int[] GetEasyQuestionIds(string topicName)
    {
        EnsureInitialized();

        if (_easyQuestionIds.TryGetValue(topicName, out int[] ids))
            return ids;

        throw new InvalidOperationException($"Easy question IDs for topic '{topicName}' were not found.");
    }

    public int[] GetHardQuestionIds(string topicName)
    {
        EnsureInitialized();

        if (_hardQuestionIds.TryGetValue(topicName, out int[] ids))
            return ids;

        throw new InvalidOperationException($"Hard question IDs for topic '{topicName}' were not found.");
    }

    public int[] GetMediumQuestionIds(string topicName)
    {
        EnsureInitialized();

        if (_mediumQuestionIds.TryGetValue(topicName, out int[] ids))
            return ids;

        throw new InvalidOperationException($"Medium question IDs for topic '{topicName}' were not found.");
    }

    public TopicDto GetTopicById(int id)
    {
        EnsureInitialized();

        if (_topicsById.TryGetValue(id, out TopicDto topic))
            return topic;

        throw new InvalidOperationException($"Topic with id '{id}' was not found.");
    }

    public TopicDto GetTopicByName(string name)
    {
        EnsureInitialized();

        if (_topicsByName.TryGetValue(name, out TopicDto topic))
            return topic;

        throw new InvalidOperationException($"Topic '{name}' was not found.");
    }

    public IReadOnlyList<TopicDto> GetTopics()
    {
        EnsureInitialized();
        return _topics;
    }

    private void EnsureInitialized()
    {
        if (!_isInitialized)
            throw new InvalidOperationException(
                $"{nameof(ApplicationDataStore)} was not initialized. Call {nameof(InitializeAsync)}() at application startup.");
    }
}