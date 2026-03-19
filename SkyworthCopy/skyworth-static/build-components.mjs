import fs from 'fs';
import path from 'path';

const BASE = 'D:/SkyworthCopy/SkyworthCopy/skyworth-static';
const srcFile = path.join(BASE, 'index.html');

// Read all lines
const raw = fs.readFileSync(srcFile, 'utf8');
const lines = raw.split('\n');
console.log(`Total lines: ${lines.length}`);

// Line 88 (idx=87): '</script><header class="ys-header">'
const line87 = lines[87];
const hPos = line87.indexOf('<header');
console.log(`Line 88: ${line87.substring(0, 60)}`);
console.log(`<header starts at position: ${hPos}`);

const headerFirstLine = line87.substring(hPos);
const beforeHeader    = line87.substring(0, hPos); // '</script>'

// === Extract header-nav HTML (line 88 partial + lines 89-1631) ===
// idx: first part of 87, then 88..1630
const headerParts = [headerFirstLine, ...lines.slice(88, 1631)];
const headerHtml  = headerParts.join('\n');
fs.writeFileSync(path.join(BASE, 'components/header-nav.html'), headerHtml, 'utf8');
console.log(`header-nav.html written (${headerParts.length} lines)`);

// === Extract footer HTML (lines 3067-3163, idx 3066-3162) ===
const footerParts = lines.slice(3066, 3163);
const footerHtml  = footerParts.join('\n');
fs.writeFileSync(path.join(BASE, 'components/footer.html'), footerHtml, 'utf8');
console.log(`footer.html written (${footerParts.length} lines)`);

// === Create components.js ===
// Escape backticks and ${} for JS template literals
function escapeTemplate(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

const headerEscaped = escapeTemplate(headerHtml);
const footerEscaped = escapeTemplate(footerHtml);

const jsContent = `// Auto-generated component loader - do not edit manually
const headerNavHTML = \`${headerEscaped}\`;

const footerHTML = \`${footerEscaped}\`;

// Inject immediately (script runs at end of body, DOM is ready)
(function () {
  var h = document.getElementById('header-nav-placeholder');
  if (h) h.innerHTML = headerNavHTML;
  var f = document.getElementById('footer-placeholder');
  if (f) f.innerHTML = footerHTML;
})();
`;

fs.writeFileSync(path.join(BASE, 'assets/js/components.js'), jsContent, 'utf8');
console.log(`components.js written (${jsContent.length} bytes)`);

// === Modify index.html ===
const newLines = [];

// Part 1: lines 1-87 (idx 0-86), but replace idx 87 with split version
for (let i = 0; i <= 86; i++) newLines.push(lines[i]);
newLines.push(beforeHeader);                                   // '</script>'
newLines.push('<div id="header-nav-placeholder"></div>');      // placeholder

// Part 2: lines 1632-3066 (idx 1631-3065) — main content
for (let i = 1631; i <= 3065; i++) newLines.push(lines[i]);

// Footer placeholder
newLines.push('<div id="footer-placeholder"></div>');

// Part 3: components.js FIRST, then existing scripts (lines 3164+, idx 3163+)
newLines.push('<script src="assets/js/components.js"></script>');
for (let i = 3163; i < lines.length; i++) newLines.push(lines[i]);

const newContent = newLines.join('\n');
fs.writeFileSync(srcFile, newContent, 'utf8');
console.log(`index.html rewritten (${newLines.length} lines)`);

// Verify
const verify = fs.readFileSync(srcFile, 'utf8');
const verLines = verify.split('\n');
console.log('\n--- Verification ---');
for (let i = 85; i <= 92; i++) {
  console.log(`Line ${i+1}: ${verLines[i].substring(0, 80)}`);
}
console.log('...');
// Find footer placeholder
for (let i = 0; i < verLines.length; i++) {
  if (verLines[i].includes('footer-placeholder')) {
    console.log(`Line ${i+1}: ${verLines[i]}`);
    console.log(`Line ${i+2}: ${verLines[i+1].substring(0, 60)}`);
    break;
  }
}
console.log('\nDone!');
