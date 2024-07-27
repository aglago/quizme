import OpenAI from "openai";
import dotenv from "dotenv";
import { QuizPreferences, QuizQuestion } from "./models/quizType.models";
import { dummyQuestions } from "./dummyQuestions";

dotenv.config(); // Load environment variables from.env file

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateQuestions(
  text: string,
  preferences: QuizPreferences
): Promise<QuizQuestion[]> {
  const prompt = `Generate ${
    preferences.questionCount
  } ${preferences.questionTypes.join(", ")} questions at ${
    preferences.difficultyLevel
  } difficulty based on the following text. Include an explanation for each correct answer. Format as JSON array.

  Text: ${text}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" if you have access
      messages: [{ role: "system", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    if (
      completion.choices &&
      completion.choices.length > 0 &&
      completion.choices[0].message?.content
    ) {
      const generatedText = completion.choices[0].message.content.trim();

      // Use regex to find JSON arrays in the response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const questions: QuizQuestion[] = JSON.parse(jsonMatch[0]);
          return questions as QuizQuestion[];
        } catch (error) {
          console.error("Error parsing generated questions:", error);
          return dummyQuestions;
        }
      } else {
        console.error("No valid JSON found in the response");
        return dummyQuestions;
      }
    } else {
      console.error("No valid response from OpenAI");
      return dummyQuestions;
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    return dummyQuestions;
  }
}
