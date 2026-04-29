using KramarDev.Quiz.BLL.Services;
using KramarDev.Quiz.DAL;
using KramarDev.Quiz.DAL.Database;
using KramarDev.Quiz.DAL.Database.Tables;
using KramarDev.Quiz.DALAbstractions;
using KramarDev.Quiz.WebAPI.Controllers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace KramarDev.Quiz.WebAPI;

public class Program
{
    private const string CorsPolicyName = "QuizCORS";

    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var connectionString = builder.Configuration.GetConnectionString("QuizDbConnection")
                ?? throw new InvalidOperationException("Connection string 'QuizDbConnection' was not found.");

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddCustomSwagger();
        builder.Services.AddDbContext<QuizDbContext>(opt =>
        {
            opt.UseSqlServer(connectionString, sqlOptions =>
            {
                sqlOptions.EnableRetryOnFailure();
            });
        });
        
        builder.Services.AddAppCors(CorsPolicyName, builder.Environment.IsProduction());
        builder.Services.AddIdentityCore<User>(opt =>
        {
            opt.Password.RequireUppercase = false;
            opt.Password.RequiredLength = 6;
            opt.Password.RequireLowercase = false;
            opt.User.RequireUniqueEmail = true;
            opt.Password.RequireDigit = false;
            opt.Password.RequireNonAlphanumeric = false;
        })
        .AddRoles<IdentityRole>()
        .AddEntityFrameworkStores<QuizDbContext>();

        builder.Services.AddAppRateLimiting(BaseController.RateLimiterName);
        builder.Services.AddJwtAuthentication(builder.Configuration);
        builder.Services.AddAuthorization();
        builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
        builder.Services.AddScoped<ITestService, TestService>();
        builder.Services.AddScoped<IStatisticsService, StatisticsService>();
        builder.Services.AddSingleton<IStatisticsCacheService, StatisticsCacheService>();
        builder.Services.AddSingleton<IApplicationDataStore, ApplicationDataStore>();
        builder.Services.AddMemoryCache();

        var app = builder.Build();
        app.UseApiNoCaching();
        app.UseAppExceptionHandler();
        app.UseCustomSwagger(app.Environment);
        app.UseHttpsRedirection();
        app.UseCors(CorsPolicyName);
        app.UseRateLimiter();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        using (var scope = app.Services.CreateScope())
        {
            var uow = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            await uow.UpdateDbAsync();

            var dataStore = scope.ServiceProvider.GetRequiredService<IApplicationDataStore>();
            await dataStore.InitializeAsync();
        }

        await app.RunAsync();
    }
}