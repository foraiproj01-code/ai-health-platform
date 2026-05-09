namespace AiHealth.Api.DTOs.Health;

public class NutritionPlanRequest
{
    public string Goal { get; set; } = string.Empty;

    public int DailyCalories { get; set; }

    public int MealsPerDay { get; set; }
}