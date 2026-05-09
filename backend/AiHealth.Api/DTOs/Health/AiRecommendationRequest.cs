namespace AiHealth.Api.DTOs.Health;

public class AiRecommendationRequest
{
    public string Goal { get; set; } = string.Empty;
    public string ActivityLevel { get; set; } = string.Empty;
}