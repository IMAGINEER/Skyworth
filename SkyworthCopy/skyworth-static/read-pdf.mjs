import { readFileSync } from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const buf = readFileSync('D:/SkyworthCopy/SkyworthCopy/skyworth-static/docs/海外产品培训.pdf');
const data = await pdfParse(buf);

console.log('=== PDF 基本信息 ===');
console.log('总页数: ' + data.numpages);
console.log('PDF 版本: ' + data.info?.PDFFormatVersion);
console.log('标题: ' + (data.info?.Title || '(无)'));
console.log('作者: ' + (data.info?.Author || '(无)'));
console.log('创建时间: ' + (data.info?.CreationDate || '(无)'));
console.log('');

// 全文文本（前 6000 字）
const text = data.text;
console.log('=== 文件全文（前 6000 字符）===');
console.log(text.substring(0, 6000));
console.log('');
console.log('=== 文件全文（6000-12000）===');
console.log(text.substring(6000, 12000));
