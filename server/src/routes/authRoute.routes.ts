import express from "express";
import { register, login, resetPassword, forgotPassword, verifyTokenResetPassword } from "../controllers/auth.controllers";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", verifyTokenResetPassword);
router.post("/reset-password", resetPassword);

export default router;
