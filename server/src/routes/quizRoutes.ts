import express from "express";
import multer from "multer";
import handleFileUpload from "../controllers/extractTextFromFile.controller";
import generateQuiz from "../controllers/generateQuiz.controller";

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

export default router;
