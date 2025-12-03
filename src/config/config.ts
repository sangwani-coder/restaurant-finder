interface Config {
  port: number;
  nodeEnv: string;
  LLM_API_KEY: string;
}

export const initializeConfig = (): Config => {
  // Access process.env here when the function is called
  const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    LLM_API_KEY: process.env.LLM_API_KEY || '',
  };
  return config;
};