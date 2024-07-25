import { Request, Response } from "express";
import { generateQuestions } from "../quizGenerator";

const generateQuiz = async (req: Request, res: Response) => {
  try {
    const { text, preferences} = req.body
    // Generate questions from the extracted text
    const questions = await generateQuestions(text, preferences);

    // Return the generated questions
    res.json({ questions });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: "Error generating quiz" });
  }
};

export default generateQuiz;