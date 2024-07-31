import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import quizRoutes from "./routes/quizRoute.routes.js";
import authRoutes from  "./routes/authRoute.routes.js";
import connectToDatabase from "./db/connectTodb.js";

dotenv.config(); // Load environment variables from.env file

const app = express();

// Define middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    exposedHeaders: ["X-Total-Count"],
  })
);

// Define routes

app.use("/api/auth/", authRoutes);
app.use("/api/quiz/", quizRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the QuizMe API!");
});

// Server listening for requests

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
  connectToDatabase();
});
