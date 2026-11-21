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
5. [x] Add the new rooms to `index.html` routes, README, PROMPT, decisions; glossary entries for any new terms.
6. [ ] Final check: all node tests pass, all links resolve, commit and push (private).
