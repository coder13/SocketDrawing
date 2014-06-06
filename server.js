var fs = require("fs"), 
	http = require("http"),	
	socketIO = require("socket.io"), 
	port = (process.argv[2]? +process.argv[2]:8000);
 
var server = http.createServer(function(req, res) {
    try {
        if (req.url == "/") {
            res.writeHead(200, { "Content-type": "text/html"});
            res.end(fs.readFileSync(__dirname + "/index.html"));
        } else {
            if (req.url.split('/')[1] == 'js')
                res.writeHead(200, { "Content-type": "text/javascript"});
            else
                res.writeHead(200, { "Content-type": "text/plain"});
            res.end(fs.readFileSync(__dirname + req.url));
        }
    } catch (e) {}
}).listen(port, "0.0.0.0", function() {
    console.log("Listening at: http://localhost:" + port);
});

// path = {owner: , id: , d: }

var app = {
    paths: [

    ]
};

socketIO.listen(server).on("connection", function (client) {
	console.log("client connected with id: " + client.id);

	client.emit("init", JSON.stringify({id: client.id, data: app.paths}));

    client.on("new", function (data) {
        app.paths.push(JSON.parse(data));
        
    });
}).set("log level", 1); 