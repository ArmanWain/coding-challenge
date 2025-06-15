using Microsoft.AspNetCore.Mvc;
using DashboardApi.Models;
using System.Text.Json;

namespace DashboardApi.Controllers;

[ApiController]
[Route("api/chart")]
public class ChartController : ControllerBase
{
    [HttpGet("summary")]
    public IActionResult GetChartSummary([FromQuery] string? period, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        List<DateTime> dateRange;

        if (startDate.HasValue && endDate.HasValue)
        {
            dateRange = Enumerable.Range(0, (endDate.Value - startDate.Value).Days + 1)
                                    .Select(offset => startDate.Value.AddDays(offset))
                                    .ToList();
        }
        else if (period == "lastQuarter")
        {
            var now = DateTime.Now;
            var currentQuarter = (now.Month - 1) / 3 + 1;
            var lastQuarter = currentQuarter == 1 ? 4 : currentQuarter - 1;
            var year = currentQuarter == 1 ? now.Year - 1 : now.Year;
            var startMonth = (lastQuarter - 1) * 3 + 1;
            startDate = new DateTime(year, startMonth, 1);
            endDate = startDate.Value.AddMonths(3).AddDays(-1);

            dateRange = Enumerable.Range(0, (endDate.Value - startDate.Value).Days + 1)
                                   .Select(offset => startDate.Value.AddDays(offset))
                                   .ToList();
        }
        else if (period == "lastMonth")
        {
            endDate = DateTime.Today;
            startDate = endDate.Value.AddMonths(-1).AddDays(1);
            dateRange = Enumerable.Range(0, (endDate.Value - startDate.Value).Days + 1)
                                   .Select(offset => startDate.Value.AddDays(offset))
                                   .ToList();
        }
        else if (period == "lastYear")
        {
            startDate = new DateTime(DateTime.Today.Year - 1, 1, 1);
            endDate = new DateTime(DateTime.Today.Year - 1, 12, 31);
            dateRange = Enumerable.Range(0, 12)
                                   .Select(i => new DateTime(startDate.Value.Year, i + 1, 1))
                                   .ToList();
        }
        else
        {
            // Default: last 4 weeks
            dateRange = Enumerable.Range(0, 4).Select(i => DateTime.Now.AddDays(-7 * (3 - i))).ToList();
            startDate = dateRange.First();
            endDate = dateRange.Last();
        }

        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "sales-test-data-1.json");
        var json = System.IO.File.ReadAllText(filePath);
        var sales = JsonSerializer.Deserialize<List<Sale>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        }) ?? new List<Sale>();

        var filteredSales = sales.Where(s => s.Date >= startDate && s.Date <= endDate).ToList();

        return Ok(new
        {
            startDate,
            endDate,
            sales = filteredSales
        });
    }
}
