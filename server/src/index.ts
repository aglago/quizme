import express from "express";
import dotenv from "dotenv";

dotenv.config();  // Load environment variables from.env file

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => { 
    res.send("Welcome to the QuizMe API!");
})

app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
})