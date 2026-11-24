import sys, glob, numpy as np, json
from PIL import Image
fs=sorted(glob.glob(sys.argv[1]+"/*.png"))
prev=None; prevm=None; rows=[]
for i,f in enumerate(fs):
    a=np.asarray(Image.open(f).convert("RGB")).astype(np.float32)
    H,W,_=a.shape
    band=a[int(H*.36):int(H*.64)]
    mx=band.max(2); mn=band.min(2)
    m=(mx>200)&((mx-mn)<70)          # near-white text pixels
    # bluish text pixels
    b=(band[...,2]>170)&(band[...,2]-band[...,0]>40)
    mask=m|b
    ys,xs=np.nonzero(mask)
    cov=mask.mean()
    small=np.asarray(Image.open(f).convert("L").resize((64,36))).astype(np.float32)
    cut=0 if prev is None else np.abs(small-prev).mean()
    md=0 if prevm is None else (mask^prevm).mean()
    bbox=(int(xs.min()),int(ys.min()+H*.36),int(xs.max()),int(ys.max()+H*.36)) if len(xs)>200 else None
    rows.append(dict(f=i,t=round(i/30,3),cov=round(float(cov),4),md=round(float(md),4),cut=round(float(cut),1),bbox=bbox,lum=round(float(a.mean()),1)))
    prev=small; prevm=mask
json.dump(rows,open(sys.argv[2],"w"))
for r in rows: print(r["f"],r["t"],r["cov"],r["md"],r["cut"],r["lum"],r["bbox"])
