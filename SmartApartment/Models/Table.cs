// Models/Table.cs
public class Table : Equipment
{
    public string Material { get; set; }
    public override string GetDetails() => $"[Table] {Name} (Material: {Material})";
}