const fs = require('fs');
const path = require('path');
const https = require('https');

const outDir = path.join(process.cwd(), 'docs', 'lib');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const candidateUrls = [
  'https://unpkg.com/docsify/lib/docsify.min.js',
  'https://cdn.jsdelivr.net/npm/docsify/lib/docsify.min.js',
  'https://cdn.jsdelivr.net/gh/docsifyjs/docsify/lib/docsify.min.js'
];

const cssUrls = [
  'https://unpkg.com/docsify/lib/themes/vue.css',
  'https://cdn.jsdelivr.net/npm/docsify/lib/themes/vue.css',
  'https://cdn.jsdelivr.net/gh/docsifyjs/docsify/lib/themes/vue.css'
];

function downloadUrl(url, destPath) {
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) return reject(new Error('Failed to fetch ' + url + ' - status ' + res.statusCode));
      const ws = fs.createWriteStream(destPath);
      res.pipe(ws);
      ws.on('finish', () => ws.close(resolve));
      ws.on('error', reject);
    }).on('error', reject);
  });
}

async function tryDownload(list, name) {
  const dest = path.join(outDir, name);
  for (const url of list) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Attempt ${attempt}: Downloading ${url}`);
        await downloadUrl(url, dest);
        console.log(`Saved ${name} from ${url}`);
        return true;
      } catch (err) {
        console.warn(`Attempt ${attempt} failed for ${url}: ${err.message}`);
        await new Promise(r => setTimeout(r, 500 * attempt));
      }
    }
  }
  console.warn(`All attempts failed for ${name}`);
  return false;
}

(async () => {
  try {
    const okJs = await tryDownload(candidateUrls, 'docsify.min.js');
    const okCss = await tryDownload(cssUrls, 'themes/vue.css');
    if (okJs || okCss) {
      console.log('Docsify assets downloaded to docs/lib (partial ok: js=' + okJs + ', css=' + okCss + ')');
    } else {
      console.warn('Could not download any docsify assets. The build will continue and index.html contains CDN fallbacks.');
    }
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error fetching docsify assets:', err);
    process.exit(0);
  }
})();
