import type {
  FaceScores,
  PersonalityProfile,
  Question,
  ReportContent,
} from '../types';
import type { DailyAwarenessAnswers } from '../data/dailyAwarenessQuestions';

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
  };
}

class GeminiApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'GeminiApiError';
  }
}

const postJson = async <T>(
  path: string,
  body: unknown,
  timeoutMs = 20_000,
): Promise<T> => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'same-origin',
      signal: controller.signal,
    });

    const payload = await response.json() as T & ApiErrorBody;
    if (!response.ok) {
      throw new GeminiApiError(
        payload.error?.message || 'AI 服務暫時無法使用。',
        response.status,
        payload.error?.code,
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof GeminiApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new GeminiApiError('AI 回應逾時，請稍後再試。', 408, 'CLIENT_TIMEOUT');
    }
    throw new GeminiApiError('目前無法連線至 AI 服務。', 503, 'NETWORK_ERROR');
  } finally {
    window.clearTimeout(timeout);
  }
};

export async function generateDynamicReport(
  dna: FaceScores,
  daily: FaceScores,
  profile: PersonalityProfile,
): Promise<ReportContent | null> {
  try {
    const result = await postJson<{ report: ReportContent }>('/api/gemini/report', {
      dna,
      daily,
      profile: {
        code: profile.code,
        name: profile.name,
      },
    });
    return result.report;
  } catch (error) {
    console.error('Dynamic report unavailable', error);
    return null;
  }
}

export async function generateMarketAwareQuestions(): Promise<Question[] | null> {
  try {
    const result = await postJson<{ questions: Question[] }>(
      '/api/gemini/market-questions',
      {},
    );
    return result.questions;
  } catch (error) {
    console.error('Market questions unavailable', error);
    return null;
  }
}

export async function generateBarResponse(drinkId: string): Promise<string> {
  const result = await postJson<{ text: string }>(
    '/api/gemini/bar',
    { drinkId },
  );
  return result.text;
}

export async function generateDailyAwarenessReflection(
  answers: DailyAwarenessAnswers,
): Promise<string | null> {
  try {
    const result = await postJson<{ reflectionText: string }>(
      '/api/gemini/daily-awareness',
      { answers },
      30_000,
    );
    return result.reflectionText?.trim() || null;
  } catch (error) {
    console.error('Daily awareness reflection unavailable', error);
    return null;
  }
}
