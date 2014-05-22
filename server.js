var fs = require('fs'), 
	http = require('http'),	
	socketIO = require('socket.io'), 
	port = 8080;
 

var server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html'));
}).listen(port, function() {
    console.log('Listening at: http://localhost:' + port);
});

var data = "";

socketIO.listen(server).on('connection', function (client) {
	console.log('client connected');
	client.emit('message', data);

    client.on('message', function (msg) {
    	data = msg;
        client.broadcast.emit('message', msg);
    });
}).set('log level', 1); 