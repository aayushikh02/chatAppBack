var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


//mongodb
const cors = require("cors");
app.use(cors());
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/chatBack';
mongoose.connect((url), { useNewUrlParser: true });
var db = mongoose.connection;

//----------------------------------------------Friends Added--------------------------------------------------

friendAdded

var friendAddedschema = new mongoose.Schema({
    usercontact: { type: String, required: true },
    friendName: { type: String, required: true },
    friendContact:{type:String,unique:true}
});

var friendAdded = mongoose.model('friendAdded', friendAddedschema);

app.post('/friendAdded', function (req, res) {
    console.log("yahahahaa friend addede me");
   
    var myDataFriends = friendAdded({
        usercontact: req.body.contact,
        friendName: req.body.friendName,
        friendContact:req.body.friendContact
    });
    console.log(myDataFriends.usercontact);
    console.log("friendname");
    console.log(myDataFriends.friendName);
    // console.log(friendContact);
    db.collection('usersignups').update( {'contact':myDataFriends.usercontact},{ $push: { 'friends': myDataFriends } },function(err,c){
        // console.log(c);
        console.log("****************************");
        res.send(
            {
                "tag": "All rights are reserved by Aayushi",
                "code": "200",
                "data": "Failed"
            }
        );
    });
  
});

//----------------------------------------------User SignUp--------------------------------------------------

var userSignUpschema = new mongoose.Schema({
    name: { type: String, required: true } ,
    contact: { type: String, required: true ,unique: true},
    password: { type: String, required: true },
    friends:{type:Array}
});

var userSignUp = mongoose.model('userSignUp', userSignUpschema);

app.post('/userSignUp', function (req, res) {
    console.log("yahahahaa");
    console.log(req.body);
    var myData = userSignUp({
        name: req.body.name,
        contact: req.body.contact,
        password: req.body.password,
        friends:req.body.friends
    });

    db.collection('usersignups').insertOne(myData, function (err, collection) {
        if (err) {
            console.log(err);
            console.log("error in new");
            res.send(
                {
                    "tag": "All rights are reserved by Aayushi",
                    "code": "503",
                    "data": "Failed"
                }
            );
        } else {
            console.log("Record inserted Successfully");
            res.send(
                {
                    "tag": "All rights are reserved by Aayushi",
                    "code": "200",
                    "data": "Success"
                }
            );
        }
    });
}); 

//-----------------------------------------------User Login-----------------------------------------------

var userLoginSchema = new mongoose.Schema({
    contact: { type: String, required: true },
    password: { type: String, required: true }
});

var userLogin = mongoose.model('userLogin', userLoginSchema);


app.post('/userLogin', function (req, res) {
console.log(req);
    db.collection('usersignups').findOne({ contact: req.body.contact }, function (err, user) {
        console.log(user);
        console.log("hahhahahah");
        
        if (user === null) {
            console.log("login invalid...")
            res.send(
                {
                    "tag": "All rights are reserved by Aayushi",
                    "code": "400",
                    "data": "Failed"
                }
            );
        } else if (user.contact === req.body.contact && user.password === req.body.password) {
            console.log("sab badiya");
            res.send(
                {
                    "tag": "All rights are reserved by Aayushi",
                    "code": "200",
                    "data": "Success"
                }
            );
        } else {
            console.log("Credentials wrong");
            res.send(
                {
                    "tag": "All rights are reserved by Aayushi",
                    "code": "503",
                    "data": "Failed"
                }
            );  
    }
    });
});

//--------------------------------------------Get list of friends added-------------------------------------------

var getfriendSchema = new mongoose.Schema({
    getContactFriend: { type: String, required: true },
});

var getfriend = mongoose.model('getfriend', getfriendSchema);

app.post('/getfriends',function(req,res){
    console.log("request-------------------------------------------------------");
    console.log(req.body.rr);
// res.send("ok");
    // console.log(getContactFriend);
    // console.log(req.body);
    db.collection('usersignups').findOne({contact:req.body.rr},function(err,filess){
        if(err){
            res.send('errors1');
            console.log("error hai")
        }
        // console.log(filess.friends);
        res.json(filess);
    });
})

io.sockets.on('connection', function(socket) {
    // We're connected to someone now. Let's listen for events from them
   var roomNaam;
    users=[];
    var x;
    var y;
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
    roomNaam=roomName;
       console.log(roomName);
    socket.join(roomName);
    x= roomName.slice(0,10);
   
    console.log(x);
     y = roomName.slice(10,20);
    console.log(y);
    console.log(x+y);
    // socket.to('game1').to('game2').emit('nice game', "let's play a game (too)");
     // io.sockets.in("CS").emit("WELCOME CS BRANCH");
    console.log("hdsfc");
});

socket.on('typing',function(data){
socket.broadcast.emit('typing',data)
});
  socket.on('msg', function(data) {
        //Send message to everyone
        console.log("phle kaha kaha??");
        console.log(x+y);
        console.log(y+x);
        io.sockets.to(x+y).to(y+x).emit('newmsg', data);
        // io.sockets.in(roomNaam).emit('newmsg', data);
        // io.sockets.emit('newmsg',data);
        console.log("bas ho gya")
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