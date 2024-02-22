const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "/public")));

io.on("connection", (socket) => {

  // Broadcast when a new user joins
  socket.on("newuser", (username) => {
    socket.broadcast.emit("update", username + " joined the conversation");
  });

  // Broadcast when a user leaves
  socket.on("exituser", (username) => { 
    socket.broadcast.emit("update",username + "A  left the conversation"); 
  })
  // Broadcast chat message
  socket.on("chat", (message) => {
    socket.broadcast.emit("chat", message);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});