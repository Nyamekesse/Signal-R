// create connection
var connectionChat = new signalR.HubConnectionBuilder()
  .configureLogging(signalR.LogLevel.None)
  .withUrl('/hubs/basicchat', signalR.HttpTransportType.WebSockets)
  .build();

document.getElementById('sendMessage').disabled = true;

connectionChat.on('MessageReceived', function (user, message) {
  var li = document.createElement('li');
  document.getElementById('messagesList').appendChild(li);
  li.textContent = `${user} - ${message}`;
});

document.getElementById('sendMessage').addEventListener('click', function (event) {
  event.preventDefault();
  var sender = document.getElementById('senderEmail').value;
  var message = document.getElementById('chatMessage').value;
  var receiver = document.getElementById('receiverEmail').value;

  if (receiver.length > 0) {
    connectionChat.send('SendMessageToReceiver', sender, receiver, message);
  } else {
    //send message to all of the users
    connectionChat.send('SendMessageToAll', sender, message).catch(function (err) {
      return console.error(err.toString());
    });
  }
});

// start connection
connectionChat
  .start()
  .then(function () {
    console.log('Connection started');
    document.getElementById('sendMessage').disabled = false;
  })
  .catch(function (err) {
    return console.error(err.toString());
  });
