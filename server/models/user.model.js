import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    name: { type: String, default: "" },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" }, // Cloudinary URL or fallback
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // small arrays ok for MVP
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // saved posts
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

// hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed; // ✅ Save the hashed password
    next(); // ✅ Call next after setting
  } catch (error) {
    next(error); // ❗ Don't call next() twice
  }
});

// compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// assign token
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { _id: this._id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
