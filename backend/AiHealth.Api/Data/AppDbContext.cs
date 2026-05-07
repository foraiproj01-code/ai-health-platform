using AiHealth.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AiHealth.Api.Data;


public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<HealthRecord> HealthRecords => Set<HealthRecord>();
}