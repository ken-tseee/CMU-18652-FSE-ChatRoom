
$(function () {
	var socket = io.connect();

	$('#button').click(function () {
		// send message
		var message = $('#input').val();
		var name    = $('#name').val();
		var date    = new Date();

		$('body').append('<p>' + name + ':' + message + '<br/>' + date + '</p>');

		socket.emit('message', {
			name: name,
			message: message,
			date: date
		});
	});

	socket.on('message', function (data) {
		// receive message
		$('body').append('<p>' + data.name + ':' + data.message + '<br/>' + data.date + '</p>');
	});

	socket.on('online', function () {
		// online
		var onDate = new Date();
		$('body').append('<p>' + 'Someone is online!' + '<br/>' + onDate + '</p>');
	});


	socket.on('offline', function (name, date) {
		// offline
		var offDate = new Date();
		$('body').append('<p>' + name + ' is offline!' + '<br/>' + offDate + '</p>');
	});
});
