import esbuild from 'esbuild';
import { writeFileSync } from 'fs';

const res = await esbuild.build({ entryPoints: ['constants.tsx'], bundle: true, format: 'esm', write: false, platform: 'node', logLevel: 'silent' });
const mod = await import('data:text/javascript;base64,' + Buffer.from(res.outputFiles[0].text).toString('base64'));
const M = mod.FACE_MAP;
const profiles = {};
for (const k of Object.keys(M)) {
  const p = M[k];
  profiles[k] = { code: p.code, name: p.name, motto: p.motto, attributes: p.attributes, portrait: p.portrait, mechanism: p.psychology.mechanism, scene: p.psychology.scene, landscapeImageUrl: p.landscapeImageUrl };
}
const DATA = JSON.stringify(profiles, null, 2);

const file = `const SITE_ORIGIN = 'https://faceyourself.vercel.app';

// 人格分享資料自帶於此檔（不 import 專案其他模組），確保 Vercel serverless 穩定執行。
// 資料來源為 constants.tsx 的 FACE_MAP；若人格資料更新，重跑 tmp/gen-share.mjs 同步。
type ShareProfile = {
  code: string;
  name: string;
  motto: string;
  attributes: string;
  portrait: string;
  mechanism: string;
  scene: string;
  landscapeImageUrl: string;
};

const SHARE_PROFILES: Record<string, ShareProfile> = ${DATA};

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

const replaceFirst = (html: string, pattern: RegExp, replacement: string): string =>
  pattern.test(html) ? html.replace(pattern, replacement) : html;

// 把含換行的長文轉成多個 <p>，供爬蟲讀取的真實內文。
const toParagraphs = (text: string): string => text
  .split(/\\n{1,}/)
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => \`<p>\${escapeHtml(line)}</p>\`)
  .join('');

// 給不執行 JavaScript 的爬蟲（含 AI 引擎）閱讀的內文。React 掛載時 createRoot
// 會清空 #root 並以互動版取代，一般使用者不會看到這段，但爬蟲讀得到真實文字。
const buildSeoBody = (profile: ShareProfile): string =>
  \`<article>\`
  + \`<h1>\${escapeHtml(profile.name)}（\${escapeHtml(profile.code)}）</h1>\`
  + \`<p>\${escapeHtml(profile.attributes)}</p>\`
  + \`<blockquote>\${escapeHtml(profile.motto)}</blockquote>\`
  + \`<section><h2>人格描述</h2>\${toParagraphs(profile.portrait)}</section>\`
  + \`<section><h2>核心心理機制</h2><p>\${escapeHtml(profile.mechanism)}</p><p>\${escapeHtml(profile.scene)}</p></section>\`
  + \`</article>\`;

const buildProfileJsonLd = (profile: ShareProfile, pageUrl: string, imageUrl: string, title: string, description: string): string => {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: title,
        description,
        image: imageUrl,
        inLanguage: 'zh-TW',
        about: \`FACE 交易人格 \${profile.code}\`,
        mainEntityOfPage: pageUrl,
        isPartOf: { '@id': \`\${SITE_ORIGIN}/#website\` },
        publisher: { '@id': \`\${SITE_ORIGIN}/#organization\` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '首頁', item: \`\${SITE_ORIGIN}/\` },
          { '@type': 'ListItem', position: 2, name: '交易人格圖鑑', item: \`\${SITE_ORIGIN}/types\` },
          { '@type': 'ListItem', position: 3, name: profile.name, item: pageUrl },
        ],
      },
    ],
  };
  return \`<script type="application/ld+json">\${JSON.stringify(graph)}</script>\`;
};

const renderAppShell = async (profile: ShareProfile): Promise<string> => {
  const pageUrl = \`\${SITE_ORIGIN}/types/\${profile.code}\`;
  const imageUrl = new URL(profile.landscapeImageUrl, SITE_ORIGIN).toString();
  // 與前端 lib/pageMetadata.ts 的 getPageCopy 對齊，避免 Google 在 JS 執行後看到不同標題。
  const title = \`\${profile.name} \${profile.code}｜\${profile.attributes.replaceAll(' / ', '・')}的交易人格\`;
  const description = \`\${profile.name}（\${profile.code}）的 FACE 交易人格圖鑑：看懂決策偏好、交易天賦、壓力盲點與可執行的調整方式。\`;
  const shellResponse = await fetch(\`\${SITE_ORIGIN}/index.html\`);
  let html = await shellResponse.text();

  html = replaceFirst(html, /<title>[^<]*<\\/title>/i, \`<title>\${escapeHtml(title)}</title>\`);
  html = replaceFirst(html, /<meta name="description" content="[^"]*">/i, \`<meta name="description" content="\${escapeHtml(description)}">\`);
  html = replaceFirst(html, /<link rel="canonical" href="[^"]*">/i, \`<link rel="canonical" href="\${escapeHtml(pageUrl)}">\`);
  html = replaceFirst(html, /<meta property="og:url" content="[^"]*">/i, \`<meta property="og:url" content="\${escapeHtml(pageUrl)}">\`);
  html = replaceFirst(html, /<meta property="og:title" content="[^"]*">/i, \`<meta property="og:title" content="\${escapeHtml(title)}">\`);
  html = replaceFirst(html, /<meta property="og:description" content="[^"]*">/i, \`<meta property="og:description" content="\${escapeHtml(description)}">\`);
  html = replaceFirst(html, /<meta property="og:image" content="[^"]*">/i, \`<meta property="og:image" content="\${escapeHtml(imageUrl)}">\`);
  html = replaceFirst(html, /<meta property="og:image:type" content="[^"]*">/i, '<meta property="og:image:type" content="image/png">');
  html = replaceFirst(html, /<meta property="og:image:width" content="[^"]*">/i, '<meta property="og:image:width" content="1672">');
  html = replaceFirst(html, /<meta property="og:image:height" content="[^"]*">/i, '<meta property="og:image:height" content="941">');
  html = replaceFirst(html, /<meta name="twitter:url" content="[^"]*">/i, \`<meta name="twitter:url" content="\${escapeHtml(pageUrl)}">\`);
  html = replaceFirst(html, /<meta name="twitter:title" content="[^"]*">/i, \`<meta name="twitter:title" content="\${escapeHtml(title)}">\`);
  html = replaceFirst(html, /<meta name="twitter:description" content="[^"]*">/i, \`<meta name="twitter:description" content="\${escapeHtml(description)}">\`);
  html = replaceFirst(html, /<meta name="twitter:image" content="[^"]*">/i, \`<meta name="twitter:image" content="\${escapeHtml(imageUrl)}">\`);
  html = replaceFirst(html, /<meta name="robots" content="[^"]*">/i, '<meta name="robots" content="index, follow, max-image-preview:large">');
  html = replaceFirst(html, /<\\/head>/i, \`\${buildProfileJsonLd(profile, pageUrl, imageUrl, title, description)}</head>\`);
  html = replaceFirst(html, /<div id="root">\\s*<\\/div>/i, \`<div id="root">\${buildSeoBody(profile)}</div>\`);

  return html;
};

export default async function handler(
  request: VercelRequestLike,
  response: VercelResponseLike,
): Promise<void> {
  const requestUrl = new URL(request.url ?? '/', \`https://\${request.headers?.host ?? 'faceyourself.vercel.app'}\`);
  const code = (requestUrl.searchParams.get('code') ?? '').toUpperCase();
  const profile = SHARE_PROFILES[code];

  if (!profile) {
    response.redirect(302, \`\${SITE_ORIGIN}/types\`);
    return;
  }

  if (requestUrl.searchParams.get('render') === 'app') {
    const appHtml = await renderAppShell(profile);
    response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.status(200).send(appHtml);
    return;
  }

  const dnaShare = requestUrl.searchParams.get('dna_share');
  const destination = dnaShare
    ? \`\${SITE_ORIGIN}/?dna_share=\${encodeURIComponent(dnaShare)}\`
    : \`\${SITE_ORIGIN}/types/\${profile.code}\`;
  const shareUrl = \`\${SITE_ORIGIN}/share/\${profile.code}\`;
  const imageUrl = new URL(profile.landscapeImageUrl, SITE_ORIGIN).toString();
  const title = \`FACE 交易人格｜\${profile.name}\`;
  const description = \`「\${profile.motto}」\`;

  const html = \`<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>\${escapeHtml(title)}</title>
    <meta name="description" content="\${escapeHtml(description)}">
    <meta name="robots" content="noindex,follow,max-image-preview:large">
    <link rel="canonical" href="\${escapeHtml(\`\${SITE_ORIGIN}/types/\${profile.code}\`)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="\${escapeHtml(shareUrl)}">
    <meta property="og:title" content="\${escapeHtml(title)}">
    <meta property="og:description" content="\${escapeHtml(description)}">
    <meta property="og:image" content="\${escapeHtml(imageUrl)}">
    <meta property="og:image:width" content="1672">
    <meta property="og:image:height" content="941">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="\${escapeHtml(title)}">
    <meta name="twitter:description" content="\${escapeHtml(description)}">
    <meta name="twitter:image" content="\${escapeHtml(imageUrl)}">
    <script>window.location.replace(\${JSON.stringify(destination)});</script>
  </head>
  <body>
    <p><a href="\${escapeHtml(destination)}">查看 \${escapeHtml(profile.name)} 的 FACE 交易人格</a></p>
  </body>
</html>\`;

  response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.status(200).send(html);
}
`;

writeFileSync('api/share.ts', file);
console.log('WROTE api/share.ts bytes=' + file.length);
