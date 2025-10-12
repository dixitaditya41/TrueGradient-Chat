import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_KEY);

export const gptApiResults = async (prompt) => {
  if (!prompt || (typeof prompt === "string" && prompt.trim() === "")) {
    throw new Error("Prompt is required");
  }
  
  try {
    const textModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Generate content
    const result = await textModel.generateContent(prompt);
    
    // Get the response
    const response = result.response;
    const text = await response.text();
    
    return {
      response: text,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(`Gemini API failed: ${error.message}`);
  }
};