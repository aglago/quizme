import { Request, Response } from "express";
import { generateQuestions } from "../quizGenerator";
import { QuestionType } from "../models/quizType.models";
import { createQuestion } from "../utils/createFormattedQuestions.utils";

const generateQuiz = async (req: Request, res: Response) => {
  try {
    const { text, preferences } = req.body;

    // Generate questions from the extracted text
    const questions = await generateQuestions(text, preferences);

    // Format the questions by types FIXME: question should not be of type any
    const formattedQuestions = questions.map((question: any) => {
      if (!question.type) {
        throw new Error("Unsupported question type: undefined");
      }
      return createQuestion(question.type as QuestionType, question);
    });

    // Return the generated questions
    res.json(formattedQuestions);
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: "Error generating quiz" });
  }
};

export default generateQuiz;
