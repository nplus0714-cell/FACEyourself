from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "tmp" / "imagegen" / "props-v2-raw"
OUT_ROOT = ROOT / "public" / "images" / "personality-props-v2"
DATA_FILE = Path(__file__).with_name("personality_props_v2.json")
FONT_PATH = Path(r"C:\Windows\Fonts\kaiu.ttf")
CAPTION_FONT_SIZE = 78
SIZE = 1254


def add_caption(source: Path, label: str, target: Path) -> None:
    image = Image.open(source).convert("RGBA")
    if image.size != (SIZE, SIZE):
        image = image.resize((SIZE, SIZE), Image.Resampling.LANCZOS)

    mask = Image.new("L", (SIZE, SIZE), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.rectangle((0, 1050, SIZE, SIZE), fill=235)
    mask = mask.filter(ImageFilter.GaussianBlur(34))
    wash = Image.new("RGBA", (SIZE, SIZE), (247, 240, 224, 0))
    wash.putalpha(mask)
    image.alpha_composite(wash)

    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype(str(FONT_PATH), CAPTION_FONT_SIZE)
    center = (SIZE / 2, 1164)
    draw.text((center[0] + 1, center[1] + 1), label, font=font, anchor="mm", fill=(255, 252, 244, 210))
    draw.text(center, label, font=font, anchor="mm", fill=(49, 47, 43, 255))
    target.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(target, quality=95)


def main() -> None:
    data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    for animal in data:
        folder = OUT_ROOT / f"{animal['number']:02d}-{animal['slug']}"
        folder.mkdir(parents=True, exist_ok=True)
        for item in animal["items"]:
            source = RAW_DIR / item["raw"]
            if not source.exists():
                print(f"MISSING {source.name}")
                continue
            target = folder / f"{item['seq']:02d}_{item['type']}_{item['name']}.png"
            add_caption(source, item["name"], target)
            print(target.relative_to(ROOT))


if __name__ == "__main__":
    main()
