// create connection

var connectionUserCount = new signalR.HubConnectionBuilder()
  .configureLogging(signalR.LogLevel.None)
  .withAutomaticReconnect()
  .withUrl('/hubs/userCount', signalR.HttpTransportType.WebSockets)
  .build();

// connect to methods that hub invokes aka receive notifications from hub

connectionUserCount.on('updateTotalViews', (value) => {
  var newCountSpan = document.getElementById('totalViewsCounter');
  newCountSpan.innerText = value.toString();
});

connectionUserCount.on('updateTotalUsers', (value) => {
  var newCountSpan = document.getElementById('totalUsersCounter');
  newCountSpan.innerText = value.toString();
});

// invoke hub methods aka send notification to hub
function newWindowLoadedOnClient() {
  connectionUserCount.send('NewWindowReloaded');
}

connectionUserCount.onclose((error) => {
  document.body.style.background = 'red';
});

connectionUserCount.onreconnected((connectionId) => {
  document.body.style.background = 'green';
});

connectionUserCount.onreconnecting((error) => {
  document.body.style.background = 'orange';
});

// start connection

connectionUserCount
  .start()
  .then(function () {
    console.log('Connection started');
    newWindowLoadedOnClient();
  })
  .catch(function (err) {
    return console.error(err.toString());
  });
