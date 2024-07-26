import { Response, Request } from "express";
import { extractTextFromFile } from "../quizGenerator";

const handleFileUpload = async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Extract text from the uploaded file
    const extractedText = await extractTextFromFile(req.file.path);
    res.send(extractedText);
}

export default handleFileUpload;