const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"], // Allow only GET and POST request methods
    allowedHeaders: ["my-custom-header"], // Allow custom headers to be sent
    credentials: true // Allow credentials (cookies) to be sent; can be set to false if not needed
  }
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "/public")));

io.on("connection", (socket) => {

  // Broadcast when a new user joins
  socket.on("newuser", (username) => {
    socket.broadcast.emit("update", username + " joined the conversation");
  });

  // Broadcast when a user leaves
  socket.on("exituser", (username) => { 
    socket.broadcast.emit("update",username + " left the conversation"); 
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