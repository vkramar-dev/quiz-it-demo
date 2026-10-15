using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace KramarDev.Quiz.DAL.Database;

public class QuizDbContext : IdentityDbContext<User>
{
    public QuizDbContext()
    {
    }

    public QuizDbContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Test>()
            .HasMany(e => e.TestQuestions)
            .WithOne(e => e.Test)
            .HasForeignKey(e => e.TestId)
            .HasPrincipalKey(e => e.Id)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Test>()
            .Property(t => t.State)
            .HasConversion<byte>();

        builder.Entity<Test>()
            .ToTable(t => t.HasCheckConstraint(
                "CK_Test_State",
                "[State] in (0, 1, 2)"));

        builder.Entity<Question>()
            .HasMany(e => e.TestQuestions)
            .WithOne(e => e.Question)
            .HasForeignKey(e => e.QuestionId)
            .HasPrincipalKey(e => e.Id)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Topic>()
            .HasMany(e => e.Questions)
            .WithOne(e => e.Topic)
            .HasForeignKey(e => e.TopicId)
            .HasPrincipalKey(e => e.Id)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Topic>()
            .HasMany(e => e.Tests)
            .WithOne(e => e.Topic)
            .HasForeignKey(e => e.TopicId)
            .HasPrincipalKey(e => e.Id)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<IdentityRole>()
            .HasData(
                new IdentityRole
                {
                    Id = "7B4E9D6D-41C3-4E22-9B28-111111111111",
                    Name = "Member",
                    NormalizedName = "MEMBER",
                    ConcurrencyStamp = "A1C7E8D4-1111-4444-8888-111111111111"
                },
                new IdentityRole
                {
                    Id = "8C5F0E7E-52D4-5F33-AB39-222222222222",
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    ConcurrencyStamp = "B2D8F9E5-2222-5555-9999-222222222222"
                }
            );

        builder.Entity<Test>().HasIndex(e => e.Username);
        builder.Entity<Test>().HasIndex(e => e.FinalScore);
    }

    public DbSet<Question> Questions { get; set; }

    public DbSet<Topic> Topics { get; set; }

    public DbSet<Test> Tests { get; set; }

    public DbSet<TestQuestion> TestQuestions { get; set; }
}
