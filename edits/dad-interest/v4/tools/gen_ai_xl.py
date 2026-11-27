"""AI stills, v2: SDXL base 1.0 (CreativeML Open RAIL++-M) + SDXL-Lightning 4-step UNet (ByteDance, OpenRAIL++), bf16 on CPU (AMX).
Sharper and far more photographic than the Vega pass. Money close-ups are NOT generated (AI bills look fake; real footage is used).
    python3 gen_ai_xl.py [name ...]   -> ../src/ai/<name>_xl<seed>.png (768x1344)
"""
import os, sys, time, torch
from diffusers import StableDiffusionXLPipeline, UNet2DConditionModel, EulerDiscreteScheduler
from huggingface_hub import hf_hub_download
from safetensors.torch import load_file
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, '../src/ai')
FILM = 'candid documentary photograph, shot on Kodak Portra 400, 35mm lens, natural skin texture, soft natural light, realistic, highly detailed'
JOBS = {
    'dad_allowance': 'a Jamaican-American father in his 40s with a warm smile hands a twenty dollar bill to his happy 15 year old daughter with long box braids in their small New York kitchen, early 2000s home, morning window light',
    'books':         'a happy 15 year old Black girl with long box braids hugging a stack of hardcover books to her chest in a bookstore aisle, warm bookstore lights, shelves full of books behind her',
    'friends_ask':   'at the high school lockers, a teenage boy in a grey hoodie and a teenage girl with a short curly afro both hold out their open hands toward their friend, a smiling Black girl with long box braids who holds her wallet, school hallway, daylight',
    'dad_door':      'a middle-aged Black father with a short grey beard wearing a navy blue work shirt and jeans stands in a home hallway and knocks with his knuckles on a closed white bedroom door, early morning, warm light, family photos on the wall',
    'teen_boss':     'editorial portrait of a confident 15 year old Black girl with box braids in a tailored black blazer, arms crossed, smiling, modern office with big windows and a city view',
}
NEG = 'cartoon, illustration, painting, 3d render, cgi, plastic skin, deformed hands, extra fingers, bad anatomy, text, watermark, logo'
want = sys.argv[1:] or list(JOBS)
torch.set_num_threads(4)
base = 'stabilityai/stable-diffusion-xl-base-1.0'
unet = UNet2DConditionModel.from_config(base, subfolder='unet')
unet.load_state_dict(load_file(hf_hub_download('ByteDance/SDXL-Lightning', 'sdxl_lightning_4step_unet.safetensors'), device='cpu'))
unet = unet.to(torch.bfloat16)
pipe = StableDiffusionXLPipeline.from_pretrained(base, unet=unet, torch_dtype=torch.bfloat16, variant='fp16', use_safetensors=True)
pipe.vae.config.force_upcast = False      # bf16 VAE is stable (fp16 is not)
pipe.scheduler = EulerDiscreteScheduler.from_config(pipe.scheduler.config, timestep_spacing='trailing')
os.makedirs(OUT, exist_ok=True)
for name in want:
    for seed in ([int(x) for x in os.environ['SEEDS'].split(',')] if os.environ.get('SEEDS') else (7, 42)):
        t0 = time.time()
        img = pipe(prompt=f'{JOBS[name]}, {FILM}', negative_prompt=NEG, num_inference_steps=4, guidance_scale=0, width=768, height=1344,
                   generator=torch.Generator().manual_seed(seed)).images[0]
        img.save(os.path.join(OUT, f'{name}_xl{seed}.png')); print(name, seed, round(time.time() - t0), 's', flush=True)
