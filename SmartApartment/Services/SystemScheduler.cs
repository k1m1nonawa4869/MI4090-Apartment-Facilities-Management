// Services/SystemScheduler.cs
public class SystemScheduler
{
    // 1. Private Static Instance
    private static SystemScheduler _instance;
    
    // 2. Private Constructor (Prevent "new SystemScheduler()")
    private SystemScheduler() { }

    // 3. Public Access Point
    public static SystemScheduler GetInstance()
    {
        if (_instance == null)
        {
            _instance = new SystemScheduler();
        }
        return _instance;
    }

    // The Logic
    public void RunDailyAudit(EquipmentService service)
    {
        Console.WriteLine("\n[SystemScheduler] Running Daily System Audit...");
        
        var items = service.GetAll();
        Console.WriteLine($"[Audit] Scanning {items.Count} items for issues...");
        
        // Simulating random faults (Entropy)
        Random rnd = new Random();
        foreach (var item in items)
        {
            // Simulate random failure logic (10% chance)
            // Only check items that are currently Active
            if (item.Status == "Active" && rnd.Next(1, 100) <= 10)
            {
                Console.WriteLine($"[Audit] ALERT: Detected voltage spike in {item.Name} ({item.Location})!");
                
                // Optional: Auto-report fault
                service.UpdateStatus(item.Id, "Faulty"); 
            }
        }
        
        Console.WriteLine("[Audit] Scan complete.");
    }
}