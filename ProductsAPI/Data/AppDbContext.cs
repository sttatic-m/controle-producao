using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace ProductsAPI.Data;

public class AppDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) 
        => optionsBuilder.UseSqlite("DataSource=products.db;Cache=Shared");
}