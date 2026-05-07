namespace AiHealth.Api.Models;

public class HealthRecord
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public double Weight { get; set; }

    public double Height { get; set; }

    public double BMI { get; set; }

    public string Category { get; set; } = string.Empty;

    public string Recommendation { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
}