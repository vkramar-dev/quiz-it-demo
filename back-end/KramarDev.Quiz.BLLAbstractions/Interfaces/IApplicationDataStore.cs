namespace KramarDev.Quiz.BLLAbstractions.Interfaces;

public interface IApplicationDataStore
{
    Task InitializeAsync();

    IReadOnlyList<TopicDto> GetTopics();

    TopicDto GetTopicById(int id);

    TopicDto GetTopicByName(string name);

    int[] GetEasyQuestionIds(string topicName);

    int[] GetMediumQuestionIds(string topicName);

    int[] GetHardQuestionIds(string topicName);
}
