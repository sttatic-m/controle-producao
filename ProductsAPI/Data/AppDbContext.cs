using Microsoft.EntityFrameworkCore;
using ProductsAPI.Models.Production;

namespace ProductsAPI.Data;

public class AppDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }
    public DbSet<Production> Productions { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) 
        => optionsBuilder.UseSqlite("DataSource=production-control.db;Cache=Shared");
}