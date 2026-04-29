namespace KramarDev.Quiz.DAL.Database.Tables;

public class TestQuestion
{
    public int Id { get; set; }

    public byte? AnswerNumber { get; set; }

    public byte? AnswerPoints { get; set; }

    public DateTime? RequestDate { get; set; }

    public DateTime? AnswerDate { get; set; }

    public int TestId { get; set; }

    public Test Test { get; set; }

    public int QuestionId { get; set; }

    public Question Question { get; set; }
}
