
$(function () {
	$('#inputarea').hide();
	$('#messages').hide();
	var socket = io.connect();
	var currentname;

	$('#login').click(function () {
		if ($('#name').val()=='') {
			alert('User name cannot be empty!');
		} else {
			socket.emit('checkname', $('#name').val());
		}
	})

	$('#send').click(function () {
		// send message
		var message = $('#input').val();
		var name = $('#name').val();
		var date = new Date().toString().slice(4, 25);

		if (message=='') {
			alert('Message cannot be empty!');
		} else {
			$('#messages').prepend('<p>' + name + ' < ' + date + ' > ' + ':' + '<br/>' + message + '</p>');

			socket.emit('message', {
				name: name,
				message: message,
				date: date
			});
			$('#input').val('');
		}
	});

	$('#logout').click(function () {
		socket.emit('logout', $('#name').val());
		$('#inputarea').hide();
		$('#nameblank').show();
		$('#messages').empty();
		$('#messages').hide();
		$('#name').val('');
		$('#currentuser').html('Current User: ');
	});

	socket.on('existed', function (data) {
		if (data=='No') {
			currentname=$('#name').val();
			$('#nameblank').hide();
			$('#inputarea').show();
			$('#currentuser').append(currentname);
			$('#messages').show();
		} else {
			alert('This name has already been occupied. Please input another one!');
			$('#name').val('');
		};
	});

	socket.on('message', function (data) {
		// receive message
		if (currentname!=null) {
			$('#messages').prepend('<p>' + data.name + ' < ' + data.date + ' > ' + ':' + '<br/>' + data.message + '</p>');
		}
	});

	socket.on('online', function (name) {
		// online
		if (currentname!=null) {
			var onDate = new Date().toString().slice(4, 25);
		$('#messages').prepend('<p style="color:green">' + name + ' < ' + onDate + ' > ' + '<br/>' + 'Online!' + '</p>');
		}
	});

	socket.on('offline', function (name) {
		// offline
		if (currentname!=null) {
			var offDate = new Date().toString().slice(4, 25);
		$('#messages').prepend('<p style="color:red">' + name + ' < ' + offDate + ' > ' + '<br/>' + 'Offline!' + '</p>');
		}
	});

	socket.on('chatrecord', function (data) {
		for (var i = data.length-1; i>=data.length-10; i--) {
			$('#messages').prepend('<p>' + data[i].name + ' < ' + data[i].time + ' > ' + ':' + '<br/>' + data[i].message + '</p>');
		};
	});

});
