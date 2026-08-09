from __future__ import annotations

import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public" / "images" / "personalities-v2-square-color"
BASE_DIR = ROOT / "tmp" / "imagegen" / "v2-integrated-bases"
OUTPUT_DIR = ROOT / "public" / "images" / "personalities-v2-text"
FONT_SERIF = Path(r"C:\Windows\Fonts\NotoSerifTC-VF.ttf")
FONT_KAI = Path(r"C:\Windows\Fonts\kaiu.ttf")

W, H = 1672, 941
INK = (48, 48, 45, 255)
BRASS = (144, 105, 54, 255)

PERSONALITIES = [
    (1, "golden-eagle-commander", "金雕大統帥", "ARLC", "積極／理性／長期／集中", "最好的操作就是什麼都不做；我看準了，我重壓，然後我去睡覺。"),
    (2, "polar-bear-strategist", "北極熊謀士", "ARLD", "積極／理性／長期／分散", "我不需要預測哪一匹馬會贏，我直接買下整個賽馬場；只要時代在前進，我的資產就會起飛。"),
    (3, "cheetah-sniper", "獵豹狙擊手", "ARTC", "積極／理性／短期／集中", "市場沒有感情，只有機率；我不在乎漲跌，我只在乎我的準星有沒有對準。"),
    (4, "hound-astrologer", "獵犬占星師", "ARTD", "積極／理性／短期／分散", "我不是在賭博，我是在經營賭場；我不依賴單一運氣，我依靠系統性的機率優勢。"),
    (5, "black-panther-evangelist", "黑豹傳教士", "AILC", "積極／感性／長期／集中", "別人笑我太瘋癲，我笑他人看不穿；我買的不是代碼，而是人類的下一個紀元。"),
    (6, "squirrel-collector", "松鼠收藏家", "AILD", "積極／感性／長期／分散", "這個看起來會漲，那個故事也很棒！小朋友才做選擇，我全都要！"),
    (7, "sabertooth-gambler", "劍齒虎賭徒", "AITC", "積極／感性／短期／集中", "聽見市場的脈搏，在那一秒全倉出擊；要嘛贏得世界，要嘛回家吃土。"),
    (8, "macaque-host", "獼猴派對主", "AITD", "積極／感性／短期／分散", "天下武功，唯快不破，我玩的不是股票，是心跳！"),
    (9, "white-deer-appraiser", "白鹿鑑古師", "PRLC", "保守／理性／長期／集中", "眾人皆醉我獨醒；我不看價格，我只看價值。只要公司沒壞，股價腰斬正如我意。"),
    (10, "mole-guide", "鼴鼠導引者", "PRLD", "保守／理性／長期／分散", "挖得快不一定挖得穩；我不求暴利，只求步步踏實。活著，就是最大的勝利。"),
    (11, "crocodile-actuary", "鱷魚精算師", "PRTC", "保守／理性／短期／集中", "我從不賭博，我只在獵物進入射程時才咬下；與其在大浪裡追逐，我寧願潛伏在岸邊，等最確定的那一擊。"),
    (12, "elephant-warden", "大象典獄長", "PRTD", "保守／理性／短期／分散", "我每天檢查一百道鎖，調度一千次衛兵；雖然很累且沒賺多少，但至少今晚我很安全。"),
    (13, "rhinoceros-guard", "犀牛親衛隊", "PILC", "保守／感性／長期／集中", "我不懂財報，但我相信這家公司；只要它還在，我就不會離開。"),
    (14, "sloth-thinker", "樹懶思想家", "PILD", "保守／感性／長期／分散", "不看就不會虧，只要我心如止水，股市波動就與我無關。"),
    (15, "night-owl-sentinel", "夜梟前哨兵", "PITC", "保守／感性／短期／集中", "看見的不只是獲利，而是獲利背後那 100 種可能讓我受傷的方式。"),
    (16, "koala-companion", "考拉隨行者", "PITD", "保守／感性／短期／分散", "大家都去的地方，一定比較安全吧？"),
]


def font(size: int, kai: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_KAI if kai else FONT_SERIF), size=size)


def centered_text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, fnt, fill, width: int) -> None:
    box = draw.textbbox((0, 0), text, font=fnt)
    draw.text((xy[0] + (width - (box[2] - box[0])) / 2, xy[1]), text, font=fnt, fill=fill)


def wrap_cjk(draw: ImageDraw.ImageDraw, text: str, fnt, max_width: int) -> list[str]:
    lines: list[str] = []
    current = ""
    for ch in text:
        trial = current + ch
        if current and draw.textlength(trial, font=fnt) > max_width:
            lines.append(current)
            current = ch
        else:
            current = trial
    if current:
        lines.append(current)
    return lines


def parchment(seed: int) -> Image.Image:
    rng = random.Random(seed)
    img = Image.new("RGBA", (W, H), (247, 241, 227, 255))
    px = img.load()
    for y in range(H):
        edge = int(5 * abs(y - H / 2) / (H / 2))
        for x in range(W):
            grain = rng.randint(-3, 3) - edge // 3
            px[x, y] = (max(0, 247 + grain), max(0, 241 + grain), max(0, 227 + grain), 255)
    return img


def add_art(canvas: Image.Image, source: Path) -> None:
    art = Image.open(source).convert("RGBA")
    art.thumbnail((900, 900), Image.Resampling.LANCZOS)
    art = ImageEnhance.Contrast(art).enhance(0.96)
    x, y = 6, (H - art.height) // 2
    canvas.alpha_composite(art, (x, y))

    veil = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    vp = veil.load()
    for xx in range(720, 1010):
        alpha = int(235 * (xx - 720) / 290)
        for yy in range(H):
            vp[xx, yy] = (247, 241, 227, alpha)
    ImageDraw.Draw(veil).rectangle((1010, 0, W, H), fill=(247, 241, 227, 235))
    canvas.alpha_composite(veil)


def add_faint_chart(canvas: Image.Image, seed: int) -> None:
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x0, y0, x1, y1 = 1040, 90, 1560, 310
    for x in range(x0, x1 + 1, 52):
        d.line((x, y0, x, y1), fill=(120, 130, 125, 16), width=1)
    for y in range(y0, y1 + 1, 44):
        d.line((x0, y, x1, y), fill=(120, 130, 125, 16), width=1)
    rng = random.Random(seed * 19)
    pts = []
    value = 215
    for x in range(x0, x1 + 1, 52):
        value = min(260, max(115, value + rng.randint(-38, 34)))
        pts.append((x, value))
    d.line(pts, fill=(138, 105, 58, 28), width=3, joint="curve")
    canvas.alpha_composite(layer)


def draw_card(index: int, slug: str, title: str, code: str, attrs: str, motto: str) -> Path:
    out = OUTPUT_DIR / f"v2-{index:02d}-{slug}-text.png"
    source = BASE_DIR / f"v2-{index:02d}-{slug}-base.png"
    if not source.exists():
        raise FileNotFoundError(source)
    canvas = Image.open(source).convert("RGBA")
    if canvas.size != (W, H):
        canvas = canvas.resize((W, H), Image.Resampling.LANCZOS)

    # A feathered watercolor wash lowers contrast behind typography without
    # creating a rectangular panel or interrupting the continuous scene.
    wash_mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(wash_mask).ellipse((900, -120, 1760, 720), fill=165)
    wash_mask = wash_mask.filter(ImageFilter.GaussianBlur(75))
    wash = Image.new("RGBA", (W, H), (248, 242, 228, 0))
    wash.putalpha(wash_mask)
    canvas.alpha_composite(wash)
    d = ImageDraw.Draw(canvas)

    tx, tw = 1010, 610
    centered_text(d, (tx, 72), title, font(68, kai=True), INK, tw)

    code_colors = {
        "A": (105, 117, 93, 255), "P": (105, 117, 93, 255),
        "R": (164, 119, 59, 255), "I": (164, 119, 59, 255),
        "L": (119, 83, 62, 255), "T": (119, 83, 62, 255),
        "C": (84, 105, 122, 255), "D": (84, 105, 122, 255),
    }
    code_font = font(98)
    col_w = tw / 4
    for n, ch in enumerate(code):
        bbox = d.textbbox((0, 0), ch, font=code_font)
        cw = bbox[2] - bbox[0]
        d.text((tx + n * col_w + (col_w - cw) / 2, 170), ch, font=code_font, fill=code_colors[ch])

    attr_text = attrs.replace("／", "  ／  ")
    centered_text(d, (tx, 310), attr_text, font(32, kai=True), INK, tw)

    line_y = 380
    d.line((tx + 18, line_y, tx + tw - 18, line_y), fill=(166, 128, 76, 180), width=2)
    cx = tx + tw / 2
    d.polygon([(cx, line_y - 6), (cx + 6, line_y), (cx, line_y + 6), (cx - 6, line_y)], outline=BRASS)

    centered_text(d, (tx, 420), "座 右 銘", font(38, kai=True), BRASS, tw)

    motto_font = font(29, kai=True)
    lines = wrap_cjk(d, motto, motto_font, tw - 36)
    if len(lines) > 4:
        motto_font = font(27, kai=True)
        lines = wrap_cjk(d, motto, motto_font, tw - 36)
    line_h = 50 if len(lines) <= 3 else 44
    start_y = 490
    for n, line in enumerate(lines):
        centered_text(d, (tx, start_y + n * line_h), line, motto_font, INK, tw)

    canvas.convert("RGB").save(out, quality=95)
    return out


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for row in PERSONALITIES:
        out = draw_card(*row)
        print(out.name)


if __name__ == "__main__":
    main()
