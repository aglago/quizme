import express from "express";
import multer from 'multer';
import generateQuiz from "../controllers/generateQuiz.controller";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/generate-quiz', upload.single('file'), generateQuiz);

export default router;