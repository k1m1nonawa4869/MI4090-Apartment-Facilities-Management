// Repositories/FileRepository.cs
using System.Text.Json;

public class FileRepository<T>
{
    private readonly string _filePath;

    public FileRepository(string filename)
    {
        _filePath = filename;
        if (!File.Exists(_filePath)) File.WriteAllText(_filePath, "[]");
    }

    public List<T> FindAll()
    {
        var json = File.ReadAllText(_filePath);
        return JsonSerializer.Deserialize<List<T>>(json) ?? new List<T>();
    }

    public void Add(T entity)
    {
        var list = FindAll();
        list.Add(entity);
        Save(list);
    }

    public void Save(List<T> list)
    {
        var options = new JsonSerializerOptions { WriteIndented = true };
        File.WriteAllText(_filePath, JsonSerializer.Serialize(list, options));
    }
}