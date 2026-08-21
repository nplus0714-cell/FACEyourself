type VercelRequestLike = {
  method?: string;
  url?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type VercelResponseLike = {
  setHeader: (name: string, value: string | string[]) => void;
  status: (statusCode: number) => VercelResponseLike;
  send: (body: unknown) => void;
};

type WebHandler = (request: Request) => Promise<Response>;

const firstHeaderValue = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const buildHeaders = (input: VercelRequestLike['headers']): Headers => {
  const headers = new Headers();
  Object.entries(input ?? {}).forEach(([name, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => headers.append(name, item));
    } else if (value !== undefined) {
      headers.set(name, value);
    }
  });
  return headers;
};

const serializeBody = (body: unknown, contentType: string): BodyInit | undefined => {
  if (body === undefined || body === null) return undefined;
  if (typeof body === 'string' || body instanceof Uint8Array) return body;

  if (contentType.includes('application/x-www-form-urlencoded') && typeof body === 'object') {
    const parameters = new URLSearchParams();
    Object.entries(body as Record<string, unknown>).forEach(([key, value]) => {
      if (value !== undefined && value !== null) parameters.append(key, String(value));
    });
    return parameters.toString();
  }

  return JSON.stringify(body);
};

export const createLegacyPostHandler = (webHandler: WebHandler) => async (
  request: VercelRequestLike,
  response: VercelResponseLike,
): Promise<void> => {
  if ((request.method ?? 'GET').toUpperCase() !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).send('Method Not Allowed');
    return;
  }

  const headers = buildHeaders(request.headers);
  const protocol = firstHeaderValue(request.headers?.['x-forwarded-proto']) ?? 'https';
  const host = firstHeaderValue(request.headers?.host) ?? 'faceyourself.vercel.app';
  const url = new URL(request.url ?? '/', `${protocol}://${host}`).toString();
  const body = serializeBody(request.body, headers.get('content-type') ?? '');
  const webResponse = await webHandler(new Request(url, { method: 'POST', headers, body }));

  webResponse.headers.forEach((value, name) => response.setHeader(name, value));
  const responseBody = Buffer.from(await webResponse.arrayBuffer());
  response.status(webResponse.status).send(responseBody);
};
