import { createGoogleGenerativeAI } from '@ai-sdk/google';

const googleApiKey =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

export const hasGoogleApiKey = Boolean(googleApiKey);

export const googleAI = createGoogleGenerativeAI(
  googleApiKey ? { apiKey: googleApiKey } : {}
);
