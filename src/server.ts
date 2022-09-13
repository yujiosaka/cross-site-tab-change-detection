import { createServer } from "http";
import * as express from "express";
import { Server } from "socket.io";

const PORT = 8080;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  const ip = socket.handshake.address;
  socket.join(ip);

  socket.on("hidden", (data) => {
    io.to(ip).emit("hidden", data);
  });
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
