namespace KramarDev.Quiz.BLLAbstractions.Dto;

public sealed class AuthUserDto
{
    public string Login { get; init; }

    public string[] Roles { get; init; }
}
