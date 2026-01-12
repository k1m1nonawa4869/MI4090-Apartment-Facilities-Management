public class Technician : IObserver
{
    public string Phone { get; set; }
    public void Update(string message)
    {
        // In a real app, this sends an SMS
        Console.WriteLine($"[SMS to Technician {Phone}] Alert: {message}");
    }
}