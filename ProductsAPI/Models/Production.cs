using ProductsAPI.Data;

namespace ProductsAPI.Models.Production;

public class Production(Guid productionId, int code, int productCode, double amount, DateTime fabricationDate, int validity, double recipesQuantity)
{
    public Guid ProductionId { get; set; } = productionId;
    public int Code { get; set; } = code;
    public int ProductCode { get; set; } = productCode;
    public double Amount { get; set; } = amount;
    public DateTime FabricationDate { get; set; } = fabricationDate;
    public int Validity { get; set; } = validity;
    public double RecipesQuantity { get; set; } = recipesQuantity;

    public static implicit operator string(Production production) 
        => $"{production.Code},{production.ProductCode},{production.Amount},{production.FabricationDate.ToString("dd-MM-yyyy")},{production.Validity},{production.RecipesQuantity}";
    
    public static implicit operator Production(string line)
    {
        var data = line.Split(",");
        return new Production(
            Guid.NewGuid(),
            int.Parse(data[0]),
            int.Parse(data[1]),
            double.Parse(data[2]),
            data[3].ToDateTime(),
            int.Parse(data[4]),
            double.Parse(data[5])
        );
    }
}