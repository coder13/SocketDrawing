const express = require('express');
const app = express();
const http = require("http").createServer(app);
const io = require('socket.io')(http);
const colors = ["red", "green", "blue", "orange", "yellow", "pink", "purple", "White"];

app.use(express.static('public'));

// path = {owner: , id: , d: }

var clients = 0;
app.clients = [];
app.paths = [];
io.on('connection', function (client) {
   console.log("client connected with id: " + clients.toString());

   var c = {clientID: client.id, id: clients, color: colors[clients % colors.length]};
   app.clients.push(c)
   client.emit("init", JSON.stringify({client: c, data: app.paths}));

   client.on("create", function (data) {
        app.paths.push(JSON.parse(data));
        console.log('created path ' + data);
    });

    client.on("disconnect", function (data) {
        console.log('client ' + c.id + ' disconnected');
    });

    client.on("update", function (data) {
        data = JSON.parse(data)
        app.paths.forEach(function (path) {
            if (path.owner == data.owner && path.id == data.id) {
                path.d = data.d;
                update(data);
                return;
            }
        });
    });

    client.on('log', function(data) {

        console.log('[log] ' + data.toString());
    });

    function update(path) {
        client.broadcast.emit('update', JSON.stringify(path));
    }

    clients++;
});

http.listen(8000, () => {
  console.log('running on 8000');
});

