// Program.cs
class Program
{
    static void Main(string[] args)
    {
        // 1. Setup Dependency Injection (Manually for now)
        string dbPath = "equipment_db.txt";
        var repository = new FileRepository<Equipment>(dbPath);
        var factory = new EquipmentFactory();
        var service = new EquipmentService(repository, factory);

        Console.WriteLine("=== Smart Apartment System (TextFile DB) ===");
        
        while (true)
        {
            Console.WriteLine("\n1. Add Equipment");
            Console.WriteLine("2. View Inventory");
            Console.WriteLine("3. Exit");
            Console.Write("Select: ");
            var choice = Console.ReadLine();

            if (choice == "1")
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
            }
            
            else if (choice == "2")
            {
                service.ListAll();
            }
            else if (choice == "3") break;
        }
    }
}