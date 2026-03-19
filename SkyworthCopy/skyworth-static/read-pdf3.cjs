const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const buf = fs.readFileSync('D:/SkyworthCopy/SkyworthCopy/skyworth-static/docs/海外产品培训.pdf');
const parser = new PDFParse();

parser.parse(buf).then(data => {
  const out = [];
  out.push('=== PDF 基本信息 ===');
  out.push('总页数: ' + data.numpages);
  if (data.info) {
    for (const k of Object.keys(data.info)) {
      if (data.info[k]) out.push(k + ': ' + data.info[k]);
    }
  }
  out.push('总字符数: ' + data.text.length);
  out.push('');
  out.push('=== 全文内容 ===');
  out.push(data.text);

  const result = out.join('\n');
  fs.writeFileSync('D:/SkyworthCopy/SkyworthCopy/skyworth-static/pdf-output.txt', result, 'utf8');
  process.stdout.write('Done! Written ' + result.length + ' chars\n');
  process.stdout.write('Pages: ' + data.numpages + '\n');
  // Print first 3000 chars of text
  process.stdout.write('\n--- TEXT PREVIEW ---\n');
  process.stdout.write(data.text.substring(0, 3000));
}).catch(err => {
  process.stderr.write('Error: ' + err.message + '\n');
});
