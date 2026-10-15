using Microsoft.AspNetCore.Identity;

namespace KramarDev.Quiz.DAL.Database.Tables;

public class User : IdentityUser
{
    public string About { get; set; }

    public string Contacts { get; set; }
}
