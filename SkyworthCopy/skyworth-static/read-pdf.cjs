const fs = require('fs');
const pdfParse = require('pdf-parse');

const buf = fs.readFileSync('D:/SkyworthCopy/SkyworthCopy/skyworth-static/docs/海外产品培训.pdf');

pdfParse(buf).then(data => {
  console.log('=== PDF 基本信息 ===');
  console.log('总页数: ' + data.numpages);
  console.log('标题: ' + (data.info && data.info.Title ? data.info.Title : '(无)'));
  console.log('作者: ' + (data.info && data.info.Author ? data.info.Author : '(无)'));
  console.log('');

  const text = data.text;
  console.log('=== 全文前 8000 字符 ===');
  console.log(text.substring(0, 8000));
  console.log('\n... [以上为前8000字符] ...\n');
  console.log('=== 8000-16000 ===');
  console.log(text.substring(8000, 16000));
}).catch(err => {
  console.error('解析错误:', err.message);
});
