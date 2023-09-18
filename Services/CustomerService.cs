using Microsoft.Extensions.Options;
using CustomerApp.Constants;
using CustomerApp.Models;
using CustomerApp.Entities;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoFramework;
using MongoFramework.Linq;

namespace CustomerApp.Services;
public class CustomerService
{
    private readonly DatabaseConfiguration configuration;
    public CustomerService(IOptions<DatabaseConfiguration> configuration)
    {
        this.configuration = configuration.Value;

        // just for mock-up some data
        using var ctx = GetCtx();
        if (ctx.Customers.AsNoTracking().Count() == 0)
        {
            ctx.Customers.AddRange(MockData.FAKE_CUSTOMERS);
            ctx.SaveChanges();
        }
    }

    private CustomerAppContext GetCtx()
    {
        // recreate connection every single call 
        // inject disposable object could cause lack of performance
        return new CustomerAppContext(MongoDbConnection.FromConnectionString(configuration.ConnectionString));
    }

    public Task<int> CustomersCount() => GetAll().CountAsync();
    public Task<List<CustomerLight>> GetCustomers() => GetAll().ToListAsync();
    public IQueryable<CustomerLight> GetAll()
    {
        return GetCtx().Customers
            .AsNoTracking()
            .Select(c => new CustomerLight(
                c.Id.ToString(),
                c.CompanyName,
                c.State != null
                    ? c.Address + " (" + c.State + "), " + c.Country
                    : c.Address + ", " + c.Country,
                    c.SubscriptionState,
                c.Invoices.Count()
            ));
    }
    public async Task Create(CustomerWrite customer)
    {
        using var ctx = GetCtx();
        var CUSTOMER = await ctx.Customers.FirstOrDefaultAsync(c => c.CompanyName == customer.CompanyName);
        if (CUSTOMER is not null) return;
        CUSTOMER = new Customer
        {
            Id = ObjectId.GenerateNewId(),
            Address = customer.Address,
            CompanyName = customer.CompanyName,
            Country = customer.Country,
            State = customer.State,
            SubscriptionState = customer.SubscriptionState
        };

        // Add Random invoices ( just for test )
        IEnumerable<Invoice> getRandomInvoiceLocal()
        {
            var random = new Random();
            var invoices = MockData.FAKE_CUSTOMERS.SelectMany(c => c.Invoices);
            int maxValue = invoices.Count();
            int index = random.Next(maxValue);
            return index < maxValue - 3
                ? invoices.Skip(index).Take(3)
                : invoices.Take(3);
        };
        CUSTOMER.Invoices.AddRange(getRandomInvoiceLocal());

        ctx.Customers.Add(CUSTOMER);
        await ctx.SaveChangesAsync();
    }
    public async Task Update(string id, CustomerWrite customer)
    {
        using var ctx = GetCtx();
        if (!ObjectId.TryParse(id, out ObjectId objectId)) return;
        var CUSTOMER = await ctx.Customers.FirstOrDefaultAsync(c => c.Id == objectId)
            ?? throw new ArgumentOutOfRangeException(nameof(id), $"Non è stato possibile trovare il cliente con id {id}");

        CUSTOMER.Address = customer.Address;
        CUSTOMER.CompanyName = customer.CompanyName;
        CUSTOMER.Country = customer.Country;
        CUSTOMER.State = customer.State;
        CUSTOMER.SubscriptionState = customer.SubscriptionState;
        await ctx.SaveChangesAsync();
    }
    public async Task<CustomerDetail> GetCustomerById(string id)
    {
        if (!ObjectId.TryParse(id, out ObjectId customerId))
            throw new InvalidOperationException($"l'id {id} deve essere di tipo ObjectId ");

        using var ctx = GetCtx();
        return (await ctx.Customers
            .Where(c => c.Id == customerId)
            .Select(c => new CustomerDetail
            (
                c.Id.ToString(),
                c.CompanyName,
                c.Address,
                c.State,
                c.Country,
                c.SubscriptionState,
                c.Invoices.Select(i => new InvoiceList(i.Number, i.Date, i.Total))
        )).FirstOrDefaultAsync()) ?? throw new ArgumentOutOfRangeException(nameof(id), $"Customer with id '{id}' does not exists");


    }

    public async Task<bool> ExistsCustomerName(string name)
    {
        using var ctx = GetCtx();
        return await ctx.Customers.AnyAsync(c => c.CompanyName == name);
    }
}
