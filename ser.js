var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4200;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/chat.html');
});
http.listen(port, function(){
    console.log('This is listening to => http://localhost:4200');
  });
connect=[];
io.on('connection',socket => {
        connect.push(socket);
        console.log("Connected socket => %s socket",connect.length);
    socket.on('disconnect',function(socket){
        connect.splice(connect.indexOf(socket),1)
        console.log("Disconnected socket =>remaining : %s  socket ",connect.length);
    });
    socket.on('send message',function(msg,user){
        io.emit('new message',{msg:msg,usr:user});
    });
    socket.on('user',function(user){
        io.emit('broadcast',{des:user +" joined the Chat",usr:user});
    });
    setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
});