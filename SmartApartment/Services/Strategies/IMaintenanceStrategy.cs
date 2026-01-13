// Services/Strategies/IMaintenanceStrategy.cs
public interface IMaintenanceStrategy
{
    // The strategy takes the equipment and performs logic on it
    MaintenanceResult Execute(Equipment equipment);
}