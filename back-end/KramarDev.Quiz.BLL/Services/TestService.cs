using KramarDev.Quiz.DALAbstractions.Dto;
using BL = KramarDev.Quiz.BLLAbstractions.Dto;
using DAL = KramarDev.Quiz.DALAbstractions.Dto;

namespace KramarDev.Quiz.BLL.Services;

public sealed class TestService(IUnitOfWork uow, IApplicationDataStore dataService) : ITestService
{
    private readonly IUnitOfWork _uow = uow;
    private readonly IApplicationDataStore _dataService = dataService;

    // PUBLIC API

    public async Task<BL.TestDto> CreateTestAsync(string topicName, string userName,
        string ipAddress, CancellationToken cancellationToken = default)
    {
        BL.TopicDto topic = _dataService.GetTopicByName(topicName);
        NewTestData testData = GenerateRandomQuestionsForTest(topic);

        DAL.NewTestDto newTest = new()
        {
            TopicId = testData.TopicId,
            Username = userName,
            StartDate = DateTime.UtcNow,
            RemoteIpAddress = ipAddress,
            QuestionIds = testData.QuestionIds,
            TotalPoints = testData.TotalPoints,
        };

        int testId = await _uow.TestRepository.CreateTestAsync(newTest, cancellationToken);

        try
        {
            BL.QuestionDto firstQuestion = await GetNextQuestionAsync(testId, userName, cancellationToken);
            return new BL.TestDto
            {
                TestId = testId,
                TopicName = topicName,
                QuestionCount = testData.QuestionIds.Length,
                SecondsLeft = topic.DurationInMinutes * 60,
                Question = firstQuestion,
                TopicColor = topic.ThemeColor,
            };
        }
        catch
        {
            await _uow.TestRepository.CancelTestAndSaveAsync(userName, testId, CancellationToken.None);
            throw;
        }
    }

    public async Task<AnswerResponseDto> AnswerAndNextAsync(int testId,
        int questionId, byte answerNumber, string userName, CancellationToken cancellationToken = default)
    {
        var currentTest = await _uow.TestRepository.GetTestAsync(testId, cancellationToken);
        if (userName != currentTest.Username)
        {
            throw new UnauthorizedAccessException("The test does not belong to the current user.");
        }

        int durationInMin = _dataService.GetTopicById(currentTest.TopicId).DurationInMinutes;
        int secondsLeft = CalculateLeftSeconds(currentTest, durationInMin);

        BL.QuestionDto nextQuestion = null;
        if (secondsLeft > 0)
        {
            await SubmitAnswerAsync(testId, questionId, answerNumber, userName, cancellationToken);
            nextQuestion = await GetNextQuestionAsync(testId, userName, cancellationToken);
            nextQuestion?.SecondsLeft = CalculateLeftSeconds(currentTest, durationInMin);
        }

        // If there is a next question, return it immediately
        if (nextQuestion != null)
        {
            return new AnswerResponseDto
            {
                NextQuestion = nextQuestion,
                TestResult = null
            };
        }

        return new AnswerResponseDto
        {
            NextQuestion = null,
            TestResult = await BuildAndCompleteTestAsync(testId, userName, cancellationToken),
        };
    }

    public async Task<BL.TestDto> RestoreCurrentTestAsync(string userName, CancellationToken cancellationToken = default)
    {
        int? testId = await _uow.TestRepository.GetActiveTestByUserAsync(userName, cancellationToken);
        if (testId == null)
        {
            return null;
        }

        DAL.CurrentTestStateDto dalTestDto =
            await _uow.TestRepository.GetCurrentTestStateAsync(testId.Value, cancellationToken);

        if (dalTestDto == null)
        {
            return null;
        }

        BL.TopicDto topic = _dataService.GetTopicById(dalTestDto.TopicId);

        DateTime now = DateTime.UtcNow;
        int secondsLeft = topic.DurationInMinutes * 60 - (int)(now - dalTestDto.StartDate).TotalSeconds;

        if (secondsLeft <= 0)
        {
            await BuildAndCompleteTestAsync(testId.Value, userName, cancellationToken);
            return null;
        }

        BL.TestDto testDto = new()
        {
            SecondsLeft = secondsLeft,
            TestId = dalTestDto.TestId,
            QuestionCount = dalTestDto.TotalQuestions,
            Question = DtoMapper.FromDAL(dalTestDto.CurrentQuestion),
            TopicName = topic.Name,
            TopicColor = topic.ThemeColor,
        };

        return testDto;
    }

    public Task CancelTestAsync(string userName, int testId, CancellationToken cancellationToken = default)
    {
        return _uow.TestRepository.CancelTestAndSaveAsync(userName, testId, cancellationToken);
    }

    public Task<TestResultDto> CompleteAsync(int testId,
        string userName, CancellationToken cancellationToken = default)
    {
        return BuildAndCompleteTestAsync(testId, userName, cancellationToken);
    }

    public Task HideAsync(string userName, CancellationToken cancellationToken = default)
    {
        return _uow.StatisticsRepository.HideTestsForUserAndSaveAsync(userName, cancellationToken);
    }

    // PRIVATE HELPERS
    private async Task<BL.QuestionDto> GetNextQuestionAsync(
        int testId, string userName, CancellationToken cancellationToken = default)
    {
        DAL.QuestionDto nextQuestionDAL =
            await _uow.QuestionRepository.SelectNextQuestionAsync(testId, userName, cancellationToken);

        if (nextQuestionDAL != null)
        {
            await _uow.QuestionRepository.UpdateTestQuestionDateAndSaveAsync(testId,
                nextQuestionDAL.TestQuestionId, cancellationToken);

            return DtoMapper.FromDAL(nextQuestionDAL);
        }

        return null;
    }

    private async Task SubmitAnswerAsync(int testId, int questionId,
        byte answerNumber, string username, CancellationToken cancellationToken = default)
    {
        bool canAnswer = await _uow.TestRepository.CanAnswerQuestionAsync(
            testId, questionId, username, cancellationToken);
        if (!canAnswer)
        {
            throw new InvalidOperationException(
                $"User {username} cannot answer question {questionId} for test {testId}");
        }

        DAL.QuestionInfoDto questionInfo =
            await _uow.TestRepository.GetQuestionInfoAsync(questionId, cancellationToken);

        DAL.QuestionAnswerDto answer = new()
        {
            TestId = testId,
            QuestionId = questionId,
            AnswerNumber = answerNumber,
            AnswerPoints = (byte)(answerNumber == questionInfo.CorrectAnswerNumber ? 1 : 0),
            AnswerDate = DateTime.UtcNow
        };

        bool isCorrect = answer.AnswerPoints > 0;

        await _uow.TestRepository.AnswerAndSaveAsync(answer, cancellationToken);
        await _uow.QuestionRepository.IncrementQuestionCounterAsync(questionId, isCorrect, cancellationToken);
    }

    private async Task<TestResultDto> BuildAndCompleteTestAsync(
        int testId, string userName, CancellationToken cancellationToken)
    {
        AnswerDto[] answers = DtoMapper.FromDAL(
            await _uow.QuestionRepository.GetAnswersAsync(testId, userName, cancellationToken));

        CalculateFinalScore(
            answers,
            out int finalScore,
            out int finalWeightedScore,
            out int totalPoints,
            out int earnedPoints,
            out int answeredCount);

        DAL.TopicDto topic = await _uow.TopicRepository.GetTopicByTestIdAsync(testId, cancellationToken);

        var dto = new TestResultDto
        {
            Answers = answers,
            TotalPoints = totalPoints,
            FinalScore = finalScore,
            EarnedPoints = earnedPoints,
            AnsweredCount = answeredCount,
            TopicName = topic.Name
        };

        var dtoParam = new CompleteTestDto(userName, testId, finalScore,
            finalWeightedScore, answeredCount, earnedPoints);

        await _uow.TestRepository.CompleteTestAndSaveAsync(dtoParam, cancellationToken);

        return dto;
    }

    private NewTestData GenerateRandomQuestionsForTest(BL.TopicDto topic)
    {
        var (ids, totalPoints) = GenerateTestQuestions(topic.Name, topic.QuestionCount);

        return new NewTestData
        {
            QuestionIds = ids,
            TotalPoints = totalPoints,
            TopicId = topic.Id
        };
    }

    private (int[], int) GenerateTestQuestions(string topicName, int questionAmount)
    {
        int[] easyIds = _dataService.GetEasyQuestionIds(topicName);
        int[] middleIds = _dataService.GetMediumQuestionIds(topicName);
        int[] hardIds = _dataService.GetHardQuestionIds(topicName);

        int easyAmount = questionAmount / 2;
        int middleAmount = questionAmount / 3;
        int hardAmount = questionAmount - (easyAmount + middleAmount);

        if (easyIds.Length < easyAmount)
        {
            throw new InvalidOperationException(
                $"Not enough easy questions for topic: {topicName}. " +
                $"Required: {easyAmount}, available: {easyIds.Length}");
        }

        if (middleIds.Length < middleAmount)
        {
            throw new InvalidOperationException(
                $"Not enough middle questions for topic: {topicName}. " +
                $"Required: {middleAmount}, available: {middleIds.Length}");
        }

        if (hardIds.Length < hardAmount)
        {
            throw new InvalidOperationException(
                $"Not enough hard questions for topic: {topicName}. " +
                $"Required: {hardAmount}, available: {hardIds.Length}");
        }

        List<int> generatedIds = new(questionAmount);
        generatedIds.AddRange(GenerateQuestionIds(easyIds, easyAmount));
        generatedIds.AddRange(GenerateQuestionIds(middleIds, middleAmount));
        generatedIds.AddRange(GenerateQuestionIds(hardIds, hardAmount));

        int totalPoints = easyAmount + middleAmount * 2 + hardAmount * 3;

        return (generatedIds.ToArray(), totalPoints);
    }

    private static int CalculateLeftSeconds(DAL.TestDto test, int durationInMin)
    {
        return Math.Max(0, (int)Math.Ceiling(
                (test.StartDate.AddMinutes(durationInMin) - DateTime.UtcNow).TotalSeconds));
    }

    private static int[] GenerateQuestionIds(int[] ids, int amount)
    {
        int[] generatedIds = new int[amount];
        var selectedIndices = new HashSet<int>(amount);
        for (int i = 0, index; i < amount; ++i)
        {
            while (!selectedIndices.Add(index = Random.Shared.Next(ids.Length))) ;

            generatedIds[i] = ids[index];
        }

        return generatedIds;
    }

    private static void CalculateFinalScore(AnswerDto[] answers, out int finalScore,
        out int finalWeightedScore, out int totalPoints, out int earnedPoints, out int answeredCount)
    {
        totalPoints = 0;
        earnedPoints = 0;
        answeredCount = 0;

        for (int i = 0; i < answers.Length; ++i)
        {
            AnswerDto answer = answers[i];
            totalPoints += answer.Complexity;
            if (answer.Answer == answer.CorrectAnswer)
            {
                earnedPoints += answer.Complexity;
                ++answeredCount;
            }
        }

        finalScore = CalculateScore(answeredCount, answers.Length);
        finalWeightedScore = CalculateScore(earnedPoints, totalPoints);
    }

    private static int CalculateScore(int earned, int total)
    {
        if (total == 0)
            return 0;

        return (int)Math.Round((earned / (double)total) * 100, MidpointRounding.AwayFromZero);
    }
}
