# Caption spec for the "placed lockup" style (reference 2). Times on the final 26.4 s timeline (ms).
import json, sys
W = json.load(open(sys.argv[1])); OUT = sys.argv[2]
def T(i):
    t = W[i]["cut_start_ms"]; return t if t < 16520 else t - 2080
# role: small (connector words) | big (key word) | caps (title/CTA)
def S(text, i, **k): return dict(text=text, t=T(i) if isinstance(i, int) else i, role="small", **k)
def Bg(text, i, **k): return dict(text=text, t=T(i) if isinstance(i, int) else i, role="big", **k)
def C(text, i, **k): return dict(text=text, t=T(i) if isinstance(i, int) else i, role="caps", **k)
# zone: where the lockup lives. align: left/right/center. lines stack top->bottom; a line with replace=True swaps the text of the line above in place (word-by-word build).
G = [
 # --- wide shot: printed onto the red screen (overlay)
 dict(id="L1", zone="screen", blend="overlay", lines=[S("everything I was", 0), Bg("searching", 3), S("for", 4, align="right")]),
 dict(id="L2", zone="screen", blend="overlay", lines=[S("was searching", 5), Bg("for me,", 7)]),
 # --- white slide: right of her face, difference
 dict(id="L3", zone="right_of_head", blend="difference", behind=True, lines=[S("and I found my", 9), Bg("passion,", 13)]),
 dict(id="L4", zone="right_of_head", blend="difference", behind=True, lines=[S("okay?", 14)]),
 dict(id="L5", zone="right_of_head", blend="difference", behind=True, lines=[S("how do you think", 15), Bg("I found it?", 19)]),
 dict(id="L6", zone="right_of_head", blend="difference", behind=True, lines=[S("did I find it", 22), S("did I find it by", 26, replace=True), Bg("sitting", 27), Bg("still", 28)]),
 dict(id="L7", zone="right_of_head", blend="difference", behind=True, lines=[S("and thinking", 29), S("and thinking what my", 31, replace=True), Bg("passion", 33), S("could be?", 34, align="right")]),
 # --- dark wall: beside her head on the free side, normal, depth
 dict(id="L8", zone="side_of_head", blend="normal", behind=True, lines=[Bg("No.", 36)]),
 dict(id="L9", zone="side_of_head", blend="normal", behind=True, lines=[S("I found it because", 37), S("I had been", 42), Bg("moving", 44)]),
 dict(id="L10", zone="arc", blend="normal", behind=False, lines=[Bg("all along,", 45)]),
 dict(id="L11", zone="side_of_head", blend="normal", behind=True, lines=[S("doing something,", 47), S("doing something", 49), Bg("I love,", 51)]),
 dict(id="L12", zone="side_of_head", blend="normal", behind=True, lines=[Bg("watching,", 53)]),
 dict(id="L13", zone="side_of_head", blend="normal", behind=True, lines=[Bg("observing,", 54)]),
 dict(id="L14", zone="side_of_head", blend="normal", behind=True, lines=[S("and", 55), Bg("feeling.", 56)]),
 # --- red slide: lower third over her jacket, normal, in front
 dict(id="L15", zone="lower", blend="normal", lines=[S("clarity doesn't", 66), S("clarity doesn't come", 68, replace=True), Bg("before action.", 69)]),
 dict(id="L16", zone="lower", blend="normal", lines=[C("CLARITY", 71), C("COMES THROUGH", 72), C("ACTION.", 74)]),
 dict(id="L17", zone="right_of_head", blend="normal", behind=True, lines=[S("standing here,", 75), S("standing here, I can learn", 77, replace=True), S("how much ever times", 80), Bg("how to swim,", 84)]),
 dict(id="L18", zone="lower", blend="normal", lines=[S("but I can only", 87), S("but I can only swim if I", 91, replace=True), C("JUMP", 94), C("INTO THE", 95), C("WATER.", 97)]),
]
for k, g in enumerate(G):
    g["t0"] = g["lines"][0]["t"]; g["t1"] = G[k + 1]["lines"][0]["t"] if k + 1 < len(G) else 26400
json.dump({"duration": 26400, "fps": 50, "groups": G}, open(OUT, "w"), indent=1)
for g in G: print(g["id"], g["t0"], g["t1"], g["zone"], g["blend"], " | ".join(f'{l["role"][0]}:{l["text"]}@{l["t"]}' for l in g["lines"]))
