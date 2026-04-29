using KramarDev.Quiz.WebAPI.Model.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KramarDev.Quiz.WebAPI.Controllers;

public sealed class TestsController(ITestService testService) : BaseController
{
    private readonly ITestService _testService = testService;


    [Authorize]
    [HttpGet("current")]
    public async Task<ActionResult<TestModel>> Current(CancellationToken cancellationToken)
    {
        TestDto testDto = await _testService.RestoreCurrentTestAsync(UserName, cancellationToken);

        if (testDto == null)
            return Ok(null);

        return Ok(TestModel.FromBL(testDto));
    }

    [Authorize]
    [HttpPost("create")]
    public async Task<ActionResult<TestModel>> Create([FromBody] CreateTestRequest request, CancellationToken cancellationToken)
    {
        TestDto testDto = await _testService.CreateTestAsync(
            request.TopicName, UserName, IpAddress, cancellationToken);

        return Ok(TestModel.FromBL(testDto));
    }

    [Authorize]
    [HttpPost("answer")]
    public async Task<ActionResult<AnswerResponseModel>> Answer([FromBody] AnswerRequest requestModel)
    {
        AnswerResponseDto responseDto = await _testService.AnswerAndNextAsync(
            requestModel.TestId, requestModel.QuestionId, requestModel.AnswerNumber, UserName);

        return Ok(AnswerResponseModel.FromBLL(responseDto));
    }

    [Authorize]
    [HttpPost("cancel")]
    public async Task<ActionResult> Cancel([FromBody] CancelTestRequest request)
    {
        await _testService.CancelTestAsync(UserName, request.TestId);
        return Ok();
    }

    [Authorize]
    [HttpPost("complete")]
    public async Task<ActionResult<TestResultModel>> Complete([FromBody] CompleteTestRequest request)
    {
        TestResultDto resultDto = await _testService.CompleteAsync(request.TestId, UserName);
        return Ok(TestResultModel.FromBLL(resultDto));
    }
}