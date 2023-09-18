namespace CustomerApp.Models;

public record DatabaseConfiguration
{
    public string Name { get; set; } = default!;
    public string ConnectionString { get; set; } = default!;
};
