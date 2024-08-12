import express from "express";
import verifyUser from "../middlwares/verifyUser.middleware";
import { userProfile } from "../controllers/user.controllers";

const router = express.Router();

router.use(verifyUser);

router.get("/profile", userProfile);

module.exports = router;

export default router;
