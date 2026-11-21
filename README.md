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

Start at [`index.html`](index.html). Open any file in a browser. No install, no server.

## Checks

Each demo compares the simulation with an exact answer on the page.
Example: `<x²>` from random paths (0.496) vs. transfer matrix (0.4995) for the
harmonic oscillator at β = 8, ħ = 1. Double slit at λ = 8, d = 40: stripe
distance 73.5 (simulation) vs. 72.0 (path sum) vs. 71.2 (λL/d). Spinor:
interference I(360°) = 0.000, I(720°) = 1.000; the belt untangles at 720° with
the box still (0.0°), but at 360° the box must turn (180° at the midpoint).

## Rebuild it yourself

See [`PROMPT.md`](PROMPT.md) for the prompt and [`DATA.md`](DATA.md) for the data.
