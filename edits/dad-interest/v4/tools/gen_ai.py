"""AI stills for the relatable beats: Segmind Vega (Apache-2.0) + VegaRT LCM LoRA (Apache-2.0), CPU, 6 steps (as in edits/hatch-team/tools).
    python3 gen_ai.py [name ...]      -> ../src/ai/<name>_s<seed>.png (768x1344)
"""
import os, sys, time, json, torch
from diffusers import StableDiffusionXLPipeline, LCMScheduler
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, '../src/ai')
STYLE = 'candid photograph, cinematic, 35mm film, natural skin texture, shallow depth of field, warm color grade, photorealistic, high detail'
JOBS = {
    'dad_allowance': 'a Jamaican father in his 40s wearing a work shirt hands a few dollar bills of allowance to his smiling 15 year old Black teenage daughter with long hair, cozy home kitchen, warm morning window light',
    'books':         'a 15 year old Black teenage girl with long hair hugging a tall stack of books in a bookstore aisle, smiling proudly, warm bookstore lights, shelves full of books behind her',
    'friends_ask':   'two high school teenagers in a school hallway with lockers holding out their hands asking a Black teenage girl for money, she holds her wallet and smiles slyly, daylight',
    'dad_door':      'a Jamaican father in his 40s in a work uniform knocking on a bedroom door in a home hallway in the early morning, warm light, view from the hallway',
    'drawer':        'close-up of a teenage girl hands opening a wooden bedroom dresser drawer full of saved dollar bills rolled with rubber bands, warm lamp light',
    'teen_boss':     'portrait of a confident 15 year old Black teenage girl entrepreneur in a blazer, arms crossed, smiling, standing in a bright modern office with big city windows',
}
NEG = 'cartoon, illustration, painting, 3d render, deformed hands, extra fingers, bad anatomy, blurry face, text, watermark, logo, frame'
want = sys.argv[1:] or list(JOBS)
torch.set_num_threads(4)
pipe = StableDiffusionXLPipeline.from_pretrained('segmind/Segmind-Vega', torch_dtype=torch.float32, variant='fp16', use_safetensors=True)
pipe.load_lora_weights('segmind/Segmind-VegaRT', weight_name='pytorch_lora_weights.safetensors'); pipe.fuse_lora()
pipe.scheduler = LCMScheduler.from_config(pipe.scheduler.config)
os.makedirs(OUT, exist_ok=True)
for name in want:
    for seed in (11, 23):
        t0 = time.time()
        img = pipe(prompt=f'{JOBS[name]}, {STYLE}', negative_prompt=NEG, num_inference_steps=6, guidance_scale=1.5, width=768, height=1344,
                   generator=torch.Generator().manual_seed(seed)).images[0]
        img.save(os.path.join(OUT, f'{name}_s{seed}.png')); print(name, seed, round(time.time() - t0), 's', flush=True)
