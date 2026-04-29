namespace KramarDev.Quiz.WebAPI.Model.Request;

public sealed record MistakesRequest
{
    public int TopicId { get; init; }

    public bool ByTotal { get; init; }

    public int TopCount { get; init; }

    public static MistakesRequestDto ToBLL(MistakesRequest model)
    {
        return new MistakesRequestDto(model.TopicId, model.ByTotal, model.TopCount);
    }
}
