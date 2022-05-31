const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/chatappdb").then(function() {

    const userRoutes = require('./routes/user_routes');
    app.use("/api/user", userRoutes);

    const chatroomRoutes = require('./routes/chatroom_routes');
    app.use("/api/chat", chatroomRoutes);

});


// Create Socket Connection
const http = require('http');
const server = http.createServer(app);

const socketio = require('socket.io');
const io = new socketio.Server(server);

io.on('connection', function(socket) {
    socket.join("xyz");

    socket.on("new-message", function(data) {
        console.log("a user said : " + data);

        // EMIT
        socket.broadcast.to("xyz").emit("new-message", data);
    });

    socket.on('disconnect', function() {
        console.log("Someone disconnected!");
    });
});


const PORT = 5000;
server.listen(PORT, function() {
    console.log("Server started at PORT: " + PORT);
});