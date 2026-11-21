# Prompt

Build a set of single-file HTML demos (no build step, no external libraries)
that give intuition for:

1. Path integrals. Real time: every path is a unit arrow turned by S/ħ; show the
   arrows added head to tail (Cornu spiral) and the band of paths that survive
   (stationary phase). Imaginary time: sample closed paths with weight e^(−S_E/ħ)
   by Metropolis; compare the histogram with an exact transfer-matrix |ψ|².
   Double slit: Schrödinger wave on a grid (Visscher scheme, 4th-order
   Laplacian), domain colouring for the phase, de Broglie–Bohm flow lines,
   single arrival dots sampled from |ψ|², and the path-sum curve on the screen.
2. Quantum states and observables. Stern–Gerlach in sequence (order of
   measurements matters), ⟨[x,p]⟩ = iħ on a grid, and the Wigner function of
   Fock, cat, coherent and squeezed states (negative regions visible).
   Broken symmetry: a ball on V = −μ²r² + ¼r⁴ (Higgs mode 2μ, Goldstone mode 0)
   and a 128×128 XY model with Metropolis, vortices and a slow/fast quench.
3. The gauge groups U(1), SU(2), SU(3): show what a group element does, with
   low-dimensional slices of SU(3). Spinor page: one rotation angle drives a
   belt trick (row of plates, untangle via R(s,u) = rot(x,θs/2)·rot(b(u),θs/2)),
   a Bloch sphere with a Penrose flag, the two spinor components as arrows, an
   SU(2) circle, and the neutron-interferometer curve (1 + cos(θ/2))/2.
   SU(3): three colour arrows moved by exp(iθ λ_a/2) for each Gell-Mann
   matrix, weight diagrams and 3⊗3̄ = 8⊕1.
4. Gauge fields as phases on paths. Compact U(1) on a 2D lattice: Wilson loops
   with the exact (I₁/I₀)^Area, and a gauge-invariance check. Aharonov–Bohm:
   the double-slit solver with Peierls phases across a Dirac-string cut; the
   stripes shift by Φ/Φ₀, and moving the cut changes nothing physical.
   Abelian Higgs vortices on a 2D lattice (gradient flow): flux quantisation,
   BPS energy 2π per vortex, global vortex energy growing like ln R, type I
   attraction vs type II repulsion. String breaking: lattice Schwinger model
   with staggered fermions, exact diagonalisation (Lanczos), static charges
   ±q, V(r) linear then flat; fractional q never breaks.
5. Fluctuations and tunnelling. A free field on a chain: exact Gaussian
   ground-state samples, zero-point energy per mode, Casimir energy between
   Dirichlet walls vs −π/(24L). Wick rotation slider t = τe^(−iθ); double-well
   instantons with Metropolis (local, block and kink-pair moves), ΔE from the
   correlator vs exact diagonalisation.

Every room: a "How to use this room" box (3 steps) at the top, and a guide at the bottom with the fixed headings In one minute / What you see / Things to try (with hidden answers) / The physics / The math / Honest limits / Go further, styled by `notes/guide-template.css`. Technical words link to `glossary.html#id`.
6. Feynman. "Light takes every path": arrows for light on a mirror, a grating made by scraping the mirror, Snell's law by stationary phase, thin-film reflection (two arrows vs the exact Airy result). "Feynman diagrams from a path integral": Z(g) = ∫dφ e^(−φ²/2 − gφ⁴/4!), Wick pairings as diagrams with symmetry factors, the divergent asymptotic series vs the exact integral, ln Z = connected diagrams, QED cartoons.

7. More paths. "Watching the slits": the double slit with a marker state χ₁, χ₂ at each slit (overlap cos(θ/2)); stripe visibility V = |⟨χ₁|χ₂⟩|, distinguishability D, V² + D² = 1; the quantum eraser P± = ¼|ψ₁ ± ψ₂|². "Feynman diagrams for a real particle": 1D scattering from a delta, two deltas, a square barrier and a Gaussian; Born/Dyson series with G₀ = e^(ik|x−x'|)/(ik), each order drawn as a diagram with n kicks; partial sums vs the exact transfer matrix; divergence for |g|/k > 1 (bound state). "Paths that meet again": classical fan and Mehler kernel in a harmonic trap (focus at T/2 with phase −i, at T with −1); the quantum carpet of a packet in a box, T_rev = 4L²/π, copies at rational times, bounced paths over the carpet, autocorrelation curve.

Landing page `index.html`: the story "nature adds up phases" and one card per room.

Rules: label every panel as exact, simulation, interpretation or cartoon; sliders for the physics parameters (ħ, constant force, β, potential, flux, temperature); every demo
shows one number that is checked against an exact answer; dark and light theme;
works on a phone. Put the physics in a `/* PHYSICS-CORE START */ … END */`
block so a node test in `tests/` can check it without a browser.
