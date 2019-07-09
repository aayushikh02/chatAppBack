var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.sockets.on('connection', function(socket) {
    // We're connected to someone now. Let's listen for events from them

    users=[];

    // socket.on('setUsername', function(data) {
    //           console.log(data);
    //             if(users.indexOf(data) > -1) {
    //             console.log(users.indexOf(data));
    //             socket.emit('userExists', data + ' username is taken! Try some other username.');
    //           } else {
    //              users.push(data);
    //              console.log(users.indexOf(data));
    //              socket.emit('userSet', {username: data});
    //           }
    //        });

   socket.on('addToRoom', function(roomName) {
       
       console.log(roomName);
    socket.join(roomName);
    
    socket.on('msg', function(data) {
        //Send message to everyone
        console.log("phle kaha kaha??");
        io.sockets.in(roomName).emit('newmsg', data);
        console.log("bas ho gya")
     })

    io.sockets.in("CS").emit("WELCOME CS BRANCH");
    console.log("hdsfc");
});

//     socket.on('setUsername', function(data) {
//         // We've received some data. Let's just log it
//         console.log("kya hai>>>>");
//         console.log(data);
//         // Now let's reply
//         socket.emit('event', {some: "data"});
//     });
//     socket.on('now', function(data) {
//         // We've received some data. Let's just log it
//         console.log(data);
//         console.log("here in node.js")
//         // Now let's reply
//         socket.emit('event', {some: "data"});
// });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
 });