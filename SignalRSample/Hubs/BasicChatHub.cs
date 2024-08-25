using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;

namespace SignalRSample.Hubs;

public class BasicChatHub(ApplicationDbContext db) : Hub
{
    private readonly ApplicationDbContext _db = db;

    public async Task SendMessageToAll(string user, string message)
    {
        await Clients.All.SendAsync("MessageReceived", user, message);
    }

    [Authorize]
    public async Task SendMessageToReceiver(string sender, string receiver, string message)
    {
        var userId = _db
            .Users.FirstOrDefault(user => user.Email.ToLower() == receiver.ToLower())
            ?.Id;
        if (!string.IsNullOrEmpty(userId))
        {
            await Clients.User(userId).SendAsync("MessageReceived", sender, message);
        }
    }
}
