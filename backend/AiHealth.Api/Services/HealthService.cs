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

    public async Task<object> GenerateWorkoutPlanAsync(
        int userId,
        WorkoutPlanRequest request
    )
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
            throw new Exception("Колдонуучу табылган жок");

        var latestRecord = await _context.HealthRecords
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync();

        var bmiText = latestRecord == null
            ? "BMI маалыматы жок"
            : $"Акыркы BMI: {latestRecord.BMI}, категория: {latestRecord.Category}";

        var plan = new List<object>();

        for (int day = 1; day <= request.DaysPerWeek; day++)
        {
            plan.Add(new
            {
                day = $"{day}-күн",
                title = GetWorkoutTitle(request.Goal),
                duration = GetWorkoutDuration(request.Level),
                exercises = GetWorkoutExercises(request.Goal)
            });
        }

        return new
        {
            user = $"{user.FirstName} {user.LastName}",
            goal = request.Goal,
            level = request.Level,
            daysPerWeek = request.DaysPerWeek,
            bmiInfo = bmiText,
            recommendation = GetWorkoutRecommendation(request.Level),
            plan
        };
    }

    private string GetWorkoutTitle(string goal)
    {
        if (goal == "Арыктоо")
            return "Май күйгүзүү машыгуусу";

        if (goal == "Булчуң көбөйтүү")
            return "Булчуң өстүрүү машыгуусу";

        if (goal == "Чыдамкайлык")
            return "Чыдамкайлык машыгуусу";

        return "Жалпы ден соолук машыгуусу";
    }

    private string GetWorkoutDuration(string level)
    {
        if (level == "Башталгыч")
            return "20-30 мүнөт";

        if (level == "Орточо")
            return "35-45 мүнөт";

        if (level == "Жогорку")
            return "50-60 мүнөт";

        return "30 мүнөт";
    }

    private List<string> GetWorkoutExercises(string goal)
    {
        if (goal == "Арыктоо")
        {
            return new List<string>
            {
                "5 мүнөт жеңил чуркоо",
                "Jumping jacks - 3 x 30 секунд",
                "Squat - 3 x 12",
                "Mountain climber - 3 x 20",
                "Планка - 3 x 30 секунд",
                "5 мүнөт созулуу"
            };
        }

        if (goal == "Булчуң көбөйтүү")
        {
            return new List<string>
            {
                "Жеңил жылынуу - 5 мүнөт",
                "Push-up - 4 x 10",
                "Squat - 4 x 12",
                "Lunge - 3 x 10",
                "Plank - 3 x 45 секунд",
                "Созулуу - 5 мүнөт"
            };
        }

        if (goal == "Чыдамкайлык")
        {
            return new List<string>
            {
                "Жеңил чуркоо - 10 мүнөт",
                "Burpees - 3 x 10",
                "Jump rope - 3 x 1 мүнөт",
                "Mountain climber - 3 x 25",
                "Планка - 3 x 40 секунд",
                "Дем алуу жана созулуу"
            };
        }

        return new List<string>
        {
            "Жеңил жылынуу - 5 мүнөт",
            "Жөө басуу - 15 мүнөт",
            "Squat - 3 x 10",
            "Push-up - 3 x 8",
            "Планка - 3 x 20 секунд",
            "Созулуу - 5 мүнөт"
        };
    }

    private string GetWorkoutRecommendation(string level)
    {
        if (level == "Башталгыч")
            return "Башында жеңил темп менен баштаңыз. Денени ашыкча кыйнабаңыз жана ар бир машыгуудан кийин эс алыңыз.";

        if (level == "Орточо")
            return "Орточо деңгээл үчүн машыгууларды туруктуу график менен аткарыңыз жана прогрессти көзөмөлдөңүз.";

        if (level == "Жогорку")
            return "Жогорку деңгээлде интенсивдүүлүктү туура бөлүштүрүп, калыбына келүүгө убакыт бериңиз.";

        return "Машыгууну ден соолугуңузга жараша тандаңыз.";
    }

    public async Task<object> GenerateAiChatResponseAsync(
    int userId,
    AiChatRequest request
)
{
    var user = await _context.Users.FindAsync(userId);

    if (user == null)
        throw new Exception("Колдонуучу табылган жок");

    var latestRecord = await _context.HealthRecords
        .Where(x => x.UserId == userId)
        .OrderByDescending(x => x.CreatedAt)
        .FirstOrDefaultAsync();

    var bmiInfo = latestRecord == null
        ? "BMI маалыматы жок"
        : $"Акыркы BMI: {latestRecord.BMI}, категория: {latestRecord.Category}";

    var answer = $@"
Саламатсызбы, {user.FirstName}!

Сиздин сурооңуз:
{request.Message}

Сиздин маалымат:
{bmiInfo}
Бою: {user.Height} см
Салмак: {user.Weight} кг
Жашы: {user.Age}

AI жооп:
1. Эгер максатыңыз арыктоо болсо, күнүмдүк калорияны азайтып, жеңил кардио кошуңуз.
2. Эгер салмак кошуу болсо, белокко бай тамактарды көбөйтүңүз.
3. Күнүнө 1.5–2 литр суу ичүү сунушталат.
4. Аптасына 3–4 жолу физикалык активдүүлүк жасаңыз.
5. Уйку режимиңизди сактаңыз: 7–8 саат уктоо маанилүү.

Эскертүү: Бул медициналык диагноз эмес. Ден соолугуңуз боюнча олуттуу маселе болсо, дарыгерге кайрылыңыз.
";

    return new
    {
        user = $"{user.FirstName} {user.LastName}",
        message = request.Message,
        answer
    };
}

}