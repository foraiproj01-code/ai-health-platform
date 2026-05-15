using System.Security.Claims;
using AiHealth.Api.DTOs.Water;
using AiHealth.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiHealth.Api.Controllers;

[ApiController]
[Route("api/water")]
[Authorize]
public class WaterController : ControllerBase
{
    private readonly WaterService _waterService;

    public WaterController(WaterService waterService)
    {
        _waterService = waterService;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddWater(AddWaterRequest request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _waterService.AddWaterAsync(userId, request);

        return Ok(result);
    }

    [HttpGet("today")]
    public async Task<IActionResult> GetToday()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var total = await _waterService.GetTodayTotalAsync(userId);

        return Ok(new
        {
            totalMl = total,
            goalMl = 2000,
            percent = Math.Min(100, total * 100 / 2000)
        });
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var history = await _waterService.GetHistoryAsync(userId);

        return Ok(history);
    }
}