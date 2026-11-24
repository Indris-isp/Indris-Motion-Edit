import sys
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]; fr=[int(x) for x in sys.argv[3].split(",")]
y0,y1=int(sys.argv[4]) if len(sys.argv)>4 else 230, int(sys.argv[5]) if len(sys.argv)>5 else 470
tiles=[]
for f in fr:
    im=Image.open(f"{d}/{f+1:04d}.png").convert("RGB").crop((0,y0,1276,y1)).resize((638,(y1-y0)//2))
    ImageDraw.Draw(im).text((6,4),f"f{f} {f/30:.2f}s",fill=(255,255,0))
    tiles.append(im)
cols=2; rows=(len(tiles)+1)//2; w,h=tiles[0].size
sheet=Image.new("RGB",(w*cols,h*rows))
for i,t in enumerate(tiles): sheet.paste(t,((i%cols)*w,(i//cols)*h))
sheet.save(out)
