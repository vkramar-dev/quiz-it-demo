using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace KramarDev.Quiz.DAL.Database.Tables;

public class Test
{
    public int Id { get; set; }

    [Required]
    public string Username { get; set; }

    public int FinalScore { get; set; }

    public int FinalWeightedScore { get; set; }

    public int QuestionCount { get; set; }

    public int AnsweredCount { get; set; }

    public int TotalPoints { get; set; }

    public int EarnedPoints { get; set; }

    public int TopicId { get; set; }

    public Topic Topic { get; set; }

    [DefaultValue("getdate()")]
    public DateTime StartDate { get; set; }

    public DateTime? FinishDate { get; set; }

    public TestState State { get; set; }

    public ICollection<TestQuestion> TestQuestions { get; set; }

    public string IpAddress { get; set; }

    public bool IsHidden { get; set; }
}
