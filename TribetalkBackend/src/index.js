
import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

import setupGateway from "./Utils/socket/gateway.js";


dotenv.config({
    path: './.env'
})

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Server is running</h1>");
});

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

setupGateway(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


// connectDB()
// .then(() => {
//     app.listen(process.env.PORT || 8000, () => {
//         console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
//     })
// })
// .catch((err) => {
//     console.log("MONGO db connection failed !!! ", err);
// })
