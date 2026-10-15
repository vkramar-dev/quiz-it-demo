using System.ComponentModel.DataAnnotations;

namespace KramarDev.Quiz.DAL.Database.Tables;

[Index(nameof(Name), IsUnique = true)]
public class Topic
{
    public int Id { get; set; }

    [StringLength(32), Required]
    public string Name { get; set; }

    [StringLength(220), Required]
    public string Description { get; set; }

    public bool IsActive { get; set; }

    public int QuestionCount { get; set; }

    public int DurationInMinutes { get; set; }

    [StringLength(7), Required]
    public string ThemeColor { get; set; }

    public ICollection<Question> Questions { get; set; }

    public ICollection<Test> Tests { get; set; }
}
