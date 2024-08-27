// create connection
var connectionChat = new signalR.HubConnectionBuilder()
  .configureLogging(signalR.LogLevel.None)
  .withUrl('/hubs/chat', signalR.HttpTransportType.WebSockets)
  .withAutomaticReconnect([0, 1000, 5000, null])
  .build();

connectionChat.on('ReceiveUserConnected', function (userId, userName, isOldConnection) {
  if (!isOldConnection) {
    addMessage(`${userName} connected.`);
  }
});

function addMessage(msg) {
  if (msg == null && msg == '') {
    return;
  }
  let ui = document.getElementById('messagesList');
  let li = document.createElement('li');
  li.innerHTML = msg;
  ui.appendChild(li);
}

// start connection
connectionChat
  .start()
  .then(function () {
    console.log('Connection started');
  })
  .catch(function (err) {
    return console.error(err.toString());
  });
