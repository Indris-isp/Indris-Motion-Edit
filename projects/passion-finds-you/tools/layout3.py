# Placed-lockup layout v3: Satoshi Medium/Bold, smaller sizes, tight leading, centred lockups that avoid the face,
# and selected big words placed BEHIND her head at eye level (reference: "changing.", "continuing").
import json, sys, subprocess, numpy as np
from PIL import Image
V, B, S = sys.argv[1:4]
spec = json.load(open(f"{V}/spec.json")); meas = json.load(open(f"{V}/measure.json"))
head = [h for h in json.load(open(f"{B}/head_track.json")) if h]
STY = {"small": (500, -0.02), "big": (700, -0.045), "caps": (700, -0.03)}
BIG_CAP, CAPS_CAP, BIG_W, CAPS_W = 150, 120, 600, 680
def hs_for(t0, t1): return [h for h in head if t0 <= h["f"] * 20 < t1] or [min(head, key=lambda h: abs(h["f"] * 20 - t0))]
render, plan = [], []
for g in spec["groups"]:
    hs = hs_for(g["t0"], g["t1"]); wide = np.mean([h["top"] for h in hs]) > 600
    bigs = [l for l in g["lines"] if l["role"] == "big"]; caps = [l for l in g["lines"] if l["role"] == "caps"]
    # behind-the-head words must clear the head on both sides, so they are sized to the head
    bw_target = {"front": BIG_W, "behind": 320 if wide else 640, "above": 560, "subject": 560, "subj": 520 if wide else BIG_W}[g["mode"]]
    bigS = min([170 if g["mode"] in ("subject",) or (g["mode"] == "subj" and wide) else BIG_CAP] + [bw_target * 100 / meas[l["key"]]["w"] for l in bigs]) if bigs else None
    capS = min([CAPS_CAP] + [CAPS_W * 100 / meas[l["key"]]["w"] for l in caps]) if caps else None
    ref = bigS or capS or 120
    smallS = float(np.clip(0.42 * ref, 40, 58)) if (bigs or caps) else 56
    ink = lambda k: max(1.0, meas[k]["w"] - 24.0)          # measured span minus its 0.12em side padding at 100px = letter width
    big_w = max([bigS * ink(l["key"]) / 100 for l in bigs]) if bigs else 860   # small lines never wider than the big word
    for l in g["lines"]:
        w, ls = STY[l["role"]]; w = l.get("weight", w)
        sz = {"small": max(34, min(smallS, big_w * 0.96 * 100 / ink(l["key"]))), "big": bigS, "caps": capS}[l["role"]]
        l["size"] = round(sz, 1); render.append({"key": l["key"], "text": l["text"], "size": l["size"], "weight": w, "ls": ls})
    plan.append(dict(g=g, hs=hs, wide=wide, ref=ref))
json.dump(render, open(f"{V}/render.json", "w"))
subprocess.run(["node", f"{S}/scripts/lines.cjs", "render", f"{V}/render.json", f"{V}/rendered.json", V], check=True)
box = {}; trim = {}; edges = json.load(open(f"{V}/rendered.json"))
for r in render:
    im = Image.open(f"{V}/lines/{r['key']}.png").convert("RGBA"); a = np.asarray(im)[..., 3]
    ys, xs = np.nonzero(a > 6); x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    im.crop((x0, y0, x1, y1)).save(f"{V}/lines/{r['key']}_t.png"); box[r["key"]] = (int(x1 - x0), int(y1 - y0)); trim[r["key"]] = int(x0)
GAP = {("small", "big"): 0.025, ("big", "small"): 0.03, ("small", "small"): 0.06, ("big", "big"): 0.0, ("caps", "caps"): 0.04,
       ("small", "caps"): 0.04, ("caps", "small"): 0.03}
els = []; report = []
for p in plan:
    g = p["g"]; lines = g["lines"]; hs = p["hs"]
    slots, y, prev = [], 0.0, None
    for l in lines:
        w, h = box[l["key"]]
        if l.get("replace"): slots[-1]["keys"].append(l); continue
        if prev is not None:
            unit = p["ref"] if "big" in (prev["role"], l["role"]) or "caps" in (prev["role"], l["role"]) else l["size"]
            y += GAP[(prev["role"], l["role"])] * unit
        slots.append({"y": y, "keys": [l], "h": h, "role": l["role"]}); y += h; prev = l
    bh = y; bw = max(box[s["keys"][-1]["key"]][0] for s in slots)
    top = float(np.median([h["top"] for h in hs])); hcx = float(np.median([h["hcx"] for h in hs]))
    FH = 95 if p["wide"] else 330                     # head top to chin
    face = (hcx - (45 if p["wide"] else 150), top, hcx + (45 if p["wide"] else 150), top + FH)
    if g["mode"] == "above":
        # big word sits just above her head; the hair crown overlaps the bottom of the letters (reference: "continuing")
        bi = next(i for i, s_ in enumerate(slots) if s_["role"] == "big")
        oy = (top + 55) - (slots[bi]["y"] + slots[bi]["h"]); cx = hcx
    elif g["mode"] == "subj":
        # centred on HER: horizontal middle of her body, vertical middle of her figure (mid-frame in medium shots)
        xs_, ys_ = [], []
        for f in range(int(g["t0"] / 20), max(int(g["t0"] / 20) + 1, int(g["t1"] / 20)), 5):
            pth = f"{B}/matte/{min(f,1302):05d}.png" if f < 1303 else f"{B}/matte_tail/{min(f-1303,16):05d}.png"
            mm = np.asarray(Image.open(pth)) > 128
            band = mm[int(top + FH + 40): int(top + FH + 500)] if not p["wide"] else mm
            cols = np.nonzero(band.any(0))[0]; rows = np.nonzero(mm.any(1))[0]
            if len(cols): xs_.append((np.percentile(cols, 20) + np.percentile(cols, 80)) / 2)
            if len(rows): ys_.append((rows.min() + rows.max()) / 2)
        cx = float(np.clip(np.median(xs_) if xs_ else 540, 430, 650))
        cy = float(np.median(ys_)) if (p["wide"] and ys_) else 960
        oy = cy - bh / 2
        fx0, fy0, fx1, fy1 = face
        if (cx - bw / 2 < fx1 and cx + bw / 2 > fx0 and oy < fy1 + 40 and oy + bh > fy0 - 40): oy = fy1 + 60
    elif g["mode"] == "subject":
        # on her body, centred on her, starting just under her chin (never over the face)
        cx = hcx; oy = top + FH + 45
    elif g["mode"] == "behind":
        # big word centred on the head at eye level; small lines stack above/below it as usual
        bi = next(i for i, s in enumerate(slots) if s["role"] == "big")
        eye = top + (0.45 * FH if p["wide"] else 175)
        oy = eye - (slots[bi]["y"] + slots[bi]["h"] / 2)
        cx = hcx
    else:
        cx = 540; oy = 960 - bh / 2
        y0, y1 = oy, oy + bh; fx0, fy0, fx1, fy1 = face
        overlaps = (cx - bw / 2 < fx1 and cx + bw / 2 > fx0 and y0 < fy1 + 40 and y1 > fy0 - 40)
        if overlaps:
            below = fy1 + 60; above = fy0 - 60 - bh
            oy = below if below + bh < 1700 else max(120, above)
            if p["wide"] and above > 150: oy = above        # wide shot: the empty screen above her
    bx = float(np.clip(cx - bw / 2, 40, 1040 - bw))
    for s in slots:
        for k, l in enumerate(s["keys"]):
            w, h = box[l["key"]]; la = l.get("align", "left")
            x = bx if la == "left" else (bx + bw - w if la == "right" else bx + (bw - w) / 2)
            if g["mode"] == "above" and s["role"] == "small":
                half = 150; si = [q for q in slots if q["role"] == "small"].index(s)
                x = (hcx + half + 20) if hcx < 540 else (hcx - half - 20 - w); x = float(np.clip(x, 30, 1050 - w))
                y_override = top + 70 + si * (h + 0.10 * l["size"])
            if g["mode"] == "behind" and s["role"] == "small":
                # small words sit beside the head on its free side (reference: "starts" next to his head), never over the face
                half = 45 if p["wide"] else 150
                x = (hcx + half + 20) if hcx < 540 else (hcx - half - 20 - w)
                x = float(np.clip(x, 30, 1050 - w))
            t_out = s["keys"][k + 1]["t"] if k + 1 < len(s["keys"]) else g["t1"]
            yy = y_override if (g["mode"] == "above" and s["role"] == "small") else oy + s["y"]
            # word-by-word reveal: each word uncovers up to its right edge at its spoken time (positions never move)
            we = edges[l["key"]]["words"]; wt = l.get("word_t", [l["t"]]); words = []
            for k2, (ws, wend) in enumerate(we):
                cut = wend + 0.06 * l["size"] if k2 + 1 == len(we) else min(wend + 0.06 * l["size"], we[k2 + 1][0] - 1)
                words.append([wt[min(k2, len(wt) - 1)], round(cut - trim[l["key"]]) if k2 + 1 < len(we) else 100000])
            els.append(dict(words=words, key=l["key"] + "_t", x=round(x), y=round(yy), t_in=l["t"], t_out=t_out, blend=g["blend"],
                            behind=(g["mode"] == "above" or (g["mode"] == "behind" and s["role"] == "big")), fade=80 if l["role"] == "small" else 160, w=w, h=h, group=g["id"], text=l["text"]))
    report.append(f'{g["id"]:4s} {g["mode"]:6s} big {p["ref"]:5.0f}px  block {int(bw)}x{int(bh)} at x {int(bx)} y {int(oy)}  face y {int(face[1])}-{int(face[3])}')
json.dump({"elements": els}, open(f"{V}/elements.json", "w"), indent=1)
print("\n".join(report))
