"""
Generate placeholder images for the website.
Creates professional gradient images with text overlays for pages that need them.
"""
import os
import math
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(__file__), "images")
os.makedirs(OUT, exist_ok=True)

FONT = "C:/Windows/Fonts/msyh.ttc"
FONT_B = "C:/Windows/Fonts/msyhbd.ttc"
W, H = 1200, 600  # standard size


def gradient(w, h, colors, direction="v"):
    """Create a gradient image. colors = list of (r,g,b) stops."""
    img = Image.new("RGB", (w, h))
    draw = ImageDraw.Draw(img)
    n = len(colors) - 1
    if direction == "v":
        for y in range(h):
            t = y / max(h - 1, 1)
            seg = min(int(t * n), n - 1)
            lt = (t * n) - seg
            c1, c2 = colors[seg], colors[seg + 1]
            r = int(c1[0] + (c2[0] - c1[0]) * lt)
            g = int(c1[1] + (c2[1] - c1[1]) * lt)
            b = int(c1[2] + (c2[2] - c1[2]) * lt)
            draw.line([(0, y), (w, y)], fill=(r, g, b))
    else:
        for x in range(w):
            t = x / max(w - 1, 1)
            seg = min(int(t * n), n - 1)
            lt = (t * n) - seg
            c1, c2 = colors[seg], colors[seg + 1]
            r = int(c1[0] + (c2[0] - c1[0]) * lt)
            g = int(c1[1] + (c2[1] - c1[1]) * lt)
            b = int(c1[2] + (c2[2] - c1[2]) * lt)
            draw.line([(x, 0), (x, h)], fill=(r, g, b))
    return img


def draw_text_center(draw, text, y, w, font, fill=(255, 255, 255)):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, y), text, font=font, fill=fill)


def draw_circle(draw, cx, cy, r, fill):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill)


def draw_rounded_rect(draw, x1, y1, x2, y2, r, fill):
    draw.rounded_rectangle([x1, y1, x2, y2], radius=r, fill=fill)


def add_decorations(img, style="dots"):
    """Add subtle decorative elements."""
    draw = ImageDraw.Draw(img, "RGBA")
    w, h = img.size
    if style == "dots":
        for i in range(20):
            x = (i * 137 + 50) % w
            y = (i * 89 + 30) % h
            draw_circle(draw, x, y, 3, (255, 255, 255, 25))
    elif style == "circles":
        draw_circle(draw, w - 120, 120, 180, (255, 255, 255, 12))
        draw_circle(draw, 100, h - 80, 120, (255, 255, 255, 10))
    elif style == "waves":
        for i in range(5):
            y_base = h - 60 - i * 30
            points = [(x, y_base + int(20 * math.sin(x / 80 + i))) for x in range(0, w, 4)]
            if len(points) > 1:
                draw.line(points, fill=(255, 255, 255, 15 + i * 3), width=2)
    return img


# =============================================
# 1. About page - company overview image
# =============================================
def gen_about_hero():
    img = gradient(W, H, [(15, 42, 74), (46, 139, 87), (60, 179, 113)])
    draw = ImageDraw.Draw(img, "RGBA")
    add_decorations(img, "circles")
    # icons
    draw_rounded_rect(draw, 80, 180, 200, 300, 20, (255, 255, 255, 30))
    draw_rounded_rect(draw, 240, 150, 360, 310, 20, (255, 255, 255, 20))
    draw_rounded_rect(draw, 400, 200, 520, 290, 20, (255, 255, 255, 25))
    # text
    f1 = ImageFont.truetype(FONT_B, 48)
    f2 = ImageFont.truetype(FONT, 22)
    draw_text_center(draw, "慧耕农业科技", 200, W, f1)
    draw_text_center(draw, "智慧农业 \u00b7 节水灌溉 \u00b7 数字化管理", 270, W, f2)
    img.save(os.path.join(OUT, "about-hero.png"), quality=90)
    print("  about-hero.png")


def gen_about_company():
    img = gradient(W, 500, [(240, 248, 245), (220, 240, 230), (200, 235, 215)])
    draw = ImageDraw.Draw(img, "RGBA")
    # office-like illustration
    draw_rounded_rect(draw, 100, 60, 500, 440, 16, (255, 255, 255, 200))
    draw_rounded_rect(draw, 120, 80, 480, 300, 12, (46, 139, 87, 30))
    # grid pattern (building)
    for row in range(3):
        for col in range(4):
            x = 150 + col * 80
            y = 110 + row * 60
            draw_rounded_rect(draw, x, y, x + 60, y + 40, 6, (46, 139, 87, 40))
            draw_rounded_rect(draw, x + 5, y + 5, x + 55, y + 35, 4, (255, 255, 255, 80))
    # right side text area
    f1 = ImageFont.truetype(FONT_B, 36)
    f2 = ImageFont.truetype(FONT, 18)
    draw.text((560, 100), "企业简介", font=f1, fill=(15, 23, 42))
    draw.text((560, 160), "专注于智慧农业", font=f2, fill=(100, 116, 139))
    draw.text((560, 195), "节水灌溉", font=f2, fill=(100, 116, 139))
    draw.text((560, 230), "水肥一体化", font=f2, fill=(100, 116, 139))
    draw.text((560, 265), "农业数字化管理", font=f2, fill=(100, 116, 139))
    # stats boxes
    for i, (num, label) in enumerate([("10+", "年经验"), ("200+", "项目"), ("30+", "专利")]):
        x = 560 + i * 170
        draw_rounded_rect(draw, x, 330, x + 150, 420, 12, (46, 139, 87, 15))
        f3 = ImageFont.truetype(FONT_B, 28)
        draw.text((x + 15, 345), num, font=f3, fill=(46, 139, 87))
        draw.text((x + 15, 385), label, font=f2, fill=(100, 116, 139))
    img.save(os.path.join(OUT, "about-company.png"), quality=90)
    print("  about-company.png")


# =============================================
# 2. Solution scenario images
# =============================================
def gen_scenario(name, label, icon_text, colors):
    img = gradient(W, 400, colors)
    draw = ImageDraw.Draw(img, "RGBA")
    add_decorations(img, "waves")
    # icon circle
    draw_circle(draw, W // 2, 140, 60, (255, 255, 255, 40))
    f_icon = ImageFont.truetype(FONT_B, 36)
    bbox = draw.textbbox((0, 0), icon_text, font=f_icon)
    iw = bbox[2] - bbox[0]
    draw.text(((W - iw) // 2, 120), icon_text, font=f_icon, fill=(255, 255, 255))
    # label
    f1 = ImageFont.truetype(FONT_B, 32)
    draw_text_center(draw, label, 230, W, f1)
    # bottom line
    draw_rounded_rect(draw, W // 2 - 40, 280, W // 2 + 40, 284, 2, (255, 255, 255, 120))
    img.save(os.path.join(OUT, name), quality=90)
    print(f"  {name}")


# =============================================
# 3. Service page images
# =============================================
def gen_service_hero():
    img = gradient(W, H, [(10, 22, 40), (20, 80, 50), (46, 139, 87)])
    draw = ImageDraw.Draw(img, "RGBA")
    add_decorations(img, "dots")
    # gear icons (service metaphor)
    for cx, cy, r in [(200, 200, 50), (350, 280, 35), (180, 350, 25)]:
        draw_circle(draw, cx, cy, r, (255, 255, 255, 20))
        draw_circle(draw, cx, cy, r - 8, (255, 255, 255, 10))
    # right side
    for cx, cy, r in [(900, 180, 40), (1000, 300, 55), (950, 380, 30)]:
        draw_circle(draw, cx, cy, r, (255, 255, 255, 15))
    f1 = ImageFont.truetype(FONT_B, 48)
    f2 = ImageFont.truetype(FONT, 22)
    draw_text_center(draw, "全流程服务保障", 220, W, f1)
    draw_text_center(draw, "7\u00d724小时持续在线", 290, W, f2)
    img.save(os.path.join(OUT, "service-hero.png"), quality=90)
    print("  service-hero.png")


def gen_service_process():
    img = gradient(1200, 300, [(248, 250, 252), (240, 248, 245)])
    draw = ImageDraw.Draw(img, "RGBA")
    # 4 step circles connected by line
    step_colors = [(46, 139, 87), (60, 179, 113), (34, 139, 34), (0, 128, 0)]
    labels = ["01", "02", "03", "04"]
    names = ["需求调研", "方案设计", "施工交付", "运维保障"]
    for i in range(4):
        cx = 150 + i * 280
        # connection line
        if i < 3:
            draw.line([(cx + 35, 130), (cx + 280 - 35, 130)], fill=(200, 210, 200), width=2)
        # circle
        draw_circle(draw, cx, 130, 35, step_colors[i])
        f_num = ImageFont.truetype(FONT_B, 20)
        bbox = draw.textbbox((0, 0), labels[i], font=f_num)
        nw = bbox[2] - bbox[0]
        draw.text((cx - nw // 2, 118), labels[i], font=f_num, fill=(255, 255, 255))
        # name
        f_name = ImageFont.truetype(FONT_B, 18)
        bbox2 = draw.textbbox((0, 0), names[i], font=f_name)
        nw2 = bbox2[2] - bbox2[0]
        draw.text((cx - nw2 // 2, 180), names[i], font=f_name, fill=(15, 23, 42))
    img.save(os.path.join(OUT, "service-process.png"), quality=90)
    print("  service-process.png")


# =============================================
# 4. Product placeholder for missing product images
# =============================================
def gen_product_bg(name, label, color_top, color_bot):
    img = gradient(600, 400, [color_top, color_bot])
    draw = ImageDraw.Draw(img, "RGBA")
    add_decorations(img, "circles")
    # product silhouette (simple box shape)
    draw_rounded_rect(draw, 180, 100, 420, 320, 16, (255, 255, 255, 25))
    draw_rounded_rect(draw, 200, 120, 400, 300, 12, (255, 255, 255, 15))
    f1 = ImageFont.truetype(FONT_B, 22)
    draw_text_center(draw, label, 190, 600, f1, (255, 255, 255, 200))
    img.save(os.path.join(OUT, name), quality=85)
    print(f"  {name}")


# =============================================
# 5. News hero images (different from case images)
# =============================================
def gen_news_hero(name, title, color1, color2):
    img = gradient(W, 500, [color1, color2])
    draw = ImageDraw.Draw(img, "RGBA")
    add_decorations(img, "dots")
    # article icon
    draw_rounded_rect(draw, W // 2 - 30, 150, W // 2 + 30, 210, 8, (255, 255, 255, 30))
    draw_rounded_rect(draw, W // 2 - 20, 165, W // 2 + 20, 170, 2, (255, 255, 255, 50))
    draw_rounded_rect(draw, W // 2 - 20, 178, W // 2 + 20, 183, 2, (255, 255, 255, 50))
    draw_rounded_rect(draw, W // 2 - 20, 191, W // 2 + 10, 196, 2, (255, 255, 255, 50))
    f1 = ImageFont.truetype(FONT_B, 28)
    draw_text_center(draw, title, 250, W, f1)
    img.save(os.path.join(OUT, name), quality=90)
    print(f"  {name}")


# =============================================
# Run all generators
# =============================================
if __name__ == "__main__":
    print("Generating images...")

    # About page
    gen_about_hero()
    gen_about_company()

    # Scenarios
    gen_scenario("scenario-orchard.png", "山地果园", "\ud83c\udf4a",
                 [(34, 100, 60), (46, 139, 87), (60, 179, 113)])
    gen_scenario("scenario-greenhouse.png", "蔬菜大棚", "\ud83e\udd6c",
                 [(20, 80, 50), (46, 120, 70), (80, 180, 120)])
    gen_scenario("scenario-tea.png", "茶园管理", "\ud83c\udf75",
                 [(30, 90, 50), (50, 140, 80), (70, 160, 100)])
    gen_scenario("scenario-farmland.png", "大田种植", "\ud83c\udf3e",
                 [(40, 100, 30), (60, 145, 50), (80, 170, 70)])

    # Service
    gen_service_hero()
    gen_service_process()

    # News heroes
    gen_news_hero("news-hero-1.png", "智慧农业示范项目", (15, 42, 74), (46, 139, 87))
    gen_news_hero("news-hero-2.png", "智能滴灌系统", (20, 60, 40), (34, 139, 34))
    gen_news_hero("news-hero-3.png", "农业物联网平台", (10, 30, 60), (30, 100, 160))

    print(f"\nDone! Generated images in {OUT}")
