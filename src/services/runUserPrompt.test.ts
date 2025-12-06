import { jest, describe, test, beforeEach, expect } from "@jest/globals";
import { runUserPrompt, findOptimalRestaurants } from './runUserPrompt';
import { GenerateContentResponse, GoogleGenAI } from '@google/genai';

// runUserPrompt Test go here