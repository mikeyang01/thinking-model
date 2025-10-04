const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const items = fs.readdirSync(src);
    items.forEach(item => copyRecursive(path.join(src, item), path.join(dest, item)));
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy all markdown files and assets into docs/
const root = process.cwd();
const out = path.join(root, 'docs');

const entries = fs.readdirSync(root);
entries.forEach(e => {
  if (e === 'docs' || e === 'node_modules' || e === '.git') return;
  const src = path.join(root, e);
  const dest = path.join(out, e);
  copyRecursive(src, dest);
});

console.log('Copied project files into docs/');
