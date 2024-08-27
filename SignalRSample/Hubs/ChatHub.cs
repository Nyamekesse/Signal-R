using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;

namespace SignalRSample.Hubs;

public class ChatHub(ApplicationDbContext db) : Hub
{
    private readonly ApplicationDbContext _db = db;

    public override Task OnConnectedAsync()
    {
        var UserId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(UserId))
        {
            var userName = _db.Users.FirstOrDefault(user => user.Id == UserId)?.UserName;
            Clients
                .Users(HubConnections.OnlineUsers())
                .SendAsync(
                    "ReceiveUserConnected",
                    UserId,
                    userName,
                    HubConnections.HasUser(UserId)
                );

            HubConnections.AddUserConnection(UserId, Context.ConnectionId);
        }
        return base.OnConnectedAsync();
    }
}
