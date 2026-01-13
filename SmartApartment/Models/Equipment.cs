// Models/Equipment.cs
using System.Text.Json.Serialization;

[JsonDerivedType(typeof(GeneralItem), typeDiscriminator: "GeneralItem")]
public abstract class Equipment
{
    public Guid Id { get; set; } = Guid.NewGuid();     // This is your Unique ID (Asset Tag)
    
    public string Name { get; set; }
    
    public string Location { get; set; } // Simplified Composite Pattern

    public DateTime PurchaseDate { get; set; } = DateTime.Now;
    public decimal InitialCost { get; set; } = 0; // Price when bought
    public string Status { get; set; } = "Active";

    public abstract string GetDetails();
}