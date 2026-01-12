// Services/MaintenanceService.cs
public class MaintenanceService
{
    private readonly FileRepository<Equipment> _equipRepo;
    private readonly FileRepository<WorkOrder> _workOrderRepo;

    public MaintenanceService(FileRepository<Equipment> equipRepo, FileRepository<WorkOrder> workOrderRepo)
    {
        _equipRepo = equipRepo;
        _workOrderRepo = workOrderRepo;
    }

    public void PerformMaintenance(Guid id, string strategyName)
    {
        // 1. Find the Item
        var allItems = _equipRepo.FindAll();
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

        // 3. Run the Strategy (The "Fix")
        try 
        {
            var strategy = MaintenanceStrategyFactory.Get(strategyName);
            strategy.Execute(item); // This updates item.Status
            
            // 2. Save the Item changes
            _equipRepo.Save(allItems);

            // 3. [NEW] Create & Save the Log (WorkOrder)
            var log = new WorkOrder
            {
                EquipmentId = item.Id,
                StrategyUsed = strategyName,
                TechnicianNote = $"Performed {strategyName} maintenance successfully."
            };
            
            _workOrderRepo.Add(log); // Save to maintenance_log.txt
            
            Console.WriteLine($"[Log] Work Order {log.Id} saved to history.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }

    //Method to read history
    public List<WorkOrder> GetHistory(Guid equipmentId)
    {
        return _workOrderRepo.FindAll()
                             .Where(w => w.EquipmentId == equipmentId)
                             .OrderByDescending(w => w.Date)
                             .ToList();
    }
}