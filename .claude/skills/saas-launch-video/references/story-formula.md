# Story formula: problem first, then the fix

The film sells a *relief*. The viewer has to feel the problem in the first 6–8 seconds, before they see the product. Write the script in this order. Every beat is one idea and one shot.

## The arc (about 26 s; scale to 22–35 s)

| # | Beat | Job | Shot | Seconds |
|---|---|---|---|---|
| 1 | **Hook** | A real, specific moment the viewer has lived | `hook` | 1.5–1.8 |
| 2 | **Chaos** | Show the mess the problem creates | `chaos` | 1.8–2.2 |
| 3 | **Pain** | Turn the mess into one number | `pain` | 2.0–2.4 |
| 4 | **Turn** | Darkness, then light: the product is coming | `turn` | 1.8–2.2 |
| 5 | **Reveal** | Name + icon | `brand` | 1.5–1.8 |
| 6–8 | **Benefits ×3** | Each one is a headline + UI proof that kills one part of the pain | `laptop`, `circle`, `fanout` | 2.4–2.8 each |
| 9 | **Proof** | Outcome numbers | `dashboard` | 2.2–2.6 |
| 10 | **Social proof** | Others trust it | `social` | 1.7–2.0 |
| 11 | **Ease** | It's fast to start (removes the last objection) | `reel` | 1.5–1.8 |
| 12 | **CTA** | Name, tagline, buttons, URL | `cta` | 2.6–3.2 |

Shorter cuts (15–20 s, e.g. for social): hook → pain → turn → brand → 2 benefits → cta. Longer cuts add benefits, never longer holds.

## Copy rules

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

## Beat sheet format (show this to the user before building)

```
#  t      shot       on-screen copy                         what moves
1  0.0    hook       9:13 → 9:14 am · "any update on v2??"  focus-pull, digit roll, message flies in
2  1.6    chaos      Feedback is / everywhere.              card wall pops, headline blur-whips in
...
```

## Mapping a product into the brief

1. Ask: *who* is the user, *what moment* hurts, *what* do they count when it hurts, *which 3* features remove it, *what numbers* prove it, *how fast* is setup, and what the CTA is.
2. Fill `brief.js` top to bottom in the same order as the arc.
3. Make sure the people, messages and complaints in the problem beats come back resolved in the benefit beats. Re-using the same names and items sells continuity.
