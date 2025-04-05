// app/lib/ai/openai.ts
import OpenAI from 'openai';
import { Question } from '@/app/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateQuestionsOptions {
  numQuestions?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  topics?: string[];
  questionTypes?: Array<'multiple-choice' | 'true-false' | 'short-answer'>;
}

export async function generateQuestions(
  text: string, 
  options: GenerateQuestionsOptions = {}
): Promise<Question[]> {
  const { 
    numQuestions = 5, 
    difficulty = 'medium',
    questionTypes = ['multiple-choice'],
  } = options;

  const prompt = `
    Generate ${numQuestions} ${difficulty} difficulty level questions based on the following text. 
    Include the correct answer and 3 incorrect answers for each question.
    Question types to include: ${questionTypes.join(', ')}
    Format as JSON array with question, options, and correctAnswer fields.
    
    Text: ${text}
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are an educational AI assistant that creates high-quality quiz questions.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
  });

  try {
    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content in response');
    
    const parsedQuestions = JSON.parse(content) as Array<{
      questionText: string;
      options: string[];
      correctAnswer: string | number | boolean;
      questionType?: string;
      difficulty?: number;
      topic?: string;
    }>;
    
  // Transform to proper Question type with IDs
  return parsedQuestions.map((q, index) => ({
    questionId: `gen_${Date.now()}_${index}`,
    questionText: q.questionText,
    questionType: (q.questionType || 'multiple-choice') as 'multiple-choice' | 'true-false' | 'short-answer',
    options: q.options,
    correctAnswer: q.correctAnswer,
    difficulty: q.difficulty || (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3),
    topic: q.topic || '',
  }));
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    throw new Error('Failed to generate questions');
  }
}

interface ExplanationOptions {
  detail?: 'brief' | 'detailed';
  includeExamples?: boolean;
}

export async function getExplanation(
  question: string, 
  context: string,
  options: ExplanationOptions = {}
): Promise<string> {
  const { detail = 'detailed', includeExamples = true } = options;
  
  const prompt = `
    Provide a ${detail} explanation for the following question based on the context.
    ${includeExamples ? 'Include examples to illustrate the concept.' : ''}
    
    Question: ${question}
    Context: ${context}
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are an educational AI assistant that provides clear, concise explanations.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.5,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No explanation generated');
  }
  
  return content;
}