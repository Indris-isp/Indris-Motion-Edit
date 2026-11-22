import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { SCENES } from "./config";
import { A1Hook } from "./scenes/A1Hook";
import { A2Who } from "./scenes/A2Who";
import { B1Reach } from "./scenes/B1Reach";
import { B2Fees } from "./scenes/B2Fees";
import { B3Tools } from "./scenes/B3Tools";
import { C1Meet } from "./scenes/C1Meet";
import { D1Publish } from "./scenes/D1Publish";
import { D2Paid } from "./scenes/D2Paid";
import { D3Dash } from "./scenes/D3Dash";
import { E1Proof } from "./scenes/E1Proof";
import { E2Payoff } from "./scenes/E2Payoff";
import { E3Cta } from "./scenes/E3Cta";

// Storyboard v4: 12 scenes, 5 acts, 45.0 s at 60 fps.
const ORDER: [keyof typeof SCENES, React.FC][] = [
  ["hook", A1Hook], ["who", A2Who],
  ["reach", B1Reach], ["fees", B2Fees], ["tools", B3Tools],
  ["meet", C1Meet],
  ["publish", D1Publish], ["paid", D2Paid], ["dash", D3Dash],
  ["proof", E1Proof], ["payoff", E2Payoff], ["cta", E3Cta],
];

export const GhostLaunch: React.FC = () => (
  <AbsoluteFill style={{ background: "#FFFFFF" }}>
    <Series>
      {ORDER.map(([k, C]) => (
        <Series.Sequence key={k} durationInFrames={SCENES[k]}><C /></Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
