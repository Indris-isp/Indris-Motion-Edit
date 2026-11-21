import React from 'react';
import {Composition} from 'remotion';
import {Launch} from './Launch';
import T from './timing.json';

// Scene lengths must sum to the total.
const sum = Object.values(T.scenes).reduce((a, s) => a + s.dur, 0);
if (sum !== T.total) throw new Error(`Scene lengths add up to ${sum}, expected ${T.total}`);

export const Root: React.FC = () => (
  <>
    <Composition id="Launch" component={Launch} durationInFrames={T.total} fps={T.fps} width={1920} height={1080} defaultProps={{withAudio: true}} />
    <Composition id="LaunchVertical" component={Launch} durationInFrames={T.total} fps={T.fps} width={1080} height={1920} defaultProps={{withAudio: true}} />
    <Composition id="LaunchSquare" component={Launch} durationInFrames={T.total} fps={T.fps} width={1080} height={1080} defaultProps={{withAudio: true}} />
  </>
);
