namespace KramarDev.Quiz.WebAPI.Model;

public sealed class ProfileModel
{
    public ProfileSummaryModel ProfileSummary { get; set; }

    public PerformanceByTopicModel[] Topics { get; set; }

    public AttemptModel[] Attempts { get; set; }

    public static ProfileModel FromBLL(ProfileDto dto)
    {
        if (dto == null) return null;

        return new ProfileModel
        {
            ProfileSummary = new ProfileSummaryModel
            {
                TotalAttemptCount = dto.Summary.TotalAttemptCount,
                AverageScore = dto.Summary.AverageScore,
                BestScore = dto.Summary.BestScore,
                AnswerCount = dto.Summary.AnswerCount
            },
            Topics = dto.Topics?.Select(t => new PerformanceByTopicModel
            {
                Topic = t.Topic,
                Best = t.Best,
                Average = t.Average,
                AttemptCount = t.AttemptCount,
                Color = t.Color
            }).ToArray(),
            Attempts = dto.Attempts?.Select(a => new AttemptModel
            {
                Topic = a.Topic,
                Date = a.Date.ToString("dd MMM yyyy h:mm"),
                AnsweredCount = a.AnsweredCount,
                QuestionCount = a.QuestionCount,
                Score = a.Score
            }).ToArray()
        };
    }
}

public sealed class ProfileSummaryModel
{
    public int TotalAttemptCount { get; set; }

    public int AverageScore { get; set; }

    public int BestScore { get; set; }

    public int AnswerCount { get; set; }
}

public sealed class PerformanceByTopicModel
{
    public string Topic { get; set; }

    public int Best { get; set; }

    public int Average { get; set; }

    public int AttemptCount { get; set; }

    public string Color { get; set; }
}

public sealed class AttemptModel
{
    public string Topic { get; set; }

    public string Date { get; set; }

    public int AnsweredCount { get; set; }

    public int QuestionCount { get; set; }

    public int Score { get; set; }
}