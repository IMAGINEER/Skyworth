import os
import glob
import re

IMG_DIR = "D:/SkyworthCopy/SkyworthCopy/skyworth-static/assets/images/products"
OUT_FILE = "D:/SkyworthCopy/SkyworthCopy/skyworth-static/image-preview.html"

# Collect all images, sorted by filename
files = sorted(
    glob.glob(os.path.join(IMG_DIR, "*.jpg")) +
    glob.glob(os.path.join(IMG_DIR, "*.jpeg")) +
    glob.glob(os.path.join(IMG_DIR, "*.png"))
)

def parse_info(filename):
    name = os.path.basename(filename)
    m = re.match(r"page_(\d+)_img_(\d+)\.", name)
    if m:
        page = int(m.group(1))
        idx  = int(m.group(2))
        return page, idx, name
    return 0, 0, name

cards = []
for f in files:
    page, idx, name = parse_info(f)
    rel_path = "assets/images/products/" + name
    cards.append((page, idx, name, rel_path))

cards.sort(key=lambda x: (x[0], x[1]))

# Build HTML
items_html = ""
for page, idx, name, rel in cards:
    items_html += f"""
    <div class="card">
      <div class="img-wrap">
        <img src="{rel}" alt="{name}" loading="lazy">
      </div>
      <div class="info">
        <span class="fname">{name}</span>
        <span class="page">PDF 第 {page} 页 &nbsp;·&nbsp; 图 {idx}</span>
      </div>
    </div>"""

html = f"""<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<title>图片预览 — 海外产品培训.pdf</title>
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ font-family: system-ui, sans-serif; background: #111; color: #eee; padding: 24px; }}
  h1 {{ font-size: 20px; margin-bottom: 6px; color: #fff; }}
  .meta {{ color: #888; font-size: 13px; margin-bottom: 24px; }}
  .grid {{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }}
  .card {{
    background: #1e1e1e;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #333;
    transition: border-color .2s;
  }}
  .card:hover {{ border-color: #006BC0; }}
  .img-wrap {{
    width: 100%;
    aspect-ratio: 4/3;
    background: #2a2a2a;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }}
  .img-wrap img {{
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }}
  .info {{
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }}
  .fname {{
    font-size: 11px;
    color: #aaa;
    word-break: break-all;
  }}
  .page {{
    font-size: 12px;
    color: #006BC0;
    font-weight: 600;
  }}
</style>
</head>
<body>
<h1>图片预览 — 海外产品培训.pdf</h1>
<p class="meta">共 {len(cards)} 张图片 &nbsp;|&nbsp; 保存于 assets/images/products/</p>
<div class="grid">
{items_html}
</div>
</body>
</html>"""

with open(OUT_FILE, "w", encoding="utf-8") as f:
    f.write(html)

print(f"预览页面已生成：{OUT_FILE}")
print(f"共 {len(cards)} 张图片")
