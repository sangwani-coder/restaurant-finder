import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import { initializeConfig } from './config/config'; 
dotenv.config();


const config = initializeConfig()
const ai = new GoogleGenAI({apiKey: config.LLM_API_KEY});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: "Write a short 3 line joke about cars",
  });
  console.log(response.text);
}

main();