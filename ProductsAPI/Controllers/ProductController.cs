using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductsAPI.Data;

namespace ProductsAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductController(AppDbContext appDbContext) : ControllerBase
{
    private readonly AppDbContext _context = appDbContext;

    [HttpGet("/products")]
    public async Task<IActionResult> GetProducts()
    {
        var products = _context.Products;

        return Ok(await products.ToListAsync());
    }

    [HttpPost("/products")]
    public async Task<IActionResult> AddProducts([FromBody] Product product)
    {
        try
        {
            if (product.ProductName != null && product.Department != null)
            {
                await _context.Products.AddAsync(new Product(Guid.NewGuid(), product.Code, product.ProductName, product.Department));
            }

            await _context.SaveChangesAsync();
            return Created($"/products/{product.Id}", product);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("/products/{indexCode}")]
    public ActionResult GetProductByCode(int indexCode)
    {
        try
        {
            return Ok(_context.Products.FirstOrDefault(product => product.Code == indexCode));
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("/products/{productCode}")]
    public async Task<IActionResult> EditProduct(int productCode, [FromBody] Product updateProduct)
    {
        try
        {
            Product? product = _context.Products.FirstOrDefault(product => product.Code == productCode);

            if (product != null)
            {
                product.Code = updateProduct.Code;
                product.ProductName = updateProduct.ProductName;
                product.Department = updateProduct.Department;

                _context.Update(product);
                await _context.SaveChangesAsync();

                return Ok(product);
            }

            return NotFound(product);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("/products/{productCode}")]
    public async Task<IActionResult> RemoveProduct(int productCode)
    {
        try
        {
            Product? product = _context.Products.FirstOrDefault(product => product.Code == productCode);
            if (product != null) _context.Remove(product);
            await _context.SaveChangesAsync();
            return Ok(product);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}