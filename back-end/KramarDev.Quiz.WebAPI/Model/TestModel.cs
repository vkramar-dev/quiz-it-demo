
namespace KramarDev.Quiz.WebAPI.Model;

public sealed record TestModel
{
    public int TestId { get; init; }

    public string TopicName { get; init; }

    public int SecondsLeft { get; init; }

    public int QuestionCount { get; init; }

    public QuestionModel Question { get; init; }

    public string TopicColor { get; init; }

    public static TestModel FromBL(KramarDev.Quiz.BLLAbstractions.Dto.TestDto testDto)
    {
        return new TestModel
        {
            TestId = testDto.TestId,
            TopicName = testDto.TopicName,
            SecondsLeft = testDto.SecondsLeft,
            QuestionCount = testDto.QuestionCount,
            Question = QuestionModel.FromBLL(testDto.Question),
            TopicColor = testDto.TopicColor,
        };
    }
}
