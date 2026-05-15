namespace AiHealth.Api.DTOs.Health;

public class WorkoutPlanRequest
{
    public string Goal { get; set; } = string.Empty;

    public string Level { get; set; } = string.Empty;

    public int DaysPerWeek { get; set; }
}