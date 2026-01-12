using System;

public class HistoryLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Action { get; set; } // "Modify" or "Delete"
    public string TargetId { get; set; } // Equipment ID
    public string Details { get; set; } // What changed
    public DateTime Timestamp { get; set; } = DateTime.Now;

    public override string ToString()
    {
        return $"[{Timestamp}] {Action}: {Details} (ID: {TargetId})";
    }
}
