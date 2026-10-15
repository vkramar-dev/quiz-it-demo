using Microsoft.EntityFrameworkCore.Design;

namespace KramarDev.Quiz.DAL.Database;

public class DemoDbContextFactory : IDesignTimeDbContextFactory<QuizDbContext>
{
    public QuizDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<QuizDbContext>();
        optionsBuilder.UseSqlServer(DatabaseConfig.GetConnectionString());

        return new QuizDbContext(optionsBuilder.Options);
    }
}
