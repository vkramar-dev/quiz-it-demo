using KramarDev.Quiz.WebAPI.Model.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KramarDev.Quiz.WebAPI.Controllers;

public class StatisticsController(IStatisticsService statisticsService, ITestService testService) : BaseController
{
    private readonly IStatisticsService _statisticsService = statisticsService;
    private readonly ITestService _testService = testService;

    [HttpGet("page")]
    public async Task<ActionResult<StatisticsPageModel>> Page(
        [FromQuery] StatisticsRequest param, CancellationToken cancellationToken)
    {
        return StatisticsPageModel.FromBLL(
            await _statisticsService.GetStatisticsPageAsync(StatisticsRequest.ToBLL(param), cancellationToken));
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<ActionResult<ProfileModel>> Profile(CancellationToken cancellationToken)
    {
        return ProfileModel.FromBLL(
            await _statisticsService.GetProfileAsync(UserName, cancellationToken));
    }

    [HttpGet("mistakes")]
    public async Task<ActionResult<MistakeModel[]>> Mistakes(
        [FromQuery] MistakesRequest param, CancellationToken cancellationToken)
    {
        return MistakeModel.FromBLL(
            await _statisticsService.GetMistakesAsync(MistakesRequest.ToBLL(param), cancellationToken));
    }

    [Authorize]
    [HttpPut("hide")]
    public async Task<ActionResult<ProfileModel>> Hide(CancellationToken cancellationToken)
    {
        await _testService.HideAsync(UserName, cancellationToken);
        return ProfileModel.FromBLL(
            await _statisticsService.GetProfileAsync(UserName, cancellationToken));
    }
}
