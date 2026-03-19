$ErrorActionPreference = 'Stop'
Set-Location 'D:/SkyworthCopy/SkyworthCopy/skyworth-static'
$enc = [System.Text.Encoding]::UTF8NoBOM

# 读取全部行
$lines = [System.IO.File]::ReadAllLines('index.html', [System.Text.Encoding]::UTF8)
Write-Host ("读取完成，共 " + $lines.Count + " 行")

# === 1. 提取 header-nav HTML ===
# 行88(idx=87): '</script><header ...>'  position=9 是 <header 开始
$line87 = $lines[87]
$hPos   = $line87.IndexOf('<header')
$headerFirstLine = $line87.Substring($hPos)
$beforeHeader    = $line87.Substring(0, $hPos)

$headerParts = New-Object System.Collections.Generic.List[string]
$headerParts.Add($headerFirstLine)
for ($i = 88; $i -le 1630; $i++) { $headerParts.Add($lines[$i]) }
$headerHtml = [string]::Join([System.Environment]::NewLine, $headerParts)
[System.IO.File]::WriteAllText('components/header-nav.html', $headerHtml, $enc)
Write-Host ("header-nav.html 已写入，行数: " + $headerParts.Count)

# === 2. 提取 footer HTML ===
# lines[3066..3162] = 行3067-3163
$footerParts = New-Object System.Collections.Generic.List[string]
for ($i = 3066; $i -le 3162; $i++) { $footerParts.Add($lines[$i]) }
$footerHtml = [string]::Join([System.Environment]::NewLine, $footerParts)
[System.IO.File]::WriteAllText('components/footer.html', $footerHtml, $enc)
Write-Host ("footer.html 已写入，行数: " + $footerParts.Count)

# === 3. 创建 components.js ===
# 转义 template literal 中的反引号和 ${}
function Escape-TemplateStr($str) {
    $str = $str.Replace('\', '\\')
    $str = $str.Replace('`', '\`')
    $str = $str.Replace('${', '\${')
    return $str
}

$headerEscaped = Escape-TemplateStr $headerHtml
$footerEscaped = Escape-TemplateStr $footerHtml

$jsContent = @"
// Auto-generated component loader
const headerNavHTML = ``$headerEscaped``;

const footerHTML = ``$footerEscaped``;

// 同步注入（脚本在 body 末尾运行时 DOM 已就绪）
(function () {
  var h = document.getElementById('header-nav-placeholder');
  if (h) h.innerHTML = headerNavHTML;
  var f = document.getElementById('footer-placeholder');
  if (f) f.innerHTML = footerHTML;
})();
"@

[System.IO.File]::WriteAllText('assets/js/components.js', $jsContent, $enc)
Write-Host "components.js 已写入"

# === 4. 修改 index.html ===
# 重组各段
$newLines = New-Object System.Collections.Generic.List[string]

# 段1: 行1-87，把第88行改成 </script> + 占位符
for ($i = 0; $i -le 86; $i++) { $newLines.Add($lines[$i]) }
$newLines.Add($beforeHeader)   # </script>
$newLines.Add('<div id="header-nav-placeholder"></div>')

# 段2: 行1632-3066 (idx 1631-3065) — header结束到footer之前
for ($i = 1631; $i -le 3065; $i++) { $newLines.Add($lines[$i]) }

# footer 占位符
$newLines.Add('<div id="footer-placeholder"></div>')

# 段3: 行3164+ (idx 3163+)，在最前插入 components.js 引用
$newLines.Add('<script src="assets/js/components.js"></script>')
for ($i = 3163; $i -lt $lines.Count; $i++) { $newLines.Add($lines[$i]) }

$newContent = [string]::Join([System.Environment]::NewLine, $newLines)
[System.IO.File]::WriteAllText('index.html', $newContent, $enc)
Write-Host ("index.html 已写入，新行数: " + $newLines.Count)

Write-Host "全部完成！"
