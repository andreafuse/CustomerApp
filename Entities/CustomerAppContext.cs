using MongoFramework;

namespace CustomerApp.Entities;

#pragma warning disable 
public class CustomerAppContext : MongoDbContext
{
    public CustomerAppContext(IMongoDbConnection connection) : base(connection)
    {

    }

    public MongoDbSet<Customer> Customers { get; set; } 
    public MongoDbSet<Invoice> Invoices { get; set; }

    // protected override void OnConfigureMapping(MappingBuilder mappingBuilder)
    // {
    //     mappingBuilder.Entity<Customer>().HasKey(e => e.Id);
    //     mappingBuilder.Entity<Invoice>().HasKey(e => e.Id);
    // }
}
#pragma warning restore