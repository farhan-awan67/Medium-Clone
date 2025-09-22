import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// cookies option
const options = {
  httpOnly: true,
  secure: true,
};

// register user
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // validating body
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  } else if (username.length < 3) {
    return res.status(400).json({
      success: false,
      message: "minimun length for username is 3",
    });
  }

  //   cheking for esixting user
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res
      .status(409)
      .json({ success: false, message: "user already exist" });
  }

  // if not then we have to create
  const user = await User({ username, email, password });
  await user.save();

  const token = user.generateToken();

  return res
    .status(201)
    .cookie("token", token, options)
    .json({ success: true, message: "user register successfully", token });
});

// login user
export const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  // validating body

  // Check: either username OR email must be provided
  if (!username && !email) {
    return res.status(400).json({
      success: false,
      message: "Username or email is required",
    });
  } // Check: password is required
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  // looking for user in db
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    return res.status(404).json({ success: false, message: "user not found" });
  }

  // comparing password
  const isCorrect = await user.comparePassword(password);
  if (!isCorrect) {
    return res
      .status(401)
      .json({ success: false, message: "invalid credentiols" });
  }

  const token = await user.generateToken();

  return res
    .status(200)
    .cookie("token", token, options)
    .json({ success: true, message: "login successfully", token });
});

// user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  // lets find user in db
  const user = await User.findOne({ _id });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ user });
});

// logout user
export const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("token", options)
    .json({ success: true, message: "log out successfully" });
});
