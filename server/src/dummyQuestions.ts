import { QuizQuestion } from "./models/quizType.models";

export const dummyQuestions: QuizQuestion[] = [
  {
    question: "What is one reason the author gives for using the command line?",
    type: "multiple-choice",
    options: [
      "A. It's faster than using a mouse",
      "B. It is the only way to get anything done on a computer",
      "C. It is easier to learn than a graphical user interface",
      "D. It is more secure than a graphical user interface",
    ],
    correctAnswer: "B",
    explanation:
      "The author highlights that the command line is a powerful tool essential for many tasks that might be cumbersome or impossible with a graphical interface.",
  },
  {
    question: "What is the primary focus of this book?",
    type: "multiple-choice",
    options: [
      "A. Linux system administration",
      "B. Using the Linux command line",
      "C. Programming in Linux",
      "D. Installing Linux on a computer",
    ],
    correctAnswer: "B",
    explanation:
      "The book is dedicated to teaching the usage of the Linux command line, covering various commands and techniques to efficiently navigate and utilize the system.",
  },
  {
    question: "Who is the intended audience for this book?",
    type: "multiple-choice",
    options: [
      "A. Experienced Linux administrators",
      "B. Casual computer users",
      "C. New Linux users who migrated from other platforms",
      "D. Programmers with extensive experience in Linux",
    ],
    correctAnswer: "C",
    explanation:
      "The book is tailored for new Linux users, especially those who have transitioned from other operating systems, providing them with a comprehensive guide to the command line.",
  },
  {
    question: "How is the material in this book presented?",
    type: "multiple-choice",
    options: [
      "A. In a systematic fashion, covering each topic exhaustively",
      "B. As a reference work to be used as needed",
      "C. In a sequence like a story with a beginning, middle, and end",
      "D. As a series of standalone lessons",
    ],
    correctAnswer: "C",
    explanation:
      "The book is structured in a narrative sequence, guiding the reader through the material in a coherent and progressive manner.",
  },
  {
    question: "Which part of the book introduces shell programming?",
    type: "multiple-choice",
    options: [
      "A. Part 1 - Learning The Shell",
      "B. Part 2 - Configuration And The Environment",
      "C. Part 3 - Common Tasks And Essential Tools",
      "D. Part 4 - Writing Shell Scripts",
    ],
    correctAnswer: "D",
    explanation:
      "Shell programming is introduced in Part 4, focusing on writing and understanding shell scripts to automate tasks and enhance productivity.",
  },
];
