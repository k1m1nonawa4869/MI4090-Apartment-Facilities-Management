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

    // Services/EquipmentService.cs

    // ... existing code ...

    public Equipment GetById(Guid id)
    {
        // Find the item in the list
        var item = _repo.FindAll().FirstOrDefault(e => e.Id == id);
        if (item == null) throw new Exception("Equipment not found!");
        return item;
    }

    public void UpdateStatus(Guid id, string newStatus)
    {
        var allItems = _repo.FindAll();
        var item = allItems.FirstOrDefault(e => e.Id == id);
    
        if (item != null)
        {
            item.Status = newStatus;
            // In a file-based DB, we have to save the whole list again
            _repo.Save(allItems); // Ensure your FileRepository has a public Save() or distinct Update()
            Console.WriteLine($"[Update] Item {item.Name} is now {newStatus}.");
        }
    }

    public (int active, int faulty, int repair) GetStats()
    {
        var items = _repo.FindAll();
        return (
            items.Count(i => i.Status == "Active"),
            items.Count(i => i.Status == "Faulty"),
            items.Count(i => i.Status == "UnderRepair")
        );
    }

    public List<Equipment> GetFaultyItems()
    {
        return _repo.FindAll().Where(i => i.Status == "Faulty").ToList();
    }
}