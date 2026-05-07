using System.Security.Claims;
using AiHealth.Api.DTOs.Health;
using AiHealth.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiHealth.Api.Controllers;

[ApiController]
[Route("api/health")]
[Authorize]
public class HealthController : ControllerBase
{
    private readonly HealthService _healthService;

    public HealthController(HealthService healthService)
    {
        _healthService = healthService;
    }

    [HttpPost("calculate")]
    public async Task<IActionResult> Calculate(CalculateBmiRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        var result = await _healthService.CalculateAndSaveBmiAsync(int.Parse(userId), request);

        return Ok(result);
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        var result = await _healthService.GetHistoryAsync(int.Parse(userId));

        return Ok(result);
    }
}