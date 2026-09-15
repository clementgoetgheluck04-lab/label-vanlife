from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
IMAGES = (
    ("public/images/hero-label-vanlife.png", "public/images/hero-label-vanlife.webp", 1920),
    ("public/images/home/camping-vanlife.png", "public/images/home/camping-vanlife.webp", 1920),
    ("public/images/people/helene-family-vanlifers.png", "public/images/people/helene-family-vanlifers.webp", 1600),
)


for source_name, output_name, max_width in IMAGES:
    source = ROOT / source_name
    output = ROOT / output_name
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened)
        if image.width > max_width:
            height = round(image.height * max_width / image.width)
            image = image.resize((max_width, height), Image.Resampling.LANCZOS)
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGB")
        image.save(output, "WEBP", quality=82, method=6)
    before = source.stat().st_size
    after = output.stat().st_size
    print(f"{output.relative_to(ROOT)}: {before // 1024} KB -> {after // 1024} KB")
