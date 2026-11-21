import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';

// A 1920×1080 design space pinned to the frame's center. Every scene positions
// from the center, so 1080×1920 and 1080×1080 cutdowns crop around the key action.
// Narrow cutdowns (1080 wide) fit a 1500 px design width, so the key action stays inside the frame.
export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {width} = useVideoConfig();
  const k = width < 1920 ? width / 1500 : 1;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 1920, height: 1080, marginLeft: -960, marginTop: -540, transform: `scale(${k})`}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

// Place a child by its center, in world coordinates (0,0 = canvas center).
export const At: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, children, style}) => (
  <div style={{position: 'absolute', left: 960 + x, top: 540 + y, transform: 'translate(-50%, -50%)', ...style}}>{children}</div>
);
