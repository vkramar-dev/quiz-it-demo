namespace KramarDev.Quiz.WebAPI.Model;

public sealed record QuestionModel
{
    public int Number { get; init; }

    public int TestId { get; init; }

    public int QuestionId { get; init; }

    public int TestQuestionId { get; init; }

    public string Text { get; init; }

    public string Answer1 { get; init; }

    public string Answer2 { get; init; }

    public string Answer3 { get; init; }

    public string Answer4 { get; init; }

    public int SecondsLeft { get; init; }

    public static QuestionModel FromBLL(KramarDev.Quiz.BLLAbstractions.Dto.QuestionDto questionDto)
    {
        return new QuestionModel
        {
            Number = questionDto.Number,
            QuestionId = questionDto.QuestionId,
            TestId = questionDto.TestId,
            TestQuestionId = questionDto.TestQuestionId,
            Text = questionDto.Text,
            Answer1 = questionDto.Answer1,
            Answer2 = questionDto.Answer2,
            Answer3 = questionDto.Answer3,
            Answer4 = questionDto.Answer4,
            SecondsLeft = questionDto.SecondsLeft,
        };
    }
}
