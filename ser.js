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
let lodusr=[];
io.on('connection',socket => {
        connect.push(socket);
        console.log("Connected socket => %s socket",connect.length);
    socket.on('disconnect',function(socket){
        connect.splice(connect.indexOf(socket),1);
        lodusr.splice(lodusr.indexOf(socket),1);
        console.log("Disconnected socket =>remaining : %s  socket ",connect.length);
        if (connect.length == 0){
            lodusr=[];
        }
    });
    socket.on('dis',function(data){
        io.emit('bye',{des:data +" Bye Byeee...",usr:data});
    });
    socket.on('user',function(user){
        if(lodusr.includes(user) && lodusr.length>0 ){
            socket.emit('errusr',{des:user +" is Already taken.. try another Name",usr:""});
        }
        else{
            lodusr.push(user);
            io.emit('broadcast',{des:user +" joined the Chat",usr:user});
        }
    });
    socket.on('send message',function(msg,user){
        io.emit('new message',{msg:msg,usr:user});
    });
    setInterval(() =>{
        d=new Date();
        io.emit('time',d.getDate()+"     -     "+(d.getMonth()+1)+"     -     "+(d.getFullYear())+"                       "+d.getHours()+"     :     "+d.getMinutes()+"     :     "+d.getSeconds());
    }, 1000);
});
