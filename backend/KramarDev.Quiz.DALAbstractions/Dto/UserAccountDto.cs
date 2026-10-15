namespace KramarDev.Quiz.DALAbstractions.Dto;

public sealed class UserAccountDto
{
    public string UserName { get; init; }

    public string[] Roles { get; init; }
}
