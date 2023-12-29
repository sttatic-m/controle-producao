using System.Data.SqlTypes;

public class Product 
{
    public Guid Id { get; set; }
    public int Code { get; set; }
    public string ProductName { get; set; }
    public string Department { get; set; }

    public Product(Guid id, int code, string productName, string department) 
    {
        Id = id;
        Code = code;
        ProductName = productName;
        Department = department;
    }
}