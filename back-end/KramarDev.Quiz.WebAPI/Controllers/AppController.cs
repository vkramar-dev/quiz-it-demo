using KramarDev.Quiz.DAL.Database.Tables;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Rewrite;

namespace KramarDev.Quiz.WebAPI.Controllers;

public sealed class AppController(IApplicationDataStore dataService,
    UserManager<User> userManager, IJwtTokenGenerator tokenService) : BaseController
{
    readonly IApplicationDataStore _dataService = dataService;
    readonly UserManager<User> _userManager = userManager;
    readonly IJwtTokenGenerator _tokenService = tokenService;

    [HttpGet("init-state")]
    public async Task<ActionResult<AppStateModel>> GetInitialStateAsync()
    {
        AppStateModel model = new();

        IReadOnlyList<TopicDto> topics = _dataService.GetTopics();
        model.Topics = topics.Select(t => TopicModel.FromBLL(t)).ToArray();

        if (UserName != null)
        {
            var user = await _userManager.FindByNameAsync(UserName);

            if (user != null)
            {
                model.User = new UserModel
                {
                    Email = user.Email,
                    Token = await _tokenService.GenerateTokenAsync(user),
                    Login = user.UserName
                };
            }
        }

        return model;
    }

    [HttpPost("login")]
    [EnableRateLimiting(RateLimiterName)]
    [RequestSizeLimit(4 * 1024)]
    public async Task<ActionResult<UserModel>> Login(LoginModel login)
    {
        var user = await _userManager.FindByNameAsync(login.Username);
        if (user == null || !await _userManager.CheckPasswordAsync(user, login.Password))
        {
            return Unauthorized();
        }

        return new UserModel
        {
            Email = user.Email,
            Token = await _tokenService.GenerateTokenAsync(user),
            Login = user.UserName
        };
    }

    [HttpPost("register")]
    [EnableRateLimiting(RateLimiterName)]
    [RequestSizeLimit(4 * 1024)]
    public async Task<ActionResult<UserModel>> Register(RegisterModel register)
    {
        const string MemberRole = "Member";

        var user = new User { UserName = register.Username, Email = register.Email };

        var result = await _userManager.CreateAsync(user, register.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        var roleResult = await _userManager.AddToRoleAsync(user, MemberRole);

        if (!roleResult.Succeeded)
        {
            foreach (var error in roleResult.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        return new UserModel
        {
            Email = user.Email,
            Token = await _tokenService.GenerateTokenAsync(user),
            Login = user.UserName
        };
    }
}
