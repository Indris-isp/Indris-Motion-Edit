import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {SCENES} from './config';
import {Always, Booked, Chat, Cta, Doors, Hook, Offer, Problem, Reveal} from './scenes';

const MAP: Record<string, React.FC<{dur: number}>> = {
  hook: Hook, problem: Problem, reveal: Reveal, doors: Doors, chat: Chat,
  booked: Booked, always: Always, offer: Offer, cta: Cta,
};

export const Launch: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: '#060A12', fontFamily: 'Inter', color: '#111827'}}>
    {SCENES.map((s) => {
      const Comp = MAP[s.id];
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
          <Comp dur={s.dur} />
        </Sequence>
      );
    })}
    {audio ? <Audio src={staticFile('audio.wav')} /> : null}
  </AbsoluteFill>
);
