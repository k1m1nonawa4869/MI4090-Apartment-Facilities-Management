// Models/GeneralItem.cs
public class GeneralItem : Equipment
{
    // Store the specific type name (e.g., "Lamp", "Bed") since it's not the class name
    public string Category { get; set; }

    public override string GetDetails()
    {
        return $"[{Category}] {Name}";
    }
}
