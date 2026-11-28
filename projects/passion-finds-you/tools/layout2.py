import json, sys, subprocess, numpy as np
from PIL import Image
V, B, S = sys.argv[1:4]
spec = json.load(open(f"{V}/spec.json")); meas = json.load(open(f"{V}/measure.json"))
head = [h for h in json.load(open(f"{B}/head_track.json")) if h]
def heads(t0, t1):
    hs = [h for h in head if t0 <= h["f"] * 20 < t1] or [min(head, key=lambda h: abs(h["f"] * 20 - t0))]; return hs
def matte(f):
    p = f"{B}/matte/{f:05d}.png" if f < 1303 else f"{B}/matte_tail/{f-1303:05d}.png"; return np.asarray(Image.open(p)) > 128
def free_sides(t0, t1, y0, y1):
    fl, fr = [], []
    for f in range(int(t0 / 20), max(int(t0 / 20) + 1, int(t1 / 20)), 5):
        m = matte(min(f, 1319))[y0:y1]; cols = np.nonzero(m.any(0))[0]
        if len(cols) == 0: fl.append(1080); fr.append(1080); continue
        fl.append(np.percentile(cols, 2)); fr.append(1080 - np.percentile(cols, 98))
    return float(np.min(fl)), float(np.min(fr))
STY = {"small": (600, -0.01), "big": (800, -0.035), "caps": (900, -0.01)}
CAP = {"big": 210, "caps": 190}
render = []; plan = []
for g in spec["groups"]:
    hs = heads(g["t0"], g["t1"]); top = float(np.mean([h["top"] for h in hs]))
    hx0 = min(h["hx0"] for h in hs); hx1 = max(h["hx1"] for h in hs)
    z = g["zone"]; side = None
    if z == "screen": maxW, x_anchor, align, y_top = 700, 290, "left", 360
    elif z == "right_of_head":
        x0 = max(560, min(hx1 + 30, 640)); maxW = 1045 - x0; x_anchor, align, y_top = x0, "left", top + 160
    elif z == "side_of_head":
        y0 = int(top + 120); fl, fr = free_sides(g["t0"], g["t1"], y0, y0 + 360)
        side = "right" if fr >= fl else "left"; free = max(fl, fr)
        maxW = float(np.clip(free * 1.45, 300, 560)); align = "left" if side == "right" else "right"
        x_anchor = (1080 - fr + 24) if side == "right" else (fl - 24); y_top = top + 150
    elif z == "lower": maxW, x_anchor, align, y_top = 900, 540, "center", 1120
    elif z == "torso":
        cx = []
        for f in range(int(g["t0"] / 20), max(int(g["t0"] / 20) + 1, int(g["t1"] / 20)), 5):
            m = matte(min(f, 1319))[int(top + 380):int(top + 700)]; cols = np.nonzero(m.any(0))[0]
            if len(cols): cx.append((np.percentile(cols, 20) + np.percentile(cols, 80)) / 2)
        x_anchor = float(np.clip(np.mean(cx) if cx else 540, 470, 610)); maxW, align, y_top = 800, "torso", top + 430
    else: maxW, x_anchor, align, y_top = 0, 0, "arc", 0
    bigs = [l for l in g["lines"] if l["role"] == "big"]; caps = [l for l in g["lines"] if l["role"] == "caps"]
    bigS = min([CAP["big"]] + [maxW * 100 / meas[l["key"]]["w"] for l in bigs]) if bigs and z != "arc" else None
    capS = min([CAP["caps"]] + [maxW * 100 / meas[l["key"]]["w"] for l in caps]) if caps else None
    ref = bigS or capS or 160
    smallS = float(np.clip(0.36 * ref, 46, 70))
    for l in g["lines"]:
        w, ls = STY[l["role"]]
        if l["role"] == "small": sz = min(smallS, maxW * 100 / meas[l["key"]]["w"]) if maxW else smallS
        elif l["role"] == "big": sz = bigS if z != "arc" else 92
        else: sz = capS
        l["size"] = round(sz, 1); render.append({"key": l["key"], "text": l["text"], "size": l["size"], "weight": w, "ls": ls})
    plan.append(dict(g=g, x_anchor=x_anchor, align=align, y_top=y_top, side=side, maxW=maxW, hx0=hx0, hx1=hx1, top=top, ref=ref))
json.dump(render, open(f"{V}/render.json", "w"))
subprocess.run(["node", f"{S}/scripts/lines.cjs", "render", f"{V}/render.json", f"{V}/rendered.json", V], check=True)
# trim each line image to its ink and keep offsets
box = {}
for r in render:
    im = Image.open(f"{V}/lines/{r['key']}.png").convert("RGBA"); a = np.asarray(im)[..., 3]
    ys, xs = np.nonzero(a > 6); x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    im.crop((x0, y0, x1, y1)).save(f"{V}/lines/{r['key']}_t.png"); box[r["key"]] = (int(x1 - x0), int(y1 - y0))
els = []
for p in plan:
    g = p["g"]; lines = g["lines"]
    if p["align"] == "arc": els.append(dict(key=lines[0]["key"], arc=True, t_in=lines[0]["t"], t_out=g["t1"], blend=g["blend"], behind=False, fade=200, size=lines[0]["size"], text=lines[0]["text"])); continue
    # vertical stack (replace lines reuse the slot above)
    slots = []; y = p["y_top"]; prev = None
    for l in lines:
        w, h = box[l["key"]]
        if l.get("replace"): slot = slots[-1]; slot["keys"].append(l); continue
        if prev is not None:
            gap = (0.10 * p["ref"]) if (prev["role"] != l["role"]) else (0.04 * l["size"] if l["role"] != "small" else 0.18 * l["size"])
            y += gap
        slots.append({"y": y, "keys": [l]}); y += h; prev = l
    # block width = widest line of the final state
    bw = max(box[s["keys"][-1]["key"]][0] for s in slots)
    if p["align"] == "left": bx = min(p["x_anchor"], 1050 - bw)
    elif p["align"] == "right": bx = max(30, p["x_anchor"] - bw)
    elif p["align"] == "torso": bx = float(np.clip(p["x_anchor"] - bw / 2, 40, 1040 - bw))
    else: bx = 540 - bw / 2
    t1 = g["t1"]
    for s in slots:
        for k, l in enumerate(s["keys"]):
            w, h = box[l["key"]]
            la = l.get("align", "left" if p["align"] != "center" else "center")
            if p["align"] == "right" and "align" not in l: la = "right"
            if p["align"] == "torso" and "align" not in l: la = "center"
            x = bx if la == "left" else (bx + bw - w if la == "right" else (bx + (bw - w) / 2 if p["align"] == "torso" else 540 - w / 2))
            t_out = s["keys"][k + 1]["t"] if k + 1 < len(s["keys"]) else t1
            els.append(dict(key=l["key"] + "_t", x=round(x), y=round(s["y"]), t_in=l["t"], t_out=t_out, blend=g["blend"], behind=bool(g.get("behind")),
                            fade=0 if l["role"] == "small" else 200, w=w, h=h, group=g["id"], text=l["text"]))
json.dump({"elements": els, "plan": [{k: v for k, v in p.items() if k != "g"} | {"id": p["g"]["id"]} for p in plan]}, open(f"{V}/elements.json", "w"), indent=1)
for p in plan: print(p["g"]["id"], p["g"]["zone"], "side", p["side"], "maxW", int(p["maxW"]), "anchor", int(p["x_anchor"]), "y", int(p["y_top"]), "bigsize", round(p["ref"]))
