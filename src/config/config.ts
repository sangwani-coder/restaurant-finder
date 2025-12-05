interface Config {
  port: number;
  nodeEnv: string;
  GEMINI_API_KEY: string;
  FSQ_API_KEY: string;
}

export const initializeConfig = (): Config => {
  // Access process.env here when the function is called
  const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    FSQ_API_KEY: process.env.FSQ_API_KEY || '',
  };
  return config;
};