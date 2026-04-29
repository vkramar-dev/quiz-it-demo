using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace KramarDev.Quiz.DAL.Database.Tables;

[Index(nameof(Name), IsUnique = true)]
public class Technology
{
    public int Id { get; set; }

    [StringLength(32), Required]
    public string Name { get; set; }

    [StringLength(220), Required]
    public string Description { get; set; }

    public bool IsActive { get; set; }

    public int QuestionsAmount { get; set; }

    public int DurationInMinutes { get; set; }

    public ICollection<Question> Questions { get; set; }

    public ICollection<Test> Tests { get; set; }
}
