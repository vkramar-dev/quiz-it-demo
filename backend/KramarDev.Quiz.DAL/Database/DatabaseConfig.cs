using Microsoft.Extensions.Configuration;

namespace KramarDev.Quiz.DAL.Database;

public static class DatabaseConfig
{
    private const string QuizDbConnectionKey = "QuizDbConnection";

    public static string GetConnectionString()
    {
        // Try to get from environment variable first
        var connectionString = Environment.GetEnvironmentVariable(QuizDbConnectionKey);

        if (!string.IsNullOrEmpty(connectionString))
        {
            return connectionString;
        }

        // Try to get from configuration file
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .Build();

        connectionString = configuration.GetConnectionString(QuizDbConnectionKey);

        if (!string.IsNullOrEmpty(connectionString))
        {
            return connectionString;
        }

        // Fallback for development (should not be used in production)
        throw new InvalidOperationException("Connection string not found in environment variables or configuration files.");
    }
}
