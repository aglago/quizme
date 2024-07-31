import express from "express";
import multer from "multer";
import {
  handleFileUpload,
  generateQuiz,
  gradeTheory,
  saveQuiz,
  savedQuizzes,
} from "../controllers/quiz.controllers";

const router = express.Router();

// save file as original name to prevent overwriting
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
router.post("/save-quiz", saveQuiz); // Save a quiz for later play
router.get("/saved-quizzes", savedQuizzes); // Retrieve saved quizzes

export default router;
