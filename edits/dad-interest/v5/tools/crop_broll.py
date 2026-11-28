"""9:16 B-roll crops from the free-licence Mixkit originals (src/broll/raw_<id>.mp4) -> src/broll/<name>.mp4, 1080x1920, 5 s, 23.976 fps.
    python3 tools/crop_broll.py"""
import os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); SRC = os.path.join(HERE, '../src/broll')
JOBS = {  # name: (mixkit id, start s, crop centre x 0..1)
    'cal':      (38501, 3.6, 0.62),   # days circled on a calendar           -> "in the middle of the month"
    'ask':      (23523, 2.4, 0.42),   # hands held out, money handed over    -> "they came to me for money"
    'calc':     (47011, 1.0, 0.45),   # wallet + calculator                  -> "they had to pay interest"
    'wallet20': (18297, 2.8, 0.42),   # pulling dollars out of a wallet      -> "daddy, you owe me $20"
    'handover': (18247, 2.0, 0.55),   # a bill passes hand to hand           -> "and plus $5 for interest"
    'upset':    (32056, 1.0, 0.64),   # upset young woman by the window      -> "he didn't give me back my interest"
}
for name, (mid, ss, cx) in [(n, j) for n, j in JOBS.items() if len(sys.argv) < 2 or n in sys.argv[1:]]:
    vf = (f"crop=ih*9/16:ih:max(0\\,min(iw-ih*9/16\\,iw*{cx}-ih*9/32)):0,scale=1080:1920:flags=lanczos,unsharp=5:5:0.6,fps=24000/1001")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(ss), '-i', os.path.join(SRC, f'raw_{mid}.mp4'), '-t', '5.005', '-an', '-vf', vf,
                    '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-pix_fmt', 'yuv420p', os.path.join(SRC, f'{name}.mp4')], check=True)
    print(name)
