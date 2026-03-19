from PIL import Image
import os
import glob

IMG_DIR = "D:/SkyworthCopy/SkyworthCopy/skyworth-static/assets/images/products"

jpx_files = glob.glob(os.path.join(IMG_DIR, "*.jpx"))

if not jpx_files:
    print("没有找到 .jpx 文件")
else:
    converted = 0
    failed = []
    for src in sorted(jpx_files):
        dst = src.replace(".jpx", ".jpg")
        try:
            img = Image.open(src).convert("RGB")
            img.save(dst, "JPEG", quality=95)
            os.remove(src)
            converted += 1
        except Exception as e:
            failed.append((src, str(e)))

    print(f"转换完成：{converted} 个 .jpx -> .jpg")
    if failed:
        print(f"失败 {len(failed)} 个：")
        for f, err in failed:
            print(f"  {os.path.basename(f)}: {err}")
