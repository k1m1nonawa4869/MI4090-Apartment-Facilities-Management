// Services/Strategies/FalseReportStrategy.cs
public class FalseReportStrategy : IMaintenanceStrategy
{
    public MaintenanceResult Execute(Equipment equipment)
    {
        Console.WriteLine($"[Strategy] Verifying False Report on {equipment.Name}...");
        
        Console.WriteLine("Technician verified the item is NOT broken.");
        
        // Ask for optional note? Or default? User said "simply notify". 
        // Let's ask loosely or just default it. "giving note and price" was for combine.
        // "simply notify" -> Note = "False Report declared"
        
        equipment.Status = "Active";
        Console.WriteLine($"[Result] Item status reset to Active. No costs incurred.");

        return new MaintenanceResult 
        { 
            Success = true, 
            Note = "Verified False Report - Item Operational", 
            Cost = 0 
        };
    }
}
