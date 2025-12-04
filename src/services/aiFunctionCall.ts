import { GenerateImagesResponse, GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';
import { initializeConfig } from '../config/config';
import { GenerateContentResponse } from "@google/genai";
dotenv.config();

// Configure the client
const config = initializeConfig()
const ai = new GoogleGenAI({ apiKey: config.LLM_API_KEY });

// Function calling reference: https://ai.google.dev/gemini-api/docs/function-calling?example=weather#javascript
// Define the function declaration for the model
const restaurantFunctionDeclaration = {
  name: 'find_optimal_restaurants',
  description: 'Finds restaurants that suits the user requirements.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: {
        type: Type.STRING,
        description: 'The city name, e.g. Kitwe',
      },
      name: {
        type: Type.STRING,
        description: 'The name of the restaurant, e.g Elephant cafe',
      },
      rating: {
        type: Type.STRING,
        description: 'The restaurants rating, e.g. 4',
      },
    },
    // required: ['location'],
  },
};

async function queryFSQ(userPrompt:string): Promise<GenerateContentResponse> {
  const contents = [
    {
      role: 'user',
      parts: [{ text: userPrompt }]
    }
  ];
  // Send request with function declrations
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
    config: {
      tools: [{
        functionDeclarations: [restaurantFunctionDeclaration]
      }],
    },
  });
  return response;
}

async function checkForFunctionCalls() {
  const prompt = "Find a restaurant in Lusaka";
  const response: GenerateContentResponse = await queryFSQ(prompt);

  // Check for function calls in the response
  if (response.functionCalls && response.functionCalls.length > 0) {
    const functionCall = response.functionCalls[0]; // Assuming one function call

    console.log(`Function to call: ${functionCall?.name}`);
    console.log(`Arguments: ${JSON.stringify(functionCall?.args)}`);
    // In a real app, you would call your actual function here:
    // const result = await getCurrentTemperature(functionCall.args);
  } else {
    console.log("No function call found in the response.");
    console.log(response.text);
  }
}
checkForFunctionCalls();