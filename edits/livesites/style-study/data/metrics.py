import subprocess, sys, json, numpy as np, cv2, csv
src, out, W, H, fps = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), float(sys.argv[5])
p = subprocess.Popen(['ffmpeg','-v','error','-i',src,'-vf',f'scale={W}:{H}','-f','rawvideo','-pix_fmt','bgr24','-'],stdout=subprocess.PIPE)
rows=[]; pg=None; ph=None; i=0
while True:
    b=p.stdout.read(W*H*3)
    if len(b)<W*H*3: break
    f=np.frombuffer(b,np.uint8).reshape(H,W,3); g=cv2.cvtColor(f,cv2.COLOR_BGR2GRAY)
    hsv=cv2.cvtColor(f,cv2.COLOR_BGR2HSV); h=cv2.calcHist([hsv],[0,1],None,[32,32],[0,180,0,256]); cv2.normalize(h,h)
    r={'f':i,'t':round(i/fps,3),'luma':round(float(g.mean()),1),'sat':round(float(hsv[...,1].mean()),1)}
    r['motion']=round(float(np.abs(g.astype(int)-pg).mean()),2) if pg is not None else 0
    r['cut']=round(1-float(cv2.compareHist(ph,h,cv2.HISTCMP_CORREL)),4) if ph is not None else 0
    rows.append(r); pg=g.astype(int); ph=h; i+=1
with open(out,'w',newline='') as fh:
    w=csv.DictWriter(fh,fieldnames=rows[0].keys()); w.writeheader(); w.writerows(rows)
print(len(rows))
