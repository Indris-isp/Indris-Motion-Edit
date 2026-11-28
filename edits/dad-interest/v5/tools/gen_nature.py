"""Natural wallpapers for the liquid-glass UI scenes (sun / water / flower), SDXL base + SDXL-Lightning 4-step, bf16 on CPU.
    python3 tools/gen_nature.py [name ...]  -> assets/nature/<name>_<seed>.png (768x1344)"""
import os, sys, time, torch
from diffusers import StableDiffusionXLPipeline, UNet2DConditionModel, EulerDiscreteScheduler
from huggingface_hub import hf_hub_download
from safetensors.torch import load_file
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, '../assets/nature')
LOOK = 'nature photograph, soft natural light, airy, bright, pastel tones, shallow depth of field, calm, minimal, high detail, shot on medium format film'
JOBS = {
    'sun':    'warm morning sun glowing through soft tall meadow grass, gentle lens flare, creamy golden bokeh, pale sky',
    'water':  'clear shallow turquoise sea water seen from above, soft sunlight caustics rippling on white sand, gentle ripples',
    'flower': 'soft white and blush pink cosmos flowers swaying in sunlight against a pale blue sky, dreamy bokeh',
    'leaves': 'sunlight filtering through fresh green leaves and white blossoms, soft sun rays, light sky, dreamy bokeh',
}
NEG = 'text, watermark, logo, people, person, animal, dark, gloomy, oversaturated, cartoon, illustration, 3d render, frame, border'
want = sys.argv[1:] or list(JOBS)
torch.set_num_threads(4)
base = 'stabilityai/stable-diffusion-xl-base-1.0'
unet = UNet2DConditionModel.from_config(base, subfolder='unet')
unet.load_state_dict(load_file(hf_hub_download('ByteDance/SDXL-Lightning', 'sdxl_lightning_4step_unet.safetensors'), device='cpu'))
unet = unet.to(torch.bfloat16)
pipe = StableDiffusionXLPipeline.from_pretrained(base, unet=unet, torch_dtype=torch.bfloat16, variant='fp16', use_safetensors=True)
pipe.vae.config.force_upcast = False
pipe.scheduler = EulerDiscreteScheduler.from_config(pipe.scheduler.config, timestep_spacing='trailing')
os.makedirs(OUT, exist_ok=True)
for name in want:
    for seed in (7, 42):
        t0 = time.time()
        img = pipe(prompt=f'{JOBS[name]}, {LOOK}', negative_prompt=NEG, num_inference_steps=4, guidance_scale=0, width=768, height=1344,
                   generator=torch.Generator().manual_seed(seed)).images[0]
        img.save(os.path.join(OUT, f'{name}_{seed}.png')); print(name, seed, round(time.time() - t0), 's', flush=True)
