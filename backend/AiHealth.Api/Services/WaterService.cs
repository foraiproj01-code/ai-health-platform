using AiHealth.Api.Data;
using AiHealth.Api.DTOs.Water;
using AiHealth.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AiHealth.Api.Services;

public class WaterService
{
    private readonly AppDbContext _context;

    public WaterService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<WaterLog> AddWaterAsync(int userId, AddWaterRequest request)
    {
        var log = new WaterLog
        {
            UserId = userId,
            AmountMl = request.AmountMl,
            CreatedAt = DateTime.UtcNow
        };

        _context.WaterLogs.Add(log);
        await _context.SaveChangesAsync();

        return log;
    }

    public async Task<int> GetTodayTotalAsync(int userId)
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        return await _context.WaterLogs
            .Where(x => x.UserId == userId && x.CreatedAt >= today && x.CreatedAt < tomorrow)
            .SumAsync(x => x.AmountMl);
    }

    public async Task<List<WaterLog>> GetHistoryAsync(int userId)
    {
        return await _context.WaterLogs
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .Take(30)
            .ToListAsync();
    }
}