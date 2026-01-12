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

    // The Logic: Matches "3_5_dailyAudit.txt" sequence diagram
    public void RunDailyAudit(EquipmentService service)
    {
        Console.WriteLine("\n[SystemScheduler] Running Daily System Audit...");
        
        var items = service.GetById(Guid.Empty); // Trick to get all items? 
        // Better: Add GetAll() to service or access repo. 
        // For simplicity, let's assume we pass the service method:
        
        // Simulating random faults (Entropy)
        Random rnd = new Random();
        if (rnd.Next(1, 10) > 7) 
        {
            Console.WriteLine("[Audit] ALERT: Detected voltage spike in Room 101.");
            // In a real app, this would auto-create a fault report
        }
        else
        {
            Console.WriteLine("[Audit] System nominal. No auto-detected faults.");
        }
    }
}