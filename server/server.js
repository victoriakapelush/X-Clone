const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

// Create an HTTP server
const server = http.createServer(app);

// Integrate Socket.IO with the server
const io = new Server(server);

// Load the Socket.IO logic
require("./socket")(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
