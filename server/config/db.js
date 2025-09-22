import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";

const connectDB = asyncHandler(async () => {
  await mongoose.connect(process.env.MONGO_ATLAS_URI);
  console.log("DB connected successfully");
});

export default connectDB;
