using Microsoft.AspNetCore.Mvc;
using ProductsAPI.Data;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContext>();

var app = builder.Build();

app.MapGet("/products", (AppDbContext context) =>
{
    return Results.Ok(context.Products.ToList());
});

app.MapPost("/products/", (AppDbContext context, [FromBody] Product product) =>
{
    try
    {
        context.Products.Add(new Product(Guid.NewGuid(), product.ProductName, product.Department));
        context.SaveChanges();
        return Results.Created($"/products/{product.Id}", product);
    }
    catch (Exception e)
    {
        return Results.BadRequest(e.Message);
    }
});

app.MapGet("/products/{productName}", (AppDbContext context, string productName) => 
{
    return Results.Ok(context.Products.FirstOrDefault( product => product.ProductName == productName));
});

app.Run();
