import "dotenv/config";
import { createServer } from "node:http";
import { Server } from "socket.io";

import { app } from "./app.js";  
import connectDB from "./Repository/index.js";
import setupGateway from "./socket/gateway.js";

// Optional: add test route
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

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
