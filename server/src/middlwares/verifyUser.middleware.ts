import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { CustomJwtPayload } from "../types/express";

const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.cookies.jwt || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;

    // Check if the token has expired
    if (Date.now() >= decoded.exp! * 1000) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token has expired" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error in verifyUser middleware:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    res.status(500).json({ message: "Server error: Could not verify token" });
  }
};

export default verifyUser;
