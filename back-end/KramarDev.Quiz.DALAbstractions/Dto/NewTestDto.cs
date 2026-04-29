namespace KramarDev.Quiz.DALAbstractions.Dto;

public sealed record NewTestDto
{
    public int TopicId { get; init; }

    public string Username { get; init; }

    public DateTime StartDate { get; init; }

    public string RemoteIpAddress { get; init; }

    public int TotalPoints { get; init; }

    public int[] QuestionIds { get; init; } = [];
}
