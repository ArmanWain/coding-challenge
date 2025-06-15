namespace DashboardApi.Models;

public class Sale
{
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
    public bool IsLoyaltyCustomer { get; set; }
    public string Channel { get; set; } = string.Empty;
}
