namespace CustomerApp.Models;

public record CustomerDetail
(
    string Id, string CompanyName,
    string Address, string? State,
    string Country,
    string SubscriptionState,
    IEnumerable<InvoiceList> Invoices
);

public record CustomerLight(string Id, string CompanyName, string FullAddress, string SubscriptionState, int NumberOfInvoices);

public record CustomerWrite(string CompanyName, string Address, string? State, string Country, string SubscriptionState);

public record InvoiceList(string Number, DateOnly Date, decimal Total);