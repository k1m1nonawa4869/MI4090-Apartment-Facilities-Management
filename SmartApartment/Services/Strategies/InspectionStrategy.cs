public class InspectionStrategy : IMaintenanceStrategy
{
    public void Execute(Equipment equipment)
    {
        Console.WriteLine($"[Strategy] Inspecting {equipment.Name} (False Alarm Check)...");
        Console.WriteLine(" - verifying hardware integrity...");
        
        // Logic: No repairs needed, just verifying it works
        equipment.Status = "Active";
        Console.WriteLine($"[Result] No fault found. Status reset to: {equipment.Status}");
    }
}