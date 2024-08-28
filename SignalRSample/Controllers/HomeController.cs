using System.Diagnostics;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;
using SignalRSample.Hubs;
using SignalRSample.Models;
using SignalRSample.Models.ViewModel;

namespace SignalRSample.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly IHubContext<DeathlyHallowsHub> _deathlyHub;
    private readonly ApplicationDbContext _context;
    private readonly IHubContext<OrderHub> _orderHub;

    public HomeController(
        ILogger<HomeController> logger,
        IHubContext<DeathlyHallowsHub> deathlyHub,
        ApplicationDbContext context,
        IHubContext<OrderHub> orderHub
    )
    {
        _logger = logger;
        _deathlyHub = deathlyHub;
        _context = context;
        _orderHub = orderHub;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult BasicChat()
    {
        return View();
    }

    [Authorize]
    public IActionResult Chat()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        ChatVM chatVm =
            new()
            {
                Rooms = _context.ChatRooms.ToList(),
                MaxRoomAllowed = 4,
                UserId = userId,
            };
        return View(chatVm);
    }

    public IActionResult AdvancedChat()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        ChatVM chatVm =
            new()
            {
                Rooms = _context.ChatRooms.ToList(),
                MaxRoomAllowed = 4,
                UserId = userId,
            };
        return View(chatVm);
    }

    public IActionResult Notification()
    {
        return View();
    }

    public IActionResult DeathlyHallowRace()
    {
        return View();
    }

    public IActionResult HarryPotterHouse()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(
            new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier }
        );
    }

    public async Task<IActionResult> DeathlyHallows(string type)
    {
        if (SD.DealthyHallowRace.ContainsKey(type))
        {
            SD.DealthyHallowRace[type]++;
        }
        await _deathlyHub.Clients.All.SendAsync(
            "updateDeathlyHallowCount",
            SD.DealthyHallowRace[SD.Cloak],
            SD.DealthyHallowRace[SD.Stone],
            SD.DealthyHallowRace[SD.Wand]
        );

        return Accepted();
    }

    [ActionName("Order")]
    public async Task<IActionResult> Order()
    {
        string[] name = { "Bhrugen", "Ben", "Jess", "Laura", "Ron" };
        string[] itemName = { "Food1", "Food2", "Food3", "Food4", "Food5" };

        Random rand = new Random();
        // Generate a random index less than the size of the array.
        int index = rand.Next(name.Length);

        Order order =
            new()
            {
                Name = name[index],
                ItemName = itemName[index],
                Count = index,
            };

        return View(order);
    }

    [ActionName("Order")]
    [HttpPost]
    public async Task<IActionResult> OrderPost(Order order)
    {
        _context.Orders.Add(order);
        _context.SaveChanges();
        await _orderHub.Clients.All.SendAsync("newOrder");
        return RedirectToAction(nameof(Order));
    }

    [ActionName("OrderList")]
    public async Task<IActionResult> OrderList()
    {
        return View();
    }

    [HttpGet]
    public IActionResult GetAllOrder()
    {
        var productList = _context.Orders.ToList();
        return Json(new { data = productList });
    }
}
