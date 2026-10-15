namespace KramarDev.Quiz.DALAbstractions.Repositories;

public interface IUserAccountRepository
{
    Task<UserAccountDto> FindByNameAsync(string userName, CancellationToken cancellationToken = default);

    Task<UserAccountDto> FindByCredentialsAsync(string userName, string password, CancellationToken cancellationToken = default);

    Task<AccountErrorDto[]> CreateAndSaveAsync(string userName, string password, CancellationToken cancellationToken = default);

    Task<AccountErrorDto[]> AddToRoleAndSaveAsync(string userName, string role, CancellationToken cancellationToken = default);
}
