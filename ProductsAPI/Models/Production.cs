namespace ProductsAPI.Models.Production;

public class Production 
{
    public Guid ProductionId { get; set; }
    public int Code { get; set; }
    public int ProductCode { get; set; }
    public double Amount { get; set; }
    public DateTime FabricationDate { get; set; }
    public int Validity { get; set; }
    public double RecipesQuantity { get; set; }

    public Production(Guid productionId, int code, int productCode, double amount, DateTime fabricationDate, int validity, double recipesQuantity)
    {
        ProductionId = productionId;
        Code = code;
        ProductCode = productCode;
        Amount = amount;
        FabricationDate = fabricationDate;
        Validity = validity;
        RecipesQuantity = recipesQuantity;
    }
}