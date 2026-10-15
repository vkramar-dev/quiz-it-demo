using System.ComponentModel.DataAnnotations;

namespace KramarDev.Quiz.WebAPI.Model.Request;

public sealed class StatisticsRequest
{
    public int TopicId { get; set; }

    public int ScoreThreshold { get; set; }

    [Range(1, 100)]
    public int PageSize { get; set; }

    [Range(0, int.MaxValue)]
    public int PageNumber { get; set; }

    public static StatisticsRequestDto ToBLL(StatisticsRequest model)
    {
        return new StatisticsRequestDto(model.TopicId, model.ScoreThreshold, model.PageSize, model.PageNumber);
    }
}
