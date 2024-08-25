// create connection
var connectionOrder = new signalR.HubConnectionBuilder()
  .configureLogging(signalR.LogLevel.None)
  .withUrl('/hubs/order', signalR.HttpTransportType.WebSockets)
  .build();

var dataTable;

$(document).ready(function () {
  loadDataTable();
});

function loadDataTable() {
  dataTable = $('#tblData').DataTable({
    ajax: {
      url: '/Home/GetAllOrder',
    },
    columns: [
      { data: 'id', width: '5%' },
      { data: 'name', width: '15%' },
      { data: 'itemName', width: '15%' },
      { data: 'count', width: '15%' },
      {
        data: 'id',
        render: function (data) {
          return `
                        <div class="w-75 btn-group" role="group">
                        <a href=""
                        class="btn btn-primary mx-2"> <i class="bi bi-pencil-square"></i> </a>
                      
					</div>
                        `;
        },
        width: '5%',
      },
    ],
  });
}

connectionOrder.on('newOrder', function () {
  dataTable.ajax.reload();
  toastr.success('New Order Added');
});

// start connection

connectionOrder
  .start()
  .then(function () {
    console.log('Connection started');
  })
  .catch(function (err) {
    return console.error(err.toString());
  });
