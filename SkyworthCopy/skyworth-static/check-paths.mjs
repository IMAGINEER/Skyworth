import fs from 'fs';
import path from 'path';

const BASE = 'D:/SkyworthCopy/SkyworthCopy/skyworth-static';

const mainFiles = [
  'index.html',
  'components/header-nav.html',
  'components/footer.html',
  'pages/product-template.html',
  'pages/solution-template.html',
  'pages/case-template.html',
].map(f => path.join(BASE, f));

// 允许保留的合法外部域名
const allowedDomains = [
  'googletagmanager.com', 'google-analytics.com',
  'linkedin.com', 'youtube.com', 'facebook.com', 'instagram.com',
  'my.skyworth-pv.com', 'th.skyworth-pv.com', 'br.skyworth-pv.com',
  'solavita.com', 'global.skyworth.com', 'skyworthpv.com',
  'skyworthdigital.com', 'yongsy.com',
];

function isAllowedExternal(url) {
  return allowedDomains.some(d => url.includes(d));
}

console.log('='.repeat(62));
console.log('  路径合法性检查报告');
console.log('='.repeat(62));

let totalProblems = 0;
let totalAllowed = 0;

for (const filePath of mainFiles) {
  const name = path.relative(BASE, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const problems = [];
  const allowed  = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const re = /(?:src|href|action)="([^"]*)"/g;
    let m;
    while ((m = re.exec(line)) !== null) {
      const url = m[1];
      if (!url || url.startsWith('#') || url.startsWith('javascript:') || url.startsWith('mailto:')) continue;

      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
        if (isAllowedExternal(url)) {
          allowed.push({ line: i + 1, url: url.substring(0, 90) });
        } else {
          problems.push({ line: i + 1, url: url.substring(0, 90) });
        }
      }
    }
  }

  totalProblems += problems.length;
  totalAllowed  += allowed.length;

  console.log('\n📄 ' + name);
  if (problems.length === 0) {
    console.log('   ✅ 无可疑路径');
  } else {
    for (const p of problems) {
      console.log('   ⚠️  行' + p.line + ': ' + p.url);
    }
  }
  console.log('   ℹ️  合法外链 ' + allowed.length + ' 处（社媒/多语言子域名/CDN等，可保留）');
}

console.log('\n' + '='.repeat(62));
console.log('  检查完毕 — 问题路径: ' + totalProblems + ' 处  |  合法外链: ' + totalAllowed + ' 处');
console.log('='.repeat(62));
