using System.ComponentModel.DataAnnotations;

namespace KramarDev.Quiz.WebAPI.Model;

public sealed record LoginModel
{
    [Required]
    [StringLength(32, MinimumLength = 3)]
    public string Username { get; init; }

    [Required]
    [StringLength(32, MinimumLength = 6)]
    public string Password { get; init; }
}
