const app = express();
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";

// env config
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

// routes
app.use("/api/auth", userRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on ${PORT}`);
});
