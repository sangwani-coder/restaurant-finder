import { GenerateImagesResponse, GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';
import { initializeConfig } from '../config/config';
import { GenerateContentResponse } from "@google/genai";
// Implement function in utils
import { toQueryString } from "./utils";

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


/**
 * Find optimal restaurants for a user
 * @param string {query} - A string that provides query parameters.
 */
export async function findOptimalRestaurants(query: any){
  // Implement function in Utils to encode query params
  const parsed_query = toQueryString(query);
    const url = `https://places-api.foursquare.com/places/search${parsed_query}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json', 'X-Places-Api-Version': '2025-06-17',
            authorization: `Bearer ${config.FSQ_API_KEY}`,
        },
    };
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        return data

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


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
    const tool_call = response.functionCalls[0]; // Assuming one function call
    let result;
    if (tool_call?.name === 'find_optimal_restaurants' && tool_call.args) {
      result = await findOptimalRestaurants(tool_call.args);
      console.log(`Function execution result: ${JSON.stringify(result)}`);
    }
  } else {
    console.log("No function call found in the response.");
    console.log(response.text);
  }
}
checkForFunctionCalls();