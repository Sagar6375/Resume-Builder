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
