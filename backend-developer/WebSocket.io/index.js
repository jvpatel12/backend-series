const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const { Server } = require("socket.io");

const PORT = 9000;
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve("./public")));

//socket io
io.on("connection", (socket) => {
  console.log("A new user has conected", socket.id);
});

app.get("/", (req, res) => {
  return res.sendFile("/public/index.html");
});

app.listen(PORT, () => {
  console.log("app is listen", PORT);
});
