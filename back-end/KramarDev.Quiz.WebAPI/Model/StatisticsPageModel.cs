namespace KramarDev.Quiz.WebAPI.Model;

public sealed record StatisticsPageModel
{
    public RowModel[] Rows { get; init; }

    public int TotalCount { get; init; }

    public static StatisticsPageModel FromBLL(KramarDev.Quiz.BLLAbstractions.Dto.StatisticsPageDto dto)
    {
        return new StatisticsPageModel
        {
            Rows = RowModel.FromBLL(dto.Rows),
            TotalCount = dto.TotalCount,
        };
    }
}

public sealed record RowModel
{
    public int Rank { get; init; }

    public string Name { get; init; }

    public string TopicTitle { get; init; }

    public string TopicColor { get; init; }

    public int AnsweredCount { get; init; }

    public int QuestionCount { get; init; }

    public int Score { get; init; }

    public int WeightedScore { get; init; }

    public string Date { get; init; }

    public static RowModel[] FromBLL(KramarDev.Quiz.BLLAbstractions.Dto.RowDto[] dtoArray)
    {
        RowModel[] modelArray = new RowModel[dtoArray.Length];

        for (int i = 0; i < dtoArray.Length; ++i)
        {
            var dto = dtoArray[i];

            modelArray[i] = new RowModel()
            {
                Rank = dto.Rank,
                Name = dto.User,
                TopicTitle = dto.TopicName,
                TopicColor = dto.TopicThemeColor,
                AnsweredCount = dto.AnsweredCount,
                QuestionCount = dto.QuestionTotal,
                Score = dto.FinalScore,
                WeightedScore = dto.FinalWeightedScore,
                Date = dto.Date.ToShortDateString(),
            };
        }

        return modelArray;
    }
}
