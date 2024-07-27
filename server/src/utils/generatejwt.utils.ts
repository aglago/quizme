import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Response } from "express";

export const generateJWtandSetCookie = (
  userID: Types.ObjectId,
  res: Response
) => {
  try {
    const token = jwt.sign(userID, process.env.JWT_SECRET ?? "", {
      expiresIn: "1d",
    });

    res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "development",
    });

    return token;
  } catch (error) {
    console.log("Error in generatejwtandsetcookie function: " + error);
  }
};
