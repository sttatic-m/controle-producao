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
        if (product.ProductName != null && product.Department != null)
        {
            context.Products.Add(new Product(Guid.NewGuid(), product.Code, product.ProductName, product.Department));
        }

        context.SaveChanges();
        return Results.Created($"/products/{product.Id}", product);
    }
    catch (Exception e)
    {
        return Results.BadRequest(e.Message);
    }
});

app.MapGet("/products/{productCode}", (AppDbContext context, int productCode) =>
{
    return Results.Ok(context.Products.FirstOrDefault(product => product.Code == productCode));
});

app.MapPost("/products/edit/{productCode}", (AppDbContext context, int productCode, [FromBody] Product updateProduct) =>
{
    try
    {
        Product? product = context.Products.FirstOrDefault(product => product.Code == productCode);

        if (product != null)
        {
            product.Code = updateProduct.Code;
            product.ProductName = updateProduct.ProductName;
            product.Department = updateProduct.Department;

            context.Update(product);
            context.SaveChanges();

            return Results.Ok(product);
        }

        return Results.NotFound(product);
    }
    catch (Exception e)
    {
        return Results.BadRequest(e.Message);
    }
});

app.MapPost("/products/{productCode}/remove", (AppDbContext context, int productCode) =>
{
    try
    {
        Product? product = context.Products.FirstOrDefault(product => product.Code == productCode);
        if (product != null) context.Remove(product);
        context.SaveChanges();
        return Results.Ok(product);
    }
    catch (Exception e)
    {
        return Results.BadRequest(e.Message);
    }
});

app.Run();
