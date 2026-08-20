import { FACE_MAP } from '../constants';

const SITE_ORIGIN = 'https://faceyourself.vercel.app';

const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

type VercelRequestLike = {
  url?: string;
  headers?: { host?: string };
};

type VercelResponseLike = {
  redirect: (status: number, location: string) => void;
  setHeader: (name: string, value: string) => void;
  status: (status: number) => VercelResponseLike;
  send: (body: string) => void;
};

export default function handler(
  request: VercelRequestLike,
  response: VercelResponseLike,
): void {
  const requestUrl = new URL(request.url ?? '/', `https://${request.headers?.host ?? 'faceyourself.vercel.app'}`);
  const code = (requestUrl.searchParams.get('code') ?? '').toUpperCase();
  const profile = FACE_MAP[code];

  if (!profile) {
    response.redirect(302, `${SITE_ORIGIN}/types`);
    return;
  }

  const dnaShare = requestUrl.searchParams.get('dna_share');
  const destination = dnaShare
    ? `${SITE_ORIGIN}/?dna_share=${encodeURIComponent(dnaShare)}`
    : `${SITE_ORIGIN}/types/${profile.code}`;
  const shareUrl = `${SITE_ORIGIN}/share/${profile.code}`;
  const imageUrl = new URL(profile.landscapeImageUrl, SITE_ORIGIN).toString();
  const title = `FACE 交易人格｜${profile.name}`;
  const description = `「${profile.motto}」`;

  const html = `<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="noindex,follow,max-image-preview:large">
    <link rel="canonical" href="${escapeHtml(`${SITE_ORIGIN}/types/${profile.code}`)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${escapeHtml(shareUrl)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${escapeHtml(imageUrl)}">
    <meta property="og:image:width" content="1672">
    <meta property="og:image:height" content="941">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}">
    <script>window.location.replace(${JSON.stringify(destination)});</script>
  </head>
  <body>
    <p><a href="${escapeHtml(destination)}">查看 ${escapeHtml(profile.name)} 的 FACE 交易人格</a></p>
  </body>
</html>`;

  response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.status(200).send(html);
}
