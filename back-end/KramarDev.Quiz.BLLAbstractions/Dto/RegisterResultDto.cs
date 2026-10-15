namespace KramarDev.Quiz.BLLAbstractions.Dto;

public sealed class RegisterResultDto
{
    public AuthUserDto User { get; init; }

    public AccountErrorDto[] Errors { get; init; }
}
