import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const filePath = 'D:/SkyworthCopy/SkyworthCopy/skyworth-static/docs/海外产品培训.pdf';
const data = new Uint8Array(fs.readFileSync(filePath));

const loadingTask = pdfjsLib.getDocument({ data });
const pdf = await loadingTask.promise;

const numPages = pdf.numPages;
console.log('总页数: ' + numPages);

const meta = await pdf.getMetadata();
if (meta.info) {
  console.log('标题: ' + (meta.info.Title || '(无)'));
  console.log('作者: ' + (meta.info.Author || '(无)'));
  console.log('创建时间: ' + (meta.info.CreationDate || '(无)'));
}
console.log('');

// 提取所有页面文本，写入文件
const allLines = [];
allLines.push('=== PDF: 海外产品培训.pdf ===');
allLines.push('总页数: ' + numPages);
allLines.push('');

for (let pageNum = 1; pageNum <= numPages; pageNum++) {
  const page = await pdf.getPage(pageNum);
  const content = await page.getTextContent();
  const pageText = content.items.map(item => item.str).join(' ');
  allLines.push(`--- 第 ${pageNum} 页 ---`);
  allLines.push(pageText.trim());
  allLines.push('');

  // Print first 10 pages to stdout
  if (pageNum <= 10) {
    process.stdout.write('--- 第 ' + pageNum + ' 页 ---\n');
    process.stdout.write(pageText.trim().substring(0, 400) + '\n\n');
  }
}

fs.writeFileSync(
  'D:/SkyworthCopy/SkyworthCopy/skyworth-static/pdf-output.txt',
  allLines.join('\n'),
  'utf8'
);
console.log('\n全文已写入 pdf-output.txt');
