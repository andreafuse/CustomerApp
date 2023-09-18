
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoFramework;
using MongoFramework.Attributes;

namespace CustomerApp.Entities;

[Table("Customers")]
public class Customer
{
    [Key]
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId Id { get; set; }

    [Index("IX_Customers_Name", IndexSortOrder.Ascending)]
    public string CompanyName { get; set; } = default!;
    public string Address { get; set; } = default!;
    public string? State { get; set; }
    public string Country { get; set; } = default!;
    public string SubscriptionState { get; set; } = default!;

    [Column("Invoices")]
    public List<Invoice> Invoices { get; set; } = new List<Invoice>();

}
