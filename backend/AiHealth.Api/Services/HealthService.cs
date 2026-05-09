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
            record.Height,
            record.Weight,
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

    public async Task<object> GenerateAiRecommendationAsync(
        int userId,
        AiRecommendationRequest request
    )
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
            throw new Exception("Колдонуучу табылган жок");

        var latestRecord = await _context.HealthRecords
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync();

        var bmiText = latestRecord != null
            ? $"Сиздин акыркы BMI көрсөткүчүңүз {latestRecord.BMI}, категорияңыз: {latestRecord.Category}."
            : "Азырынча BMI тарыхы жок.";

        var recommendation = $@"
{bmiText}

Максатыңыз: {request.Goal}
Активдүүлүк деңгээли: {request.ActivityLevel}

AI сунуш:
1. Күн сайын 1.5–2 литр суу ичүүгө аракет кылыңыз.
2. Тамактанууда жашылча, белок жана пайдалуу углеводдорду тең салмакта колдонуңуз.
3. Аптасына кеминде 3 жолу жеңил физикалык активдүүлүк жасаңыз.
4. Уйку режимиңизди сактаңыз: күнүнө 7–8 саат уктоо сунушталат.
5. Өзүңүздү начар сезсеңиз, сөзсүз дарыгерге кайрылыңыз.

Эскертүү: Бул медициналык диагноз эмес, маалыматтык сунуш.
";

        return new
        {
            user = $"{user.FirstName} {user.LastName}",
            goal = request.Goal,
            activityLevel = request.ActivityLevel,
            recommendation
        };
    }

    public async Task<object> GenerateNutritionPlanAsync(
        int userId,
        NutritionPlanRequest request
    )
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
            throw new Exception("Колдонуучу табылган жок");

        string breakfast;
        string lunch;
        string dinner;

        if (request.Goal == "Арыктоо")
        {
            breakfast = "Сулу боткосу, кайнатылган жумуртка жана көк чай";
            lunch = "Тоок эти, гречка жана жашылча салаты";
            dinner = "Балык, брокколи жана жеңил салат";
        }
        else if (request.Goal == "Салмак кошуу")
        {
            breakfast = "Жумуртка, сыр, нан жана банан";
            lunch = "Эт, күрүч жана жашылча салаты";
            dinner = "Макарон, тоок эти жана айран";
        }
        else if (request.Goal == "Булчуң көбөйтүү")
        {
            breakfast = "Омлет, сулу боткосу жана сүт";
            lunch = "Тоок эти, күрүч жана жашылча";
            dinner = "Балык, картошка жана салат";
        }
        else
        {
            breakfast = "Йогурт, жемиш жана сулу";
            lunch = "Шорпо, салат жана тоок эти";
            dinner = "Жеңил белоктуу тамак жана жашылча";
        }

        var nutritionPlan = $@"
Күнүмдүк калория: {request.DailyCalories}
Тамак саны: {request.MealsPerDay}

Эртең менен:
{breakfast}

Түшкү тамак:
{lunch}

Кечки тамак:
{dinner}

Кошумча сунуштар:
1. Күнүнө 1.5–2 литр суу ичиңиз.
2. Газдалган суусундуктарды жана ашыкча кантты азайтыңыз.
3. Тамакты бир убакта жегенге аракет кылыңыз.
4. Жашылча жана белокко бай азыктарды көбүрөөк колдонуңуз.
5. Бул медициналык диета эмес, маалыматтык сунуш.
";

        return new
        {
            user = $"{user.FirstName} {user.LastName}",
            goal = request.Goal,
            dailyCalories = request.DailyCalories,
            mealsPerDay = request.MealsPerDay,
            nutritionPlan
        };
    }
}