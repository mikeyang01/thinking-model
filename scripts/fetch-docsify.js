const fs = require('fs');
const path = require('path');
const https = require('https');

const outDir = path.join(process.cwd(), 'docs', 'lib');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = [
  { url: 'https://unpkg.com/docsify/lib/docsify.min.js', name: 'docsify.min.js' },
  { url: 'https://unpkg.com/docsify/lib/themes/vue.css', name: 'themes/vue.css' }
];

function download(file) {
  const dest = path.join(outDir, file.name);
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  return new Promise((resolve, reject) => {
    https.get(file.url, res => {
      if (res.statusCode !== 200) return reject(new Error('Failed to fetch ' + file.url));
      const ws = fs.createWriteStream(dest);
      res.pipe(ws);
      ws.on('finish', () => ws.close(resolve));
      ws.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  try {
    for (const f of files) {
      console.log('Downloading', f.url);
      await download(f);
    }
    console.log('Docsify assets downloaded to docs/lib');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
