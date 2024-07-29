import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY ?? "";

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
    console.log("generated text in quizGenerator.ts: ", generatedText);

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
