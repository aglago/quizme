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
    model: "gemini-pro", // Use the Gemini Pro model
  });

  const prompt = `Generate ${
    preferences.questionCount
  } ${preferences.questionTypes.join(", ")} questions at ${
    preferences.difficultyLevel
  } difficulty based on the following text. Include an explanation for each correct answer. Format as JSON array.

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
        return dummyQuestions;
      }
    } else {
      console.error("No valid JSON found in the response");
      console.log(generatedText);
      return dummyQuestions;
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    return dummyQuestions;
  }
};
