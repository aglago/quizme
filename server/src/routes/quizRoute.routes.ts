import express from "express";
import multer from "multer";
import handleFileUpload from "../controllers/fileUpload.controllers";
import generateQuiz from "../controllers/generateQuiz.controllers";
import { gradeTheory } from "../controllers/gradeTheory.controllers";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/generate-quiz", generateQuiz);
router.post("/upload", upload.single("file"), handleFileUpload);
router.post("/grade-theory", gradeTheory);


export default router;
