"""Local image generation: Segmind Vega (Apache-2.0) + VegaRT LCM LoRA (Apache-2.0), 4-6 steps on CPU.
    python3 gen.py <out.png> <width> <height> <seed> "<prompt>"
"""
import sys, time, torch
from diffusers import StableDiffusionXLPipeline, LCMScheduler
out, W, H, seed, prompt = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
torch.set_num_threads(4)
t0 = time.time()
pipe = StableDiffusionXLPipeline.from_pretrained('segmind/Segmind-Vega', torch_dtype=torch.float32, variant='fp16', use_safetensors=True)
pipe.load_lora_weights('segmind/Segmind-VegaRT', weight_name='pytorch_lora_weights.safetensors'); pipe.fuse_lora()
pipe.scheduler = LCMScheduler.from_config(pipe.scheduler.config)
print('load', round(time.time() - t0), 's', flush=True)
neg = 'cartoon, illustration, painting, deformed hands, extra fingers, blurry face, text, watermark, logo'
t1 = time.time()
img = pipe(prompt=prompt, negative_prompt=neg, num_inference_steps=6, guidance_scale=1.5, width=W, height=H,
           generator=torch.Generator().manual_seed(seed)).images[0]
img.save(out); print('gen', round(time.time() - t1), 's', out)
