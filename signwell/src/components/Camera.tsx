import React from 'react';

// One camera per scene. `zoom` scales around the canvas center; `focus` (0→1 via `amount`)
// slides the given world point toward center. `push` is the always-on micro push.
export const Camera: React.FC<{
  rotate?: number; zoom?: number; focus?: {x: number; y: number}; amount?: number; panX?: number; panY?: number; push?: number;
  children: React.ReactNode;
}> = ({rotate = 0, zoom = 1, focus = {x: 0, y: 0}, amount = 0, panX = 0, panY = 0, push = 1, children}) => {
  const s = zoom * push;
  return (
    <div style={{position: 'absolute', inset: 0, transformOrigin: '960px 540px',
      transform: `rotate(${rotate}deg) scale(${s}) translate(${-focus.x * amount + panX}px, ${-focus.y * amount + panY}px)`}}>
      {children}
    </div>
  );
};
