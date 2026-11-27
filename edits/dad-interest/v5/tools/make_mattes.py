"""Full-frame photo + person matte for the roto scenes (text behind the subject on the ORIGINAL background).
    python3 tools/make_mattes.py -> assets/photo_<name>.jpg + assets/matte_<name>.png (1080x1920, same registration)"""
import os, cv2, numpy as np, onnxruntime as ort
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '../..')
s = ort.InferenceSession(os.path.join(ROOT, 'models/modnet.onnx'), providers=['CPUExecutionProvider']); n = s.get_inputs()[0].name
for name in ('dad_allowance', 'dad_door', 'teen_boss'):
    img = cv2.imread(os.path.join(ROOT, 'v4/src/ai', name + '.png'))[..., :3]
    H, W = img.shape[:2]
    x = cv2.resize(img[..., ::-1], (544, 960), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
    a = s.run(None, {n: ((x - 0.5) / 0.5).transpose(2, 0, 1)[None]})[0][0, 0]
    a = cv2.resize(np.clip(a, 0, 1), (W, H), interpolation=cv2.INTER_CUBIC)
    a = np.clip((a - 0.08) / 0.84, 0, 1)                                       # firm up the edge, keep soft hair
    cv2.imwrite(os.path.join(HERE, '../assets', f'photo_{name}.jpg'), img, [cv2.IMWRITE_JPEG_QUALITY, 92])
    cv2.imwrite(os.path.join(HERE, '../assets', f'matte_{name}.png'), np.dstack([img, (a * 255).astype(np.uint8)]))
    print(name, W, H)
