import fs from 'fs';
import path from 'path';

const BASE = 'D:/SkyworthCopy/SkyworthCopy/skyworth-static';

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      results.push(...walkDir(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

const allFiles = walkDir(BASE);

// 按顶层文件夹分组
const groups = {};
for (const f of allFiles) {
  const rel = path.relative(BASE, f).replace(/\\/g, '/');
  const parts = rel.split('/');
  const topFolder = parts.length === 1 ? '(根目录)' : parts[0];
  if (!groups[topFolder]) groups[topFolder] = [];
  groups[topFolder].push({ rel, size: fs.statSync(f).size });
}

// 统计
let totalFiles = 0;
let totalBytes = 0;

const folderOrder = ['(根目录)', 'components', 'pages', 'assets', 'Public', 'En'];
const allFolders = [...new Set([...folderOrder, ...Object.keys(groups)])];

for (const folder of allFolders) {
  if (!groups[folder]) continue;
  const files = groups[folder];
  const folderBytes = files.reduce((s, f) => s + f.size, 0);
  totalFiles += files.length;
  totalBytes += folderBytes;

  function fmt(bytes) {
    if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return bytes + ' B';
  }

  console.log('\n📁 ' + folder + '/  (' + files.length + ' 个文件, ' + fmt(folderBytes) + ')');
  console.log('   ' + '-'.repeat(55));

  // 只列出前20个文件，超过则省略
  const show = files.slice(0, 20);
  for (const f of show) {
    const name = f.rel.length > 60 ? '...' + f.rel.slice(-57) : f.rel;
    console.log('   ' + name.padEnd(62) + fmt(f.size).padStart(8));
  }
  if (files.length > 20) {
    console.log('   ... 还有 ' + (files.length - 20) + ' 个文件（主要为 Uploads 中的图片/视频）');
  }
}

function fmtTotal(bytes) {
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}
console.log('\n' + '='.repeat(62));
console.log('  合计: ' + totalFiles + ' 个文件，约 ' + fmtTotal(totalBytes));
console.log('='.repeat(62));
