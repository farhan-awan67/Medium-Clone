import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/posts.routes.js";
import commentRoute from "./routes/comments.route.js";
import notificationsRoute from "./routes/notifications.route.js";
import tagsRoutes from "./routes/tagsRoutes.route.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// for users
const onlineUsers = new Map();

// Socket.IO
io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    onlineUsers.set(String(userId), socket.id);
    console.log(`${userId} is online`);
  });
  socket.on("disconnect", () => {
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        console.log(`${userId} went offline`);

        break;
      }
    }
  });
});

export const sendNotification = async (recipientId, notification) => {
  const socketId = onlineUsers.get(String(recipientId));
  if (socketId) {
    io.to(socketId).emit("notification", notification);
  }
};

app.set("io", io);

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/post", commentRoute);
app.use("/api/notifications", notificationsRoute);
app.use("/api/tags", tagsRoutes);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
