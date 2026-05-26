using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using VoiceBotNew.Web;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

var endpoint = builder.Configuration["Copilot:Endpoint"];
builder.Services.AddSingleton(new BotConfig { Endpoint = endpoint });

builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

await builder.Build().RunAsync();
