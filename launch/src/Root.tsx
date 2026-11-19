import React from 'react';
import { Composition } from 'remotion';
import { FPS, TOTAL } from './config';
import { Video } from './Video';

export const Root: React.FC = () => (
  <>
    <Composition id="ISP-16x9" component={Video} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
    <Composition id="ISP-9x16" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    <Composition id="ISP-1x1" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1080} />
  </>
);
