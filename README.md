# Quantum Playground

A hobby playground to build intuition for path integrals, quantum fluctuations,
quantum states, and the Lie groups of the Standard Model (U(1), SU(2), SU(3)).
Not research. The aim: change parameters, watch what happens, understand it.

## Demos

| Demo | What it shows |
|---|---|
| [`demos/feynman-mirror.html`](demos/feynman-mirror.html) | Feynman's arrows for light: reflection from every point of a mirror, a scraped mirror as a grating, Snell's law from the least-time point, partial reflection from a glass sheet |
| [`demos/feynman-diagrams.html`](demos/feynman-diagrams.html) | Where Feynman diagrams come from: zero-dimensional φ⁴ theory, diagrams as pairings of legs with symmetry factors, the asymptotic series vs the exact integral, QED cartoons and electron g−2 |
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
| [`demos/which-path.html`](demos/which-path.html) | Watching the slits: a which-path marker of adjustable strength; stripe visibility = \|⟨χ₁\|χ₂⟩\| = cos(θ/2), V² + D² = 1, and the quantum eraser (P± = ¼\|ψ₁ ± ψ₂\|²) |
| [`demos/born-series.html`](demos/born-series.html) | Feynman diagrams for a real particle: 1D scattering, the Born/Dyson series (term n = diagram with n kicks), partial sums vs the exact transfer matrix, divergence when \|g\|/k > 1 |
| [`demos/quantum-carpet.html`](demos/quantum-carpet.html) | Paths that meet again: harmonic trap (all paths focus at T/2, Mehler kernel, Gouy phase −i) and the quantum carpet in a box (Talbot revivals at T_rev = 4L²/π, fractional copies) |
| [`demos/time-slicing.html`](demos/time-slicing.html) | From paths to Schrödinger: the path integral as a product of N short-time steps; a sliced path you can drag, split-step evolution, error vs N (plain split order 1, symmetric order 2, free particle exact for every N), imaginary time to the ground state |
| [`demos/checkerboard.html`](demos/checkerboard.html) | Feynman's checkerboard: zig-zag paths at light speed with a factor −iεm per turn sum to the 1+1D Dirac propagator (Bessel functions); unitary quantum-walk version, packet speed k/√(k²+m²), Zitterbewegung |
| [`demos/winding-ring.html`](demos/winding-ring.html) | Paths that wind around a ring: winding sectors n with phase e^{iθn}, Z as a sum over windings = sum over levels (Poisson), level crossing at θ = π, persistent current, Monte Carlo of winding paths |
| [`demos/berry-phase.html`](demos/berry-phase.html) | A phase from the shape of the path: a spin follows a slowly turning field; Berry phase −Ω/2 from the Schrödinger run vs the exact rotating-frame solution; independent of speed; monopole flux picture |

Start at [`index.html`](index.html). It groups the rooms into four routes and marks each room as "for everybody", "some physics" or "for students". Every room has a short "How to use" box at the top and a full guide at the bottom (idea in one minute, what you see, things to try with answers, the physics, the math, honest limits, further reading). [`glossary.html`](glossary.html) explains 90 terms and links each one to the rooms that show it. Open any file in a browser. No install, no server.

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
w = 0 equals J q² to 1e-14; q = 1 breaks, q = 0.5 does not. Watching the
slits: visibility cos(θ/2) to 6e-4, eraser piles P+ + P− equal the no-stripe
pattern to 1e-18. Born series: delta-spike sum of 60 diagrams = 1/(1 + ig/k) to
6e-17; the series diverges at the rate |g|/k = 1.5. Paths that meet again:
|⟨ψ₀(−x)|ψ(T/2)⟩| = 1.0000000000, and |⟨ψ(0)|ψ(T_rev)⟩|² = 1.0000000000. From paths to
Schrödinger: fitted order of the symmetric split 2.000 (exact 2), ground-state
energy 0.49995 (exact 0.5). Checkerboard: recursion = brute force over all 2^N
paths (difference 0), order of convergence to the Dirac propagator 1.03 (exact 1),
no Zitterbewegung for a positive-energy packet (below 1e-8). Ring: Z from
winding sectors = Z from energy levels to 1e-16; Monte Carlo ⟨n²⟩ within 0.4σ.
Berry phase: −1.57006 from a slow run vs −Ω/2 = −1.57080 at α = 60°; the
difference 7.4e-4 is the known 1/T term.

Node tests: `node tests/<name>.test.mjs` runs the physics core of a page
without a browser.

## Rebuild it yourself

See [`PROMPT.md`](PROMPT.md) for the prompt and [`DATA.md`](DATA.md) for the data.
