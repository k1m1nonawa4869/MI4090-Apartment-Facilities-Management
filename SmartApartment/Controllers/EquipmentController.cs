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
        Console.Write("Enter Type (Router/Table/Chair): ");
        var type = Console.ReadLine();
            
        Console.Write("Enter Name: ");
        var name = Console.ReadLine();
            
        Console.Write("Enter Location (e.g., Room 101): ");
        var location = Console.ReadLine();

        try 
        {
            // 2. Delegate to Service (Model Logic)
            _service.RegisterNewDevice(type, name, location);
        } 
        catch (Exception ex) 
        {
            Console.WriteLine($"[Error] Failed to add equipment: {ex.Message}");
        }
    }

    public void ViewInventory()
    {
        _service.ListAll();
    }
    }

