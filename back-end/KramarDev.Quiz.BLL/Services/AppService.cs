using DAL = KramarDev.Quiz.DALAbstractions.Dto;
using KramarDev.Quiz.DALAbstractions.Repositories;

namespace KramarDev.Quiz.BLL.Services;

public sealed class AppService(IUserAccountRepository accounts) : IAppService
{
    private const string MemberRole = "Member";

    private readonly IUserAccountRepository _accounts = accounts;

    public async Task<AuthUserDto> LoginAsync(
        string username, string password, CancellationToken cancellationToken = default)
    {
        DAL.UserAccountDto user = await _accounts.FindByCredentialsAsync(username, password, cancellationToken);
        return user == null ? null : Map(user);
    }

    public async Task<RegisterResultDto> RegisterAsync(
        string username, string password, CancellationToken cancellationToken = default)
    {
        DAL.AccountErrorDto[] createErrors = await _accounts.CreateAndSaveAsync(username, password, cancellationToken);
        if (createErrors.Length > 0)
            return Failed(createErrors);

        DAL.AccountErrorDto[] roleErrors = await _accounts.AddToRoleAndSaveAsync(username, MemberRole, cancellationToken);
        if (roleErrors.Length > 0)
            return Failed(roleErrors);

        return new RegisterResultDto
        {
            User = new AuthUserDto
            {
                Login = username,
                Roles = [MemberRole]
            },
            Errors = []
        };
    }

    public async Task<AuthUserDto> FindByNameAsync(string username, CancellationToken cancellationToken = default)
    {
        DAL.UserAccountDto user = await _accounts.FindByNameAsync(username, cancellationToken);
        return user == null ? null : Map(user);
    }

    private static AuthUserDto Map(DAL.UserAccountDto user)
    {
        return new AuthUserDto
        {
            Login = user.UserName,
            Roles = user.Roles
        };
    }

    private static RegisterResultDto Failed(DAL.AccountErrorDto[] errors)
    {
        AccountErrorDto[] mapped = new AccountErrorDto[errors.Length];
        for (int i = 0; i < errors.Length; ++i)
        {
            mapped[i] = new AccountErrorDto
            {
                Code = errors[i].Code,
                Description = errors[i].Description
            };
        }

        return new RegisterResultDto
        {
            Errors = mapped
        };
    }
}
