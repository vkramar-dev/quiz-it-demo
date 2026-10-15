using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace KramarDev.Quiz.WebAPI;

public interface IJwtTokenGenerator
{
    Task<string> GenerateTokenAsync(string login, IReadOnlyList<string> roles);
}

public sealed class JwtTokenGenerator(IConfiguration config) : IJwtTokenGenerator
{
    private readonly IConfiguration _config = config;

    public Task<string> GenerateTokenAsync(string login, IReadOnlyList<string> roles)
    {
        if (string.IsNullOrWhiteSpace(login))
            throw new InvalidOperationException("UserName is missing.");

        var tokenKey = _config["JWTSettings:QIT_TokenKey"]
            ?? throw new InvalidOperationException("JWTSettings:QIT_TokenKey is not configured.");

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, login),
            new(ClaimTypes.Name, login)
        };

        if (roles != null)
        {
            foreach (string role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        var tokenOptions = new JwtSecurityToken(
            issuer: null,
            audience: null,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );

        return Task.FromResult(new JwtSecurityTokenHandler().WriteToken(tokenOptions));
    }
}
