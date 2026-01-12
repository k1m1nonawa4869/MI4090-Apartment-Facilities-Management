// Controllers/FaultReportController.cs
public class FaultReportController
{
    private readonly EquipmentService _service;
    private readonly NotificationCenter _notifier;
    public FaultReportController(EquipmentService service, NotificationCenter notifier)
    {
        _service = service;
        _notifier = notifier;
    }

    public void ReportFault()
    {
        Console.Write("Enter Equipment ID (copy from Inventory): ");
        string inputId = Console.ReadLine();

        if (Guid.TryParse(inputId, out Guid guid))
        {
            try 
            {
                // 1. Verify it exists
                var item = _service.GetById(guid);
                
                Console.WriteLine($"Selected: {item.Name} in {item.Location}");
                Console.Write("Description of fault: ");
                var desc = Console.ReadLine();

                // 2. Update Status in DB
                _service.UpdateStatus(guid, "Faulty");

                // 3. Trigger Observer Pattern
                //"Notify staff/managers when fault reports appear"
                string msg = $"Fault Reported: {item.Name} in {item.Location} is broken!";
                _notifier.NotifyAll(msg);
                
                // 4. (Optional) In the future, we save a "FaultReport" record here
                Console.WriteLine("--- Fault Reported Successfully ---");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }
        else
        {
            Console.WriteLine("Invalid ID format.");
        }
    }
}