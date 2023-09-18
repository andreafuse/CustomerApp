using Microsoft.AspNetCore.Mvc;
using CustomerApp.Models;
using CustomerApp.Services;
using Microsoft.AspNetCore.OData.Query;

namespace CustomerApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomerController : ControllerBase
{
    private readonly CustomerService service;

    public CustomerController(CustomerService service)
    {
        this.service = service;
    }

    [HttpGet("odata", Name = "GetODataCustomers")]
    [EnableQuery]
    public IQueryable<CustomerLight> GetODataCustomers()
    {
        return service.GetAll();
    }

    [HttpGet("count", Name = "GetCustomerCount")]
    [EnableQuery]
    public async Task<int> GetCustomersODataCount()
    {
        return await service.CustomersCount();
    }

    [HttpPost("{id}", Name = "UpdateCustomer")]
    public async Task<IActionResult> UpdateCustomer(string id, [FromBody] CustomerWrite customer)
    {
        await service.Update(id, customer);
        return CreatedAtAction(nameof(UpdateCustomer), new { customer.CompanyName });
    }

    [HttpGet("{id}", Name = "Get Customer Detail")]
    public async Task<IActionResult> GetCustomerDetail(string id)
    {
        var customer = await service.GetCustomerById(id);
        return CreatedAtAction(nameof(GetCustomerDetail), customer);
    }


    [HttpGet(Name = "GetCustomers")]
    [EnableQuery]
    public async Task<List<CustomerLight>> GetCustomers()
    {
        return await service.GetCustomers();
    }



    [HttpPost(Name = "AddCustomer")]
    public async Task<IActionResult> AddCustomer([FromBody] CustomerWrite customer)
    {
        await service.Create(customer);
        return CreatedAtAction(nameof(AddCustomer), new { customer.CompanyName });
    }

    [HttpGet("exists/{name}",Name = "ExistsCustomer")]
    public async Task<IActionResult> ExistsCustomer(string name)
    {
        return Ok(await service.ExistsCustomerName(name));
        
    }


}
