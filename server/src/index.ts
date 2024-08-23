import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import quizRoutes from "./routes/quiz.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectToDatabase from "./db/connectTodb.js";

dotenv.config(); // Load environment variables from.env file

const app = express();

const allowedOrigins = [
  "https://quizme-sooty.vercel.app",
  "https://quizme-sooty.vercel.app/",
  "http://localhost:5173/",
  "http://localhost:5173",
];

// Define middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Define routes

app.use("/api/auth/", authRoutes);
app.use("/api/quiz/", quizRoutes);
app.use("/api/user/", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the QuizMe API!");
});

// Server listening for requests

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
  connectToDatabase();
});
