require('dotenv').config();
const express = require("express");
const PORT = process.env.PORT || 4700;
const { nanoid } = require("nanoid");
const connection = require('./db')

const app = express();




connection();
app.use(express.json() )
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
//above is not needed to be written socket io implicitly creates and http server when you call io.on("connectioin", (socket)=>{})
//io is our server instance


let users = [];
let rooms = [];


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

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
