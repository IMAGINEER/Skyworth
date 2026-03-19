import fs from 'fs';

const filePath = 'D:/SkyworthCopy/SkyworthCopy/skyworth-static/docs/海外产品培训.pdf';
const stat = fs.statSync(filePath);
console.log('File size: ' + (stat.size / 1024 / 1024).toFixed(1) + ' MB');

// Read first 2KB to check PDF header and basic structure
const buf = Buffer.alloc(2048);
const fd = fs.openSync(filePath, 'r');
fs.readSync(fd, buf, 0, 2048, 0);
fs.closeSync(fd);

const header = buf.toString('latin1', 0, 20);
console.log('PDF Header: ' + header.substring(0, 10));

// Find page count via /Count in PDF
const fullBuf = fs.readFileSync(filePath);
const content = fullBuf.toString('latin1');

// Look for /Count value (number of pages)
const countMatches = content.match(/\/Count\s+(\d+)/g);
if (countMatches) {
  console.log('Page count candidates: ' + countMatches.join(', '));
  // Usually the highest /Count is the total pages
  const counts = countMatches.map(m => parseInt(m.match(/\d+/)[0]));
  console.log('Max page count: ' + Math.max(...counts));
}

// Extract text from PDF (basic approach - find BT...ET blocks)
const textBlocks = [];
let pos = 0;
let found = 0;
while (found < 200) {
  const bt = content.indexOf('BT', pos);
  if (bt === -1) break;
  const et = content.indexOf('ET', bt);
  if (et === -1) break;
  const block = content.substring(bt, et + 2);
  // Extract strings in parentheses
  const strings = block.match(/\(([^)]{2,80})\)/g);
  if (strings && strings.length > 0) {
    const text = strings.map(s => s.slice(1, -1)).join(' ').replace(/\\n/g, '\n');
    if (text.trim().length > 3) {
      textBlocks.push(text.trim());
    }
  }
  pos = et + 2;
  found++;
}

console.log('\n=== First text blocks (raw) ===');
textBlocks.slice(0, 30).forEach((b, i) => {
  if (b.length > 5) console.log('[' + i + '] ' + b.substring(0, 120));
});
