// Patterns/Observer/Manager.cs
public class Manager : IObserver
{
    public string Name { get; set; }
    public void Update(string message)
    {
        // In a real app, this sends an Email
        Console.WriteLine($"[Email to Manager {Name}] Notification: {message}");
    }
}