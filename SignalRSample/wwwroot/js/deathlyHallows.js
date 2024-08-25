var cloakSpan = document.getElementById('cloakCounter');
var stoneSpan = document.getElementById('stoneCounter');
var wandSpan = document.getElementById('wandCounter');

// create connection

var connectionDeathlyHallows = new signalR.HubConnectionBuilder()
  .configureLogging(signalR.LogLevel.None)
  .withUrl('/hubs/deathlyhallows', signalR.HttpTransportType.WebSockets)
  .build();

// connect to methods that hub invokes aka receive notifications from hub

connectionDeathlyHallows.on('updateDeathlyHallowCount', (cloak, stone, wand) => {
  cloakSpan.innerText = cloak.toString();
  stoneSpan.innerText = stone.toString();
  wandSpan.innerText = wand.toString();
});

// start connection

connectionDeathlyHallows
  .start()
  .then(function () {
    connectionDeathlyHallows.invoke('GetRaceStatus').then((raceCounter) => {
      cloakSpan.innerText = raceCounter.cloak.toString();
      stoneSpan.innerText = raceCounter.stone.toString();
      wandSpan.innerText = raceCounter.wand.toString();
    });
    console.log('Connection started');
  })
  .catch(function (err) {
    return console.error(err.toString());
  });
