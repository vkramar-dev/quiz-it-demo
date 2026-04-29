namespace KramarDev.Quiz.WebAPI.Model;

public sealed record MistakeModel
{
    public string QuestionText { get; init; }

    public string TopicName { get; init; }

    public int WrongAnswerCount { get; init; }

    public int CorrectAnswerCount { get; init; }

    public static MistakeModel[] FromBLL(MistakeDto[] dto)
    {
        return dto.Select(d => new MistakeModel
        {
            QuestionText = d.QuestionText,
            TopicName = d.TopicName,
            WrongAnswerCount = d.WrongAnswerCount,
            CorrectAnswerCount = d.CorrectAnswerCount,
        }).ToArray();
    }
}
