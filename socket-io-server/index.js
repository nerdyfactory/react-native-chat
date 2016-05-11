var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 4000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

var sockets = {};

io.on('connection', function (socket) {
  console.log('connection');

  socket.on('add user', function (senderId) {
    console.log('add user', senderId);
    socket.sid= senderId;
    sockets[socket.sid] = socket;  
  });

  socket.on('new message', function (data) {
    console.log('new message', data);
    if (!sockets[data.recipientId]) {
      console.log(data.recipientId, 'not online');
      //save in the queue or something
      return;
    }
    sockets[data.recipientId].emit('new message', {
      senderId: data.senderId,
      recipientId: data.recipientId,
      message: data.message
    });
  });

  socket.on('disconnect', function () {
    console.log(socket.sid, 'disconnected');
    delete sockets[socket.sid];
  });
});
