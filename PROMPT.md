# Prompt

Build a set of single-file HTML demos (no build step, no external libraries)
that give intuition for:

1. Path integrals. Real time: every path is a unit arrow turned by S/ħ; show the
   arrows added head to tail (Cornu spiral) and the band of paths that survive
   (stationary phase). Imaginary time: sample closed paths with weight e^(−S_E/ħ)
   by Metropolis; compare the histogram with an exact transfer-matrix |ψ|².
2. Quantum fluctuations and quantum states (next steps, see notes/decisions.md).
3. The gauge groups U(1), SU(2), SU(3): show what a group element does, with
   low-dimensional slices of SU(3).

Rules: sliders for the physics parameters (ħ, gravity, β, potential); every demo
shows one number that is checked against an exact answer; dark and light theme;
works on a phone.
