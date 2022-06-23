require('dotenv').config();
const express = require("express");
const { nanoid } = require("nanoid");
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');






const saltRounds = process.env.SALT_ROUNDS
const PORT = process.env.PORT || 4923;

mongoose.connect("mongodb://localhost:27017/finalChatDB", {useNewUrlParser:true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    username: String,
    password:String
});

const User = new mongoose.model("User", userSchema)

const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded());


let logReg = false;

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET","POST"]
  },
});

let users = [];
let rooms = [];






app.post('/register' , (req,res)=>{
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
  bcrypt.hash(req.body.password , saltRounds, function(err, hash) {
    console.log(req.body.username)
    console.log(req.body.password)
    // console.log(hash);
      const newUser = new User({
          username:req.body.username,
          password:req.body.password
          // recentSocketId:putSomeSocket
      });
      newUser.save((err)=>{
          if (err){
              console.log(err);
              res.json({message:"The registration did not work"})
          } else {
              res.json({message:"The registration worked. Please log in"})
          }
      })
  })
})
})
app.post('/login' , (req,res)=>{
  try{
      User.findOne({username: req.body.username},(err,foundUser)=>{
          if (err){
              console.log(err);
          } else {
              if(foundUser){
                  bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                      if (result){
                          // this is where it matches
                          console.log('Logged in')
                          res.json({message:"The login worked",status:true})
                          logReg = true;
                      }
                  });
              }
          }
      })
  }catch(error){
      console.log(`An error occurred: ${error}`)
      res.json({message:"The login did not work",status:false})
  }
})







if(logReg){
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
  
    socket.emit("me", socket.id); // listens to me event
    users.push(socket.id);
  
    socket.broadcast.emit("updateUsers", users); // this should send the users array to all the clients that are connected to the server
    // access on front end by listening for this event
  
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected.`);
      users = users.filter((user) => user !== socket.id);
      // console.log(users);
      socket.broadcast.emit("updateUsers", users);
      socket.disconnect();
    });
  
    socket.emit("getAllUsers", users);
    console.log(users);
  
  
  
    // Rooms
    // frontend will emit create_room event
    socket.on("create_room", () => {
      const room = {
        id: nanoid(7),
        capacity: 10,
        usersJoined: [socket.id],
        chat: [],
      };
      socket.join(room);
      socket.emit("get_room", room);
      console.log("Room created: " + room.id);
      rooms.push(room);
  
      socket.broadcast.emit("updateRooms", rooms);
    });
  
    socket.on("join_room", (room) => {
      socket.join(room.id);
      console.log(`user ${socket.id} joined room: ${room.id}`);
    });
    socket.emit("getAllRooms", rooms);
  
    socket.broadcast.emit("updateRooms", rooms);
  
    socket.on("message", (payload) => {
      console.log(`Message from ${socket.id} : ${payload.message}`);
      rooms.map((room) => {
        if (room.id === payload.room) {
          singleChat = { message: payload.message, writer: payload.socketId };
          room.chat.push(singleChat);
          payload.chat = room.chat;
        }
      });
  
      io.to(payload.room).emit("chat", payload);
    });
  });
}









server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
