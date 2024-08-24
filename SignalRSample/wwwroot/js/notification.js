// create connection
var connectionNotification = new signalR.HubConnectionBuilder()
  .configureLogging(signalR.LogLevel.None)
  .withUrl('/hubs/notification', signalR.HttpTransportType.WebSockets)
  .build();

document.getElementById('sendButton').disabled = true;

connectionNotification.on('LoadNotification', function (message, counter) {
  document.getElementById('messageList').innerHTML = '';
  var notificationCounter = document.getElementById('notificationCounter');
  notificationCounter.innerHTML = '<span>(' + counter + ')</span>';
  for (let i = message.length - 1; i >= 0; i--) {
    var li = document.createElement('li');
    li.textContent = 'Notification - ' + message[i];
    document.getElementById('messageList').appendChild(li);
  }
});

document.getElementById('sendButton').addEventListener('click', function (event) {
  var message = document.getElementById('notificationInput').value;
  connectionNotification.send('SendMessage', message).then(function () {
    document.getElementById('notificationInput').value = '';
  });
  event.preventDefault();
});

// start connection

connectionNotification
  .start()
  .then(function () {
    connectionNotification.send('LoadMessages');
    document.getElementById('sendButton').disabled = false;
  })
  .catch(function (err) {
    return console.error(err.toString());
  });
