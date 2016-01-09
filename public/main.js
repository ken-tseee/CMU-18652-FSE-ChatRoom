
$(function () {
	$('#inputarea').hide();
	var socket = io.connect();
	var currentname;

	$('#login').click(function () {
		socket.emit('checkname', $('#name').val());
	})

	$('#send').click(function () {
		// send message
		var message = $('#input').val();
		var name    = $('#name').val();
		var date    = new Date().toString().slice(4, 25);

		$('#messages').append('<p>' + name + ':' + message + '<br/>' + date + '</p>');

		socket.emit('message', {
			name: name,
			message: message,
			date: date
		});
		$('#inputarea').val('');
	});

	socket.on('existed', function (data) {
		if (data=='No') {
			currentname=$('#name').val();
			$('#nameblank').hide();
			$('#inputarea').show();
			$('currentuser').append(currentname);
		} else {
			alert('This name has already existed. Please input another one!');
		};
	});

	socket.on('message', function (data) {
		// receive message
		if (currentname!=null) {
			$('#messages').preppend('<p>' + data.name + ':' + data.message + '<br/>' + data.date + '</p>');
		}
	});

	socket.on('online', function (name) {
		// online
		if (currentname!=null) {
			var onDate = new Date().toString().slice(4, 25);
		$('#messages').preppend('<p>' + name + ' is online!' + '<br/>' + onDate + '</p>');
		}
	});


	socket.on('offline', function (name) {
		// offline
		if (currentname!=null) {
			var offDate = new Date().toString().slice(4, 25);
		$('#messages').preppend('<p>' + name + ' is offline!' + '<br/>' + offDate + '</p>');
		}
	});

	socket.on('chatrecord', function (data) {
		for (var i = data.length-1; i>=data.length-10; i--) {
			$('#messages').preppend('<p>' + data[i].name + ': ' + data[i].message + '<br/>' + data[i].time + '</p>');
		};
	});

});
