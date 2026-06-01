import fs from 'fs/promises';
import path from 'path';

interface IPageMeta {
  title: string;
  description: string;
  url: string;
  image: string;
}

const CLIENT_DIST_PATH =
  process.env.CLIENT_DIST_PATH || path.resolve(process.cwd(), '../client/dist');

const INDEX_HTML_PATH = path.join(CLIENT_DIST_PATH, 'index.html');

const escapeHtml = (value: string) => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
};

const createMetaTags = (meta: IPageMeta) => {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const url = escapeHtml(meta.url);
  const image = escapeHtml(meta.image);

  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
  `;
};

export const getClientDistPath = () => CLIENT_DIST_PATH;

export const renderHtmlWithMeta = async (meta: IPageMeta) => {
  const html = await fs.readFile(INDEX_HTML_PATH, 'utf-8');
  const metaTags = createMetaTags(meta);

  const blockRegex =
    /<!--wanderboard-meta-start-->[\s\S]*?<!--wanderboard-meta-end-->/;

  if (blockRegex.test(html)) {
    return html.replace(
      blockRegex,
      `<!--wanderboard-meta-start-->${metaTags}<!--wanderboard-meta-end-->`
    );
  }

  return html.replace('</head>', `${metaTags}</head>`);
};
