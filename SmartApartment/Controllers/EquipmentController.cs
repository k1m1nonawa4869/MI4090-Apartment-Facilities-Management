// Controllers/EquipmentController.cs
public class EquipmentController
{
    private readonly EquipmentService _service;

    public EquipmentController(EquipmentService service)
    {
        _service = service;
    }

    public void AddEquipment()
    {
        Console.WriteLine("\n--- Add New Equipment ---");
            
        // 1. Get Input (View Logic)
        try 
        {
            var existingTypes = _service.GetAll()
                .Select(e => (e as GeneralItem)?.Category ?? "Unknown")
                .Distinct()
                .Where(c => c != "Unknown")
                .OrderBy(c => c);

            Console.WriteLine($"Existing Types: {string.Join(", ", existingTypes)}");
        }
        catch 
        { 
            // Ignore errors if DB is empty or unreadable
        }
        
        Console.WriteLine("Common Types: Chair, Table, Router, Lamp, Bed, Fan, AC, etc.");
        Console.Write("Enter Type: ");
        var type = Console.ReadLine();
            
        Console.Write("Enter Name: ");
        var name = Console.ReadLine();
            
        Console.Write("Enter Location (e.g., Room 101): ");
        var location = Console.ReadLine();

        decimal price = 0;
        Console.Write("Enter Price ($): ");
        decimal.TryParse(Console.ReadLine(), out price);

        try 
        {
            // 2. Delegate to Service (Model Logic)
            _service.RegisterNewDevice(type, name, location, price);
        } 
        catch (Exception ex) 
        {
            Console.WriteLine($"[Error] Failed to add equipment: {ex.Message}");
        }
    }

    public void ViewInventory()
    {
        while (true)
        {
            Console.Clear();
            _service.ListAll();
            
            Console.WriteLine("\n[Options]");
            Console.WriteLine("- Enter ID (or first few chars) to Edit/Delete");
            Console.WriteLine("- Press ENTER to waiting main menu");
            Console.Write("Select: ");
            
            var input = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(input)) return;

            // Simple search by ID
            try 
            {
                var allItems = _service.GetAll();
                var item = allItems.FirstOrDefault(i => i.Id.ToString().StartsWith(input, StringComparison.OrdinalIgnoreCase));

                if (item != null)
                {
                    HandleItemOptions(item);
                }
                else
                {
                    Console.WriteLine("Item not found. Press Enter...");
                    Console.ReadLine();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.ReadLine();
            }
        }
    }

    private void HandleItemOptions(Equipment item)
    {
        while (true)
        {
            Console.Clear();
            Console.WriteLine($"--- Managing: {item.Name} ({item.Id}) ---");
            Console.WriteLine($"1. Edit Name (Current: {item.Name})");
            Console.WriteLine($"2. Edit Type (Current: {item.GetType().Name})");
            Console.WriteLine($"3. Edit Location (Current: {item.Location})");
            Console.WriteLine($"4. Edit Price (Current: ${item.InitialCost})");
            Console.WriteLine($"5. DELETE Item");
            Console.WriteLine($"6. Back");
            Console.Write("Select: ");

            var choice = Console.ReadLine();
            
            if (choice == "6") return;

            if (choice == "5")
            {
                Console.Write($"Are you sure you want to DELETE {item.Name}? (y/n): ");
                if (Console.ReadLine()?.ToLower() == "y")
                {
                    _service.DeleteEquipment(item.Id);
                    Console.WriteLine("Item deleted. Press Enter...");
                    Console.ReadLine();
                    return; // Return to list, item is gone
                }
            }
            else if (choice == "1" || choice == "2" || choice == "3" || choice == "4")
            {
                string newName = null, newType = null, newLocation = null;
                decimal? newPrice = null;

                if (choice == "1") 
                {
                    Console.Write("Enter new Name: ");
                    newName = Console.ReadLine();
                }
                if (choice == "2") 
                {
                    Console.Write("Enter new Type: ");
                    newType = Console.ReadLine();
                }
                if (choice == "3") 
                {
                    Console.Write("Enter new Location: ");
                    newLocation = Console.ReadLine();
                }
                if (choice == "4")
                {
                    Console.Write("Enter new Price: ");
                    if (decimal.TryParse(Console.ReadLine(), out decimal p)) newPrice = p;
                }

                _service.EditEquipment(item.Id, newName, newType, newLocation, newPrice);
                Console.WriteLine("Updated! Press Enter...");
                Console.ReadLine();
            }
        }
    }
}

