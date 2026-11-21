# Path integrals and QM basics: existing visualizations, code and demo ideas

Scope note: ~20 tool calls (search snippets plus 4 page fetches). Licences are mostly UNVERIFIED; claims below say so. Items marked "idea" are my design suggestions, not sourced facts.

## 1. Real-time and imaginary-time path integral treatments

### Takeaway
Real-time "arrows/phasor" treatments exist mainly as GeoGebra pages, a Maple worksheet and teaching software (E. Taylor). I found no polished, modern, browser-native sum-over-paths demo (Cornu spiral, stationary phase, double slit built from paths). I found no interactive imaginary-time PIMC, instanton or ring-polymer web demo either, only lecture notes and notebooks. This is the clearest gap for the museum.

### Cited Findings
- GeoGebra "Young's experiment" shows the phasor for each path and their sum in a second window. — [GeoGebra](https://www.geogebra.org/m/GALGGPlo)
- GeoGebra "Sum over paths method" follows Feynman's QED, with movable points A, B, M1, M2, C and adjustable phases. — [GeoGebra](https://mat.geogebra.org/m/PEfGzNVN)
- York University Maple worksheet sums N paths through an aperture for Fraunhofer diffraction (default 40 paths, adjustable slit width). Not a native web app. — [York U](https://www.yorku.ca/marko/ComPhys/FraunhoferFeynman/FraunhoferFeynman.html)
- Taylor et al., "Teaching Feynman's sum-over-paths quantum theory" includes a computer interface where students pick paths and watch the resulting arrow. Taylor's REFLECT (partial reflection from glass) and OnePhoton exercises come with this software. Technology of the programs is not stated, probably old desktop. — [Taylor OnePhoton exercises](https://www.eftaylor.com/software/OnePhotonExercises.pdf), [REFLECT exercises](https://www.eftaylor.com/software/ReflectExercises.pdf)
- Sitsanlis and Polatoglou (2022, Greek-language paper) describe HTML5 simulations of reflection from the QED viewpoint. — [paper](https://eproceedings.epublishing.ekt.gr/index.php/cetpe/article/download/4124/4050/10429)
- I found no ready-made HTML5 port of the classic "little arrows" reflection program in the searches I ran (not exhaustive). — same search, see above
- Tactile phasor wheels exist for teaching photon amplitude summation (Choudhary and Blair). — [sciforum paper](https://sciforum.net/paper/view/9314)
- Imaginary time: UNIVIE tutorial maps a quantum particle to a P-bead ring polymer. — [Vesely tutorial](https://homepage.univie.ac.at/franz.vesely/cp_tut/nol2h/new/c7qm_s2pim.html)
- Illinois PHYS466 project: each quantum particle is a ring polymer of N beads; quantum kinetic energy becomes harmonic springs between beads. — [Illinois](https://courses.physics.illinois.edu/phys466/sp2011/projects/2007/team_pimc/pimc.html)
- Tao Pang (UNLV) links original Java PIMC code (hard-sphere bosons in a trap, not a single oscillator). Old Java. — [UNLV](https://www.physics.unlv.edu/~pang/pimc.html)
- UCSD Lab 15 covers MCMC for the discretized imaginary-time harmonic-oscillator path integral (Jupyter, good algorithm reference). — [UCSD lab](https://jduarte.physics.ucsd.edu/phys142/labs/lab15/Lab15.html)
- Westbroek et al. "User's guide to Monte Carlo methods for evaluating path integrals" uses the harmonic oscillator as worked example. — [arXiv 1712.08508](https://ar5iv.labs.arxiv.org/html/1712.08508)
- nanoHUB PIMC tool (login required, expert interface). — [nanoHUB](https://nanohub.org/resources/3690)
- Double-well instantons: the lattice study hep-lat/0411010 shows sampled Euclidean paths with cooled paths overlaid; lecture notes cover instanton as an inverted-potential classical path. No interactive version found. — [hep-lat/0411010](https://arxiv.org/pdf/hep-lat/0411010), [Usami notes](https://www.qipe.t.u-tokyo.ac.jp/lec_2017a_cond/2017_10_16_3.pdf), [arXiv 1209.1315](https://arxiv.org/pdf/1209.1315)
- Feynman-Kac: with potential V, weight exp(-integral V) damps paths for V>0 and amplifies for V<0; free case gives the Gaussian heat kernel. Plain Brownian sampling undersamples localised potentials. No interactive demo found. — [arXiv 2204.12836 (Quantum journal paper)](https://quantum-journal.org/papers/q-2022-06-07-730/pdf/), [arXiv 2304.10518 worldline MC](https://ar5iv.labs.arxiv.org/html/2304.10518)

### Inferences
- A single page that turns a "Wick rotation" slider (t to -i tau) into a morph from oscillating arrows to decaying Brownian-weighted paths would be novel; I found nothing like it.
- Idea: real-time page with N paths (via a mirror, slit screen or free propagation), per-path arrows stacked head to tail into a Cornu/Euler spiral, and a slider for hbar (or mass). Stationary phase appears when the cancelling arrows curl up and only the straight-line neighbourhood survives.
- Idea: imaginary-time page runs live Metropolis on a ring of ~64 beads in a harmonic or double-well potential, with sliders for temperature (beta), mass and well barrier. Show the histogram converging to |psi0|^2 and the path "tunnelling" between wells (instanton kinks). Cheap in plain JS (no GPU).
- Idea: Brownian-bridge particle cloud with a V(x) painted by the user and survival weights shown by opacity (Feynman-Kac).

### Gaps
- Could not verify whether any current web demos of Cornu-spiral/stationary-phase path sums exist outside GeoGebra. Searching Observable and Shadertoy directly was not done.
- No licence info for the GeoGebra items (GeoGebra materials are typically user-contributed; check each).

## 2. Wave-packet / Schrodinger flow, double slit, simulators

### Takeaway
The wave-packet space is well populated. The best open reusable GPU codebases are marl0ny's WebGL split-operator/Crank-Nicolson simulators. Falstad, Schroeder, QuVis and PhET are excellent as design references but source reuse is unclear or licence-restricted. No in-browser Bohmian double-slit demo was found.

### Cited Findings
- marl0ny (marl0ny.github.io) lists a WebGL "Single Particle QM in 2D" (user-drawn barriers), a WebGL split-operator 2D linear/nonlinear Schrodinger demo, a very heavy 3D version, WASM "Stationary Eigenstates in 2D" and "Coupled Quantum Harmonic Oscillators", plus Python GUI QM-Simulator-1D. — [marl0ny.github.io](https://marl0ny.github.io)
- QM-Simulator-2D repo: WebGL, dat.gui, stats.js, jszip; Crank-Nicolson and split-operator; 89 commits, 43 stars; licence file exists but type not shown in what I fetched; multi-file (HTML, shaders folder, Python shader generator), includes a relativistic Dirac page. — [GitHub](https://github.com/marl0ny/QM-Simulator-2D)
- marl0ny's "ees-2d" UI is explicitly based on Falstad's apps. — [ees-2d](https://marl0ny.github.io/ees-2d/)
- Falstad's 2D applets (circular well, 2D oscillator, box) are mostly ported from Java to JavaScript (credited to Bob Hanson's team). I found no public GitHub source for them. — [Falstad 2D oscillator](https://falstad.com/qm2dosc), [Falstad 2D box](https://www.falstad.com/qm2dbox/)
- Daniel Schroeder's Weber State apps (HTML5/JS): Wavepackets, Barrier Scattering, Bound States 2D, Entanglement in a Box, Quantum Scattering 2D, Colliding Wavepackets (two-particle entanglement through interaction), Matrix Diagonalization Visualized, Spins Laboratory (linked Stern-Gerlach, spin-1/2 and spin-1). No licence named for the apps. His tutorial for writing such apps is MIT-licensed per search snippet. — [Schroeder software](https://physics.weber.edu/schroeder/software), [tutorial PDF](https://physics.weber.edu/schroeder/html5/TutorialPacket.pdf)
- Other WebGL/JS Schrodinger pages: nazat02 Quantum Tunneling (WebGL + Three.js, split-operator, reports tunnelling probability, source not confirmed); Schrodinger Playground (mikaberidze); Codeberg maunke/quantum-simulation (JS + HTML, said to be rebooting in Q1 2026); davidar "Shaders of Schrodinger" (GLSL blog). — [nazat02](https://nazat02.github.io/Quantum-Tunneling/), [Schrodinger Playground](https://mikaberidze.github.io/schrodinger/about), [Codeberg](https://codeberg.org/maunke/quantum-simulation), [davidar](https://davidar.github.io/post/quantum-glsl), [ibiblio WebGL Schrodinger](https://www.ibiblio.org/e-notes/webgl/gpu/schrodinger.htm)
- QuVis (St Andrews, Antje Kohnle): 90+ research-based HTML5 simulations since 2009, advanced school to advanced undergraduate; evaluated with student studies. Licence/source not stated in what I found. — [QuVis about](https://st-andrews.ac.uk/physics/quvis/about.html), [arXiv 1501.07905](https://arxiv.org/pdf/1501.07905)
- PhET Quantum Wave Interference: source at phetsims/quantum-wave-interference (HTML5). Ecosyste.ms lists gpl-3.0 (unverified; PhET sims are commonly GPL-3 or MIT, check the LICENSE). README says "under development" while a teacher guide appears to treat it as published (conflict). — [aggregator](https://awesome.ecosyste.ms/projects/github.com%2Fphetsims%2Fquantum-wave-interference), [PhET sim](https://phet.colorado.edu/en/simulations/quantum-wave-interference)
- Bernd Thaller, Visual Quantum Mechanics (Springer 2000): about 320 QuickTime movies on CD-ROM, popularised modulus-plus-phase colouring (complex colour wheel) of wave functions. Old media (not browser). — [Springer](https://link.springer.com/book/10.1007/b98962), [Graz VQM](https://vqm.uni-graz.at/articles/dirac1/movies.html)
- Bohmian double slit: only Wolfram Demonstrations (need Wolfram Player/cloud) and academic papers found. No JS demo found. — [Wolfram triple slit](https://demonstrations.wolfram.com/TripleSlitExperimentInTheCausalInterpretation/), [arXiv 1705.02916](https://arxiv.org/pdf/1705.02916)
- Quantum Flytrap Virtual Lab: free for teaching; engine described as proprietary; screenshots reusable under CC BY; open TypeScript packages Quantum Tensors and BraKetVue (licence badge present, name not confirmed). Photons/optics/Mach-Zehnder oriented, not wave-packet. — [Virtual Lab](https://quantumflytrap.com/virtual-lab), [arXiv 2203.13300](https://arxiv.org/pdf/2203.13300), [quantum-tensors](https://github.com/Quantum-Flytrap/quantum-tensors)
- Split-operator method reference papers: [arXiv 1306.3247](https://ar5iv.arxiv.org/html/1306.3247), [arXiv 2004.10046](https://arxiv.org/pdf/2004.10046).

### Inferences
- Idea (strong, cheap): double slit via split-operator in WebGL2/WebGL1 with complex phase colouring (Thaller) AND an overlaid probability-current streamline/Bohmian-particle layer. Streamlines are v = (hbar/m) Im(grad psi / psi), computed on the GPU. This combination appears to be missing as an in-browser tool.
- Single-file feasibility: a 2D FFT-free Crank-Nicolson/ADI or Visscher leapfrog scheme fits in one HTML file with ~150 lines of shader. marl0ny's code uses a shader folder + generator, so adapting means inlining shaders (possible but needs licence check).
- Falstad and Schroeder are best treated as UX references (parameter panels, phase colouring) rather than code sources, since no licence/source statement was found.

### Gaps
- Licences of all marl0ny repos, QuVis, Schroeder apps, Falstad were not confirmed. Last-commit dates not obtained.
- Did not check Shadertoy for existing Schrodinger/double-slit shaders in detail.
- Did not check WebGPU-specific quantum demos.

## 3. Observables, commutators, uncertainty, Wigner, spin, entanglement

### Takeaway
Spin/Stern-Gerlach and entanglement have decent web demos (Schroeder, Flytrap, QuVis). Intuitive demos of commutators ("what an observable is") are scarce; what exists is mostly Wolfram Demonstrations, Jupyter notebooks and text. Wigner-function demos in the browser are also scarce.

### Cited Findings
- Schroeder's Spins Laboratory simulates linked Stern-Gerlach devices (spin-1/2 and spin-1): a direct, hands-on way to feel non-commuting measurements. — [Schroeder](https://physics.weber.edu/schroeder/software)
- Schroeder's Entanglement in a Box and Colliding Wavepackets show two-particle entanglement in position space. — [Schroeder](https://physics.weber.edu/schroeder/software)
- Schroeder's Matrix Diagonalization Visualized rotates the basis until the Hamiltonian is diagonal: a nice "eigenbasis = observable" picture. — [Schroeder](https://physics.weber.edu/schroeder/software)
- QuVis two-level-system simulations were evaluated for student learning. — [arXiv 1501.07905](https://arxiv.org/pdf/1501.07905)
- Wolfram Demonstration on uncertainty product for angular momentum components uses the commutator bound. — [Wolfram](https://demonstrations.wolfram.com/UncertaintyProductForAngularMomentumComponents/)
- U-Tokyo "Quantum & Wave Lab" has interactive applets including an uncertainty principle one (not inspected). — [U-Tokyo](https://opes.c.u-tokyo.ac.jp/spinchem/en/resources/pedagogy/quantum-wave-lab/index.html)
- Coe College (Piper) has an interactive module on uncertainty with complex wave functions. — [Piper](https://chemistry.coe.edu/piper/posts/visualization-of-uncertainty-principle/index.html)
- Wigner functions: QuTiP lecture gallery (Python, Jupyter, includes coherent/squeezed states and interactive phase change), TU Delft interactive textbook chapter on oscillator Wigner functions, Strawberry Fields Plotly plots, QMwebJS (JS library, Mathematics 2020, unverified if it covers Wigner). No dedicated JS coherent/squeezed Wigner demo found. — [QuTiP lecture 16](https://nbviewer.hrz.uni-marburg.de/github/jrjohansson/qutip-lectures/blob/master/Lecture-16-Gallery-of-Wigner-functions.ipynb), [TU Delft](https://interactivetextbooks.tudelft.nl/qsm/src/5_wigner_2.html), [Strawberry Fields](https://strawberryfields.readthedocs.io/en/latest/_modules/strawberryfields/plot.html), [Mathematics 2020 via DOAJ](https://doaj.org/article/8bb59a8b503d4c5c8b92b9e099e7aac8)
- Phase-space visualization reference: "Visualizing quantum mechanics in phase space". — [arXiv 1101.2683](https://arxiv.org/pdf/1101.2683)
- wgxli/atomic-coherent-states on GitHub (spin coherent states visualisation; licence not checked). — [GitHub](https://github.com/wgxli/atomic-coherent-states)

### Inferences
- Idea: "Observable as a lens" page. A state is shown as a wave (or Bloch sphere). The user picks an observable (position, momentum, spin-x/z) and sees the corresponding histogram of repeated measurements building up. Apply x then p then x again to show the commutator as a visible kick to the state (a "commutator = order matters" demo using two measurement boxes in either order).
- Idea: Wigner-function panel linked live to the wave packet with sliders for displacement and squeezing. Analytic Gaussian Wigner is trivial to compute; for arbitrary psi use the discrete Wigner integral on a 128-point grid in JS (O(N^2 log N) with FFT, or O(N^3) naive; fine for N<=128). Showing negativity for Fock/cat states is a striking hook.
- Idea: Bloch sphere + Stern-Gerlach chain (z, x, z) with counts accumulating; ties to the commutator.

### Gaps
- No evidence found of a well-known interactive demo that makes commutators intuitive; I did not systematically search PhET/QuVis catalogues for it.
- Did not search for hydrogen-orbital or spin-coherent web demos beyond atomic-coherent-states.

## 4. Reusable open-source code (summary table; single-file feasibility)

| Resource | Tech | Licence | Single-file adaptable? |
|---|---|---|---|
| [marl0ny/QM-Simulator-2D](https://github.com/marl0ny/QM-Simulator-2D) | WebGL, dat.gui | LICENSE exists, type unverified | Probably, after inlining shaders; check licence |
| marl0ny split-operator-simulations (2D/3D; repo link not shown on the page I fetched) | WebGL | unknown | Likely similar |
| marl0ny ees-2d, 1D-Coupled-Oscillators | WebAssembly | unknown | Harder (WASM), could embed base64 |
| [Quantum-Flytrap/quantum-tensors](https://github.com/Quantum-Flytrap/quantum-tensors) | TypeScript | badge shown, name unconfirmed | Bundle needed; heavy for a single file |
| [phetsims/quantum-wave-interference](https://github.com/phetsims/quantum-wave-interference) | HTML5 (PhET framework) | GPL-3.0 per aggregator (unverified) | No (framework build); GPL also viral |
| Schroeder tutorial | HTML5/JS | MIT (per snippet) | Yes as a template; apps themselves have no stated licence |
| Falstad apps | Java and JS | no public source found | No |
| [wgxli/atomic-coherent-states](https://github.com/wgxli/atomic-coherent-states) | not checked | not checked | unknown |
| Codeberg maunke/quantum-simulation | JS + HTML | unknown | Likely |

### Inferences
- Given licence uncertainty and the museum's single-file goal, writing fresh shaders (split-operator or Crank-Nicolson, ~200 lines) is probably cleaner than adapting any repo; use these repos as algorithm references.

### Gaps
- Licence types, last-commit dates and repo URLs for several marl0ny projects were not retrieved. A pass with `gh api repos/<owner>/<repo>/license` would settle this quickly.

## 5. Ranked demo ideas (my synthesis, not sourced)
1. Real-time sum-over-paths: arrows to Euler spiral to stationary phase; slit/mirror toggles and hbar slider. Cheap (Canvas 2D). Gap in existing coverage.
2. Imaginary-time ring polymer / double-well instantons with live Metropolis, temperature and barrier sliders; "Wick rotation" morph to real time. Cheap (JS) and novel.
3. Double slit via WebGL split-operator with phase colour plus Bohmian/probability-current streamlines; slider for slit width, spacing, momentum. Visually striking; moderate (WebGL2).
4. Commutator/measurement-order sandbox (Stern-Gerlach chain plus Wigner function side panel).
5. Feynman-Kac cloud: Brownian particles weighted by painted potential, showing ground-state emergence (diffusion Monte Carlo). Cheap.
