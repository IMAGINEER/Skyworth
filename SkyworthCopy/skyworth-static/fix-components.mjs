import fs from 'fs';

const ORIG = 'D:/SkyworthCopy/SkyworthCopy/www.skyworth-pv.com/index.html';
const BASE = 'D:/SkyworthCopy/SkyworthCopy/skyworth-static';

const raw = fs.readFileSync(ORIG, 'utf8');
const lines = raw.split('\n');
console.log(`Original index.html: ${lines.length} lines`);

// Extract header: line 88 (idx 87) partial through line 1631 (idx 1630)
const line87 = lines[87];
const hPos = line87.indexOf('<header');
const headerFirstLine = line87.substring(hPos);
const headerParts = [headerFirstLine, ...lines.slice(88, 1631)];
const headerHtml = headerParts.join('\n');
fs.writeFileSync(`${BASE}/components/header-nav.html`, headerHtml, 'utf8');
console.log(`header-nav.html written (${headerParts.length} lines)`);

// Extract footer: lines 3067-3163 (idx 3066-3162)
const footerParts = lines.slice(3066, 3163);
const footerHtml = footerParts.join('\n');
fs.writeFileSync(`${BASE}/components/footer.html`, footerHtml, 'utf8');
console.log(`footer.html written (${footerParts.length} lines)`);

// Build components.js
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

fs.writeFileSync(`${BASE}/assets/js/components.js`, jsContent, 'utf8');
console.log(`components.js written (${jsContent.length} bytes)`);

// Verify header-nav.html starts with <header
const verify = fs.readFileSync(`${BASE}/components/header-nav.html`, 'utf8');
const firstTag = verify.substring(0, 30);
console.log(`\nVerification: header-nav.html starts with: ${firstTag}`);
console.log(`Contains <header: ${verify.includes('<header')}`);
console.log(`Contains </header>: ${verify.includes('</header>')}`);
console.log(`Contains <main: ${verify.includes('<main')}`);
console.log(`Contains ys-banner: ${verify.includes('ys-banner')}`);
console.log('\nDone!');
