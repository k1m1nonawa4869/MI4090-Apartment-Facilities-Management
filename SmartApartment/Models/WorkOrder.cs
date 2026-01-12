// Models/WorkOrder.cs
using System.Text.Json.Serialization;

public class WorkOrder
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid EquipmentId { get; set; } // Links back to the Equipment
    public DateTime Date { get; set; } = DateTime.Now;
    public string StrategyUsed { get; set; } // "Quick", "Deep", "Inspect"
    public string TechnicianNote { get; set; }

    public override string ToString()
    {
        return $"[{Date:yyyy-MM-dd HH:mm}] Strategy: {StrategyUsed} | Note: {TechnicianNote}";
    }
}