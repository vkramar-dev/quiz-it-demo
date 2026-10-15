using Microsoft.AspNetCore.Identity;

namespace KramarDev.Quiz.DAL.Repositories;

public sealed class UserAccountRepository(UserManager<User> userManager) : IUserAccountRepository
{
    private readonly UserManager<User> _userManager = userManager;

    public async Task<UserAccountDto> FindByNameAsync(string userName, CancellationToken cancellationToken = default)
    {
        User user = await _userManager.FindByNameAsync(userName);
        if (user == null)
            return null;

        IList<string> roles = await _userManager.GetRolesAsync(user);
        return new UserAccountDto
        {
            UserName = user.UserName,
            Roles = roles.ToArray()
        };
    }

    public async Task<UserAccountDto> FindByCredentialsAsync(
        string userName, string password, CancellationToken cancellationToken = default)
    {
        User user = await _userManager.FindByNameAsync(userName);
        if (user == null || !await _userManager.CheckPasswordAsync(user, password))
            return null;

        IList<string> roles = await _userManager.GetRolesAsync(user);
        return new UserAccountDto
        {
            UserName = user.UserName,
            Roles = roles.ToArray()
        };
    }

    public async Task<AccountErrorDto[]> CreateAndSaveAsync(
        string userName, string password, CancellationToken cancellationToken = default)
    {
        User user = new() { UserName = userName };
        IdentityResult result = await _userManager.CreateAsync(user, password);
        return ToErrors(result);
    }

    public async Task<AccountErrorDto[]> AddToRoleAndSaveAsync(
        string userName, string role, CancellationToken cancellationToken = default)
    {
        User user = await _userManager.FindByNameAsync(userName);
        if (user == null)
        {
            return
            [
                new AccountErrorDto
                {
                    Code = "UserNotFound",
                    Description = "User was not found."
                }
            ];
        }

        IdentityResult result = await _userManager.AddToRoleAsync(user, role);
        return ToErrors(result);
    }

    private static AccountErrorDto[] ToErrors(IdentityResult result)
    {
        if (result.Succeeded)
            return [];

        return result.Errors
            .Select(error => new AccountErrorDto
            {
                Code = error.Code,
                Description = error.Description
            })
            .ToArray();
    }
}
