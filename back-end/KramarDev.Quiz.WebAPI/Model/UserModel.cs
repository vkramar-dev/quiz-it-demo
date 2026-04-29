namespace KramarDev.Quiz.WebAPI.Model;

public sealed record UserModel
{
    public string Login { get; init; }

    public string Email { get; init; }

    public string Token { get; init; }
}
