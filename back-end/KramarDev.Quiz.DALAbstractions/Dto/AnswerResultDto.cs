
namespace KramarDev.Quiz.DALAbstractions.Dto;

public sealed record AnswerResultDto
{
    public string QuestionText { get; init; }

    public string Answer { get; init; }

    public string CorrectAnswer { get; init; }

    public byte Complexity { get; init; }
}
