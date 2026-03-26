// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
// dotenv.config();

// export const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export const ai = new OpenAI({
  apiKey: "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",
  baseURL: "https://api.groq.com/openai/v1", // IMPORTANT
});
