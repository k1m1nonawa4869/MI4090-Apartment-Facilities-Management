// Services/EquipmentFactory.cs
public class EquipmentFactory : IEquipmentFactory
{
    public Equipment Create(string type, string name, string location)
    {
        Equipment item;

        switch (type.ToLower())
        {
            case "router":
                item = new Router { IPAddress = "192.168.1.X" }; // Default IP
                break;
            case "table":
                item = new Table { Material = "Wood" };
                break;
            default:
                throw new ArgumentException("Unknown type");
        }

        // Common properties setup
        item.Name = name;
        item.Location = location; // <--- Set the location here
        
        return item;
    }
}