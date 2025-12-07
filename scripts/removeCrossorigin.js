const fs = require('fs');
const path = require('path');

const distIndex = path.resolve(__dirname, '..', 'dist', 'index.html');

if (!fs.existsSync(distIndex)) {
  console.error('dist/index.html not found. Run `npm run build` first.');
  process.exit(1);
}

let content = fs.readFileSync(distIndex, 'utf8');
const newContent = content.replace(/\s+crossorigin(=("|')?\s*\2)?/g, '');

if (newContent === content) {
  console.log('No crossorigin attribute found.');
  process.exit(0);
}

fs.writeFileSync(distIndex, newContent, 'utf8');
console.log('Removed crossorigin attributes from dist/index.html');
