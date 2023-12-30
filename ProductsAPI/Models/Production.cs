namespace ProductsAPI.Models.Production;

public class Production 
{
    public Guid ProductionId { get; set; }
    public int Code { get; set; }
    public int ProductCode { get; set; }
    public int Amount { get; set; }
    public DateTime FabricationDate { get; set; }
    public int Validity { get; set; }

    public Production(Guid productionId, int code, int productCode, int amount, DateTime fabricationDate, int validity)
    {
        ProductionId = productionId;
        Code = code;
        ProductCode = productCode;
        Amount = amount;
        FabricationDate = fabricationDate;
        Validity = validity;
    }
}