// Github project : https://github.com/akimgacem/snookickerTest
// installation guide
//1. npm init (pour creer le package.json)
//pour le launch.json, aller dans "run and debug"
//2. npm install --save ws 
//3. npm install --save fs 
//4. node server.js 

// render.com (no udp) guide installation : https://youtu.be/q8GSWGu2roA?list=LL&t=213
// Build Command : remplacer $yarn par $npm install
// socket closed automatically after 5 mins of inactivity

//app.cyclic.sh (no websocket)

//https://ably.com/pricing
//https://pusher.com/channels/pricing
//https://www.pubnub.com/pricing/

var fs              = require('fs')
var WebSocket = require('ws');

function GetLocalIPAddress (PORT) {
    const result =  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
		console.log('Server listening on ' + add + ":" + PORT);
    });
};

var port = process.env.PORT || 3333;

var server =  new WebSocket.Server({ port: port });
GetLocalIPAddress(port);

var clientInc = 0;
//OnClientConnected
server.on('connection', function (socket, req) { 

	//Welcome message
	clientInc++;
	console.log("Client connected ("+clientInc+")");
	SendMessage(socket,  "Server: hello client");
         
	//OnClientMessageReceived
	socket.on('message', function(message)  {
		const data = JSON.parse(message);

		console.log("Client "+ data.name +": "+data.msg);
		SendMessage(socket,  "received !");
	});  

	//OnClientDisconnected
	socket.on('close', function(error)  {
		clientInc--;
		console.log("Client disconnected :" + error);
	});
} );

//OnServer
server.on('sessionError', function(error, session) {
	console.error('QUIC session error:', error.message);
});
server.on('error', function(error)  {
	console.error('QUIC socket error:', error.message);
});
server.on('close', function(error)  {
	console.error('QUIC socket on close');
	//clients.delete(ws);
});
server.on('enpointClose', function(endPoint,error)  {
	console.error('QUIC enpoint on close'+error.message);
	console.error(endPoint) ;
});

//Message handler
function SendMessage(socket, message){
	socket.send(message);
}
