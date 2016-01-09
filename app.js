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

			db.open(function (err, db) {
				db.collection('chatmessages', function (err, collection) {
					if (err) {
						throw err;
					} else {
						collection.find().sort({_id: -1}).limit(10).toArray(function (err, docs) {
							if (err) {
								throw err;
							} else {
								console.log(docs);
								socket.emit('chatrecord', docs);
								db.close();
							}
						});
					}
				});
			});

		} else {
			socket.emit('existed', 'Yes');
		};
	});
	
	socket.on('message', function (data) {
		
		db.open(function (err, db) {
			if (err) {
				throw err;
			} else {
				db.collection('chatmessages', function (err, collection) {
					collection.insert({name: data.name, message: data.message, time: data.date}, function (err, docs) {
						db.close();
					});
				})
			};
		});

		socket.broadcast.emit('message', data);
	});

	socket.on('disconnect', function () {
		socket.broadcast.emit('offline', name);
		currentUser.splice(currentUser.indexOf(name), 1);
	});

});


