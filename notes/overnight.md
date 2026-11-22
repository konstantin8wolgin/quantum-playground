# Overnight work plan (2026-11-21 → 22)

The user asked: "continue working the whole night; the reset is at 2:30 am; continue automatically after the reset".
Rules for the night:
- Repo stays PRIVATE. Do not make it public, do not enable GitHub Pages. The user has not said yes to the MVP launch.
- Commit and push to the private repo after each finished item.
- Every room keeps the house style: honesty chips, one checked number, PHYSICS-CORE + node test, the how-to box and the guide (template `notes/guide-template.css`, reference `demos/double-slit.html`), glossary links only to IDs in `glossary.html`.
- Verify each new room yourself (node test + browser) before you mark it done. Workers' tests can pass by luck: check several seeds where randomness is involved.

## Backlog (mark [x] when done, with commit hash)
1. [x] (a7d1b4f) New room "Feynman diagrams for a real particle": 1D scattering, Born/Dyson series (each term = diagram with n kicks), partial sums vs exact transfer matrix. File `demos/born-series.html`.
2. [x] (0477485) New room "Paths that meet again": harmonic-oscillator propagator (all paths refocus at half a period, Mehler kernel) and the quantum carpet in a box (Talbot revivals). File `demos/quantum-carpet.html`.
3. [x] (74b6117) New room "Watching the slits": double slit with a which-path marker of adjustable strength; stripe visibility = |⟨χ₁|χ₂⟩|; the quantum eraser. File `demos/which-path.html`.
4. [x] (e1b5c03) QA pass: every room at 375 px width and in light theme; fix layout and contrast problems.
5. [x] (4b5a86b) Add the new rooms to `index.html` routes, README, PROMPT, decisions; glossary entries for any new terms.
6. [x] Final check (14/14 node tests pass, all links resolve, 17 rooms load at 375 px with no console errors): all node tests pass, all links resolve, commit and push (private).

## Backlog round 2 (added 23:45, optional, same rules)
7. [x] (2e909d7) New room "Feynman's checkerboard": a particle zig-zags at light speed on a space-time grid; each turn multiplies the amplitude by −iεm. The sum over zig-zag paths gives the 1+1D Dirac propagator. Check: path count/sum by dynamic programming vs exact Bessel-function propagator as ε → 0. File `demos/checkerboard.html`.
8. [x] (5da0a84) New room "From paths to Schrödinger": slice time into N steps, multiply short-time kernels (the path integral as a product), watch the result converge to the exact propagator (free particle, harmonic trap); error ∝ 1/N (Trotter). File `demos/time-slicing.html`.
9. [x] Integrate rooms 7–8 (16/16 tests pass, 19 rooms load at 375 px, links ok): index cards, glossary, README, PROMPT, decisions; all tests; commit and push (private).

## Backlog round 3 (added 00:30, optional, same rules)
10. [x] (11b1826) New room "Paths that wind around a ring": particle on a ring with a flux θ; paths fall into winding sectors n; Z(β) = Σ_n e^{iθn} e^{−S_n}; energy levels E_k(θ) = (k − θ/2π)²/2I from the winding sum (Poisson) vs exact; links Aharonov–Bohm, instantons, U(1). File `demos/winding-ring.html`.
11. [x] (f25ac5e) New room "A phase from the shape of the path" (Berry phase): a spin-½ follows a slowly turning magnetic field; after one loop it gains the phase −Ω/2 (Ω = solid angle); adiabatic Schrödinger run vs formula; the 2π-loop gives −1 like the spinor flag. File `demos/berry-phase.html`.
12. [x] Integrate rooms 10–11 (18/18 tests pass, 21 rooms load at 375 px, links ok).

## Round 4 (added 00:20): MVP readiness, no new rooms
13. [x] (ebc927d, d8bf2ab) Independent review of the 7 overnight rooms (which-path, born-series, quantum-carpet, time-slicing, checkerboard, winding-ring, berry-phase): physics errors, wrong claims, confusing text for a non-expert, broken controls. Reviewers report only; I check each finding and fix the real ones.
14. [x] (3cea7a6) Index with 21 cards: check that the routes still read as a story; add a short "start here" path for a first visit.
15. [x] Final (18/18 tests pass, 22 pages load at 375 px, links ok): all tests, link check, 375 px check, commit and push (private).
