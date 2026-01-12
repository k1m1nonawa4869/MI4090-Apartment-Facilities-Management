// Program.cs
class Program
{
    static void Main(string[] args)
    {
        // 1. Setup Data & Services
        string dbPath = "equipment_db.txt";
        var repository = new FileRepository<Equipment>(dbPath);
        var factory = new EquipmentFactory();
        var equipmentService = new EquipmentService(repository, factory);
        var maintenanceService = new MaintenanceService(repository);

        // 2. Setup Observers
        var notifier = new NotificationCenter();
        notifier.Subscribe(new Manager { Name = "Alice" });      // Manager listens
        notifier.Subscribe(new Technician { Phone = "555-0199" }); // Technician listens

        // 3. Setup Controllers
        var faultController = new FaultReportController(equipmentService, notifier);
        var dashboard = new DashboardController(equipmentService);

        // 4. Run Scheduler (Singleton Usage)
        var scheduler = SystemScheduler.GetInstance();
        

        var service = new EquipmentService(repository, factory);
        
        
        

        Console.WriteLine("=== Smart Apartment System (TextFile DB) ===");
        
        while (true)
        {
            Console.Clear();
            Console.WriteLine("\n1. >> VIEW DASHBOARD <<"); // New Option
            Console.WriteLine("2. Add Equipment");
            Console.WriteLine("3. View Inventory");
            Console.WriteLine("4. Report a Fault"); 
            Console.WriteLine("5. Perform Maintenance");
            Console.WriteLine("6. Run Daily Audit (System)"); // <--- NEW
            Console.WriteLine("7. Exit");
            Console.Write("Select: ");

            var choice = Console.ReadLine();

            if (choice == "1")
            {
                dashboard.ShowDashboard();
            }

            else if (choice == "2")
            {
                Console.Write("Enter Type (Router/Table): ");
                var type = Console.ReadLine();
    
                Console.Write("Enter Name (e.g., ASUS-X55): ");
                var name = Console.ReadLine();
    
                // [NEW] Ask for location
                Console.Write("Enter Location (e.g., Room 101): ");
                var loc = Console.ReadLine();

                try {
                    // Pass location to the service
                    service.RegisterNewDevice(type, name, loc);
                } catch (Exception ex) {
                    Console.WriteLine($"Error: {ex.Message}");
                }
                Pause();
            }
            
            else if (choice == "3")
            {
                service.ListAll();
                Pause();
            }

            else if (choice == "4")
            {
                faultController.ReportFault();
                Pause();
            }

            else if (choice == "5")
            {
                Console.WriteLine("\n--- Maintenance Module ---");
                Console.Write("Enter Equipment ID (from Dashboard): ");
                string idStr = Console.ReadLine();
        
                if (Guid.TryParse(idStr, out Guid id))
                {
                    Console.WriteLine("Choose Strategy:");
                    Console.WriteLine(" - 'quick'   (Reboot/Clean)");
                    Console.WriteLine(" - 'inspect' (False Alarm Check)");
                    Console.Write("Strategy: ");
                    string strat = Console.ReadLine();

                    maintenanceService.PerformMaintenance(id, strat);
                }
                {
                    Console.WriteLine("Invalid ID.");
                }
                Pause();
            }

            else if (choice == "6")
            {
                scheduler.RunDailyAudit(equipmentService);
            }
            
            else if (choice == "7") break;
        }
    }

    // Helper to pause execution so user can read output
    static void Pause()
    {
        Console.WriteLine("\nPress any key to continue...");
        Console.ReadKey();
    }
}