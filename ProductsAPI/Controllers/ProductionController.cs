using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductsAPI.Data;
using ProductsAPI.Models.Production;

namespace ProductsAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductionController(AppDbContext appDbContext) : ControllerBase
{
    private readonly AppDbContext _context = appDbContext;

    [HttpGet("/production")]
    public async Task<IActionResult> GetProductions()
    {
        return Ok(await _context.Productions.ToListAsync());
    }

    [HttpPost("/production")]
    public async Task<IActionResult> AddProduction([FromBody] Production production)
    {
        try
        {
            if (_context.Products.FirstOrDefault(product => product.Code == production.ProductCode) == null)
            {
                return NotFound("Verify product Code");
            }

            if (production.Amount >= 1)
            {
                var newProduction = new Production(Guid.NewGuid(), production.Code, production.ProductCode, production.Amount, DateTime.Now, production.Validity, production.RecipesQuantity);
                await _context.Productions.AddAsync(newProduction);
                await _context.SaveChangesAsync();
                return Created($"/production/{production.ProductionId}", production);
            }

            throw new Exception("Failed to create production, verify production informations");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("/productions/{productionCode}")]
    public async Task<IActionResult> EditProduction(int productionCode, [FromBody] Production updateProduction)
    {
        try
        {
            Production? production = _context.Productions.FirstOrDefault(production => production.Code == productionCode);

            if (production != null)
            {
                production.ProductCode = updateProduction.ProductCode;
                production.Amount = updateProduction.Amount;
                production.Validity = updateProduction.Validity;
                production.RecipesQuantity = updateProduction.RecipesQuantity;

                _context.Update(production);
                await _context.SaveChangesAsync();

                return Ok(production);
            }

            return NotFound(production);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("/productions/{index}")]
    public async Task<IActionResult> FindProductionByCode(string index)
    {
        try
        {
            if (int.TryParse(index, out int code))
            {
                Production? production = await _context.Productions.FirstOrDefaultAsync(production => production.Code == code) ?? throw new KeyNotFoundException("Cant Find any production for this code");
                return Ok(production);
            }

            else
            {
                List<Production> productions;

                string dateFormat = "yyyy-MM-dd";
                DateTime searchDate;
                if (DateTime.TryParseExact(index, dateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out searchDate))
                {
                    productions = _context.Productions.Where(productions => productions.FabricationDate.Date == searchDate).ToList();
                    return Ok(productions);
                }

                productions = [.. _context.Productions.Where(productions => productions.ProductCode == int.Parse(index))];
                return Ok(productions);
            }
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("/productions/{productionCode}")]
    public async Task<IActionResult> RemoveProductions(int productionCode)
    {
        try
        {
            Production? production = _context.Productions.FirstOrDefault(production => production.Code == productionCode);
            if (production != null) _context.Remove(production);
            await _context.SaveChangesAsync();
            return Ok(production);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}