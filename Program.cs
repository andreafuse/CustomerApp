using CustomerApp.Models;
using CustomerApp.Services;
using Microsoft.AspNetCore.OData;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.Services.AddControllers()
    .AddOData(options => options
        .Select()
        .Filter()
        .Count()
        .OrderBy()
        .SetMaxTop(null)

    // .AddRouteComponents("odata", getEdmModel())
    );
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

//Dependency Injection for database configuration
builder.Services.Configure<DatabaseConfiguration>(
    builder.Configuration.GetSection("Database")
);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Dependency Injection registering singleton
builder.Services.AddSingleton<CustomerService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(options => options
    .WithOrigins("http://localhost:4200")
    .AllowAnyMethod()
    .AllowAnyHeader()
);

// app.UseHttpsRedirection();

app.UseAuthorization();
app.MapControllers();

app.Run();