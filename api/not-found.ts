const SITE_ORIGIN = 'https://faceyourself.vercel.app';

type VercelResponseLike = {
  setHeader: (name: string, value: string) => void;
  status: (status: number) => VercelResponseLike;
  send: (body: string) => void;
};

const replaceFirst = (html: string, pattern: RegExp, replacement: string): string =>
  pattern.test(html) ? html.replace(pattern, replacement) : html;

export default async function handler(
  _request: unknown,
  response: VercelResponseLike,
): Promise<void> {
  try {
    const shellResponse = await fetch(`${SITE_ORIGIN}/index.html`);
    if (!shellResponse.ok) throw new Error(`APP_SHELL_FAILED_${shellResponse.status}`);
    let html = await shellResponse.text();
    html = replaceFirst(html, /<title>[^<]*<\/title>/i, '<title>找不到頁面｜FACE 交易人格測驗</title>');
    html = replaceFirst(html, /<meta name="description" content="[^"]*">/i, '<meta name="description" content="這個網址不存在，請回到 FACE 首頁、交易人格圖鑑或內容中心。">');
    html = replaceFirst(html, /<meta name="robots" content="[^"]*">/i, '<meta name="robots" content="noindex, nofollow">');
    html = replaceFirst(
      html,
      /<div id="root">\s*<\/div>/i,
      '<div id="root"><main><h1>找不到頁面</h1><p>這個網址不存在。你可以回到 FACE 首頁、交易人格圖鑑或內容中心。</p></main></div>',
    );

    response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300');
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.status(404).send(html);
  } catch (error) {
    console.error('[not-found] failed to render app shell', error);
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.status(404).send('<!doctype html><html lang="zh-TW"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>找不到頁面｜FACE Trader</title></head><body><h1>找不到頁面</h1><p><a href="/">回到首頁</a></p></body></html>');
  }
}
