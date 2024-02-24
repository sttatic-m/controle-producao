namespace ProductsAPI.Data;

public static class StringExtension
{
    public static DateTime ToDateTime(this string value)
    {
        var date = value.Split("-");
        return new DateTime(
            int.Parse(date[0]),
            int.Parse(date[1]),
            int.Parse(date[2])
        );
    }
}