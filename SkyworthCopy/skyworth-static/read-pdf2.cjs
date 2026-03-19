const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const buf = fs.readFileSync('D:/SkyworthCopy/SkyworthCopy/skyworth-static/docs/海外产品培训.pdf');
const parser = new PDFParse();

parser.parse(buf).then(data => {
  console.log('=== PDF 基本信息 ===');
  console.log('总页数: ' + data.numpages);
  if (data.info) {
    Object.keys(data.info).forEach(k => {
      if (data.info[k]) console.log(k + ': ' + data.info[k]);
    });
  }
  console.log('');
  const text = data.text;
  console.log('总字符数: ' + text.length);
  console.log('\n=== 全文前 8000 字符 ===');
  console.log(text.substring(0, 8000));
}).catch(err => {
  console.error('解析错误:', err.message);
  console.error(err.stack);
});
