using AiHealth.Api.Data;
using AiHealth.Api.DTOs.Health;
using AiHealth.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AiHealth.Api.Services;

public class HealthService
{
    private readonly AppDbContext _context;

    public HealthService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<object> CalculateAndSaveBmiAsync(int userId, CalculateBmiRequest request)
    {
        var heightInMeters = request.Height / 100.0;
        var bmi = request.Weight / (heightInMeters * heightInMeters);
        bmi = Math.Round(bmi, 1);

        string category;
        string recommendation;

        if (bmi < 18.5)
        {
            category = "Салмак жетишсиз";
            recommendation = "Белокко бай тамактарды көбүрөөк колдонуу сунушталат.";
        }
        else if (bmi < 25)
        {
            category = "Норма";
            recommendation = "Сергек жашоо образын улантыңыз.";
        }
        else
        {
            category = "Ашыкча салмак";
            recommendation = "Күн сайын активдүү кыймыл жасап, туура тамактануу сунушталат.";
        }

        var record = new HealthRecord
        {
            UserId = userId,
            Height = request.Height,
            Weight = request.Weight,
            BMI = bmi,
            Category = category,
            Recommendation = recommendation
        };

        _context.HealthRecords.Add(record);
        await _context.SaveChangesAsync();

        return new
        {
            record.Id,
            record.BMI,
            record.Category,
            record.Recommendation,
            record.CreatedAt
        };
    }

    public async Task<List<object>> GetHistoryAsync(int userId)
    {
        return await _context.HealthRecords
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new object[]
            {
                new
                {
                    x.Id,
                    x.Height,
                    x.Weight,
                    x.BMI,
                    x.Category,
                    x.Recommendation,
                    x.CreatedAt
                }
            })
            .Select(x => x[0])
            .ToListAsync();
    }
}