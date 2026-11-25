#!/usr/bin/env python3
"""
Generates the app artwork in public/art/ as SVG.

Every screen is drawn from the real app's source: layouts, colours, labels and
navigation come from the repos (WeatherApp, instaclone, Tour-Guide) and from the
Stupro product site. Sample values inside the screens (a city, a temperature, like
counts) are illustrative only.

    python3 scripts/make-app-art.py
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "art"
W, H = 360, 780  # screen viewBox
SANS = "Roboto, 'Segoe UI', system-ui, -apple-system, sans-serif"
SERIF = "'DM Serif Text', Georgia, 'Times New Roman', serif"

# ── icons (24×24 paths) ───────────────────────────────────────────────
ICONS = {
    "home": ("fill", "M3 10.4 12 3l9 7.4V21h-6.2v-6.2H9.2V21H3z"),
    "search": ("stroke", "M10.5 3.5a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM15.8 15.8 21 21"),
    "add": ("stroke", "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM12 7.5v9M7.5 12h9"),
    "heart": ("fill", "M12 20.6S3.2 15.3 3.2 9.2A4.7 4.7 0 0 1 12 6.9a4.7 4.7 0 0 1 8.8 2.3c0 6.1-8.8 11.4-8.8 11.4z"),
    "heart_o": ("stroke", "M12 20.6S3.2 15.3 3.2 9.2A4.7 4.7 0 0 1 12 6.9a4.7 4.7 0 0 1 8.8 2.3c0 6.1-8.8 11.4-8.8 11.4z"),
    "account": ("fill", "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a3.3 3.3 0 1 1 0 6.6A3.3 3.3 0 0 1 12 6zm0 14a8 8 0 0 1-6.3-3.1c1.4-1.8 3.7-2.7 6.3-2.7s4.9.9 6.3 2.7A8 8 0 0 1 12 20z"),
    "comment": ("fill", "M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8l-4 4V5a1 1 0 0 1 0-1z"),
    "send": ("fill", "M2.5 11.2 21.5 3l-8.2 19-2.4-8.4z"),
    "bookmark": ("stroke", "M6.5 3.5h11v17l-5.5-4-5.5 4z"),
    "messenger": ("stroke", "M12 3.2c5 0 8.8 3.6 8.8 8.1S17 19.5 12 19.5c-.9 0-1.8-.1-2.6-.4L5.6 21l.6-3.5A7.8 7.8 0 0 1 3.2 11.3C3.2 6.8 7 3.2 12 3.2z"),
    "more": ("fill", "M12 5.5a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2zm0 5a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2zm0 5a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2z"),
    "map": ("fill", "M9 3.5 15 6l6-2.5v15L15 21l-6-2.5L3 21V6zm.9 2.2v11.4l4.2 1.8V7.4z"),
    "share": ("stroke", "M12 3v12M7.5 7.5 12 3l4.5 4.5M5 11v8.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V11"),
    "globe": ("stroke", "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM3 12h18M12 3c2.5 2.7 3.6 5.7 3.6 9S14.5 18.3 12 21c-2.5-2.7-3.6-5.7-3.6-9S9.5 5.7 12 3z"),
    "pin": ("fill", "M12 2.5A6.8 6.8 0 0 0 5.2 9.3c0 5 6.8 12.2 6.8 12.2s6.8-7.2 6.8-12.2A6.8 6.8 0 0 0 12 2.5zm0 9.3a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"),
    "flame": ("fill", "M12.5 2.5s1 3.4-1.6 6c-1.7 1.7-3.9 3.3-3.9 6.6A5 5 0 0 0 12 20a5 5 0 0 0 5-5c0-2.4-1-3.8-1-3.8s-.4 2-2 2.6c1-3.6-1.5-8.8-1.5-11.3z"),
    "code": ("stroke", "M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15"),
    "pen": ("stroke", "M4 20l1-4.5L16.5 4a2 2 0 0 1 2.8 0l.7.7a2 2 0 0 1 0 2.8L8.5 19zM14.5 6l3.5 3.5"),
    "trophy": ("stroke", "M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.5c0 3 1.5 4.5 3.7 4.8M16 6h3.5c0 3-1.5 4.5-3.7 4.8M12 13v4M8.5 20.5h7M10 17h4l.5 3.5h-5z"),
    "cards": ("stroke", "M7 4.5h12a1 1 0 0 1 1 1V17M4 7.5h12a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1z"),
    "check": ("stroke", "M5 12.5l4.2 4.2L19 7"),
    "book": ("stroke", "M4 5.5C6 4.5 9 4.4 12 6c3-1.6 6-1.5 8-.5V19c-2-1-5-1.1-8 .5-3-1.6-6-1.5-8-.5zM12 6v13.5"),
    "quiz": ("stroke", "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM9.6 9.3a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.6M12 16.6v.4"),
    "bulb": ("stroke", "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"),
    "chat": ("stroke", "M4 5h16v11H9l-5 4z"),
}


def icon(name, x, y, size=24, color="#fff", width=1.9):
    kind, d = ICONS[name]
    s = size / 24
    paint = f'fill="{color}"' if kind == "fill" else f'fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"'
    return f'<path transform="translate({x} {y}) scale({s})" d="{d}" {paint}/>'


def text(x, y, s, size=14, color="#fff", weight=400, anchor="start", family=SANS, extra=""):
    s = s.replace("&", "&amp;").replace("<", "&lt;")
    return f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" fill="{color}" text-anchor="{anchor}" {extra}>{s}</text>'


def status_bar(color="#fff", bg=None):
    out = f'<rect width="{W}" height="34" fill="{bg}"/>' if bg else ""
    out += text(22, 23, "9:41", 13, color, 600)
    out += f'<rect x="{W-66}" y="13" width="18" height="10" rx="2" fill="none" stroke="{color}" stroke-width="1.2"/>'
    out += f'<rect x="{W-64}" y="15" width="12" height="6" rx="1" fill="{color}"/>'
    for i, h in enumerate([4, 6, 8, 10]):
        out += f'<rect x="{W-98+i*5}" y="{23-h}" width="3" height="{h}" rx="1" fill="{color}"/>'
    return out


# ── illustrated "photos" (no stock imagery) ─────────────────────────────
PALETTES = {
    "dusk": ("#ffb27a", "#ff7a8a", "#6c4bb4", "#3a2a6e", "#ffe1a8"),
    "sea": ("#9be7ff", "#5ec2e8", "#2a7fb8", "#14507e", "#fff6c9"),
    "hills": ("#c9f2d8", "#86d6a8", "#3f9d6b", "#1f5c41", "#fff3c2"),
    "desert": ("#ffd9a0", "#f4a259", "#c8553d", "#7a2e2a", "#fff0d1"),
    "night": ("#2b3a67", "#3f4f8a", "#1b2547", "#0f1630", "#f4f1d0"),
    "snow": ("#d8ecff", "#a9c9f0", "#6f8fbf", "#3c5584", "#ffffff"),
    "rose": ("#ffd1e8", "#f79ac0", "#b85c8f", "#6e2f57", "#fff4d6"),
}


def photo(pid, x, y, w, h, pal="dusk", r=0, sun=(0.72, 0.32), city=False):
    a, b, c, d, s = PALETTES[pal]
    g = f"{pid}-g"
    out = f'<defs><linearGradient id="{g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient>'
    out += f'<clipPath id="{pid}-c"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}"/></clipPath></defs>'
    out += f'<g clip-path="url(#{pid}-c)"><rect x="{x}" y="{y}" width="{w}" height="{h}" fill="url(#{g})"/>'
    out += f'<circle cx="{x+w*sun[0]}" cy="{y+h*sun[1]}" r="{min(w,h)*0.11}" fill="{s}" opacity=".95"/>'
    if city:
        # skyline silhouette
        import random
        rnd = random.Random(pid)
        bx = x
        while bx < x + w:
            bw = rnd.uniform(w * 0.06, w * 0.14)
            bh = rnd.uniform(h * 0.22, h * 0.6)
            out += f'<rect x="{bx:.1f}" y="{y+h-bh:.1f}" width="{bw:.1f}" height="{bh:.1f}" fill="{d}"/>'
            bx += bw + w * 0.01
        out += f'<rect x="{x}" y="{y+h*0.86}" width="{w}" height="{h*0.14}" fill="{d}"/>'
    else:
        out += f'<path d="M{x} {y+h*0.72} L{x+w*0.28} {y+h*0.42} L{x+w*0.5} {y+h*0.64} L{x+w*0.7} {y+h*0.46} L{x+w} {y+h*0.7} V{y+h} H{x}z" fill="{c}"/>'
        out += f'<path d="M{x} {y+h*0.84} Q{x+w*0.3} {y+h*0.7} {x+w*0.55} {y+h*0.82} T{x+w} {y+h*0.78} V{y+h} H{x}z" fill="{d}"/>'
    return out + "</g>"


# ══ Weather App (Android · Java) ═══════════════════════════════════════
def weather(p, night=False):
    sky = ("#0d1734", "#27386a") if night else ("#3d86d6", "#a7d3f5")
    out = f'<defs><linearGradient id="{p}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{sky[0]}"/><stop offset="1" stop-color="{sky[1]}"/></linearGradient></defs>'
    out += f'<rect width="{W}" height="{H}" fill="url(#{p}-sky)"/>'
    out += f'<rect width="{W}" height="{H}" fill="#292D36" opacity="{0.25 if night else 0.18}"/>'  # app's black_shade
    if night:
        for i, (sx, sy) in enumerate([(40, 120), (300, 90), (250, 170), (70, 230), (320, 260), (150, 70), (210, 120)]):
            out += f'<circle cx="{sx}" cy="{sy}" r="{1.4 if i % 2 else 1}" fill="#fff" opacity=".8"/>'
    else:
        for cx, cy, sc in [(76, 440, 1), (282, 500, 0.8)]:
            out += f'<g opacity=".55" fill="#fff"><ellipse cx="{cx}" cy="{cy}" rx="{46*sc}" ry="{16*sc}"/><ellipse cx="{cx+18*sc}" cy="{cy-12*sc}" rx="{26*sc}" ry="{18*sc}"/></g>'
    out += status_bar()
    city = "Chennai"
    out += text(W / 2, 84, city, 18, "#fff", 500, "middle")
    # outlined search field + search icon (activity_main.xml)
    out += f'<rect x="16" y="104" width="282" height="48" rx="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.55)"/>'
    out += text(32, 133, "Enter Your City", 14, "rgba(255,255,255,0.85)")
    out += icon("search", 310, 116, 26, "#fff")
    temp = "26°C" if night else "31°C"
    out += text(W / 2, 262, temp, 76, "#fff", 300, "middle")
    # condition icon
    cy = 318
    if night:
        out += f'<circle cx="{W/2}" cy="{cy}" r="22" fill="#f4f1d0"/><circle cx="{W/2+10}" cy="{cy-8}" r="20" fill="{sky[0]}" opacity=".95"/>'
    else:
        out += f'<circle cx="{W/2-8}" cy="{cy-6}" r="20" fill="#ffd54a"/>'
        out += f'<g fill="#fff"><ellipse cx="{W/2+6}" cy="{cy+10}" rx="30" ry="13"/><ellipse cx="{W/2+16}" cy="{cy}" rx="16" ry="13"/></g>'
    out += text(W / 2, 376, "Clear" if night else "Partly cloudy", 15, "#fff", 400, "middle")
    out += text(14, 596, "Today's Weather foreCast", 15, "#fff", 700)
    hours = [("20:00", "27°C", "11"), ("21:00", "26°C", "10"), ("22:00", "26°C", "9"), ("23:00", "25°C", "8")] if night else \
            [("10:00", "29°C", "12"), ("11:00", "30°C", "14"), ("12:00", "31°C", "15"), ("13:00", "32°C", "16")]
    for i, (t, tc, wind) in enumerate(hours):
        x = 10 + i * 86
        out += f'<rect x="{x}" y="612" width="80" height="138" rx="10" fill="rgba(41,45,54,0.55)" stroke="rgba(255,255,255,0.12)"/>'
        out += text(x + 40, 636, t, 12, "#fff", 400, "middle")
        out += text(x + 40, 664, tc, 18, "#fff", 400, "middle")
        if night:
            out += f'<circle cx="{x+40}" cy="{690}" r="9" fill="#f4f1d0"/>'
        else:
            out += f'<circle cx="{x+36}" cy="{686}" r="9" fill="#ffd54a"/><ellipse cx="{x+44}" cy="{694}" rx="13" ry="6" fill="#fff"/>'
        out += text(x + 40, 732, f"{wind} km/h", 12, "#fff", 400, "middle")
    return out


# ══ Instagram clone (Flutter · Firebase) ═══════════════════════════════
IG_BLUE = "#0095F6"
GREY = "#8e8e8e"


def ig_nav(active):
    out = f'<rect y="{H-58}" width="{W}" height="58" fill="#000"/><rect y="{H-58}" width="{W}" height="1" fill="#262626"/>'
    for i, name in enumerate(["home", "search", "add", "heart", "account"]):
        out += icon(name, 24 + i * 72, H - 42, 26, "#fff" if i == active else GREY)
    return out


def instaclone_feed(p):
    out = f'<rect width="{W}" height="{H}" fill="#000"/>' + status_bar()
    out += text(16, 74, "Instaclone", 27, "#fff", 400, family="'Snell Roundhand', 'Brush Script MT', 'Segoe Script', cursive")
    out += icon("messenger", W - 44, 52, 26, "#fff")
    y = 98
    out += f'<defs><linearGradient id="{p}-av" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f9a825"/><stop offset="1" stop-color="#d81b60"/></linearGradient></defs>'
    out += f'<circle cx="32" cy="{y+20}" r="17" fill="url(#{p}-av)"/><circle cx="32" cy="{y+20}" r="14.5" fill="#333"/>'
    out += text(58, y + 25, "travel.diaries", 14, "#fff", 700)
    out += icon("more", W - 36, y + 8, 24, "#fff")
    out += photo(f"{p}-ph", 0, y + 46, W, 360, "dusk")
    ay = y + 418
    out += icon("heart", 12, ay, 28, "#f44336") + icon("comment", 54, ay + 2, 25, "#fff") + icon("send", 94, ay + 2, 25, "#fff")
    out += icon("bookmark", W - 42, ay + 2, 26, "#fff")
    out += text(16, ay + 54, "1,284 likes", 14, "#fff", 700)
    out += f'<text x="16" y="{ay+78}" font-family="{SANS}" font-size="14" fill="#fff"><tspan font-weight="700">travel.diaries</tspan><tspan>  golden hour over the hills</tspan></text>'
    out += text(16, ay + 102, "view all  comments", 14, GREY)
    out += text(16, ay + 124, "12/03/2024", 12, GREY)
    out += f'<circle cx="32" cy="{ay+160}" r="17" fill="#333"/>' + text(58, ay + 165, "city.lights", 14, "#fff", 700)
    return out + ig_nav(0)


def instaclone_profile(p):
    out = f'<rect width="{W}" height="{H}" fill="#000"/>' + status_bar()
    out += text(16, 76, "travel.diaries", 20, "#fff", 700)
    out += f'<defs><linearGradient id="{p}-av" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f9a825"/><stop offset="1" stop-color="#d81b60"/></linearGradient></defs>'
    out += f'<circle cx="58" cy="146" r="42" fill="url(#{p}-av)"/><circle cx="58" cy="146" r="38" fill="#2a2a2a"/>'
    out += icon("account", 34, 122, 48, "#555")
    for i, (n, l) in enumerate([("24", "posts"), ("1,248", "followers"), ("312", "following")]):
        cx = 168 + i * 70
        out += text(cx, 140, n, 18, "#fff", 700, "middle") + text(cx, 160, l, 12, GREY, 400, "middle")
    out += f'<rect x="124" y="178" width="220" height="30" rx="6" fill="#000" stroke="#5a5a5a"/>' + text(234, 198, "Sign Out", 13, "#fff", 600, "middle")
    out += text(16, 226, "travel.diaries", 14, "#fff", 700)
    out += text(16, 246, "chasing light, one city at a time", 13, "#d8d8d8")
    out += f'<rect y="268" width="{W}" height="1" fill="#262626"/>'
    pals = ["dusk", "sea", "hills", "desert", "night", "snow", "rose", "sea", "dusk"]
    s = (W - 4) / 3
    for i, pal in enumerate(pals):
        out += photo(f"{p}-g{i}", (i % 3) * (s + 2), 274 + (i // 3) * (s + 2), s, s, pal, city=(i % 2 == 1))
    return out + ig_nav(4)


# ══ Journey Jot — Tour Guide (Flutter · Sqflite) ═══════════════════════
JJ = "#D521BA"  # fDBlue in lib/constants/theme.dart


def jj_nav(active):
    out = f'<rect y="{H-64}" width="{W}" height="64" fill="#fff"/><rect y="{H-64}" width="{W}" height="1" fill="#eee"/>'
    for i, (ic, lab) in enumerate([("home", "Home"), ("map", "Map"), ("heart_o", "WishList"), ("share", "Share")]):
        cx = 45 + i * 90
        col = JJ if i == active else "#000"
        out += icon(ic, cx - 12, H - 54, 24, col) + text(cx, H - 18, lab, 10, col, 400, "middle")
    return out


def jj_appbar():
    out = f'<rect width="{W}" height="96" fill="{JJ}"/>' + status_bar("#000")
    out += icon("account", 14, 50, 30, "#000")
    out += text(56, 74, "Journey Jot", 22, "#000", 400, family=SERIF)
    out += icon("globe", W - 44, 52, 26, "#000")
    return out


def journeyjot_home(p):
    out = f'<rect width="{W}" height="{H}" fill="#fff"/>' + jj_appbar()
    out += f'<rect x="14" y="110" width="{W-28}" height="44" rx="22" fill="#f3f3f3"/>'
    out += icon("search", 28, 120, 22, "#555") + text(58, 137, "search Place", 14, "#888")
    out += text(16, 190, "Top Picks", 20, "#000", 700)
    for i, (city, pal) in enumerate([("Paris", "dusk"), ("Dubai", "desert"), ("Maldives", "sea")]):
        x = 16 + i * 128
        out += photo(f"{p}-t{i}", x, 204, 118, 150, pal, r=14, city=(city != "Maldives"))
        out += f'<circle cx="{x+100}" cy="222" r="13" fill="rgba(255,255,255,0.9)"/>' + icon("heart_o", x + 91, 213, 18, "#000", 2)
        out += text(x + 59, 374, city, 14, "#000", 500, "middle")
    out += text(16, 420, "Categories", 20, "#000", 700)
    for i, (cat, pal) in enumerate([("Adventure", "hills"), ("Hill Stations", "snow"), ("Beach", "sea")]):
        x = 16 + i * 128
        out += photo(f"{p}-c{i}", x, 434, 118, 150, pal, r=14)
        out += f'<circle cx="{x+100}" cy="452" r="13" fill="rgba(255,255,255,0.9)"/>' + icon("heart_o", x + 91, 443, 18, "#000", 2)
        out += text(x + 59, 604, cat, 14, "#000", 500, "middle")
    out += f'<rect x="16" y="626" width="{W-32}" height="70" rx="14" fill="#fdeefb"/>'
    out += icon("pin", 30, 648, 26, "#e53935") + text(66, 657, "Saved offline with Sqflite", 13, "#6e2f57", 600)
    out += text(66, 677, "Your visited places, on device", 12, "#9b5a86")
    return out + jj_nav(0)


def journeyjot_map(p):
    out = f'<rect width="{W}" height="{H}" fill="#f2efe9"/>'
    # OpenStreetMap-style base (flutter_map)
    out += f'<path d="M0 470 C80 440 120 520 210 500 S330 430 360 450 V780 H0z" fill="#aad3df"/>'
    out += f'<path d="M20 120 h120 v90 h-120z M230 250 h100 v70 h-100z" fill="#c8e6b6"/>'
    for d in ["M0 260 L360 210", "M120 96 L170 470", "M0 380 L360 360", "M260 96 L300 470", "M40 96 L90 300"]:
        out += f'<path d="{d}" stroke="#fff" stroke-width="9" fill="none"/>'
        out += f'<path d="{d}" stroke="#e3dccf" stroke-width="1" fill="none"/>'
    for d in ["M0 160 L360 140", "M200 96 L220 470"]:
        out += f'<path d="{d}" stroke="#f9d27a" stroke-width="6" fill="none"/>'
    for (x, y) in [(150, 230), (250, 330), (90, 360), (280, 180)]:
        out += icon("pin", x - 18, y - 36, 36, "#e53935")
    out += jj_appbar()
    out += f'<rect x="{W-62}" y="{H-150}" width="44" height="84" rx="10" fill="#fff" stroke="#ddd"/>'
    out += text(W - 40, H - 116, "+", 22, "#333", 500, "middle") + text(W - 40, H - 80, "−", 22, "#333", 500, "middle")
    out += text(10, H - 72, "© OpenStreetMap contributors", 9, "#666")
    return out + jj_nav(1)


# ══ Stupro (React Native · Spring Boot · MongoDB) ══════════════════════
SP_BG1, SP_BG2 = "#110A2B", "#191934"
GOLD, CYAN, PURPLE, PINK, BLUE = "#DCAA14", "#42D7F5", "#B37CFF", "#EF497A", "#596AC5"


def sp_base(p):
    out = f'<defs><linearGradient id="{p}-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{SP_BG1}"/><stop offset="1" stop-color="{SP_BG2}"/></linearGradient>'
    out += f'<radialGradient id="{p}-glow" cx=".85" cy=".05" r=".7"><stop offset="0" stop-color="{GOLD}" stop-opacity=".22"/><stop offset="1" stop-color="{GOLD}" stop-opacity="0"/></radialGradient></defs>'
    out += f'<rect width="{W}" height="{H}" fill="url(#{p}-bg)"/><rect width="{W}" height="{H}" fill="url(#{p}-glow)"/>'
    return out + status_bar()


def sp_nav(active):
    out = f'<rect y="{H-66}" width="{W}" height="66" fill="#0d0820"/><rect y="{H-66}" width="{W}" height="1" fill="rgba(255,255,255,0.08)"/>'
    for i, (ic, lab) in enumerate([("home", "Home"), ("cards", "Bytes"), ("code", "Code"), ("pen", "Write"), ("trophy", "Ranks")]):
        cx = 36 + i * 72
        col = GOLD if i == active else "rgba(255,255,255,0.55)"
        out += icon(ic, cx - 12, H - 56, 24, col) + text(cx, H - 18, lab, 10, col, 500, "middle")
    return out


def sp_header(title, sub):
    out = f'<text x="20" y="74" font-family="{SANS}" font-size="22" font-weight="800" fill="#fff">Stu<tspan fill="{GOLD}">Pro</tspan></text>'
    out += f'<rect x="{W-112}" y="52" width="94" height="30" rx="15" fill="rgba(220,170,20,0.14)" stroke="rgba(220,170,20,0.45)"/>'
    out += icon("flame", W - 104, 55, 22, GOLD) + text(W - 80, 72, "12 days", 13, GOLD, 700)
    out += text(20, 124, title, 22, "#fff", 700) + text(20, 146, sub, 13, "rgba(255,255,255,0.6)")
    return out


def stupro_home(p):
    out = sp_base(p) + sp_header("Daily Career Challenges", "Small daily wins that add up BIG")
    out += f'<rect x="20" y="164" width="{W-40}" height="8" rx="4" fill="rgba(255,255,255,0.1)"/><rect x="20" y="164" width="{(W-40)*0.4}" height="8" rx="4" fill="{GOLD}"/>'
    out += text(W - 20, 192, "2 of 5 done", 12, "rgba(255,255,255,0.6)", 500, "end")
    rows = [("book", "Article", "One article", GOLD, True), ("code", "Coding problem", "One coding problem", CYAN, True),
            ("quiz", "Quiz", "One quiz", PURPLE, False), ("chat", "Sentence", "One sentence", PINK, False), ("bulb", "Tech fact", "One tech fact", BLUE, False)]
    for i, (ic, t, sub, col, done) in enumerate(rows):
        y = 210 + i * 86
        out += f'<rect x="20" y="{y}" width="{W-40}" height="74" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)"/>'
        out += f'<circle cx="54" cy="{y+37}" r="20" fill="{col}" fill-opacity=".16"/>' + icon(ic, 42, y + 25, 24, col)
        out += text(88, y + 33, t, 16, "#fff", 600) + text(88, y + 54, sub, 12, "rgba(255,255,255,0.55)")
        if done:
            out += f'<circle cx="{W-50}" cy="{y+37}" r="14" fill="{col}"/>' + icon("check", W - 61, y + 26, 22, SP_BG1, 2.6)
        else:
            out += f'<circle cx="{W-50}" cy="{y+37}" r="13" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>'
    return out + sp_nav(0)


def stupro_bytes(p):
    out = sp_base(p) + sp_header("Byte-Sized Learning", "No fluff, just facts")
    out += f'<defs><linearGradient id="{p}-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A737D5"/><stop offset="1" stop-color="{PINK}"/></linearGradient></defs>'
    out += f'<rect x="44" y="196" width="{W-88}" height="420" rx="24" fill="rgba(255,255,255,0.06)" transform="rotate(4 180 400)"/>'
    out += f'<rect x="32" y="182" width="{W-64}" height="440" rx="24" fill="url(#{p}-card)"/>'
    out += f'<rect x="52" y="204" width="132" height="28" rx="14" fill="rgba(255,255,255,0.2)"/>' + text(118, 223, "AI prepared content", 12, "#fff", 600, "middle")
    out += text(52, 282, "Cloud Computing", 28, "#fff", 800)
    for i, wv in enumerate([0.92, 0.85, 0.95, 0.7, 0.88, 0.6]):
        out += f'<rect x="52" y="{312+i*26}" width="{(W-104)*wv}" height="10" rx="5" fill="rgba(255,255,255,{0.75 if i < 3 else 0.5})"/>'
    out += f'<rect x="52" y="486" width="{W-104}" height="1" fill="rgba(255,255,255,0.3)"/>'
    out += text(52, 518, "Card 3 of 8", 12, "rgba(255,255,255,0.85)", 600)
    for i in range(8):
        out += f'<circle cx="{W-140+i*12}" cy="514" r="3.5" fill="#fff" fill-opacity="{1 if i == 2 else 0.4}"/>'
    out += f'<rect x="52" y="548" width="{W-104}" height="48" rx="24" fill="#fff"/>' + text(W / 2, 578, "Next card", 15, "#A737D5", 700, "middle")
    out += text(W / 2, 660, "Under 450 characters a card", 12, "rgba(255,255,255,0.55)", 500, "middle")
    return out + sp_nav(1)


def stupro_ranks(p):
    out = sp_base(p) + sp_header("Leaderboard", "Compete across colleges")
    tabs = ["My college", "All colleges"]
    for i, t in enumerate(tabs):
        x = 20 + i * 160
        on = i == 1
        out += f'<rect x="{x}" y="164" width="150" height="34" rx="17" fill="{GOLD if on else "rgba(255,255,255,0.06)"}"/>'
        out += text(x + 75, 186, t, 13, SP_BG1 if on else "rgba(255,255,255,0.7)", 700, "middle")
    # podium
    for rank, cx, top, col in [(2, 90, 300, "#C0C7D6"), (1, 180, 266, GOLD), (3, 270, 318, "#CD8B5A")]:
        out += f'<circle cx="{cx}" cy="{top-30}" r="{26 if rank == 1 else 22}" fill="{col}" fill-opacity=".25" stroke="{col}" stroke-width="2.5"/>'
        out += icon("account", cx - 14, top - 44, 28, col)
        out += f'<rect x="{cx-36}" y="{top}" width="72" height="{400-top}" rx="10" fill="{col}" fill-opacity=".18"/>'
        out += text(cx, top + 34, str(rank), 26, col, 800, "middle")
    for i in range(4):
        y = 418 + i * 64
        me = i == 1
        out += f'<rect x="20" y="{y}" width="{W-40}" height="54" rx="14" fill="{"rgba(220,170,20,0.14)" if me else "rgba(255,255,255,0.05)"}" stroke="{"rgba(220,170,20,0.5)" if me else "rgba(255,255,255,0.06)"}"/>'
        out += text(42, y + 33, str(i + 4), 15, "rgba(255,255,255,0.7)", 700, "middle")
        out += f'<circle cx="80" cy="{y+27}" r="15" fill="{[CYAN, GOLD, PURPLE, PINK][i]}" fill-opacity=".3"/>'
        out += f'<rect x="106" y="{y+18}" width="{[96, 70, 110, 84][i]}" height="8" rx="4" fill="rgba(255,255,255,0.75)"/>'
        out += f'<rect x="106" y="{y+32}" width="{[60, 76, 52, 70][i]}" height="6" rx="3" fill="rgba(255,255,255,0.3)"/>'
        out += text(W - 36, y + 33, f"{[980, 955, 940, 910][i]} pts", 13, GOLD if me else "rgba(255,255,255,0.75)", 700, "end")
    return out + sp_nav(4)


# ── output ─────────────────────────────────────────────────────────────
def screen_svg(body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">{body}</svg>\n'


def phone(pid, body, x, y, h):
    """A device frame with the screen nested inside, for showcase compositions."""
    w = h * W / H
    pad = h * 0.022
    r = h * 0.075
    sw, sh = w - 2 * pad, h - 2 * pad
    out = f'<g filter="url(#shadow)"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="#0b0b0f"/></g>'
    out += f'<rect x="{x+1}" y="{y+1}" width="{w-2}" height="{h-2}" rx="{r-1}" fill="none" stroke="rgba(255,255,255,0.14)"/>'
    out += f'<clipPath id="{pid}-clip"><rect x="{x+pad}" y="{y+pad}" width="{sw}" height="{sh}" rx="{r-pad}"/></clipPath>'
    out += f'<g clip-path="url(#{pid}-clip)"><svg x="{x+pad}" y="{y+pad}" width="{sw}" height="{sh}" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice">{body}</svg></g>'
    out += f'<rect x="{x+w/2-w*0.14}" y="{y+pad+h*0.012}" width="{w*0.28}" height="{h*0.03}" rx="{h*0.015}" fill="#0b0b0f"/>'
    return out


def showcase(bg, phones, glow="#ffffff"):
    """1600×1200; phones sit inside the centre 900px so 3:4, 4:3 and 16:10 crops all keep them."""
    out = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200" width="1600" height="1200">'
    out += '<defs><filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="30" stdDeviation="34" flood-color="#000" flood-opacity=".45"/></filter>'
    out += f'<radialGradient id="bgGlow" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="{glow}" stop-opacity=".22"/><stop offset="1" stop-color="{glow}" stop-opacity="0"/></radialGradient></defs>'
    out += f'<rect width="1600" height="1200" fill="{bg}"/><rect width="1600" height="1200" fill="url(#bgGlow)"/>'
    for pid, body, x, y, h in phones:
        out += phone(pid, body, x, y, h)
    return out + "</svg>\n"


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    screens = {
        "weather-screen": weather("w1"),
        "journeyjot-screen": journeyjot_home("j1"),
        "stupro-screen": stupro_home("s1"),
        "instaclone-screen": instaclone_feed("i1"),
    }
    for name, body in screens.items():
        (OUT / f"{name}.svg").write_text(screen_svg(body))

    H2 = 820
    w2 = H2 * W / H
    gap = 44
    x0 = 800 - w2 - gap / 2
    y0 = 600 - H2 / 2
    two = lambda a, b: [(a[0], a[1], x0, y0 + 24, H2), (b[0], b[1], x0 + w2 + gap, y0 - 24, H2)]
    (OUT / "weather.svg").write_text(showcase("#292D36", two(("wa", weather("wa")), ("wb", weather("wb", night=True))), "#6fa8ff"))
    (OUT / "instaclone.svg").write_text(showcase("#0a0a0a", two(("ia", instaclone_feed("ia")), ("ib", instaclone_profile("ib"))), IG_BLUE))
    (OUT / "journeyjot.svg").write_text(showcase("#f6dcef", two(("ja", journeyjot_home("ja")), ("jb", journeyjot_map("jb"))), "#ffffff"))

    # Stupro (featured, wide): three phones, centre one raised
    H3 = 800
    w3 = H3 * W / H
    g3 = 40
    cx = 800 - w3 / 2
    (OUT / "stupro.svg").write_text(showcase(SP_BG1, [
        ("sa", stupro_bytes("sa"), cx - w3 - g3, 600 - H3 / 2 + 36, H3),
        ("sb", stupro_home("sb"), cx, 600 - H3 / 2 - 20, H3),
        ("sc", stupro_ranks("sc"), cx + w3 + g3, 600 - H3 / 2 + 36, H3),
    ], GOLD))
    print("wrote", sorted(p.name for p in OUT.glob("*.svg")))


if __name__ == "__main__":
    main()
