namespace KramarDev.Quiz.WebAPI.Model.Request;

public sealed record CompleteTestRequest
{
    public int TestId { get; init; }
}
