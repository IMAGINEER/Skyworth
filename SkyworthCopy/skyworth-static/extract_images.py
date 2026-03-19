import fitz  # pymupdf
import os

PDF_PATH = "D:/SkyworthCopy/SkyworthCopy/skyworth-static/docs/海外产品培训.pdf"
OUT_DIR  = "D:/SkyworthCopy/SkyworthCopy/skyworth-static/assets/images/products"

os.makedirs(OUT_DIR, exist_ok=True)

doc = fitz.open(PDF_PATH)
total = 0
log = []

for page_num in range(len(doc)):
    page = doc[page_num]
    img_list = page.get_images(full=True)
    img_count = 0
    for img_index, img in enumerate(img_list):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        ext = base_image["ext"]   # jpeg / png / etc.
        filename = f"page_{page_num+1:02d}_img_{img_index+1:02d}.{ext}"
        filepath = os.path.join(OUT_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(image_bytes)
        log.append((page_num + 1, filename))
        img_count += 1
        total += 1

doc.close()

print(f"\n提取完成！共提取 {total} 张图片\n")
print(f"保存目录：{OUT_DIR}\n")
print("前20张图片：")
print(f"{'序号':<6} {'页码':<8} {'文件名'}")
print("-" * 50)
for i, (page, name) in enumerate(log[:20], 1):
    print(f"{i:<6} 第{page}页{'':<4} {name}")

if total > 20:
    print(f"\n... 还有 {total - 20} 张，全部已保存到 assets/images/products/")
