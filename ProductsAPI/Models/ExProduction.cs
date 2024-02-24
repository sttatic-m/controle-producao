using ProductsAPI.Data;

namespace ProductsAPI.Models.Production;

public class ExProduction(Guid productionId, int code, string productName, double amount, DateTime fabricationDate, int validity, double recipesQuantity)
{
    public Guid ProductionId { get; set; } = productionId;
    public int Code { get; set; } = code;
    public string ProductName { get; set; } = productName;
    public double Amount { get; set; } = amount;
    public DateTime FabricationDate { get; set; } = fabricationDate;
    public int Validity { get; set; } = validity;
    public double RecipesQuantity { get; set; } = recipesQuantity;

    public static implicit operator string(ExProduction production) 
        => $"{production.Code};{production.ProductName};{production.Amount};{production.FabricationDate.ToString("dd-MM-yyyy")};{production.Validity};{production.RecipesQuantity}";
    
    public static implicit operator ExProduction(string line)
    {
        var data = line.Split(",");
        return new ExProduction(
            Guid.NewGuid(),
            int.Parse(data[0]),
            data[1],
            double.Parse(data[2]),
            data[3].ToDateTime(),
            int.Parse(data[4]),
            double.Parse(data[5])
        );
    }
}