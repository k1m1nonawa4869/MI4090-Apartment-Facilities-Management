// Models/Equipment.cs
using System.Text.Json.Serialization;

[JsonDerivedType(typeof(Router), typeDiscriminator: "Router")]
[JsonDerivedType(typeof(Table), typeDiscriminator: "Table")]
public abstract class Equipment
{
    // This is your Unique ID (Asset Tag)
    public Guid Id { get; set; } = Guid.NewGuid(); 
    
    public string Name { get; set; }
    
    // [NEW] Add this to distinguish items!
    public string Location { get; set; } 

    public DateTime PurchaseDate { get; set; } = DateTime.Now;
    public string Status { get; set; } = "Active";

    public abstract string GetDetails();
}