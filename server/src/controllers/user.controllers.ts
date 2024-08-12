import { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/user.models";

export const userProfile = async (req: Request, res: Response) => {
  try {
    const userId =
      typeof req.user === "string" ? req.user : (req.user as JwtPayload).id; // Assuming the user ID is stored in req.user by the auth middleware
    const user = await User.findById(userId).select(
      "name email profilePicture bio createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user profile data
    res.json({
      name: user.name,
      email: user.email,
      avatar: user.profilePicture,
      bio: user.bio,
      joined: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};