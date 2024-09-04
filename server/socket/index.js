// socket/index.js
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");

    // Handle chat message
    socket.on("chat message", (msg) => {
      console.log("message: " + msg);
      io.emit("chat message", msg);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
