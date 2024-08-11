import { Response, Request } from "express";
import { extractTextFromFile } from "../quizGenerator";
import { generateQuestions } from "../quizGenerator";
import { QuestionType } from "../models/quizType.models";
import { createQuestion } from "../utils/createFormattedQuestions.utils";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Quiz from "../models/quiz.models";
import { JwtPayload } from "jsonwebtoken";

export const geminiApiKey = process.env.GEMINI_API_KEY ?? "";

export const handleFileUpload = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Extract text from the uploaded file
  const extractedText = await extractTextFromFile(req.file.path);
  res.send(extractedText);
};

export const generateQuiz = async (req: Request, res: Response) => {
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

export const gradeTheory = async (req: Request, res: Response) => {
  const { userAnswer, correctAnswer, explanation } = req.body;

  const googleAI = new GoogleGenerativeAI(geminiApiKey);

  const geminiModel = googleAI.getGenerativeModel({
    model: "gemini-pro", // Use the Gemini Pro model
  });

  const prompt = `Grade the following answer based on the provided correct answer and explanation. Give a score between 0 and 10, and explain the reasoning for the score. Return the result as a JSON array of one object with 'score' and 'explanation' keys.
    
    Correct Answer: ${correctAnswer}
    Explanation: ${explanation}
        
    User Answer: ${userAnswer}
        
    Response format: {"score": number, "explanation": string}
  `;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;

    const generatedText = response.text().trim();

    // Match JSON object in the response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        const scoreAndExplanation = JSON.parse(jsonMatch[0]);
        res.json(scoreAndExplanation);
      } catch (error) {
        console.error("Error parsing scoreAndExplanation:", error);
        res.status(500).json({ error: "Failed to parse grading response" });
      }
    } else {
      console.error("No valid JSON found in the response");
      // FIXME: Remove this
      console.log(generatedText);
      res.status(500).json({ error: "Failed to grade the answer" });
    }
  } catch (error) {
    console.error("Error grading theory (gradeTheory.controller):", error);
    res.status(500).json({ error: "Failed to grade the answer" });
  }
};

export const saveQuiz = async (req: Request, res: Response) => {
  try {
    const { name, preferences, questions, played, results } = req.body;
    const id =
      typeof req.user === "string" ? req.user : (req.user as JwtPayload).id;

    const quiz = new Quiz({ name, preferences, questions, user: id });
    if (played) {
      quiz.status = "played";
      quiz.results = results;

      if (results.percentage > quiz.bestScore)
        quiz.bestScore = results.percentage;
    }
    await quiz.save();

    res
      .status(201)
      .json({ message: "Quiz saved successfully", quizId: quiz._id });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error saving quiz", error: error });
  }
};

export const savedQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find({}, "name preferences");
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving quizzes", error: error });
  }
};

export const unplayedQuizzes = async (req: Request, res: Response) => {
  try {
    const unplayedQuizzes = await Quiz.find({
      status: "unplayed",
      user:
        typeof req.user === "string" ? req.user : (req.user as JwtPayload).id,
    })
      .select("name preferences.questionCount preferences.difficultyLevel")
      .lean();
    res.json(unplayedQuizzes);
  } catch (error) {
    console.error("Error fetching unplayed quizzes:", error);
    res.status(500).json({ message: "Error fetching unplayed quizzes" });
  }
};

export const fetchQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Error fetching quiz" });
  }
};

export const finishQuiz = async (req: Request, res: Response) => {
  try {
    const { results } = req.body;
    const { id } = req.params;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.status = "played";
    quiz.results.push(results);
    if (quiz.bestScore < results.percentage)
      quiz.bestScore = results.percentage;
    await quiz.save();

    res.json({ message: "Quiz results saved successfully" });
  } catch (error) {
    console.error("Error saving quiz results:", error);
    res.status(500).json({ message: "Error saving quiz results" });
  }
};
