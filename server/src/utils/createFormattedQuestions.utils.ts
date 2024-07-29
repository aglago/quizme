import {
  QuestionType,
  QuizQuestion,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  FillInTheBlankQuestion,
  TheoryQuestion,
} from "../models/quizType.models";

export function createQuestion(
  type: QuestionType,
  questionContent: Partial<QuizQuestion>
): QuizQuestion {
  const baseQuestion = {
    question: questionContent.question || "",
    type: type,
    explanation: questionContent.explanation || "",
  };

  switch (type) {
    case "multiple-choice":
      return {
        ...baseQuestion,
        options:
          (questionContent as Partial<MultipleChoiceQuestion>).options || [],
        correctAnswer:
          (questionContent as Partial<MultipleChoiceQuestion>).correctAnswer ||
          "",
      } as MultipleChoiceQuestion;
    case "true-false":
      const tfCorrectAnswer = (questionContent as Partial<TrueFalseQuestion>)
        .correctAnswer;
      return {
        ...baseQuestion,
        correctAnswer:
          tfCorrectAnswer === "true"
            ? "true"
            : tfCorrectAnswer === "false"
            ? "false"
            : "",
      } as TrueFalseQuestion;
    case "fill-in-the-blank":
      return {
        ...baseQuestion,
        correctAnswer:
          (questionContent as Partial<FillInTheBlankQuestion>).correctAnswer ||
          "",
      } as FillInTheBlankQuestion;
    case "theory":
      return {
        ...baseQuestion,
        correctAnswer:
          (questionContent as Partial<TheoryQuestion>).correctAnswer || "",
      } as TheoryQuestion;
    default:
      throw new Error(`Unsupported question type: ${type}`);
  }
}
