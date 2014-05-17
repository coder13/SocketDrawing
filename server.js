var fs = require('fs'), 
	http = require('http'),	
	socketIO = require('socket.io'), 
	port = 8000;
 

var server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html'));
}).listen(port, function() {
    console.log('Listening at: http://localhost:' + port);
});

socketIO.listen(server).on('connection', function (socket) {
    socket.on('message', function (msg) {
        socket.broadcast.emit('message', msg);
    });
}).set('log level', 1);

// var io = require('socket.io').listen(80);
// var Hapi = require('hapi'), port = 8000;


// io.sockets.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });

// var server = new Hapi.Server('localhost', port);

// function route(request, reply) {
// 	reply.view('index');
// }

// server.route({ method: 'GET', path: '/', handler:route});

// server.route({
//   method: 'GET',
//   path: '/{path*}',
//   handler: {
//     directory: {
//       path: './',
//       listing: false,
//       index: true
//     }
//   }
// });

// server.views({
//     engines: {
//         jade: 'jade'
//     },
//     path: './templates'
// });

// server.start(function () {
//     console.log("server running on port " + port.toString());
// });