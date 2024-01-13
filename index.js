const http = require("http");
const app = require("./src/config/express.config");

const { Server } = require("socket.io");
// mounting express to node server
const server = http.createServer(app);

const io = new Server(server);
// socket server

console.log("I am here");
io.on("connection", (socket) => {
  // socket

  io.on("sync-user", (data) => {
    //
    console.log("I am here");

    // io.emit("event", {})
  });
});

// /io.emit("event", {})
// 127.0.0.1, ::1
server.listen(process.env.PORT || 80, (err) => {
  if (!err) {
    console.log("Server is running on port 443/80");
    console.log("Press CTRL+C to disconnect your server");
    console.log("User http://localhost:3005/ to browse your server");
  }
});
