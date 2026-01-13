// Services/EquipmentFactory.cs
public class EquipmentFactory : IEquipmentFactory
{
    public Equipment Create(string type, string name, string location)
    {
        Equipment item;

        // Always create GeneralItem
        item = new GeneralItem { Category = type };

        // Common properties setup
        item.Name = name;
        item.Location = location; // <--- Set the location here
        
        return item;
    }
}