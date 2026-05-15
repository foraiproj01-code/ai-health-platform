using AiHealth.Api.Models;
using Microsoft.EntityFrameworkCore;
using AiHealth.Api.Models;

namespace AiHealth.Api.Data;


public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<HealthRecord> HealthRecords => Set<HealthRecord>();
    
    public DbSet<WaterLog> WaterLogs { get; set; }
}