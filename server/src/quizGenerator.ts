import dotenv from "dotenv";
import { parseOfficeAsync } from "officeparser";
import { QuizPreferences } from "./models/quizType.models";
import { dummyQuestions } from "./dummyQuestions";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config(); // Load environment variables from.env file

export async function extractTextFromFile(filePath: string): Promise<string> {
  try {
    const data = await parseOfficeAsync(filePath);
    return data.toString();
  } catch (error) {
    console.log(error);
    return "File has not been parsed";
  }
}

const geminiApiKey = process.env.GEMINI_API_KEY ?? "";

export const generateQuestions = async (
  text: string,
  preferences: QuizPreferences
) => {
  const googleAI = new GoogleGenerativeAI(geminiApiKey);

  const geminiModel = googleAI.getGenerativeModel({
    model: "gemini-pro",
  });

  const prompt = `You are creating a quiz app. Generate ${
    preferences.questionCount
  } ${preferences.questionTypes.join(", ")} questions at ${
    preferences.difficultyLevel
  } difficulty based on the following text. Include an explanation for each correct answer and specify the type: ${preferences.questionTypes.join(
    ", "
  )}. Format as a JSON array with the following structure for each question:

- For multiple-choice:
{
  "type": "multiple-choice",
  "question": "Question text",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": "Correct option",
  "explanation": "Explanation of the correct answer"
}

- For true-false:
{
  "type": "true-false",
  "question": "Question text",
  "options": ["true", "false"],
  "correctAnswer": "true or false",
  "explanation": "Explanation of the correct answer"
}

- For fill-in-the-blank:
{
  "type": "fill-in-the-blank",
  "question": "Question text with a blank __",
  "correctAnswer": "Correct text to fill in the blank",
  "explanation": "Explanation of the correct answer"
}

- For theory:
{
  "type": "theory",
  "question": "Question text",
  "correctAnswer": "Expected answer",
  "explanation": "Explanation of the correct answer"
}

Ensure the JSON array is properly formatted and each question follows the specified structure.

Text: ${text}`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const generatedText = response.text().trim();
    
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const questions = JSON.parse(jsonMatch[0]);
        return questions;
      } catch (error) {
        console.error("Error parsing generated questions:", error);
        console.error("Generated text:", generatedText);
        return [];
      }
    } else {
      console.error("No valid JSON found in the response");
      console.error("Generated text:", generatedText);
      return [];
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
};
