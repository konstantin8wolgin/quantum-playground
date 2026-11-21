# Quantum Playground

A hobby playground to build intuition for path integrals, quantum fluctuations,
quantum states, and the Lie groups of the Standard Model (U(1), SU(2), SU(3)).
Not research. The aim: change parameters, watch what happens, understand it.

## Demos

| Demo | What it shows |
|---|---|
| [`demos/path-integral.html`](demos/path-integral.html) | Real-time sum over paths (arrows, Cornu spiral, classical limit) and imaginary-time Monte Carlo (harmonic oscillator, double well, tunneling) |

Open any demo file in a browser. No install, no server.

## Checks

Each demo compares the simulation with an exact answer on the page.
Example: `<x²>` from random paths (0.496) vs. transfer matrix (0.4995) for the
harmonic oscillator at β = 8, ħ = 1.

## Rebuild it yourself

See [`PROMPT.md`](PROMPT.md) for the prompt and [`DATA.md`](DATA.md) for the data.
