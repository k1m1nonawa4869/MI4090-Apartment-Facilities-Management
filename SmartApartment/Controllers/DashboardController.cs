// Controllers/DashboardController.cs
public class DashboardController
{
    private readonly EquipmentService _equipService;
    private readonly MaintenanceService _maintService;

    public DashboardController(EquipmentService equipService, MaintenanceService maintService)
    {
        _equipService = equipService;
        _maintService = maintService;
    }

    public void ShowDashboard()
    {
        Console.Clear();
        Console.WriteLine("========================================");
        Console.WriteLine("      APARTMENT MANAGER DASHBOARD       ");
        Console.WriteLine("========================================");

        // 1. Get Stats from Service
        var (active, faulty, repair) = _equipService.GetStats();
        var totalEquipmentValue = _equipService.GetTotalInventoryValue();
        var totalMaintenanceCost = _maintService.GetTotalMaintenanceCost();

        // 2. Display Summary
        Console.WriteLine($" [STATUS OVERVIEW]");
        Console.WriteLine($"  - Active Items:      {active}");
        Console.WriteLine($"  - Reported Faults:   {faulty}  <-- URGENT");
        Console.WriteLine($"  - Under Repair:      {repair}");
        Console.WriteLine("----------------------------------------");
        Console.WriteLine($" [PRICE DASHBOARD]");
        Console.WriteLine($"  - Total Asset Value: ${totalEquipmentValue}");
        Console.WriteLine($"  - Total Repair Cost: ${totalMaintenanceCost}");
        Console.WriteLine("========================================");

        // 3. Display Action Items (The "Alert List")
        var faultyItems = _equipService.GetFaultyItems();
        
        if (faultyItems.Count > 0)
        {
            Console.WriteLine(" [ATTENTION REQUIRED]");
            Console.WriteLine("  The following items need maintenance:");
            foreach (var item in faultyItems)
            {
                // Shows ID so you can copy-paste it for the next step (Fixing)
                Console.WriteLine($"  [!] {item.Name} in {item.Location}");
                Console.WriteLine($"      ID: {item.Id}");
            }
        }
        else
        {
            Console.WriteLine("  [OK] No current system faults.");
        }
    }
}