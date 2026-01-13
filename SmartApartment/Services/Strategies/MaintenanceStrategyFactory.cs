// Services/Strategies/MaintenanceStrategyFactory.cs
// Simple Factory to pick the right class based on user string input
public static class MaintenanceStrategyFactory
{
    public static IMaintenanceStrategy Get(string type)
    {
        return type.ToLower() switch
        {
            "combine" => new CombineRepairStrategy(),
            "false" => new FalseReportStrategy(),
            _ => throw new ArgumentException("Unknown strategy type")
        };
    }
}