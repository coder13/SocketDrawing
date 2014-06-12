var fs = require("fs"), 
    http = require("http"), 
    socketIO = require("socket.io"), 
    port = (process.argv[2]? +process.argv[2]:8000), 
    colors = ["red", "green", "blue", "orange", "yellow", "pink", "purple", "White"];
 
var server = http.createServer(function(req, res) {
    try {

        if (req.url == "/") {
            res.writeHead(200, { "Content-type": "text/html"});
            res.end(fs.readFileSync(__dirname + "/index.html"));
        } else {
            var path = req.url.split('.');
            if (path[path.length-1] == 'js')
                res.writeHead(200, {"Content-type": "text/javascript"});
            else if(path[path.length-1] == 'css')
                res.writeHead(200, {"content-type": "text/javascript"})
            else
                res.writeHead(200, {"Content-type": "text/plain"});

            res.end(fs.readFileSync(__dirname + req.url));
        }
    } catch (e) {}
}).listen(port, "0.0.0.0", function() {
    console.log("Listening at: http://localhost:" + port);
});

// path = {owner: , id: , d: }

var clients = 0;
var app = {
    paths: [

    ]
};

socketIO.listen(server).on("connection", function (client) {
   console.log("client connected with id: " + clients.toString());
   
   client.emit("init", JSON.stringify({id: clients.toString(), color: colors[clients % colors.length], data: app.paths}));

   client.on("create", function (data) {
        app.paths.push(JSON.parse(data));
        console.log('created path ' + data);
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

    function update(path) {
        client.broadcast.emit('update', JSON.stringify(path));
    }

    client.on("clear", function(data) {
        app.paths = [];
        console.log("clear");
    });
    clients++;
}).set("log level", 1); 