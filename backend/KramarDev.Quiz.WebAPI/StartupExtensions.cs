using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.RateLimiting;

namespace KramarDev.Quiz.WebAPI;

public static class StartupExtensions
{
    public static IServiceCollection AddCustomSwagger(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Quiz API",
                Version = "v1"
            });

            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Description = "Enter: Bearer {your JWT token}",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
            });

            c.AddSecurityRequirement(document => new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecuritySchemeReference("Bearer", document),
                    new List<string>()
                }
            });
        });

        return services;
    }

    public static IServiceCollection AddAppCors(this IServiceCollection services, string policyName, bool isProduction)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(policyName, policy =>
            {
                if (isProduction)
                {

                    policy
                        .WithOrigins(
                            "https://quiz-it.online",
                            "https://www.quiz-it.online")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .SetPreflightMaxAge(TimeSpan.FromDays(1));
                }
                else
                {
                    policy
                        .WithOrigins(
                            "http://localhost:3000",
                            "http://localhost:3004",
                            "http://127.0.0.1:3000",
                            "http://127.0.0.1:3004")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .SetPreflightMaxAge(TimeSpan.FromDays(1));
                }
            });
        });

        return services;
    }

    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var tokenKey = configuration["JWTSettings:TokenKey"]
            ?? throw new InvalidOperationException("JWTSettings:TokenKey was not found.");

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(tokenKey))
                };
            });

        return services;
    }

    public static IApplicationBuilder UseCustomSwagger(this IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment() || env.IsStaging())
        {
            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Quiz API V1");
                c.ConfigObject.AdditionalItems["persistAuthorization"] = "true";
            });
        }

        return app;
    }

    public static IServiceCollection AddLogger(this IServiceCollection services, IConfiguration configuration)
    {
        var logapiSecret = configuration["LogApi:Secret"]
            ?? throw new InvalidOperationException("LogApi:Secret was not found.");

        services.AddSingleton<LogPlatform.LogClient.ILogger>(sp =>
        {
            var env = sp.GetRequiredService<IHostEnvironment>();

            return new LogPlatform.LogClient.Logger(
                sp.GetRequiredService<IHttpContextAccessor>(),
                Product.FlashcardTrainer,
                logapiSecret,
                env.IsDevelopment() ? "https://localhost:7011" : null);
        });

        return services;
    }

    public static WebApplication UseAppExceptionHandler(this WebApplication app)
    {
        app.UseExceptionHandler(errorApp =>
        {
            errorApp.Run(async context =>
            {
                var logger = context.RequestServices
                    .GetRequiredService<KramarDev.LogPlatform.LogClient.ILogger>();

                var env = context.RequestServices
                    .GetRequiredService<IHostEnvironment>();

                var exceptionFeature = context.Features
                    .Get<IExceptionHandlerFeature>();

                var exception = exceptionFeature?.Error;

                if (exception is not null)
                {
                    await logger.LogAspNetExceptionAsync(exception, "Global Handler",
                        Severity.Medium, SourceType.Backend);
                }
                else
                {
                    await logger.LogAspNetInfoAsync("Global Handler",
                        Severity.Low, SourceType.Backend);
                }

                context.Response.Clear();
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                context.Response.ContentType = "application/problem+json";

                var problem = new ProblemDetails
                {
                    Status = StatusCodes.Status500InternalServerError,
                    Title = "An unexpected error occurred.",
                    Detail = env.IsDevelopment()
                        ? exception?.Message
                        : "Please try again later."
                };

                await context.Response.WriteAsJsonAsync(problem);
            });
        });

        return app;
    }

    public static WebApplication UseApiNoCaching(this WebApplication app)
    {
        app.Use(async (context, next) =>
        {
            if (context.Request.Path.StartsWithSegments("/api"))
            {
                context.Response.Headers.CacheControl = "no-store, no-cache, must-revalidate";
                context.Response.Headers.Pragma = "no-cache";
                context.Response.Headers.Expires = "0";
            }

            await next();
        });

        return app;
    }

    public static IServiceCollection AddAppForwardedHeaders(this IServiceCollection services)
    {
        services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            options.KnownIPNetworks.Clear();
            options.KnownProxies.Clear();
        });

        return services;
    }

    public static IServiceCollection AddAppRateLimiting(this IServiceCollection services, string rateLimitName)
    {
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            options.AddPolicy(rateLimitName, httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 10,
                        Window = TimeSpan.FromMinutes(1),
                        QueueLimit = 0
                    }));
        });

        return services;
    }
}
