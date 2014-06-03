var fs = require('fs'), 
	http = require('http'),	
	socketIO = require('socket.io'), 
	port = 8000;
<<<<<<< HEAD
 

var server = http.createServer(function(req, res) {
    try {
        if (req.url == '/') {
            res.writeHead(200, { 'Content-type': 'text/html'});
            res.end(fs.readFileSync(__dirname + '/index.html'));
        }
        
        if (req.url.split('/')[1] == 'js')
            res.writeHead(200, { 'Content-type': 'text/javascript'});
        else if (req.url.split('/')[1] == '')
            res.writeHead(200, { 'Content-type': 'text/plain'});
        
        res.end(fs.readFileSync(__dirname + req.url));
    } catch (e) {}
}).listen(port, function() {
=======

var server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html'));
}).listen(port, "0.0.0.0", function() {
>>>>>>> 997ffe9a4cef7d152d8027c232ab91ecd201fb6e
    console.log('Listening at: http://localhost:' + port);
});

var data = "M ";

socketIO.listen(server).on('connection', function (client) {
	console.log('client connected');
	client.emit('message', data);

    client.on('message', function (msg) {
    	data = msg;
        client.broadcast.emit('message', msg);
    });
}).set('log level', 1); 