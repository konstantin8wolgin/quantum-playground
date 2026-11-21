# Quantum Playground

A hobby playground to build intuition for path integrals, quantum fluctuations,
quantum states, and the Lie groups of the Standard Model (U(1), SU(2), SU(3)).
Not research. The aim: change parameters, watch what happens, understand it.

## Demos

| Demo | What it shows |
|---|---|
| [`demos/path-integral.html`](demos/path-integral.html) | Real-time sum over paths (arrows, Cornu spiral, classical limit) and imaginary-time Monte Carlo (harmonic oscillator, double well, tunneling) |
| [`demos/spinor-flag.html`](demos/spinor-flag.html) | SU(2) and the 720° rotation: belt trick (with untangle slider), Bloch sphere with Penrose flag, the two spinor arrows, neutron-interferometer brightness |
| [`demos/double-slit.html`](demos/double-slit.html) | Schrödinger wave through two slits (phase colours), Bohm flow lines, single arrival dots, path-sum prediction |
| [`demos/xy-vortices.html`](demos/xy-vortices.html) | Broken symmetry: ball on a Mexican hat (Higgs mode 2μ, Goldstone mode 0), XY model of 128×128 compasses, vortices, quench (Kibble–Zurek) |
| [`demos/su3-colours.html`](demos/su3-colours.html) | SU(3) colour: three quark arrows, the eight Gell-Mann directions, weight diagrams, 3⊗3̄ = 8⊕1 |
| [`demos/wilson-loops.html`](demos/wilson-loops.html) | Compact U(1) lattice gauge field in 2D: phases on links, Wilson loops, area law, gauge invariance |
| [`demos/order-matters.html`](demos/order-matters.html) | Observables and commutators: Stern–Gerlach sequence, [x,p] = iħ, Wigner function (Fock, cat, coherent, squeezed) |
| [`demos/aharonov-bohm.html`](demos/aharonov-bohm.html) | Aharonov–Bohm effect: stripes shift with a hidden flux, Peierls phases, the cut line as a gauge choice |
| [`demos/restless-vacuum.html`](demos/restless-vacuum.html) | Vacuum fluctuations of a field on a chain (exact ground-state samples), zero-point energy per mode, Casimir energy and force between two walls |
| [`demos/tunnelling.html`](demos/tunnelling.html) | Wick rotation as a slider (arrows become weights), imaginary-time paths in a double well, instantons, tunnelling splitting |
| [`demos/flux-vortices.html`](demos/flux-vortices.html) | Abelian Higgs model: a vortex traps one flux quantum, BPS energy 2π, global vs gauged vortex, type I vs type II forces |
| [`demos/string-breaking.html`](demos/string-breaking.html) | Lattice Schwinger model (1+1D QED) by exact diagonalisation: the flux tube between two charges stretches, then breaks; fractional charges never break |

Start at [`index.html`](index.html). Open any file in a browser. No install, no server.

## Checks

Each demo compares the simulation with an exact answer on the page.
Example: `<x²>` from random paths (0.496) vs. transfer matrix (0.4995) for the
harmonic oscillator at β = 8, ħ = 1. Double slit at λ = 8, d = 40: stripe
distance 73.5 (simulation) vs. 72.0 (path sum) vs. 71.2 (λL/d). Spinor:
interference I(360°) = 0.000, I(720°) = 1.000; the belt untangles at 720° with
the box still (0.0°), but at 360° the box must turn (180° at the midpoint).
Broken symmetry: XY energy per site −1.949 vs. −1.95 (low-T formula) at T = 0.1;
Higgs frequency 1.999 vs. 2μ = 2.000. Wilson loops: plaquette 0.6972 vs. exact
I₁/I₀ = 0.6978. Order matters: ⟨[x,p]⟩ = 0.9999i, W(0,0) of the first excited
state = −1/π. Aharonov–Bohm: stripe shift 0.500 at Φ/Φ₀ = 0.5, gauge-cut
invariance 3e-11. Restless vacuum: Casimir coefficient
L·(E − bulk − surface) = −0.1309 vs. −π/24. Tunnelling: splitting ΔE from Monte
Carlo within a few % of exact diagonalisation (0.5713). Flux vortices: total
flux Φ/2π = 1.0000, BPS energy 0.998 × 2π. String breaking: string tension at
w = 0 equals J q² to 1e-14; q = 1 breaks, q = 0.5 does not.

Node tests: `node tests/<name>.test.mjs` runs the physics core of a page
without a browser.

## Rebuild it yourself

See [`PROMPT.md`](PROMPT.md) for the prompt and [`DATA.md`](DATA.md) for the data.
