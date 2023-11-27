using JourneyHub.Common.Models.Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace JourneyHub.Data
{
    public class AppDbContext : IdentityDbContext
    {
        public DbSet<Trip> Trips { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}
