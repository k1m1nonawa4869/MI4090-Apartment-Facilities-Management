// Services/IEquipmentFactory.cs
public interface IEquipmentFactory
{
    // Update signature to accept location
    Equipment Create(string type, string name, string location);
}