using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace KramarDev.Quiz.WebAPI.Controllers;

public sealed class AppController(IApplicationDataStore dataService,
    IAppService appService, IJwtTokenGenerator tokenService) : BaseController
{
    readonly IApplicationDataStore _dataService = dataService;
    readonly IAppService _appService = appService;
    readonly IJwtTokenGenerator _tokenService = tokenService;

    [HttpGet("init-state")]
    public async Task<ActionResult<AppStateModel>> GetInitialStateAsync(CancellationToken cancellationToken)
    {
        AppStateModel model = new();

        IReadOnlyList<TopicDto> topics = _dataService.GetTopics();
        model.Topics = topics.Select(t => TopicModel.FromBLL(t)).ToArray();

        if (UserName != null)
        {
            AuthUserDto user = await _appService.FindByNameAsync(UserName, cancellationToken);
            if (user != null)
                model.User = await ToModelAsync(user);
        }

        return model;
    }

    [HttpPost("login")]
    [EnableRateLimiting(RateLimiterName)]
    [RequestSizeLimit(4 * 1024)]
    public async Task<ActionResult<UserModel>> Login(LoginModel login, CancellationToken cancellationToken)
    {
        AuthUserDto user = await _appService.LoginAsync(login.Username, login.Password, cancellationToken);
        if (user == null)
            return Unauthorized();

        return await ToModelAsync(user);
    }

    [HttpPost("register")]
    [EnableRateLimiting(RateLimiterName)]
    [RequestSizeLimit(4 * 1024)]
    public async Task<ActionResult<UserModel>> Register(RegisterModel register, CancellationToken cancellationToken)
    {
        RegisterResultDto result = await _appService.RegisterAsync(
            register.Username, register.Password, cancellationToken);

        if (result.Errors.Length > 0)
        {
            foreach (AccountErrorDto error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        return await ToModelAsync(result.User);
    }

    private async Task<UserModel> ToModelAsync(AuthUserDto user)
    {
        return new UserModel
        {
            Token = await _tokenService.GenerateTokenAsync(user.Login, user.Roles),
            Login = user.Login
        };
    }
}
