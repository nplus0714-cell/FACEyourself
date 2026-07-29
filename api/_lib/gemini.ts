import { GoogleGenAI } from '@google/genai';

let client: GoogleGenAI | null = null;

export const getGeminiClient = (): GoogleGenAI => {
  if (client) return client;

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  client = new GoogleGenAI({ apiKey });
  return client;
};

export const GEMINI_HTTP_OPTIONS = {
  timeout: 15_000,
} as const;

export const GEMINI_TEXT_MODEL =
  process.env.GEMINI_TEXT_MODEL?.trim() || 'gemini-3.6-flash';

export const GEMINI_SEARCH_MODEL =
  process.env.GEMINI_SEARCH_MODEL?.trim() || 'gemini-3.6-flash';
