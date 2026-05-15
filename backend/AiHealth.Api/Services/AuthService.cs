using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AiHealth.Api.Data;
using AiHealth.Api.DTOs.Auth;
using AiHealth.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AiHealth.Api.Services;

public class AuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
 
    private readonly EmailService _emailService;

   public AuthService(
    AppDbContext context,
    IConfiguration configuration,
    EmailService emailService
)
{
    _context = context;
    _configuration = configuration;
    _emailService = emailService;
}

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser != null)
            throw new Exception("Бул email мурун катталган");

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Age = request.Age,
            Height = request.Height,
            Weight = request.Weight,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "User"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
         
     await _emailService.SendEmailAsync(
    user.Email,
    "AI Health Platform - Катталуу ийгиликтүү болду",
    $@"
    <h2>Саламатсызбы, {user.FirstName}!</h2>
    <p>Сиз AI Health Platform системасына ийгиликтүү катталдыңыз.</p>
    <p>Эми аккаунтуңузга кирип, саламаттык анализин баштасаңыз болот.</p>
    "
);


        return new AuthResponse
        {
            UserId = user.Id,
            FullName = $"{user.FirstName} {user.LastName}",
            Email = user.Email,
            Role = user.Role,
            AccessToken = GenerateJwtToken(user)
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
            throw new Exception("Email же пароль туура эмес");

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(
            request.Password,
            user.PasswordHash
        );

        if (!isPasswordValid)
            throw new Exception("Email же пароль туура эмес");

        return new AuthResponse
        {
            UserId = user.Id,
            FullName = $"{user.FirstName} {user.LastName}",
            Email = user.Email,
            Role = user.Role,
            AccessToken = GenerateJwtToken(user)
        };
    }

    public async Task<string> ForgotPasswordAsync(string email)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == email);

        if (user == null)
            throw new Exception("Колдонуучу табылган жок");

        var token = Guid.NewGuid().ToString();

        user.PasswordResetToken = token;
        user.PasswordResetTokenExpiresAt = DateTime.UtcNow.AddHours(1);

        await _context.SaveChangesAsync();
         var frontendUrl = _configuration["EmailSettings:FrontendUrl"];
var resetLink = $"{frontendUrl}/reset-password/{token}";

await _emailService.SendEmailAsync(
    user.Email,
    "AI Health Platform - Паролду калыбына келтирүү",
    $@"
    <h2>Паролду калыбына келтирүү</h2>
    <p>Паролуңузду өзгөртүү үчүн төмөнкү шилтемени басыңыз:</p>
    <p>
      <a href='{resetLink}'>Паролду өзгөртүү</a>
    </p>
    <p>Бул шилтеме 1 саат ичинде жарактуу.</p>
    "
  );
   
   
    return "Паролду калыбына келтирүү шилтемеси email дарегиңизге жөнөтүлдү";
    }

    public async Task ResetPasswordAsync(string token, string newPassword)
    {
        var user = await _context.Users.FirstOrDefaultAsync(x =>
            x.PasswordResetToken == token &&
            x.PasswordResetTokenExpiresAt > DateTime.UtcNow
        );

        if (user == null)
            throw new Exception("Токен жараксыз же мөөнөтү бүткөн");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiresAt = null;

        await _context.SaveChangesAsync();
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                Convert.ToDouble(_configuration["Jwt:AccessTokenMinutes"])
            ),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}


