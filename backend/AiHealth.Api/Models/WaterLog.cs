namespace AiHealth.Api.Models;

public class WaterLog
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int AmountMl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}