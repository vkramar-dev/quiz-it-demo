namespace KramarDev.Quiz.WebAPI.Model;

public sealed record AnswerModel
{
    public string QuestionText { get; init; }

    public string Answer { get; init; }

    public string CorrectAnswer { get; init; }

    public byte Complexity { get; init; }

    public static AnswerModel FromBLL(KramarDev.Quiz.BLLAbstractions.Dto.AnswerDto dto)
    {
        return new AnswerModel
        {
            QuestionText = dto.QuestionText,
            Answer = dto.Answer,
            CorrectAnswer = dto.CorrectAnswer,
            Complexity = dto.Complexity,
        };
    }
}
