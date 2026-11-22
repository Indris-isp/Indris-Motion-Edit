import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { COLORS, SCENES } from "./config";
import { S1Hook } from "./scenes/S1Hook";
import { S2Problem } from "./scenes/S2Problem";
import { S3Fix } from "./scenes/S3Fix";
import { S4Payoff } from "./scenes/S4Payoff";
import { S5Cta } from "./scenes/S5Cta";

export const GhostLaunch: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.bg }}>
    <Series>
      <Series.Sequence durationInFrames={SCENES.hook}><S1Hook /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.problem}><S2Problem /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.fix}><S3Fix /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.payoff}><S4Payoff /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.cta}><S5Cta /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);
