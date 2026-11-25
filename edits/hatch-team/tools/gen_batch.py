"""Batch local generation (Segmind Vega + VegaRT LoRA, Apache-2.0): loads once, renders every job."""
import json, sys, time, torch, os
from diffusers import StableDiffusionXLPipeline, LCMScheduler
jobs = json.load(open(sys.argv[1])); outdir = sys.argv[2]
torch.set_num_threads(4)
pipe = StableDiffusionXLPipeline.from_pretrained('segmind/Segmind-Vega', torch_dtype=torch.float32, variant='fp16', use_safetensors=True)
pipe.load_lora_weights('segmind/Segmind-VegaRT', weight_name='pytorch_lora_weights.safetensors'); pipe.fuse_lora()
pipe.scheduler = LCMScheduler.from_config(pipe.scheduler.config)
neg = 'cartoon, illustration, painting, 3d render, deformed hands, extra fingers, distorted face, identical faces, text, watermark, logo'
for j in jobs:
    out = os.path.join(outdir, j['name'] + '.png')
    if os.path.exists(out): continue
    t = time.time()
    img = pipe(prompt=j['prompt'], negative_prompt=neg, num_inference_steps=6, guidance_scale=1.5, width=j.get('w', 768), height=j.get('h', 1344),
               generator=torch.Generator().manual_seed(j.get('seed', 1))).images[0]
    img.save(out); print(j['name'], round(time.time() - t), 's', flush=True)
print('ALL DONE')
