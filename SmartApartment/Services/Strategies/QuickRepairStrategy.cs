// Services/Strategies/QuickRepairStrategy.cs
// Fast, cheap fix
public class QuickRepairStrategy : IMaintenanceStrategy
{
    public void Execute(Equipment equipment)
    {
        Console.WriteLine($"[Strategy] Performing Quick Repair on {equipment.Name}...");
        Console.WriteLine(" - Rebooting system...");
        Console.WriteLine(" - Cleaning filter...");
        
        // Logic: Quick repair usually fixes the issue immediately
        equipment.Status = "Active"; 
        Console.WriteLine($"[Result] Item is back online. Status: {equipment.Status}");
    }
}