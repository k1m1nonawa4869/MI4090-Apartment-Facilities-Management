// Program.cs
class Program
{
    static void Main(string[] args)
    {
        // 0. Data Layer
        var repository = new FileRepository<Equipment>("equipment_db.txt");
        var workOrderRepo = new FileRepository<WorkOrder>("maintenance_log.txt");

        // 1. Setup Service
        var factory = new EquipmentFactory();
        var equipmentService = new EquipmentService(repository, factory);
        var maintenanceService = new MaintenanceService(repository, workOrderRepo);
        var scheduler = SystemScheduler.GetInstance();

        // 2. Setup Observers
        var notifier = new NotificationCenter();
        notifier.Subscribe(new Manager { Name = "Alice" });      // Manager listens
        notifier.Subscribe(new Technician { Phone = "555-0199" }); // Technician listens

        // 3. Setup Controllers
        var dashboard = new DashboardController(equipmentService);
        var faultController = new FaultReportController(equipmentService, notifier);
        var maintenanceController = new MaintenanceController(maintenanceService);
        var equipmentController = new EquipmentController(equipmentService);
        
        while (true)
        {
            Console.Clear();
            Console.WriteLine("=== Smart Apartment System (TextFile DB) ===");
            Console.WriteLine("1. >> VIEW DASHBOARD <<"); 
            Console.WriteLine("2. Add Equipment");
            Console.WriteLine("3. View Inventory");
            Console.WriteLine("4. Report a Fault"); 
            Console.WriteLine("5. Perform Maintenance");
            Console.WriteLine("6. Run Daily Audit (System)");
            Console.WriteLine("7. Maintenance History");
            Console.WriteLine("8. Exit");
            Console.Write("Select: ");

            var choice = Console.ReadLine();

            // The "Router" Logic
            switch (choice)
            {
                case "1": dashboard.ShowDashboard(); break;
                case "2": equipmentController.AddEquipment(); break; // <--- Clean!
                case "3": equipmentController.ViewInventory(); break;
                case "4": faultController.ReportFault(); break;
                case "5": maintenanceController.PerformMaintenance(); break; // <--- Clean!
                case "6": scheduler.RunDailyAudit(equipmentService); break;
                case "7": maintenanceController.ShowHistory(); break;
                case "8": return;
                default: 
                    Console.WriteLine("Invalid option."); 
                    break;
            }

            Console.WriteLine("\nPress Enter to continue...");
            Console.ReadLine();

        }  
    }
}