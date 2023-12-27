
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("Default");
var mysqlServerVersion = new MySqlServerVersion(new Version(8, 0, 12));

builder.Services.AddDbContext<AppDbContext>(options => {
    options.UseMySql(connectionString, mysqlServerVersion);
});
var app = builder.Build();

app.MapGet("/products", () => {
    var products = new List<Product>() {
            new Product {
                Id= 0,
                Name= "Teste"
            }
        };
    return products;
});

app.Run();
 