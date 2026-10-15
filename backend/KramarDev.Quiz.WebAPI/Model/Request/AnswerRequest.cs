using System.ComponentModel.DataAnnotations;

namespace KramarDev.Quiz.WebAPI.Model.Request;

public sealed record AnswerRequest
{
    public int TestId { get; init; }

    public int QuestionId { get; init; }

    [Range(1, 4)]
    public byte AnswerNumber { get; init; }
}
