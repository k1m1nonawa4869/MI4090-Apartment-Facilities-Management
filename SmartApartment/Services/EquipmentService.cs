// Services/EquipmentService.cs
public class EquipmentService
{
    private readonly FileRepository<Equipment> _repo;
    private readonly FileRepository<HistoryLog> _historyRepo;
    private readonly IEquipmentFactory _factory;

    public EquipmentService(FileRepository<Equipment> repo, FileRepository<HistoryLog> historyRepo, IEquipmentFactory factory)
    {
        _repo = repo;
        _historyRepo = historyRepo;
        _factory = factory;
    }

    public void RegisterNewDevice(string type, string name, string location)
    {
        Console.WriteLine($"\n[Procurement] Ordering new {type}...");
        
        var newItem = _factory.Create(type, name, location);

        Console.WriteLine($"[Installation] Technician is unpacking {name} in {location}...");
        Console.Write("Installing");
        for (int i = 0; i < 3; i++) { Console.Write("."); Thread.Sleep(300); } 
        Console.WriteLine(" Done!");

        newItem.Status = "Active"; 
        
        _repo.Add(newItem);
        LogHistory("Create", newItem.Id.ToString(), $"Added new {type}: {name}");
        Console.WriteLine($"[System] Device {newItem.Id} is now ONLINE and ACTIVE.");
    }

    public List<Equipment> GetAll()
    {
        return _repo.FindAll();
    }

    public void ListAll()
    {
        var items = _repo.FindAll();
        Console.WriteLine($"\n--- Inventory ({items.Count} items) ---");
        Console.WriteLine("{0,-36} | {1,-15} | {2,-15} | {3,-10} | {4}", "ID", "Name", "Type", "Location", "Status");
        Console.WriteLine(new string('-', 100));

        foreach (var item in items)
        {
            var typeName = item.GetType().Name;
            Console.WriteLine($"{item.Id} | {item.Name,-15} | {typeName,-15} | {item.Location,-10} | {item.Status}");
        }
    }

    public Equipment GetById(Guid id)
    {
        var item = _repo.FindAll().FirstOrDefault(e => e.Id == id);
        return item;
    }

    public void EditEquipment(Guid id, string newName, string newType, string newLocation)
    {
        var allItems = _repo.FindAll();
        var item = allItems.FirstOrDefault(e => e.Id == id);
        
        if (item != null)
        {
            var currentType = item.GetType().Name;
            var oldDetails = $"{item.Name} ({currentType}) at {item.Location}";
            bool typeChanged = !string.IsNullOrWhiteSpace(newType) && !newType.Equals(currentType, StringComparison.OrdinalIgnoreCase);

            if (typeChanged)
            {
                // Polymorphism Swap: Create new instance, copy data, perform swap
                try 
                {
                    // Create new object with new type
                    var newInstance = _factory.Create(newType, 
                        string.IsNullOrWhiteSpace(newName) ? item.Name : newName, 
                        string.IsNullOrWhiteSpace(newLocation) ? item.Location : newLocation
                    );
                    
                    // Copy technical fields
                    newInstance.Id = item.Id; // Keep same ID
                    newInstance.Status = item.Status;
                    newInstance.PurchaseDate = item.PurchaseDate;

                    // Remove old, Add new
                    allItems.Remove(item);
                    allItems.Add(newInstance);

                    item = newInstance; // Update reference for logging
                    currentType = newType;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Error] Failed to change type: {ex.Message}");
                    return;
                }
            }
            else
            {
                // Standard Update
                if(!string.IsNullOrWhiteSpace(newName)) item.Name = newName;
                if(!string.IsNullOrWhiteSpace(newLocation)) item.Location = newLocation;
            }

            _repo.Save(allItems);
            LogHistory("Modify", item.Id.ToString(), $"Changed from [{oldDetails}] to [{item.Name} ({currentType}) at {item.Location}]");
            Console.WriteLine($"[Update] Item {item.Id} updated successfully.");
        }
        else
        {
            Console.WriteLine("[Error] Item not found.");
        }
    }

    public void DeleteEquipment(Guid id)
    {
        var allItems = _repo.FindAll();
        var item = allItems.FirstOrDefault(e => e.Id == id);
        
        if (item != null)
        {
            allItems.Remove(item);
            _repo.Save(allItems);
            LogHistory("Delete", id.ToString(), $"Removed item: {item.Name}");
            Console.WriteLine($"[System] Item {item.Name} removed from inventory.");
        }
        else
        {
            Console.WriteLine("[Error] Item not found.");
        }
    }

    public void UpdateStatus(Guid id, string newStatus)
    {
        var allItems = _repo.FindAll();
        var item = allItems.FirstOrDefault(e => e.Id == id);
    
        if (item != null)
        {
            item.Status = newStatus;
            _repo.Save(allItems); 
            LogHistory("StatusChange", item.Id.ToString(), $"Status changed to {newStatus}");
            Console.WriteLine($"[Update] Item {item.Name} is now {newStatus}.");
        }
    }

    private void LogHistory(string action, string targetId, string details)
    {
        _historyRepo.Add(new HistoryLog 
        { 
            Action = action, 
            TargetId = targetId, 
            Details = details 
        });
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