using KramarDev.Quiz.DALAbstractions.Dto;

namespace KramarDev.Quiz.WebAPI.Model;

public sealed class AppStateModel
{
    public TopicModel[] Topics { get; set; }

    public UserModel User { get; set; }
}

public sealed record TopicModel
{
    public int Id { get; init; }

    public string Name { get; init; }

    public string Description { get; init; }

    public int QuestionCount { get; init; }

    public int DurationInMinute { get; init; }

    public string ThemeColor { get; init; }

    public static TopicModel FromBLL(BLLAbstractions.Dto.TopicDto dto)
    {
        return new TopicModel
        {
            Id = dto.Id,
            Name = dto.Name,
            Description = dto.Description,
            QuestionCount = dto.QuestionCount,
            DurationInMinute = dto.DurationInMinutes,
            ThemeColor = dto.ThemeColor,
        };
    }
}
