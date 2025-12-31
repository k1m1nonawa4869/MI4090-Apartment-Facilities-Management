// Models/Router.cs
public class Router : Equipment
{
    public string IPAddress { get; set; }
    public override string GetDetails() => $"[Router] {Name} (IP: {IPAddress})";
}