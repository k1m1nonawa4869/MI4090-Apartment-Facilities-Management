// Services/Strategies/CombineRepairStrategy.cs
public class CombineRepairStrategy : IMaintenanceStrategy
{
    public MaintenanceResult Execute(Equipment equipment)
    {
        Console.WriteLine($"[Strategy] Starting Repair on {equipment.Name}...");
        
        // 1. Ask for Note
        Console.Write("Enter Technician Note: ");
        string note = Console.ReadLine();

        // 2. Ask for Cost
        decimal cost = 0;
        Console.Write("Enter Cost ($): ");
        decimal.TryParse(Console.ReadLine(), out cost);

        // 3. Fix Item
        equipment.Status = "Active";
        Console.WriteLine($"[Result] Item repaired and marked Active.");

        return new MaintenanceResult 
        { 
            Success = true, 
            Note = note, 
            Cost = cost 
        };
    }
}
