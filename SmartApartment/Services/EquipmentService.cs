// Services/EquipmentService.cs
public class EquipmentService
{
    private readonly FileRepository<Equipment> _repo;
    private readonly IEquipmentFactory _factory;

    public EquipmentService(FileRepository<Equipment> repo, IEquipmentFactory factory)
    {
        _repo = repo;
        _factory = factory;
    }

    public void RegisterNewDevice(string type, string name, string location)
    {
        var newItem = _factory.Create(type, name, location);
        _repo.Add(newItem);
        Console.WriteLine($"[Success] Created {name} in {location}. ID: {newItem.Id}");
    }

    public void ListAll()
    {
        var items = _repo.FindAll();
        Console.WriteLine($"\n--- Inventory ({items.Count} items) ---");
        Console.WriteLine("{0,-36} | {1,-15} | {2,-10} | {3}", "ID (Asset Tag)", "Name", "Location", "Details");
        Console.WriteLine(new string('-', 80));

        foreach (var item in items)
        {
            // Format: ID | Name | Location | Details
            Console.WriteLine($"{item.Id} | {item.Name,-15} | {item.Location,-10} | {item.GetDetails()}");
        }
    }
}