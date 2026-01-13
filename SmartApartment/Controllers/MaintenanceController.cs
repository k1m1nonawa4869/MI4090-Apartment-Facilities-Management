// Controllers/MaintenanceController.cs
public class MaintenanceController
{
    private readonly MaintenanceService _service;

    public MaintenanceController(MaintenanceService service)
    {
        _service = service;
    }

    public void PerformMaintenance()
    {
        Console.WriteLine("\n--- Maintenance Console ---");
            
        // 1. Get Input
        Console.Write("Enter Equipment ID: ");
        string idStr = Console.ReadLine();

        if (Guid.TryParse(idStr, out Guid id))
        {
            Console.WriteLine("Choose Strategy:");
            Console.WriteLine(" - combine   (Repair with Cost & Note)");
            Console.WriteLine(" - false     (False Alarm Report)");
            Console.Write("Selection: ");
            string strategy = Console.ReadLine();

            // 2. Delegate to Service
            _service.PerformMaintenance(id, strategy);
        }
        else
        {
            Console.WriteLine("[Error] Invalid ID format.");
        }
    }

    public void ShowHistory()
    {
        Console.Write("Enter Equipment ID to view history: ");
        string idStr = Console.ReadLine();

        if (Guid.TryParse(idStr, out Guid id))
        {
            // Call the new service method
            var history = _service.GetHistory(id);

            Console.WriteLine($"\n--- Maintenance History for {id} ---");
            if (history.Count == 0)
            {
                Console.WriteLine("No records found.");
            }
            else
            {
                foreach (var log in history)
                {
                    Console.WriteLine(log.ToString());
                }
            }
        }
    }
}