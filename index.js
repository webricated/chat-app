const express = require('express');
const app= express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

const port= 3000;

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index1.html')
});

const users = {};

io.on('connection',socket=>{
    
    socket.on('new-user-joined',name=>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });


    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,user:users[socket.id]});
    })
   

    socket.on('disconnect',()=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    })
})

server.listen(port,()=>{
    console.log(`server started on port number ${port}`);
}); 