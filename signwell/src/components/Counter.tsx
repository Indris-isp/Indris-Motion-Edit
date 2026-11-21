import React from 'react';
import {interpolate} from 'remotion';
import {clamp, easeOut} from '../anim';

// Counts over ~1 s (60 frames), ease-out. Never jumps to the final value in one frame.
export const countValue = (f: number, start: number, from: number, to: number, dur = 60) =>
  interpolate(f, [start, start + dur], [from, to], {...clamp, easing: easeOut});
