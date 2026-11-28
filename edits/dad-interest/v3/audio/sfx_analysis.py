"""Measure the sound design of the reference edits: what plays at each visual cut,
how loud the music bed sits under speech, and how many non-speech hits there are.
Usage: python3 sfx_analysis.py <dir with reference mp4s> <references-data dir> <out.json>"""
import json, subprocess, sys, numpy as np, librosa
SRC, DATA, OUT = sys.argv[1:4]
MAP = {'V01':'pierre','V02':'selflove','V03':'povintro','V04':'jack','V05':'catherine','V06':'redlight',
       'V07':'visionboard','V08':'naut1','V10':'naut3','V11':'naut2','V12':'P1','V13':'P2','V14':'P3','V15':'P4'}
SR, HOP = 22050, 256
stats = {s['v']: s for s in json.load(open(f'{DATA}/stats.json'))}

def load(name):
    raw = subprocess.run(['ffmpeg','-v','error','-i',f'{SRC}/{name}.mp4','-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(raw, np.float32)

def band_db(S, freqs, lo, hi):
    m = (freqs >= lo) & (freqs < hi)
    return 10*np.log10(S[m].sum(0) + 1e-10)

res = {}
for v, name in MAP.items():
    y = load(name); t_of = lambda i: i*HOP/SR
    D = np.abs(librosa.stft(y, n_fft=2048, hop_length=HOP))**2
    freqs = librosa.fft_frequencies(sr=SR, n_fft=2048)
    H, P = librosa.decompose.hpss(D, margin=2.0)
    hi = band_db(D, freqs, 3000, 10000); lo = band_db(D, freqs, 25, 120); perc = band_db(P, freqs, 200, 10000)
    words = [w for seg in json.load(open(f'{DATA}/transcripts/{v}_words.json')) for w in seg.get('words', [])]
    speech = np.zeros(D.shape[1], bool)
    for w in words: speech[int(w['s']*SR/HOP):int(w['e']*SR/HOP)+1] = True
    rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=HOP)[0][:D.shape[1]]
    rdb = 20*np.log10(rms + 1e-6)
    # music bed: level in word gaps (>=120 ms from any word) vs level during speech
    gap = ~speech; k = int(0.12*SR/HOP)
    gap = np.convolve(gap.astype(float), np.ones(2*k+1), 'same') >= 2*k+1
    bed = float(np.median(rdb[gap])) if gap.sum() > 20 else None
    spk = float(np.median(rdb[speech]))
    # harmonic stability in gaps = music, not room tone
    chroma = librosa.feature.chroma_stft(S=H, sr=SR)
    tonal = float(np.median(chroma.max(0)[gap] / (chroma.sum(0)[gap] + 1e-9))) if gap.sum() > 20 else None
    ev = []
    for c in stats[v]['cuts'][1] if isinstance(stats[v]['cuts'], list) and len(stats[v]['cuts'])==2 and isinstance(stats[v]['cuts'][1], list) else stats[v]['cuts']:
        i = int(c*SR/HOP); a, b = max(0, i-int(.6*SR/HOP)), min(D.shape[1], i+int(.25*SR/HOP))
        base = lambda x: np.median(x[max(0, i-int(2*SR/HOP)):min(len(x), i+int(2*SR/HOP))])
        whoosh_rise = hi[a:i+int(.1*SR/HOP)].max() - base(hi)
        win = slice(max(0,i-int(.08*SR/HOP)), i+int(.12*SR/HOP))
        hit = lo[win].max() - base(lo); click = perc[win].max() - base(perc)
        # riser: high band climbing steadily over 0.8 s into the cut
        r0 = max(0, i-int(1.0*SR/HOP)); seg = hi[r0:i]
        riser = float(np.polyfit(np.arange(len(seg)), seg, 1)[0]*SR/HOP) if len(seg) > 10 else 0.0
        kinds = []
        if whoosh_rise > 9: kinds.append('whoosh')
        if hit > 8: kinds.append('low hit')
        if click > 10 and 'whoosh' not in kinds: kinds.append('click/pop')
        if riser > 12: kinds.append('riser')
        ev.append({'t': round(c, 2), 'kinds': kinds, 'hi_dB': round(float(whoosh_rise),1), 'low_dB': round(float(hit),1), 'perc_dB': round(float(click),1), 'riser_dB_s': round(riser,1)})
    # non-cut transients (keyword pops, typing, coin clinks)
    on = librosa.onset.onset_detect(onset_envelope=librosa.onset.onset_strength(S=librosa.power_to_db(P), sr=SR), sr=SR, hop_length=HOP, units='time', delta=0.25)
    cuts = np.array([e['t'] for e in ev])
    extra = [float(t) for t in on if (len(cuts)==0 or np.abs(cuts-t).min() > .3)]
    res[v] = {'file': name, 'dur': round(len(y)/SR,2), 'speech_db': round(spk,1), 'bed_db': None if bed is None else round(bed,1),
              'bed_below_speech_db': None if bed is None else round(spk-bed,1), 'gap_tonality': None if tonal is None else round(tonal,2),
              'cuts_with_sfx': f"{sum(bool(e['kinds']) for e in ev)}/{len(ev)}", 'events': ev, 'other_transients_per_s': round(len(extra)/(len(y)/SR),2)}
    print(v, name, res[v]['cuts_with_sfx'], 'bed', res[v]['bed_below_speech_db'], 'dB under speech, tonality', res[v]['gap_tonality'],
          '| kinds:', {k: sum(k in e['kinds'] for e in ev) for k in ['whoosh','low hit','click/pop','riser']}, '| extra/s', res[v]['other_transients_per_s'])
json.dump(res, open(OUT,'w'), indent=1)
