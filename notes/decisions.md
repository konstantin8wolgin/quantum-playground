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
- Demo 2: double slit — built 2026-11-21 (`demos/double-slit.html`; Visscher scheme with 4th-order Laplacian, because the FFT version was too slow).
- Demo 1: spinor flag and 720° — built 2026-11-21 (`demos/spinor-flag.html`).
- Landing page `index.html`.
- Rooms built 2026-11-21 in one run: broken symmetry (`xy-vortices.html`), three colours (`su3-colours.html`), phases around a loop (`wilson-loops.html`), order matters (`order-matters.html`), a phase without a force (`aharonov-bohm.html`). Each has node tests in `tests/` or checked numbers on the page.
- Rooms built 2026-11-21 (second run): the restless vacuum (`restless-vacuum.html`), tunnelling in imaginary time (`tunnelling.html`), vortices that trap flux (`flux-vortices.html`), pull two charges apart (`string-breaking.html`). Each has a node test.
- Fix during review: the tunnelling sampler had only local moves and gave ΔE between 0.25 and 0.67 (exact 0.571), depending on the seed. A kink-pair move (shift a stretch of path into the other well, kink-shaped edges, symmetric proposal) brings it to within a few %. The test now checks three seeds.
- Also added `tests/xy-vortices.test.mjs`. It found that "add vortex pair" made two vortices of the same sign when the click hit a grid point exactly; fixed by putting the cores at cell centres.
- Possible next rooms: SU(2) gauge field on a lattice (non-Abelian Wilson loops), quark model hadrons from SU(3) weights, a "Wick morph" video export.
- Review gate: the user reviews every room before the repo goes public.

## Round 3 (2026-11-21): user review
- User: loves the rooms, especially the double slit. Some rooms are confusing without context. Wants information so people understand what they see, some math, and more on Feynman diagrams and path integrals. Then an MVP.
- Done: a "How to use" box and a full guide in every room (template in `notes/guide-template.css`, reference `demos/double-slit.html`); `glossary.html` (67 terms); landing page as four routes with audience tags; two Feynman rooms.
- Fixes found while writing the guides: spinor 360° message at the slider end, path-integral captions (force direction, best arch vs classical path, thermal density), SU(3) hint (t³ for pure red), flux plot divided by n, XY friction text, string-breaking "must agree" label only for heavy fermions.
- Next: MVP = make the repo public and put the rooms on GitHub Pages, after the user says yes.

## Overnight run (2026-11-21 → 22)
- The user asked to work through the night. Plan and rules in `notes/overnight.md`. Repo stays private.
- New rooms, all with guide, node test and glossary links: "Watching the slits" (`which-path.html`, 74b6117), "Feynman diagrams for a real particle" (`born-series.html`, a7d1b4f), "Paths that meet again" (`quantum-carpet.html`, 0477485).
- QA pass (e1b5c03): every room at 375 px and in both themes. Dark accent buttons had 2.2:1 contrast; now `--on-accent` gives at least 4.7:1.
- Carpet room: the whole-T_rev carpet with a narrow packet looks like noise on a screen, so the default view is the 1/4 window. The jump buttons move the window when needed.
- Glossary: 79 terms (added entanglement, decoherence, complementarity, quantum eraser, scattering, Born approximation, bound state, resonance, eigenstate, harmonic oscillator, Gouy phase, revival).
- Still open: the MVP launch (public repo + GitHub Pages) waits for the user's yes.
- Round 2 of the night: "From paths to Schrödinger" (`time-slicing.html`, 5da0a84) and "Feynman's checkerboard" (`checkerboard.html`, 2e909d7). Both built by worker agents, then checked by hand.
- Review find in the checkerboard: the "positive energy only" packet still trembled (wiggle 0.006, with the plot auto-zoom making it look like real Zitterbewegung). Cause: the start state was projected with one k only. Fix: project every k onto the lattice eigenvector in Fourier space; wiggle now 1e-14, and the plot has a minimum scale. A test guards it.
- Glossary now 85 terms (added time slicing, Trotter splitting, Dirac equation, light cone, quantum walk, Zitterbewegung).
