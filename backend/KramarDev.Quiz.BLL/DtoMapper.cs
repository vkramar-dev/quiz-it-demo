using DAL = KramarDev.Quiz.DALAbstractions.Dto;
using BL = KramarDev.Quiz.BLLAbstractions.Dto;

namespace KramarDev.Quiz.BLL;

internal static class DtoMapper
{
    public static AnswerDto[] FromDAL(DAL.AnswerResultDto[] dto)
    {
        AnswerDto[] answers = new AnswerDto[dto.Length];
        for (int i = 0; i < dto.Length; ++i)
        {
            answers[i] = new AnswerDto()
            {
                Answer = dto[i].Answer,
                Complexity = dto[i].Complexity,
                CorrectAnswer = dto[i].CorrectAnswer,
                QuestionText = dto[i].QuestionText,
            };
        }

        return answers;
    }

    public static TopicDto[] FromDAL(DAL.TopicDto[] dto)
    {
        TopicDto[] topics = new TopicDto[dto.Length];
        for (int i = 0; i < dto.Length; ++i)
        {
            topics[i] = new TopicDto
            {
                Id = dto[i].Id,
                Name = dto[i].Name,
                Description = dto[i].Description,
                DurationInMinutes = dto[i].DurationInMinutes,
                QuestionCount = dto[i].QuestionCount,
                ThemeColor = dto[i].ThemeColor,
            };
        }

        return topics;
    }

    public static QuestionDto FromDAL(DAL.QuestionDto dto)
    {
        QuestionDto question = new QuestionDto
        {
            // DAL stores zero-based question index; UI displays one-based numbering.
            Number = dto.Number + 1,
            TestId = dto.TestId,
            QuestionId = dto.QuestionId,
            TestQuestionId = dto.TestQuestionId,
            Text = dto.Text,
            Answer1 = dto.Answer1,
            Answer2 = dto.Answer2,
            Answer3 = dto.Answer3,
            Answer4 = dto.Answer4
        };

        return question;
    }

    public static RowDto[] FromDAL(DAL.RowDto[] dto, int initialRankNumber)
    {
        RowDto[] rows = new RowDto[dto.Length];

        for (int i = 0; i < dto.Length; ++i)
        {
            DAL.RowDto dalRow = dto[i];
            rows[i] = new RowDto
            {
                Rank = initialRankNumber++,
                TopicName = dalRow.TopicName,
                TopicThemeColor = dalRow.TopicThemeColor,
                User = dalRow.User,
                AnsweredCount = dalRow.AnsweredCount,
                FinalScore = dalRow.FinalScore,
                FinalWeightedScore = dalRow.FinalWeightedScore,
                Date = dalRow.Date,
                QuestionTotal = dalRow.QuestionTotal,
            };
        }

        return rows;
    }

    public static BL.ProfileDto FromDAL(DAL.ProfileDto dto)
    {
        if (dto == null)
            return null;

        return new BL.ProfileDto
        {
            Summary = new BL.ProfileSummaryDto
            {
                TotalAttemptCount = dto.Summary.TotalAttemptCount,
                AverageScore = dto.Summary.AverageScore,
                BestScore = dto.Summary.BestScore,
                AnswerCount = dto.Summary.AnswerCount
            },
            Topics = dto.Topics?.Select(t => new BL.PerformanceByTopicDto
            {
                Topic = t.Topic,
                Best = t.Best,
                Average = t.Average,
                AttemptCount = t.AttemptCount,
                Color = t.Color
            }).ToArray() ?? [],
            Attempts = dto.Attempts?.Select(a => new BL.AttemptDto
            {
                Topic = a.Topic,
                Date = a.Date,
                AnsweredCount = a.AnsweredCount,
                QuestionCount = a.QuestionCount,
                Score = a.Score
            }).ToArray() ?? []
        };
    }

    public static BL.MistakeDto[] FromDAL(DAL.MistakeDto[] dto)
    {
        var mistakes = new BL.MistakeDto[dto.Length];
        for (int i = 0; i < dto.Length; ++i)
        {
            mistakes[i] = new BL.MistakeDto
            {
                QuestionText = dto[i].QuestionText,
                TopicName = dto[i].TopicName,
                WrongAnswerCount = dto[i].WrongAnswerCount,
                CorrectAnswerCount = dto[i].CorrectAnswerCount
            };
        }

        return mistakes;
    }
}
