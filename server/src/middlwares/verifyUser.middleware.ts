import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
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
