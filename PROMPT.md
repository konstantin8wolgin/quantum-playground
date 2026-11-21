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
2. Quantum fluctuations and quantum states (next steps, see notes/decisions.md).
3. The gauge groups U(1), SU(2), SU(3): show what a group element does, with
   low-dimensional slices of SU(3). Spinor page: one rotation angle drives a
   belt trick (row of plates, untangle via R(s,u) = rot(x,θs/2)·rot(b(u),θs/2)),
   a Bloch sphere with a Penrose flag, the two spinor components as arrows, an
   SU(2) circle, and the neutron-interferometer curve (1 + cos(θ/2))/2.

Landing page `index.html`: the story "nature adds up phases" and one card per room.

Rules: label every panel as exact, simulation, interpretation or cartoon; sliders for the physics parameters (ħ, gravity, β, potential); every demo
shows one number that is checked against an exact answer; dark and light theme;
works on a phone.
