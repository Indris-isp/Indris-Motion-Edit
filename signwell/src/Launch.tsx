import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Background, BgVariant} from './components/Background';
import {S1Hook} from './scenes/S1Hook';
import {S2Problem} from './scenes/S2Problem';
import {S3Fix} from './scenes/S3Fix';
import {S4Payoff} from './scenes/S4Payoff';
import {S5Logo} from './scenes/S5Logo';
import T from './timing.json';
import './fonts';
import {LensFX} from './fx/Lens';

const S = T.scenes;

export const Launch: React.FC<{withAudio?: boolean; bg?: BgVariant; bgOnly?: boolean}> = ({withAudio = true, bg = 'glow', bgOnly = false}) => (
  <AbsoluteFill>
    <LensFX>
    <Background variant={bg} />
    {!bgOnly && <>
    <Sequence from={S.s1.from} durationInFrames={S.s1.dur} name="1 · Still waiting (hook)"><S1Hook /></Sequence>
    <Sequence from={S.s2.from} durationInFrames={S.s2.dur} name="2 · Paper loop (problem)"><S2Problem /></Sequence>
    <Sequence from={S.s3.from} durationInFrames={S.s3.dur} name="3 · Place it, send it (fix)"><S3Fix /></Sequence>
    <Sequence from={S.s4.from} durationInFrames={S.s4.dur} name="4 · Signed (payoff)"><S4Payoff /></Sequence>
    <Sequence from={S.s5.from} durationInFrames={S.s5.dur} name="5 · Logo + CTA"><S5Logo /></Sequence>
    </>}
    </LensFX>
    {withAudio && <Audio src={staticFile('soundtrack.wav')} />}
  </AbsoluteFill>
);
