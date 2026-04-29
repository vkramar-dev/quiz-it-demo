using System.ComponentModel.DataAnnotations;

namespace KramarDev.Quiz.DAL.Database.Tables;

public class Message
{
    public int Id { get; set; }

    [Required]
    public string Username { get; set; }

    [Required]
    public string Email { get; set; }

    [Required]
    public string Text { get; set; }

    [Required]
    public DateTime Data { get; set; }
}
