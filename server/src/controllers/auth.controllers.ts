import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import AuthToken from "../models/authToken.model";
import { Request, Response } from "express";
import User from "../models/user.models";
import { generateJWtandSetCookie } from "../utils/generatejwt.utils";
import { sendMail } from "../utils/sendmail.utils";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword, gender } = req.body;

    // Validate inputs
    if (!name || !email || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).send({ error: "Email already exists" });

    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match" });

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // setting profile picture
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${name}`;
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${name}`;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    await newUser.save();
    const jwtoken = generateJWtandSetCookie(newUser._id, res);
    res
      .status(201)
      .json({ message: "User registered successfully", jwtoken: jwtoken });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).send({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).send({ error: "Invalid email or password" });

    const token = generateJWtandSetCookie(user._id, res);
    res.json({ message: "Logged in successfully", jwtoken: token });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ error: "Error logging in user" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: "Email not registered" });

    const token = v4();
    await AuthToken.create({
      userId: user._id,
      token,
      purpose: "password_reset",
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
    });

    // send password reset email
    sendMail(
      undefined,
      user.email,
      "Reset Password",
      `Click this link to reset your password\
          http://localhost:3000/api/auth/reset-password/${token}
        `
    );

    res.status(200).send({
      message: "Reset password link sent to your email",
      token,
      userId: user._id,
    });
  } catch (error) {
    console.log("Error in forgot password controller:", error);
    res.status(500).send({ message: "Failed to send reset password link" });
  }
};

export const verifyTokenResetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;

  // validate token
  const databaseToken = await AuthToken.findOne({ token });
  if (!databaseToken) return res.status(400).json({ message: "Invalid token" });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { newPassword, token } = req.body;

  // validate token
  const databaseToken = await AuthToken.findOne({ token });
  if (!databaseToken) return res.status(400).json({ message: "Invalid token" });

  // hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);

  // update user password
  const user = await User.findByIdAndUpdate(databaseToken.userId, {
    password: hashedNewPassword,
  });
  if (!user) return res.status(400).json({ message: "User not found" });

  // delete token from database
  await AuthToken.findByIdAndDelete(databaseToken._id);

  res.status(200).json({ message: "Password reset successfully" });
};
