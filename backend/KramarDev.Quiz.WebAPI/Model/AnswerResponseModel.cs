namespace KramarDev.Quiz.WebAPI.Model;

public sealed record AnswerResponseModel
{
    public QuestionModel NextQuestion { get; init; }

    public TestResultModel TestResult { get; init; }

    public static AnswerResponseModel FromBLL(KramarDev.Quiz.BLLAbstractions.Dto.AnswerResponseDto dto)
    {
        if (dto == null) return null;

        return new AnswerResponseModel
        {
            NextQuestion = dto.NextQuestion != null ? QuestionModel.FromBLL(dto.NextQuestion) : null,
            TestResult = dto.TestResult != null ? TestResultModel.FromBLL(dto.TestResult) : null
        };
    }
}

public sealed record TestResultModel
{
    public string TopicName { get; init; }

    public float FinalScore { get; init; }

    public int TotalPoints { get; init; }

    public int EarnedPoints { get; init; }

    public int AnsweredCount { get; init; }

    public AnswerModel[] Answers { get; init; }

    public static TestResultModel FromBLL(KramarDev.Quiz.BLLAbstractions.Dto.TestResultDto dto)
    {
        if (dto == null) return null;

        return new TestResultModel
        {
            TopicName = dto.TopicName,
            TotalPoints = dto.TotalPoints,
            EarnedPoints = dto.EarnedPoints,
            FinalScore = dto.FinalScore,
            AnsweredCount = dto.AnsweredCount,
            Answers = dto.Answers?.Select(AnswerModel.FromBLL).ToArray()
        };
    }
}
