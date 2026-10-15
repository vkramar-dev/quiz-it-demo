using System.ComponentModel.DataAnnotations;

namespace KramarDev.Quiz.DAL.Database.Tables;

public class Question
{
    public int Id { get; set; }

    [Required]
    public string Text { get; set; }

    [Required]
    public string Answer1 { get; set; }

    [Required]
    public string Answer2 { get; set; }

    [Required]
    public string Answer3 { get; set; }

    [Required]
    public string Answer4 { get; set; }

    public byte CorrectAnswerNumber { get; set; }

    public byte Difficulty { get; set; }

    public bool IsActive { get; set; } = true;

    public int CorrectAnswerCount { get; set; }

    public int WrongAnswerCount { get; set; }

    public int TopicId { get; set; }

    public Topic Topic { get; set; }

    public ICollection<TestQuestion> TestQuestions { get; set; }
}
