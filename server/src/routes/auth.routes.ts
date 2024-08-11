import express from "express";
import { register, login, resetPassword, forgotPassword, verifyTokenResetPassword, checkAuth, logout } from "../controllers/auth.controllers";
import verifyUser from "../middlwares/verifyUser.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", verifyTokenResetPassword);
router.post("/reset-password", resetPassword);
router.get("/check-auth", verifyUser, checkAuth);

export default router;
