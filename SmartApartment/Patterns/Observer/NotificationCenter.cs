// Patterns/Observer/NotificationCenter.cs
public class NotificationCenter
{
    private List<IObserver> _observers = new List<IObserver>();

    public void Subscribe(IObserver observer)
    {
        _observers.Add(observer);
    }

    public void NotifyAll(string message)
    {
        Console.WriteLine("\n--- Broadcasting Notification ---");
        foreach (var observer in _observers)
        {
            observer.Update(message);
        }
        Console.WriteLine("---------------------------------");
    }
}