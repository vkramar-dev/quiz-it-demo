namespace KramarDev.Quiz.WebAPI.Model.Request;

public sealed record CancelTestRequest
{
    public int TestId { get; init; }
}
