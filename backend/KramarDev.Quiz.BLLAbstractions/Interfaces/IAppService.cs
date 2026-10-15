namespace KramarDev.Quiz.BLLAbstractions.Interfaces;

public interface IAppService
{
    Task<AuthUserDto> LoginAsync(string username, string password, CancellationToken cancellationToken = default);

    Task<RegisterResultDto> RegisterAsync(string username, string password, CancellationToken cancellationToken = default);

    Task<AuthUserDto> FindByNameAsync(string username, CancellationToken cancellationToken = default);
}
