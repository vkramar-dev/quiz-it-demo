
namespace KramarDev.Quiz.DALAbstractions.Dto;

public sealed record TestDto
{
    public int TopicId { get; init; }

    public string Username { get; init; }

    public DateTime StartDate { get; init; }

    public DateTime? FinishDate { get; init; }

    public string IpAddress { get; init; }

    public bool IsHidden { get; init; }
}
