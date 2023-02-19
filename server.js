// Github project : https://github.com/akimgacem/snookickerTest
// installation guide
//1. npm init (pour creer le package.json)
//pour le launch.json, aller dans "run and debug"
//2. npm install --save ws 
//3. npm install --save fs 
//4. node server.js 

// render.com guide installation : https://youtu.be/q8GSWGu2roA?list=LL&t=213
// Build Command : remplacer $yarn par $npm install
// socket closed automatically after 5 mins of inactivity


var dgram = require('dgram');//dgram

function GetLocalIPAddress (PORT) {
    const result =  require('dns').lookup(require('os').hostname(), function (err, ip, fam) {
		console.log('Server listening on ' + ip + ":" + PORT);

		//if(PORT == 3333)
		//socket.bind(port, ip);
    });
};

var port = process.env.PORT || 33333;

var socket = dgram.createSocket('udp4');
GetLocalIPAddress(port);
socket.bind(port, 'https://snookicker-multiplayer-test.onrender.com');//socket.bind(port, ip);

var publicEndpointA = null;
var publicEndpointB = null;

socket.on('listening', function () {
    console.log('UDP Server listening on ' + socket.address().address + ":" + socket.address().port);
});

socket.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);

    if(message == 'A') {
    	publicEndpointA = {
    		name: 'A',
    		address: remote.address,
    		port: remote.port
    	}
		console.log("Client A connected...");
    }

    if(message == 'B') {
    	publicEndpointB = {
    		name: 'B',
    		address: remote.address,
    		port: remote.port
    	}
		console.log("Client B connected...");
    }

    sendPublicDataToClients();
});


function sendPublicDataToClients () {
	if(publicEndpointA && publicEndpointB) {

		var messageForA = new Buffer(JSON.stringify(publicEndpointB));
		socket.send(messageForA, 0, messageForA.length, publicEndpointA.port, publicEndpointA.address, function (err, nrOfBytesSent) {
			if(err) return console.log(err);
			console.log('> public endpoint of B sent to A');
		});

		var messageForB = new Buffer(JSON.stringify(publicEndpointA));
		socket.send(messageForB, 0, messageForB.length, publicEndpointB.port, publicEndpointB.address, function (err, nrOfBytesSent) {
			if(err) return console.log(err);
			console.log('> public endpoint of A sent to B');
		});

	}
}
