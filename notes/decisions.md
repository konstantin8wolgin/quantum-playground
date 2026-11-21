# Decisions

Record of the design questions ("grill") and the answers.

## Vision (round 1, 2026-11-21)

Theoretical physics feels dry in books. The project builds beautiful, interactive
simulations that give a *feeling* for what the theory means in nature. The level
to aim for: above 3Blue1Brown-style explainers, because the viewer can tune the
parameters. Layered like a good textbook: a visitor walks in, sees a striking
simulation, asks "what does this mean?", and digs deeper step by step.

Scope: quantum mechanics and the Standard Model. No gravity theory, no string theory.
Quantum-mechanics basics (observables, expectation values, commutators) are in
scope, because visuals can teach them better than the usual formalism.

## Decisions

| # | Question | Decision |
|---|---|---|
| Q1 | Main idea | Both real time (arrows, interference) and imaginary time (statistics), joined by the Wick rotation. Beauty of "what a particle experiences" over the formula of the action. |
| Q2 | "Particle flow" | Not answered explicitly. Default: double slit from the path sum next, then Schrödinger flow (streamlines). |
| Q3 | Quantum fluctuations | Field fluctuations on a grid (128×128 is good). GPU allowed. Looks first, precision second, but keep one checked number. |
| Q4 | Lie groups | Order: (a) what the group does to a state, (c) weight diagrams. SU(2): sphere with a "flag" (spinor flag / belt trick). |
| Q5 | Gauge groups + path integrals | Build separate demos first, then join them: "a path integral where the arrow is a group element". |
| Q6 | Format | Single-file HTML (most accessible). Maybe a website and YouTube videos later. |
| Q7 | Gravity slider | User asked to remove gravity. Note: the slider was a plain Newton force (a thrown ball), not gravity theory. Relabelled as "constant force F". |

## Research (2026-11-21)
- Report: `reports/Visualizing quantum physics landscape.md`. Notes: `research_notes/`.
- Main result: fill the gaps (gauge fields as phases on paths, live Higgs step, spinor flag, SU(3) action), do not copy old applets. Write raw WebGL2. Reuse ideas, not code.

## Round 2 (2026-11-21)

| # | Question | Decision |
|---|---|---|
| Q8 | Next demo | Double slit with flow lines first, then the spinor flag. XY vortices and the Mexican hat are a plan for later. Simple things first; check that they work. |
| Q9 | One story for all rooms | Not answered. Default: "nature adds up phases" is the front-door story of the landing page. |
| Q10 | Visitor | Everybody, in layers. Like planes and rockets: fascination for outsiders, depth for educated people. |
| Q11 | Honesty labels | Yes. Each panel says "exact", "simulation", "interpretation" or "cartoon". |
| Q12 | Going public | Only after the user reviews the simulations personally. Stay private until then. |

## Next
- Demo 2: double slit (split-operator Schrödinger, phase colours, Bohmian flow lines, sum-over-paths curve).
- Demo 1: spinor flag and 720°.
- Landing page `index.html`.
