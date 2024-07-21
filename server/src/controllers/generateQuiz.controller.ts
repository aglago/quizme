import { Request, Response } from "express";
import { extractTextFromFile, generateQuestions } from "../quizGenerator";

const generateQuiz = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Extract text from the uploaded file
    const extractedText = await extractTextFromFile(req.file.path);

    // Generate questions from the extracted text
    const questions = await generateQuestions(extractedText);

    // Return the generated questions
    res.json({ questions });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: "Error generating quiz" });
  }
};

export default generateQuiz;