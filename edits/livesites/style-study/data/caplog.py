C = """Here's|0.00
how you|0.18
can use|0.40
Claude|0.74
to break down|0.92
why video|1.44
got views|1.88
like this|2.20
instead of this|2.70
normally|3.82
if you ask|3.96
Claude|4.30
why video|4.52
went viral|5.20
it gives you|5.76
a super|6.12
confident|6.48
answer|6.90
without|7.24
actually|7.58
having|7.90
watched it|8.10
it literally|8.80
only reads|9.02
the transcript|9.56
so it misses|10.24
what's on|10.64
the screen|11.14
the pacing|11.74
and|12.10
psychology|12.40
behind it|12.86
but|13.64
I built|13.88
a skill|14.48
to fix that|14.90
it's called|15.76
the video|16.04
breakdown|16.36
let me|16.92
show you|17.04
how to use it|17.28
it's super simple|17.94
you paste|18.58
in a video|18.80
and|19.36
it watches|19.72
the whole thing|20.14
frame by frame|20.76
it checks|21.70
how|21.98
many more views|22.22
it got|22.86
than the|23.16
creator|23.58
normally gets|23.80
then it|24.66
maps out|24.90
every beat|25.28
names|25.92
a psychology|26.12
behind|26.72
each one|27.18
and hands|27.72
you a|28.22
template that|28.60
you can apply|29.26
to your|29.94
next video|30.26
personally|31.04
I use this on|31.32
my own|31.78
content|32.10
or creators|32.48
I get|33.14
inspiration|33.40
from|33.90
not to|34.28
copy them|34.62
but|35.08
to understand|35.28
why|35.84
certain|36.26
pieces of|36.62
content works|37.08
so I can|37.60
improve|37.98
mine going|38.32
forward|38.80
you|39.24
can|39.40
build|39.56
yourself|39.76
or|40.18
just|40.34
comment|40.50
and|41.30
send|41.62
you|41.76
over|41.92
mine|42.08"""
S = [(0,3.72,'A-FULL','plain white, no pill; on chest / beside raised hand, y≈54%'),
 (3.72,8.72,'SPLIT','dark pill, centred on the seam, y≈50%'),
 (8.72,13.52,'B-WHITE','grey pill, under the graphic, y≈75%'),
 (13.52,14.16,'A-FULL','plain white, left of the face at eye level, y≈37%'),
 (14.16,15.72,'SPLIT','pill on the seam'),
 (15.72,17.04,'B-WHITE','dark pill ON the phone screen, y≈60%'),
 (17.04,18.48,'SPLIT','pill on the seam'),
 (18.48,24.64,'B-WHITE','grey pill, follows the bottom edge of the graphic'),
 (24.64,30.92,'UI-DARK','dark pill, sits just above the Claude input bar, y≈73%'),
 (30.92,37.72,'SPLIT','pill on the seam'),
 (37.72,39.24,'B-FULL','plain white, centre, y≈50%'),
 (39.24,42.60,'A-FULL','plain white, ONE word at a time, left of the head, y≈37%')]
rows=[l.split('|') for l in C.split('\n')]
out=['| # | in (s) | frame @25 | dur (s) | on-screen caption | words | layout | caption placement |','|---|---|---|---|---|---|---|---|']
durs=[];wc=[]
for i,(t,s) in enumerate(rows):
    s=float(s); e=float(rows[i+1][1]) if i+1<len(rows) else 42.60
    lay=[x for x in S if x[0]<=s+0.03<x[1]][0]
    n=len(t.split()); durs.append(e-s); wc.append(n)
    out.append(f'| {i+1} | {s:.2f} | f{round(s*25)} | {e-s:.2f} | **{t}** | {n} | {lay[2]} | {lay[3]} |')
open('caption_log.md','w').write('\n'.join(out)+'\n')
import statistics as st
print(len(rows),'chunks; mean dur',round(st.mean(durs),2),'median',round(st.median(durs),2),'mean words',round(st.mean(wc),2),
      {k:wc.count(k) for k in set(wc)})
