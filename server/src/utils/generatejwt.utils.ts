import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Response } from "express";

export const generateJWTandSetCookie = (
  userId: Types.ObjectId,
  res: Response
): string => {
  const token = jwt.sign(
    { id: userId.toString() },
    process.env.JWT_SECRET || "",
    {
      expiresIn: "1d",
    }
  );

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
