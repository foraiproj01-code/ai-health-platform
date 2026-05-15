using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace AiHealth.Api.Services;

public class EmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
        var email = new MimeMessage();

        email.From.Add(new MailboxAddress(
            _configuration["EmailSettings:FromName"],
            _configuration["EmailSettings:FromEmail"]
        ));

        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = subject;

        email.Body = new TextPart("html")
        {
            Text = htmlBody
        };

        using var smtp = new SmtpClient();

        await smtp.ConnectAsync(
            _configuration["EmailSettings:SmtpHost"],
            int.Parse(_configuration["EmailSettings:SmtpPort"]!),
            SecureSocketOptions.StartTls
        );

        await smtp.AuthenticateAsync(
            _configuration["EmailSettings:SmtpUsername"],
            _configuration["EmailSettings:SmtpPassword"]
        );

        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}