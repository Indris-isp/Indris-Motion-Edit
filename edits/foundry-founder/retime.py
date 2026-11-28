import json
w=json.load(open('words.json'))
# drop flubbed take 83.66..100.90 ("We dropped..." first take + "restart this one")
w=[x for x in w if not (83.3<=x['s']<101.2)]
MAXGAP=0.62; HEAD=0.5
t=HEAD; prev=None; out=[]
for x in w:
    if prev is None: shift=x['s']-HEAD
    else:
        gap=x['s']-prev['e']
        if gap>MAXGAP: shift+=gap-MAXGAP
    prev=x; out.append({**x,'ns':round(x['s']-shift,2),'ne':round(x['e']-shift,2)})
json.dump(out,open('words_retimed.json','w'))
# sentence lines
line=[];
for x in out:
    line.append(x)
    if x['w'][-1] in '.?!':
        print(f"{line[0]['ns']:6.2f}-{x['ne']:6.2f} (src {line[0]['s']:6.2f}) "+' '.join(y['w'] for y in line)); line=[]
print('VO end', out[-1]['ne'])
