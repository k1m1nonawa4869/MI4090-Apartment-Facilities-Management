// Services/MaintenanceService.cs
public class MaintenanceService
{
    private readonly FileRepository<Equipment> _repo;

    public MaintenanceService(FileRepository<Equipment> repo)
    {
        _repo = repo;
    }

    public void PerformMaintenance(Guid id, string strategyName)
    {
        // 1. Find the Item
        var allItems = _repo.FindAll();
        var item = allItems.FirstOrDefault(e => e.Id == id);

        if (item == null)
        {
            Console.WriteLine("[Error] Equipment not found.");
            return;
        }

        // 2. Validate Status (Can only fix faulty items)
        if (item.Status == "Active")
        {
            Console.WriteLine("[Warning] This item is already Active. Maintenance skipped.");
            return;
        }

        try 
        {
            // 3. Get the Strategy (Factory)
            var strategy = MaintenanceStrategyFactory.Get(strategyName);

            // 4. Execute the Strategy (The "Pattern" in action)
            strategy.Execute(item);

            // 5. Save Changes to Text File
            // (We re-save the whole list because we modified one item)
            _repo.Save(allItems);
            
            Console.WriteLine("--- Maintenance Record Saved ---");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Error] Maintenance failed: {ex.Message}");
        }
    }
}