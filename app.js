var express = require('express');
var http = require('http');
var path = require('path');
var io = require('socket.io');

var mongo = require('mongodb');
var host = 'localhost';
var dbport = 27017;
var dbserver = new mongo.Server(host, dbport, {auto_reconnect: true});
var db = new mongo.Db('chatroom', dbserver, {safe: true});
var currentUser = new Array();

var app = express();


app.use(express.static(path.join(__dirname, './public')));

var server = http.createServer(app);
io = io.listen(server);
server.listen(4000);

io.sockets.on('connection', function (socket) {

	var name;

	socket.on('checkname', function(data) {
		if (currentUser.indexOf(data)==-1) {
			name=data;
			currentUser.push(data);
			socket.emit('existed', 'No');
			socket.broadcast.emit('online', name);
		} else {
			socket.emit('existed', 'Yes');
		};
	});
	
	socket.on('message', function (data) {
		name = data.name;
		socket.broadcast.emit('message', data);
	});

	socket.on('disconnect', function () {
		socket.broadcast.emit('offline', name);
		currentUser.splice(currentUser.indexOf(name), 1);
	});

});


