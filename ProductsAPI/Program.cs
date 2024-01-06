using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ProductsAPI.Data;
using ProductsAPI.Models.Production;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContext>();
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAnyOrigin", builder => {
        builder.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseCors("AllowAnyOrigin");

#region Products

app.MapGet("/products", (AppDbContext context) => 
{
    var products = context.Products;

    return Results.Content(JsonConvert.SerializeObject(products), "application/json");
});

app.MapPost("/products", (AppDbContext context, [FromBody] Product product) =>
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
    return Results.Json(context.Products.FirstOrDefault(product => product.Code == productCode));
});

app.MapPost("/products/{productCode}/edit", (AppDbContext context, int productCode, [FromBody] Product updateProduct) =>
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

#endregion

#region Production

app.MapGet("/productions", (AppDbContext context) => {
    return Results.Ok(context.Productions.ToList());
});

app.MapPost("/productions", (AppDbContext context, [FromBody] Production production) => 
{
    try
    {
        if(context.Products.FirstOrDefault(product => product.Code == production.ProductCode) == null)
        {
            return Results.NotFound("Verify product Code");
        }

        if (production.Amount >= 1)
        {
            var newProduction = new Production(Guid.NewGuid(), production.Code, production.ProductCode, production.Amount, DateTime.Now, production.Validity, production.RecipesQuantity);
            context.Productions.Add(newProduction);
            context.SaveChanges();
            return Results.Created($"/production/{production.ProductionId}", production);
        }

        throw new Exception("Failed to create production, verify production informations");
    }
    catch (Exception e)
    {
        return Results.BadRequest(e.Message);
    }
});

app.MapPost("/productions/{productionCode}/edit", (AppDbContext context, int productionCode, [FromBody] Production updateProduction) => 
{
    try
    {
        Production? production = context.Productions.FirstOrDefault(production => production.Code == productionCode);

        if (production != null)
        {
            production.ProductCode = updateProduction.ProductCode;
            production.Amount = updateProduction.Amount;
            production.Validity = updateProduction.Validity;
            production.RecipesQuantity = updateProduction.RecipesQuantity;
            
            context.Update(production);
            context.SaveChanges();

            return Results.Ok(production);
        }

        return Results.NotFound(production);
    }
    catch (Exception e)
    {
        return Results.BadRequest(e.Message);
    }
});

app.MapGet("/productions/{productionCode}", (AppDbContext context, int productionCode) => 
{

    try 
    {
        Production? production = context.Productions.FirstOrDefault(production => production.Code == productionCode) ?? throw new KeyNotFoundException("Cant Find any production for this code");
        return Results.Ok(production);
    }
    catch (Exception e)
    {
        return Results.BadRequest(e.Message);
    }

});

app.MapGet("/productions/{search}/list", (AppDbContext context, string search) => 
{
    try
    {
        List<Production> productions;

        string dateFormat = "yyyy-MM-dd";
        DateTime searchDate;
        if(DateTime.TryParseExact(search, dateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out searchDate))
        {
            productions = context.Productions.Where(productions => productions.FabricationDate.Date == searchDate).ToList();
            return Results.Ok(productions);
        }

        productions = context.Productions.Where(productions => productions.ProductCode == int.Parse(search)).ToList();
        return Results.Ok(productions);
    }
    catch (Exception e)
    {
        return Results.BadRequest(e.Message);
    }
});

app.MapPost("/productions/{productionCode}/remove", (AppDbContext context, int productionCode) =>
{
    try
    {
        Production? production = context.Productions.FirstOrDefault(production => production.Code == productionCode);
        if (production != null) context.Remove(production);
        context.SaveChanges();
        return Results.Json(production);
    }
    catch (Exception e)
    {
        return Results.BadRequest(e.Message);
    }
});

#endregion
app.Run();
