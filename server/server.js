const app = express();
import cors from "cors";
dotenv.config();
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/posts.routes.js";
import commentRoute from "./routes/comments.route.js";



const options = {
  origin: "http://localhost:5173",
  credentials: true,
};

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(options));

const PORT = process.env.PORT || 3000;

// routes
app.use("/api/auth", userRoutes);
app.use("/api", postRoutes);
app.use("/api/post", commentRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on ${PORT}`);
});
