using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CustomerApp.Entities;

[Table("Invoices")]
public class Invoice
{
    [Key]
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId Id { get; set; } 
    public string Number { get; set; } = string.Empty;
    public DateOnly Date { get; set; }
    public decimal Total { get; set; }

}
