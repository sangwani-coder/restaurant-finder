import { jest} from "@jest/globals";

interface Config {
  port: number;
  nodeEnv: string;
  GEMINI_API_KEY: string;
  FSQ_API_KEY: string;
}


export const mockConfigValue: Config = {
  port: 8080,
  nodeEnv: 'test',
  GEMINI_API_KEY: 'MOCKED_GEMINI_KEY',
  FSQ_API_KEY: 'MOCKED_FSQ_KEY',
};

// The mocked function implementation
export const initializeConfig = jest.fn(() => mockConfigValue);