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
// import schema
const schema = require("./loginSchema");
const userLogin = schema.userLogin;
//----------------------------------------------Friends Added--------------------------------------------------


var friendAddedschema = new mongoose.Schema({
    usercontact: { type: String, required: true },
    friendName: { type: String, required: true },
    friendContact: { type: String, unique: true }
});

var friendAdded = mongoose.model('friendAdded', friendAddedschema);

app.post('/friendAdded', function (req, res) {

    var myDataFriends = friendAdded({
        usercontact: req.body.contact,
        friendName: req.body.friendName,
        friendContact: req.body.friendContact
    });
    db.collection('usersignups').update({ 'contact': myDataFriends.usercontact }, { $push: { 'friends': myDataFriends } }, function (err, c) {
        res.send(
            {
                "tag": "All rights are reserved by Aayushi",
                "code": "200",
                "data": "Failed"
            }
        );
    });

});

//----------------------------------------------User SignUp-----------------------------------------------------------

var userSignUpschema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    friends: { type: Array }
});

var userSignUp = mongoose.model('userSignUp', userSignUpschema);

app.post('/userSignUp', function (req, res) {
    var myData = userSignUp({
        name: req.body.name,
        contact: req.body.contact,
        password: req.body.password,
        friends: req.body.friends
    });

    db.collection('usersignups').insertOne(myData, function (err, collection) {
        if (err) {
            res.send(
                {
                    "tag": "All rights are reserved by Aayushi",
                    "code": "503",
                    "data": "Failed"
                }
            );
        } else {
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

// var userLoginSchema = new mongoose.Schema({
//     contact: { type: String, required: true },
//     password: { type: String, required: true }
// });

// var userLogin = mongoose.model('userLogin', userLoginSchema);


app.post('/userLogin', function (req, res) {
    db.collection('usersignups').findOne({ contact: req.body.contact }, function (err, user) {

        if (user === null) {
            res.send(
                {
                    "tag": "All rights are reserved by Aayushi",
                    "code": "400",
                    "data": "Failed"
                }
            );
        } else if (user.contact === req.body.contact && user.password === req.body.password) {
            res.send(
                {
                    "tag": "All rights are reserved by Aayushi",
                    "code": "200",
                    "data": { "name": user.name, "status": "Success" },
                }
            );
        } else {
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

app.post('/getfriends', function (req, res) {
    // res.send("ok");
    db.collection('usersignups').findOne({ contact: req.body.rr }, function (err, filess) {
        if (err) {
            res.send('errors1');
        }
        res.json(filess);
    });
})

io.on('connection', function (socket) {
    var roomNaamFriend;
    var yourRoom;
    users = [];
    var x;
    var y;

    socket.on('addToRoom', function (data) {
        roomNaamFriend = data.friendRoom;
        yourRoom = data.yourRoom;
        // roomNaam=roomName;
        socket.join(yourRoom);
    });

    socket.on('typing', function (data) {
        io.sockets.in(roomNaamFriend).emit('showtyping', data);
    });

    socket.on('Stoptyping', function (data) {
        io.sockets.in(roomNaamFriend).emit('hidetyping', data);
    });


    socket.on('msg', function (data) {
        //Send message to everyone
        io.sockets.to(roomNaamFriend).to(yourRoom).emit('newmsg', data);
    });

    socket.on('disconnect', function () {
        console.log('Client disconnected.');
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});



