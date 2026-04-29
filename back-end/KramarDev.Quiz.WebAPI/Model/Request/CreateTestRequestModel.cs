using System.ComponentModel.DataAnnotations;

namespace KramarDev.Quiz.WebAPI.Model.Request;

public sealed record CreateTestRequest
{
    [Required]
    [StringLength(256)]
    public string TopicName { get; init; }
}
