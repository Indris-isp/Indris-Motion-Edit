### Story formula: problem first, then the fix

The film sells a *relief*. The viewer has to feel the problem in the first 6–8 seconds, before they see the product. Write the script in this order. Every beat is one idea and one shot.

#### The arc: Problem → Cause → Solution → Proof → CTA (30–40 s)

| # | Beat | Job | Seconds |
|---|---|---|---|
| 1–3 | **Problem** | A real, specific moment; the pain made visible as a picture, at scale | 6–9 |
| 4–5 | **Cause** | Why it happens: the root cause as a concrete picture (scattered tools, manual copying, a gatekeeper, no single source of truth, guesswork). Specific to this market | 5–8 |
| 6 | **Turn** | The cause's object transforms into the brand: the logo is built, then breathes | 2–3 |
| 7–9 | **Solution** | Each beat removes part of the cause with one real interaction on their (rebuilt) UI | 8–11 |
| 10 | **Proof** | Real numbers / customers / rating only | 3–5 |
| 11 | **CTA** | Logo returns, tagline, their buttons, URL | 3–4 |

The Cause beat is what makes the solution feel inevitable: the viewer should be able to say "oh, *that's* why". Every Solution beat must point back at the cause.

#### Copy rules

- **Their words first.** Pull the H1, section labels, stats and button labels from `brand/captured.md` and use them verbatim where they fit a beat. Write the problem beats in the same voice (their tone, their audience's words). A stat is only usable with the meaning its context sentence gives it.

- **Hook:** a time, a notification, a calendar, a counter. Concrete beats clever: "9:14 am" plus "any update on the v2 feedback??" beats "Feedback is hard."
- **Chaos headline:** name the problem in 2 + 1–2 words, with the payoff word in accent: "Feedback is / **everywhere.**", "Who's actually / **in today?**"
- **Pain number:** a count that sounds painful at a glance ("127 unread", "46 replies", "9 tools") plus a red delta pill ("+38 today").
- **Benefit headlines:** verb-led or outcome-led, 2–4 words per line, line 2 in accent. Each must answer one complaint from the chaos/pain beats.
  - "Every comment, / **one inbox.**" answers *everywhere*
  - "Sorted by AI. / **Instantly.**" answers *which file? / missed this*
  - "Reply once. / **Everyone sees it.**" answers *still waiting… / hello?*
- **Proof:** one big multiplier in the headline ("Close feedback **3.2× faster**"), then 2–4 supporting numbers in the UI.
- **Social:** "Trusted by / **N+ teams**", logos, a rating. Only use real logos and numbers the user provides; otherwise make up obviously fictional ones for a demo, and say so.
- **Ease:** "**02** minutes to set up", "Live in **10** minutes".
- **CTA tagline:** a call phrase plus an accent payoff: "Close the loop **on every client.**" Two buttons max, plus the URL.
- No sentence longer than about 6 words on screen. If it needs a comma, it is two beats.

#### Beat sheet format (show this to the user before building)

```
#  t      shot       on-screen copy                         what moves
1  0.0    hook       9:13 → 9:14 am · "any update on v2??"  focus-pull, digit roll, message flies in
2  1.6    chaos      Feedback is / everywhere.              card wall pops, headline blur-whips in
...
```

#### Mapping a product into the brief

1. Ask: *who* is the user, *what moment* hurts, *what* do they count when it hurts, *which 3* features remove it, *what numbers* prove it, *how fast* is setup, and what the CTA is.
2. Fill `brief.js` top to bottom in the same order as the arc.
3. Make sure the people, messages and complaints in the problem beats come back resolved in the benefit beats. Re-using the same names and items sells continuity.
