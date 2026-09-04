from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Realms Character Sheet.pdf"

PAGE_W, PAGE_H = A4
MARGIN = 22

FIELD = white
INK = HexColor("#24231F")
INK_SOFT = HexColor("#625D52")
ACCENT = HexColor("#8A4F2A")
ACCENT_DARK = HexColor("#5E3520")
RULE = HexColor("#A59A83")
PALE = HexColor("#E9DFCC")


def register_fonts() -> None:
    font_file = Path("/System/Library/Fonts/Palatino.ttc")
    pdfmetrics.registerFont(TTFont("Realms-Serif", str(font_file), subfontIndex=0))
    pdfmetrics.registerFont(TTFont("Realms-Serif-Italic", str(font_file), subfontIndex=1))
    pdfmetrics.registerFont(TTFont("Realms-Serif-Bold", str(font_file), subfontIndex=2))


def fit_text(c: canvas.Canvas, text: str, font: str, size: float, max_width: float) -> float:
    while size > 5 and c.stringWidth(text, font, size) > max_width:
        size -= 0.25
    return size


def draw_label(c: canvas.Canvas, text: str, x: float, y: float, width: float | None = None) -> None:
    size = 6.5
    if width is not None:
        size = fit_text(c, text, "Helvetica-Bold", size, width)
    c.setFont("Helvetica-Bold", size)
    c.setFillColor(INK_SOFT)
    c.drawString(x, y, text.upper())


def draw_section(c: canvas.Canvas, x: float, y: float, w: float, h: float, title: str, note: str = "") -> None:
    c.setFillColor(FIELD)
    c.setStrokeColor(RULE)
    c.setLineWidth(0.7)
    c.roundRect(x, y, w, h, 4, fill=1, stroke=1)

    c.setFillColor(PALE)
    c.roundRect(x, y + h - 22, w, 22, 4, fill=1, stroke=0)
    c.rect(x, y + h - 22, w, 8, fill=1, stroke=0)

    c.setFillColor(ACCENT_DARK)
    c.setFont("Realms-Serif-Bold", 9.5)
    c.drawString(x + 8, y + h - 15, title.upper())

    if note:
        size = fit_text(c, note, "Helvetica", 6.2, w - 16)
        c.setFillColor(INK_SOFT)
        c.setFont("Helvetica", size)
        c.drawRightString(x + w - 8, y + h - 14.5, note)


def text_field(
    c: canvas.Canvas,
    name: str,
    x: float,
    y: float,
    w: float,
    h: float,
    *,
    size: float = 8,
    multiline: bool = False,
    value: str = "",
) -> None:
    flags = 4096 if multiline else 0
    c.acroForm.textfield(
        name=name,
        value=value,
        x=x,
        y=y,
        width=w,
        height=h,
        borderStyle="solid",
        borderWidth=0.45,
        borderColor=RULE,
        fillColor=FIELD,
        textColor=INK,
        fontName="Helvetica",
        fontSize=size,
        fieldFlags=flags,
        forceBorder=True,
    )


def labeled_field(
    c: canvas.Canvas,
    label: str,
    name: str,
    x: float,
    y: float,
    w: float,
    h: float = 21,
    *,
    value: str = "",
) -> None:
    draw_label(c, label, x, y + h + 3, w)
    text_field(c, name, x, y, w, h, value=value)


def checkbox(c: canvas.Canvas, name: str, x: float, y: float, size: float = 10) -> None:
    c.acroForm.checkbox(
        name=name,
        x=x,
        y=y,
        size=size,
        checked=False,
        buttonStyle="check",
        borderWidth=0.5,
        borderColor=RULE,
        fillColor=FIELD,
        textColor=ACCENT_DARK,
        forceBorder=True,
    )


def draw_header(c: canvas.Canvas) -> None:
    c.setFillColor(INK)
    c.setFont("Realms-Serif-Bold", 30)
    c.drawString(MARGIN, PAGE_H - 47, "REALMS")

    c.setFillColor(INK_SOFT)
    c.setFont("Realms-Serif-Italic", 10)
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 39, "Character Sheet")

def draw_identity(c: canvas.Canvas) -> None:
    y_top = PAGE_H - 97
    labeled_field(c, "Name", "name", MARGIN, y_top, 275)
    labeled_field(c, "Player", "player", MARGIN + 285, y_top, PAGE_W - MARGIN - (MARGIN + 285))

    y_bottom = PAGE_H - 132
    labeled_field(c, "Concept", "concept", MARGIN, y_bottom, 245)
    labeled_field(c, "Ancestry", "ancestry", MARGIN + 255, y_bottom, 140)
    labeled_field(c, "Profession", "profession", MARGIN + 405, y_bottom, PAGE_W - MARGIN - (MARGIN + 405))


def draw_attributes(c: canvas.Canvas, x: float, y: float, w: float, h: float) -> None:
    draw_section(c, x, y, w, h, "Attributes")
    row_top = y + h - 46

    draw_label(c, "Attribute", x + 9, row_top + 8)
    draw_label(c, "Value", x + w - 64, row_top + 8)
    draw_label(c, "Cap", x + w - 30, row_top + 8)

    attributes = [
        ("Agility", "Balance, speed, riding, finesse"),
        ("Awareness", "Vigilance, tracking, aim"),
        ("Combat", "Weapons, fighting, tactics"),
        ("Cunning", "Deceit, stealth, improvisation"),
        ("Lore", "Medicine, craft, history, occult"),
        ("Might", "Strength, endurance, exertion"),
        ("Presence", "Empathy, command, persuasion"),
        ("Will", "Courage, control, resistance"),
    ]

    row_h = 27
    for index, (name, desc) in enumerate(attributes):
        row_y = row_top - 19 - index * row_h
        if index % 2 == 0:
            c.setFillColor(HexColor("#F2ECDF"))
            c.rect(x + 5, row_y - 4, w - 10, row_h, fill=1, stroke=0)

        c.setFillColor(INK)
        c.setFont("Realms-Serif-Bold", 8)
        c.drawString(x + 9, row_y + 10, name)
        c.setFillColor(INK_SOFT)
        c.setFont("Helvetica", 5.5)
        c.drawString(x + 9, row_y + 2, desc)

        text_field(c, f"attribute_{name.lower()}", x + w - 67, row_y, 25, 19, size=9)
        text_field(c, f"cap_{name.lower()}", x + w - 33, row_y, 24, 19, size=9)


def draw_vitals(c: canvas.Canvas, x: float, y: float, w: float, h: float) -> None:
    draw_section(c, x, y, w, h, "Vitals and Wounds")
    top = y + h - 46
    cell_gap = 6
    cell_w = (w - 18 - 2 * cell_gap) / 3

    labels = ["Resilience", "Stability", "Protection"]
    names = ["resilience", "stability", "protection"]
    for i, (label, name) in enumerate(zip(labels, names)):
        field_x = x + 9 + i * (cell_w + cell_gap)
        draw_label(c, label, field_x, top + 4, cell_w)
        text_field(c, name, field_x, top - 22, cell_w, 20, size=9)

    track_label_y = top - 39
    draw_label(c, "Damage Tracks", x + 9, track_label_y)
    c.setFillColor(INK_SOFT)
    c.setFont("Helvetica", 5.4)
    c.drawRightString(x + w - 9, track_label_y, "Each row = Resilience boxes")

    tracks = [
        ("Fit", "fit"),
        ("Wounded", "wounded"),
        ("Incapacitated", "incapacitated"),
        ("Dying", "dying"),
    ]
    for row, (label, key) in enumerate(tracks):
        row_y = track_label_y - 22 - row * 19
        size = fit_text(c, label.upper(), "Helvetica-Bold", 6, 48)
        c.setFillColor(ACCENT_DARK if key == "dying" else INK_SOFT)
        c.setFont("Helvetica-Bold", size)
        c.drawString(x + 9, row_y + 2, label.upper())
        for index in range(10):
            checkbox(c, f"wound_{key}_{index + 1}", x + 66 + index * 10.5, row_y - 1, 8.5)


def draw_focus_stress(c: canvas.Canvas, x: float, y: float, w: float, h: float) -> None:
    draw_section(c, x, y, w, h, "Focus and Stress")
    content_y = y + h - 43
    track_x = x + 46
    track_w = w - 55

    draw_label(c, "Focus", x + 9, content_y + 6)
    focus_size = 11
    focus_step = (track_w - focus_size) / 4
    for i in range(1, 6):
        bx = track_x + (i - 1) * focus_step
        checkbox(c, f"focus_{i}", bx, content_y, focus_size)

    draw_label(c, "Stress", x + 9, content_y - 28)
    stress_size = 9
    stress_step = (track_w - stress_size) / 8
    for i in range(1, 10):
        bx = track_x + (i - 1) * stress_step
        checkbox(c, f"stress_{i}", bx, content_y - 34, stress_size)


def draw_notes(c: canvas.Canvas, x: float, y: float, w: float, h: float) -> None:
    draw_section(c, x, y, w, h, "Critical Wounds and Marks")
    text_field(c, "bonds_debts_marks", x + 7, y + 7, w - 14, h - 35, size=7, multiline=True)


def draw_description(c: canvas.Canvas, x: float, y: float, w: float, h: float) -> None:
    draw_section(c, x, y, w, h, "Description")
    text_field(c, "description", x + 7, y + 7, w - 14, h - 35, size=7, multiline=True)


def draw_abilities(c: canvas.Canvas, x: float, y: float, w: float, h: float) -> None:
    draw_section(c, x, y, w, h, "Abilities")
    table_top = y + h - 31
    name_w = 90
    cost_w = 34
    effect_w = w - 16 - name_w - cost_w
    row_h = 34

    draw_label(c, "Name", x + 8, table_top)
    draw_label(c, "Focus", x + 8 + name_w, table_top, cost_w)
    draw_label(c, "Effect / Trigger", x + 8 + name_w + cost_w, table_top, effect_w)

    for i in range(8):
        row_y = table_top - 29 - i * row_h
        text_field(c, f"ability_name_{i + 1}", x + 8, row_y, name_w - 4, 25, size=7)
        text_field(c, f"ability_cost_{i + 1}", x + 8 + name_w, row_y, cost_w - 4, 25, size=7)
        text_field(c, f"ability_effect_{i + 1}", x + 8 + name_w + cost_w, row_y, effect_w, 25, size=6.5)


def draw_weapons(c: canvas.Canvas, x: float, y: float, w: float, h: float) -> None:
    draw_section(c, x, y, w, h, "Weapons")
    table_top = y + h - 32
    widths = [82, 70, 40, 52, w - 16 - 82 - 70 - 40 - 52]
    labels = ["Weapon", "Roll", "Damage", "Range", "Traits"]

    cursor = x + 8
    for label, width in zip(labels, widths):
        draw_label(c, label, cursor, table_top, width)
        cursor += width

    for row in range(3):
        row_y = table_top - 25 - row * 28
        cursor = x + 8
        for col, width in enumerate(widths):
            text_field(c, f"weapon_{row + 1}_{col + 1}", cursor, row_y, width - 4, 21, size=6.5)
            cursor += width


def draw_equipment(c: canvas.Canvas, x: float, y: float, w: float, h: float) -> None:
    draw_section(c, x, y, w, h, "Equipment and Coin")
    text_field(c, "equipment", x + 7, y + 7, w - 14, h - 35, size=7, multiline=True)


def draw_footer(c: canvas.Canvas) -> None:
    y = 18
    c.setStrokeColor(ACCENT)
    c.setLineWidth(0.8)
    c.line(MARGIN, y + 18, PAGE_W - MARGIN, y + 18)

    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 6.3)
    c.drawString(MARGIN, y + 7, "ROLL: ATTRIBUTE + ATTRIBUTE d12   |   10+ = SUCCESS   |   12 = +1 FOCUS")
    c.setFillColor(INK_SOFT)
    c.setFont("Helvetica", 5.8)
    c.drawRightString(
        PAGE_W - MARGIN,
        y + 7,
        "ATTRIBUTES: minimum 1   |   18 points total   |   starting maximum 4",
    )


def build() -> Path:
    register_fonts()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    c = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    c.setTitle("Realms Character Sheet")
    c.setAuthor("Realms")
    c.setSubject("Fillable A4 character sheet for the Realms tabletop roleplaying game")
    c.setCreator("Realms character sheet generator")

    draw_header(c)
    draw_identity(c)

    left_x = MARGIN
    left_w = 184
    gap = 10
    right_x = left_x + left_w + gap
    right_w = PAGE_W - MARGIN - right_x

    draw_attributes(c, left_x, 430, left_w, 264)
    draw_vitals(c, left_x, 240, left_w, 180)
    draw_focus_stress(c, left_x, 148, left_w, 82)
    draw_notes(c, left_x, 45, left_w, 93)

    draw_description(c, right_x, 594, right_w, 100)
    draw_abilities(c, right_x, 266, right_w, 318)
    draw_weapons(c, right_x, 137, right_w, 119)
    draw_equipment(c, right_x, 45, right_w, 82)

    draw_footer(c)
    c.showPage()
    c.save()
    return OUTPUT


if __name__ == "__main__":
    print(build())
