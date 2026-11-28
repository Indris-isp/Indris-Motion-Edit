# Tighten line spacing: stack each line as close as its letters allow (column-by-column clearance), keep each lockup's centre.
import json, sys, numpy as np
from PIL import Image
V = sys.argv[1]; CLEAR_K = float(sys.argv[2]) if len(sys.argv) > 2 else 0.06
d = json.load(open(f"{V}/elements.json")); els = d["elements"]
rend = {r["key"] + "_t": r["size"] for r in json.load(open(f"{V}/render.json"))}
def mask(x):
    a = np.asarray(Image.open(f"{V}/lines/{x['key']}.png"))[..., 3] > 40; return a
groups = {}
for x in els: groups.setdefault(x["group"], []).append(x)
report = []
for gid, xs in groups.items():
    slots = {}
    for x in xs: slots.setdefault(x["y"], []).append(x)          # lines sharing a y are one slot (word swaps)
    ys = sorted(slots); 
    if len(ys) < 2: continue
    old_top = ys[0]; old_bot = max(x["y"] + x["h"] for x in xs); centre = (old_top + old_bot) / 2
    def profile(slot):                                              # per absolute column: top and bottom ink rows (slot-relative)
        top = np.full(1080, 1e9); bot = np.full(1080, -1e9)
        for x in slot:
            m = mask(x); cols = np.nonzero(m.any(0))[0]
            for c in cols:
                rows = np.nonzero(m[:, c])[0]; X = x["x"] + c
                if 0 <= X < 1080: top[X] = min(top[X], rows[0]); bot[X] = max(bot[X], rows[-1])
        return top, bot
    new_y = {ys[0]: 0.0}; prev_top, prev_bot = profile(slots[ys[0]]); prev_y = 0.0
    for yv in ys[1:]:
        top, bot = profile(slots[yv])
        size = min(rend[x["key"]] for x in slots[yv] + slots[[k for k in new_y][-1]])
        clear = max(5.0, CLEAR_K * size)
        both = (top < 1e8) & (prev_bot > -1e8)
        need = (prev_y + prev_bot[both] - top[both]).max() + clear if both.any() else prev_y + 10
        # baseline leading (Satoshi ascender line ~0.72 em): the new line's ascender line sits gapk*size below the
        # previous line's baseline, whatever letters the words happen to contain. The column check above is the floor.
        desc = lambda x: (0.21 * rend[x["key"]] if any(c in x["text"] for c in "gjpqy,;") else 0)
        base_prev = max(new_y[k] + x["h"] - desc(x) for k in new_y for x in slots[k])
        role = lambda x: "caps" if x["text"].isupper() else ("small" if x["fade"] <= 80 else "big")
        prev_role = role(slots[[k for k in new_y][-1]][0]); cur = slots[yv][0]; r = role(cur)
        gapk = {("small", "big"): 0.02, ("big", "small"): 0.04, ("small", "small"): 0.08, ("caps", "caps"): 0.08,
                ("big", "big"): 0.02, ("small", "caps"): 0.04, ("caps", "small"): 0.04}.get((prev_role, r), 0.05)
        sz = rend[cur["key"]]; target = base_prev + (0.72 + gapk) * sz - cur["h"] + desc(cur)
        need = max(target, (need - clear) + max(4.0, 0.04 * sz))
        new_y[yv] = need
        # merged profile of everything stacked so far (so a line clears all lines above, not just the previous one)
        pb = np.where(prev_bot > -1e8, prev_y + prev_bot, -1e9); nb = np.where(bot > -1e8, need + bot, -1e9)
        prev_bot = np.maximum(pb, nb); prev_y = 0.0
    height = max(new_y[x["y"]] + x["h"] for x in xs)
    shift = centre - height / 2
    for x in xs: x["y_old"] = x["y"]
    for x in xs: x["y"] = round(new_y[x["y_old"]] + shift)
    report.append(f"{gid:5s} block height {int(old_bot - old_top)} -> {int(height)} px")
for x in els: x.pop("y_old", None)
json.dump(d, open(f"{V}/elements.json", "w"), indent=1)
print("\n".join(report))
