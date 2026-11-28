import json, sys
V = sys.argv[1]; e = json.load(open(f"{V}/elements.json"))["elements"]; spec = json.load(open(f"{V}/spec.json"))
rend = {r["key"]: r for r in json.load(open(f"{V}/render.json"))}
byg = {}
for x in e: byg.setdefault(x["group"], []).append(x)
issues = 0
for g in spec["groups"]:
    xs = byg[g["id"]]; lines = {x["key"][:-2]: x for x in xs}
    bigs = [lines[l["key"]] for l in g["lines"] if l["role"] in ("big", "caps")]
    if not bigs: continue
    L = min(b["x"] for b in bigs); R = max(b["x"] + b["w"] for b in bigs)
    fb = next(k for k, l in enumerate(g["lines"]) if l["role"] in ("big", "caps"))
    for k, l in enumerate(g["lines"]):
        x = lines[l["key"]]; size = rend[l["key"]]["size"]; prob = []
        if l["role"] == "small":
            if x["w"] > (R - L) + 2: prob.append(f"wider than the big word ({x['w']} > {R-L})")
            if size < 40: prob.append(f"too small ({size:.0f}px)")
            if k < fb and abs(x["x"] - L) > 3: prob.append(f"lead line not flush left (x {x['x']} vs {L})")
            if k > fb and abs(x["x"] + x["w"] - R) > 3: prob.append(f"trailing line not flush right ({x['x']+x['w']} vs {R})")
        elif l["role"] == "big" and abs(x["x"] - L) > 3: prob.append(f"big line not flush left (x {x['x']} vs {L})")
        elif l["role"] == "caps" and abs((x["x"] + x["w"] / 2) - (L + R) / 2) > 3: prob.append("caps line off-centre")
        if prob: issues += 1; print(f'{g["id"]:5s} "{l["text"]}": ' + "; ".join(prob))
print("alignment issues:", issues)
