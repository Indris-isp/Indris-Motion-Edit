import json, sys
W=json.load(open(sys.argv[1])); OUT=sys.argv[2]
CUT_A, CUT_B = 16520, 18600                   # beat 8 line removed from the cut timeline
def T(i):
    t=W[i]["cut_start_ms"]; return t if t < CUT_A else t-(CUT_B-CUT_A)
def L(text,tier="standard",**k): d={"text":text,"tier":tier}; d.update(k); return d
# each caption: start word index (or ms), lines, options
caps=[
 # b1 C  (note: middle of the screen, a little smaller)
 dict(t=0,lines=[L("Everything","hero")],capY=.50,scale=.85,beat="b1"),
 dict(t=T(1),lines=[L("I was searching for")],capY=.50,scale=.85,beat="b1"),
 dict(t=T(5),lines=[L("was searching")],capY=.50,scale=.85,beat="b1"),
 dict(t=T(7),lines=[L("was searching"),L("for me,")],two=True,capY=.50,scale=.85,beat="b1"),       # review 2: build, line 1 stays put
 # b2 A
 dict(t=T(9),lines=[L("and I found my")],beat="b2"),
 dict(t=T(13),lines=[L("and I found my"),L("passion,","hero")],stack=True,beat="b2"),
 dict(t=T(14),lines=[L("okay?")],beat="b2"),                         # review: add "okay?"
 # b3 B + note: double line for the question
 dict(t=T(15),lines=[L("How do you think"),L("I found it?")],two=True,beat="b3"),
 dict(t=T(22),lines=[L("Did I find it")],beat="b3"),
 dict(t=T(26),lines=[L("by sitting still","italic")],beat="b3"),
 dict(t=T(29),lines=[L("and thinking","italic")],beat="b3"),
 dict(t=T(31),lines=[L("what my passion","italic")],beat="b3"),
 dict(t=T(34),lines=[L("could be?","italic")],beat="b3"),
 # b4 A
 dict(t=T(36),lines=[L("No.","emphasis")],beat="b4"),
 # b5 B
 dict(t=T(37),lines=[L("I found it")],beat="b5"),
 dict(t=T(40),lines=[L("because I had been")],beat="b5"),
 dict(t=T(44),lines=[L("because I had been"),L("moving","hero")],stack=True,beat="b5"),
 dict(t=T(45),lines=[L("all along,")],beat="b5"),
 # b6 A
 dict(t=T(47),lines=[L("doing something,")],beat="b6"),
 dict(t=T(49),lines=[L("doing something I love,","italic")],beat="b6"),
 # b7 B
 dict(t=T(53),lines=[L("watching,","italic")],beat="b7"),
 dict(t=T(54),lines=[L("observing,","italic")],beat="b7"),
 dict(t=T(55),lines=[L("and feeling.","italic")],beat="b7"),
 # b8 A: line cut from the video
 # b9 B + note: smaller, double line held longer
 dict(t=T(66),lines=[L("Clarity doesn't",weight=500)],scale=.9,capY=.45,beat="b9"),
 dict(t=T(68),lines=[L("Clarity doesn't",weight=500),L("come before action.",weight=800)],two=True,scale=.9,capY=.45,beat="b9"),   # review: regular + bold, lower
 dict(t=T(71),lines=[L("Clarity comes through")],scale=.9,beat="b9"),
 dict(t=T(74),lines=[L("Clarity comes through"),L("action.","hero",size=.20)],stack=True,scale=.9,beat="b9"),
 # b10 B
 dict(t=T(75),lines=[L("Standing here,","italic")],beat="b10"),
 dict(t=T(77),lines=[L("I can learn")],beat="b10"),
 dict(t=T(80),lines=[L("how many times")],beat="b10"),
 dict(t=T(84),lines=[L("how to swim,")],beat="b10"),
 dict(t=T(87),lines=[L("but I can only")],beat="b10"),
 # b11 B + note
 dict(t=T(91),lines=[L("swim if I jump")],beat="b11"),
 dict(t=T(95),lines=[L("into the")],beat="b11"),
 dict(t=T(97),lines=[L("water.","heromax",italic=True)],beat="b11"),
]
LOWER=.05
for c in caps: c["capY"]=round(c.get("capY",.42)+LOWER,3)
# Blend: difference only for captions that start inside 0:02-0:10 on the white slide (2.42-9.94 s); plain white elsewhere
DIFF_FROM, DIFF_TO = 2000, 9940
for c in caps: c["blend"]="difference" if DIFF_FROM <= c["t"] < DIFF_TO else "white"
caps.sort(key=lambda c:c["t"])
DUR=26400
for k,c in enumerate(caps):
    c["out"]=caps[k+1]["t"] if k+1<len(caps) else DUR
    c["id"]=f"c{k:02d}"
json.dump({"duration":DUR,"fps":50,"letterbox_ms":0,"captions":caps},open(OUT,"w"),indent=1)
for c in caps: print(c["id"],c["t"],c["out"],c["out"]-c["t"]," / ".join(l["text"] for l in c["lines"]) or "(clean)")
