# Browser simulations of lattice fields, quantum fluctuations and gauge fields as path phases

Research date: 2026-11-21. About 20 tool calls; shallow on some items (see Gaps). Facts marked "(own knowledge, unsourced)" appear only under Inferences.

## 1. Existing browser/lightweight sims: Ising, XY/KT, lattice phi^4, free-field vacuum, Casimir

### Takeaway
Ising and XY have several good browser demos (one WebGL XY under MIT). I found no browser phi^4 demo, no lattice free-field vacuum demo and no real Casimir simulator. These are open niches.

### Cited Findings
- kjslag/XY: WebGL XY model. Holding the mouse applies a force that attracts vortices and repels anti-vortices. MIT licence. Repo is centred on one index.html, 115 commits, 9 stars (low adoption); last-commit date not shown. Live: kjslag.github.io/XY. Single-file fit: likely, not confirmed — [GitHub](https://github.com/kjslag/XY)
- Controls include temperature and stiffness; each pixel is a spin coloured by direction — [search summary of kjslag.github.io/XY](https://kjslag.github.io/XY)
- ibiblio e-notes 2D Ising (WebGL2): GPU parallel update in chessboard order, Glauber/thermostat flip probability (not Metropolis), 32-bit LCG (1664525, 1013904223) seeded from Math.random(), 512x512 default, 1024x1024 variant, slider with Tc marker (Tc ~ 2.269). No source link or licence stated, but it is plain page source — [ibiblio ising.htm](https://ibiblio.org/e-notes/Perc/ising.htm)
- Same site has XY vortex pages (colour by angle, defects where all colours meet; vortices form and annihilate with temperature) — [xy1k](https://ibiblio.org/e-notes/Perc/xy1k.htm), [xy](https://www.ibiblio.org/e-notes/Perc/xy.htm)
- skal65535 WebGPU 3D Ising: compute shader, two sublattices by parity of x+y+z, per-spin Tausworthe RNG (3 u32 states, 24-bit output), T scan plotting |M| and Cv, Tc ~ 4.5115. No lattice size, benchmark, source link or licence on the page — [skal65535.github.io/ising](https://skal65535.github.io/ising/index.html)
- radames/Ising-Model-WebGL: MIT, HTML, last pushed 2017 (unmaintained). WebGL only draws points; the Monte Carlo likely runs on the CPU — [ecosyste.ms](https://awesome.ecosyste.ms/projects/github.com%2Fradames%2Fising-model-webgl)
- pappubahry WebGL physics: 10x10 Ising with nearest-neighbour correlations vs infinite-lattice result; three.js r81 (old), float-in-RGBA packing, lagged-Fibonacci RNG; source viewable, no licence — [pappubahry](https://www.pappubahry.com/misc/webgl/physics/)
- Other Ising pages seen only as search hits (not examined): visualize-it.github.io/ising_model, jkglasbrenner.github.io/ising-model-js, NetLogo Ising, a C++/WebAssembly + WebGL2 multi-million-spin app (Thomas Lang, source not confirmed) — [search results](https://github.com/oerpli/Ising)
- Clark University "Planar model" XY applet with KT exercises, last updated 2009, Java-era, likely dead — [Clark](https://stp.clarku.edu/simulations/xymodel/index.html)
- GPU checkerboard rationale: updating all sites at once is not a valid simulation; passes over alternating sublattices are required — [arXiv cs/0312006](https://arxiv.org/pdf/cs/0312006)
- Lattice phi^4 literature (no demos found): 2D phi^4 is in the 2D Ising class (gamma=7/4, nu=1) — [arXiv:2407.09856](https://arxiv.org/pdf/2407.09856); Binder cumulant locates the critical point — [arXiv:1406.7491](https://arxiv.org/pdf/1406.7491); Wolff cluster updates fight critical slowing down — [arXiv:hep-ph/0111010](https://arxiv.org/pdf/hep-ph/0111010); lattice kink masses from MC — [arXiv:0902.0367](https://arxiv.org/pdf/0902.0367), [arXiv:hep-lat/9811002](https://arxiv.org/pdf/hep-lat/9811002); lecture-style intro to MCMC for phi^4 — [core.ac.uk](https://core.ac.uk/download/288395158.pdf)
- Casimir: search found no interactive browser simulator; only papers and a plain-language IEEE overview — [IEEE Technav](https://technav.ieee.org/topic/casimir-effect/), [arXiv:2102.11326](https://arxiv.org/pdf/2102.11326)

### Inferences
- A WebGL2 fragment-shader Ising/XY at 128x128 is a solved pattern; the differentiator would be look (vortex-colour wheel, glow), not capability.
- Numbers to show (own knowledge, unsourced, verify before publishing): 2D Ising Tc = 2/ln(1+sqrt2) = 2.2692 and Onsager magnetisation (1 - sinh^-4(2/T))^(1/8); XY KT transition at T ~ 0.893 J with helicity-modulus jump 2/pi; Gaussian free scalar on lattice has exact <phi_x phi_y> = lattice propagator 1/(4 - 2cos kx - 2cos ky + m^2) in momentum space; 2D phi^4 critical point is Ising class (value of lambda_c depends on convention; compute with Binder cumulant U4 -> 0.61 at criticality, unsourced).
- Free-field vacuum fluctuations are easiest to do without Monte Carlo: sample the Gaussian field exactly via FFT with variance 1/(2 omega_k). Casimir: sum of mode energies between plates (zero-point energy with a regulator) gives E/A = -pi^2 hbar c/(720 d^3); for a 1+1D scalar, -pi hbar c/(24 d). Both are checkable numbers (own knowledge, unsourced).

### Gaps
- No browser lattice phi^4 / kink demo found; no Casimir demo found. Search may be incomplete (Shadertoy/Observable/CodePen not directly searchable here).
- Shadertoy: one hit, shadertoy.com/view/7lKSWW (cc0 claim on itch.io), content unverified.
- Frame rates for the demos above were not stated anywhere.

## 2. Lattice gauge theory visuals: U(1), SU(2)/SU(3), Wilson loops, Polyakov loops, flux tubes, topology, cooling

### Takeaway
Leinweber's Adelaide visualisations are the gold standard but are pre-rendered videos/GIFs, not interactive. I found no interactive browser lattice gauge MC with Wilson loops. This is the biggest gap in the market.

### Cited Findings
- Leinweber, "Visualizations of the QCD Vacuum" (2000): action and topological charge densities in 3D slices, instanton/anti-instanton annihilation, animated GIFs on his page; warns that cooling makes instantons appear to shrink and vanish, which is a misreading — [arXiv:hep-lat/0004025](https://ar5iv.labs.arxiv.org/html/hep-lat/0004025)
- Nobel lecture use: Wilczek used the animations in his December 2004 lecture — [Adelaide news](https://www.adelaide.edu.au/news/news3281.html)
- Biddle, Leinweber et al. 2019 review "Publicising Lattice Field Theory through Visualisation": action/topological-charge density, chromo-electric/magnetic fields (arrows in Landau gauge), centre clusters of local Polyakov loops (colour = nearest cube root of unity, evolve in HMC time and temperature), projected centre vortices with volume-rendered topological charge, QED+QCD vacuum. Flux tubes are not discussed there — [arXiv:1903.08308](https://ar5iv.labs.arxiv.org/html/1903.08308)
- Resources (videos, HD mp4 at physics.adelaide.edu.au/cssm/lattice/..., YouTube youtu.be/WZgZI5vymiM, KkiOQOOb69k, T4sRON6uOz0, CDdmx989quA, 9TJe1Pr5c9Q) and web archives: VisualQCD/QCDvacuum, VisualQCD/Nobel, VisualQCD/OriginMass under www.physics.adelaide.edu.au/theory/staff/leinweber/ — [arXiv:1903.08308](https://ar5iv.labs.arxiv.org/html/1903.08308). Licence not stated; treat as copyrighted, cite only, do not embed.
- Centre vortex visualisation in SU(3): Biddle, Kamleh, Leinweber, PRD 2020 — via [search result](https://arxiv.org/abs/1903.08308v1)
- Creutz 1980 "Monte Carlo study of quantized SU(2) gauge theory", PRD 21: fixes scale by string tension; Creutz ratios from double differences of log Wilson loops; 1985 DESY paper found string tension a factor 2 smaller than earlier work (caveat on comparing numbers) — [OSTI](https://www.osti.gov/biblio/5458175), [arXiv:hep-lat/9301010](https://arxiv.org/pdf/hep-lat/9301010v1)
- 3thanRam/MC-SU-2-gauge-cpp: C++ reproduction of Creutz 1980 with lattice size, beta and Wilson loop sizes; contents and licence not verified — [GitHub](https://www.github.com/3thanRam/MC-SU-2-gauge-cpp)
- Compact U(1) 4D, Wilson action: weak first-order transition at beta_c = 1.0111331(21) (another paper quotes 1.0111331(15)); confined phase has abundant monopoles, density drops above beta_c (Coulomb phase); finite 12^4 pseudo-critical beta = 1.010245(1) — [arXiv:hep-lat/0503024](https://arxiv.org/pdf/hep-lat/0503024), [arXiv:hep-lat/0205003](https://arxiv.org/pdf/hep-lat/0205003), [arXiv:2403.07739](https://arxiv.org/pdf/2403.07739), [arXiv:hep-lat/9802008](https://arxiv.org/pdf/hep-lat/9802008)
- Elysiatools "Wilson Loop Lab" (drag a rectangular loop on a 2D lattice, reads area and perimeter) appeared in search; page returned 404 on fetch, so unverified whether it is real MC or a toy — [search hit](https://elysiatools.com/en/math/wilson-loop)
- No hit for a WebGL/WebGPU lattice gauge, Hybrid Monte Carlo or lattice QCD browser project — [search](https://web.dev/blog/webgpu-supported-major-browsers)
- Production codes (not browser): QUDA, described as BSD-licensed and GPU backend for Chroma, MILC, BQCD, CPS (GitHub metadata shows "other", verify) — [LAP24 slides](https://indico.desy.de/event/45151/sessions/19197/attachments/92504/125254/LAP24-QUDA.pdf), [GitHub](https://github.com/lattice/quda); SIMULATeQCD, multi-GPU, MIT — [arXiv:2306.01098](https://arxiv.org/pdf/2306.01098); Grid, GPU-portable, licence not confirmed — [arXiv:2203.06777](https://arxiv.org/pdf/2203.06777). None adaptable to single-file HTML; useful only as algorithm references.

### Inferences
- A 2D or 3D compact U(1) or Z_N/SU(2) lattice at 128x128 (2D) is feasible; 4D SU(2) at 128^2 sites is not (use 3D slices, e.g. 24^3-32^3 with 4 or 8 time slices, or a 2D slice of a smaller 4D lattice).
- Exact checkable numbers (own knowledge, unsourced): in 2D compact U(1) with Wilson action, <W(R x T)> = (I1(beta)/I0(beta))^(RT) exactly, so area law and string tension sigma = -ln(I1/I0) are provable and MC-verifiable; this is the cleanest "one number" demo, and Wilson loops are literally phases picked up along a path. In 4D compact U(1) the number is beta_c ~ 1.0111 but needs 4D (e.g. 8^4 = 4096 sites is cheap on a GPU, shown as 2D slices) and hysteresis is subtle. SU(2) 4D: string tension from Creutz ratios, sqrt(sigma) = 440 MeV sets scale (own knowledge, unsourced).
- Cooling/gradient flow visual: start from hot lattice, apply APE smearing or Wilson flow as a shader pass, show plaquette-action density relaxing and topological charge density (2D U(1): Q = (1/2pi) sum of plaquette angles is an exact integer). Heed Leinweber's warning that instantons do not really "shrink" under cooling.
- Polyakov-loop centre-cluster images in SU(2)/Z2 at the finite-temperature transition are a striking, simple visual in 3D (Z2 gauge ~ 3D Ising dual).

### Gaps
- Could not verify flux-tube visual sources (Bali, Cea et al. etc. not searched); Leinweber's flux-tube work not found.
- No instanton / gradient-flow browser demos found; Wilson Loop Lab not verified; licence of the Adelaide material not stated.

## 3. Gauge field as a phase along a path: Aharonov-Bohm, Berry phase, holonomy, connections

### Takeaway
Aharonov-Bohm has a few browser/Mathematica demos; Berry phase and connection/fibre bundle visuals exist as lecture notes, but I found no interactive web visual of lattice parallel transport. Link variables U = exp(i a A) are the natural bridge.

### Cited Findings
- Elysiatools AB simulator: browser-based, flux Phi/Phi0 (-2 to +2), wavelength, slit separation, presets, particle paths, vector-potential field lines; licence/source unknown — [Elysiatools](https://elysiatools.com/en/visualizations/aharonov-bohm)
- Wolfram Demonstrations AB effect needs CDF Player or Mathematica — [Wolfram](https://demonstrations.wolfram.com/AharonovBohmEffect/)
- Morris and Styer InterferenceSimulator (Oberlin) includes an AB mode; browser support unknown — [PDF](https://isis2.cc.oberlin.edu/physics/dstyer/ThePhysicsOfQM/InterferenceSimulator.pdf)
- Berry phase as holonomy of parallel transport in a fibre bundle; Ehresmann connection splits horizontal/vertical subspaces; sphere example of classical holonomy; Hopf fibration and Berry phase — [arXiv:1408.6867](https://arxiv.org/pdf/1408.6867), [Warwick thesis](https://text.www2.warwick.ac.uk/fac/sci/masdoc/people/studentpages/students2014/connellan/spheres.pdf), [Cornell lecture](https://sethna.lassp.cornell.edu/Teaching/QuantumI/Lectures/05.5_ParallelTransport.pdf)
- wpm/QED: a single-file browser game about gauge invariance; licence and details unverified — [GitHub](https://github.com/wpm/QED)

### Inferences
- A lattice AB demo: a 128x128 split-step Schrodinger (or 2D wave) simulation where the hopping term carries a Peierls phase exp(i theta_link) from a thin flux tube. Check number (own knowledge, unsourced): fringe shift = Phi/Phi0 fringe spacings; interference pattern period in flux h/e; also gauge invariance test: changing gauge (A -> A + grad chi) leaves intensity unchanged while the phase map changes.
- "Holonomy as colour": draw each plaquette as colour = arg of plaquette product (phase wheel). Flux = sum of plaquette angles, quantised in units of 2pi for the vortex or topological charge. Berry-phase tie-in: solid angle/2 on Bloch sphere.
- The same Peierls phase links the AB demo, the XY vortex demo and compact U(1) gauge theory in one visual language (U(1) phases on links), which could unify the catalogue.

### Gaps
- No interactive web demo found for parallel transport / fibre bundle / Berry phase (search only returned papers); not checked on Observable, GeoGebra, or YouTube.
- Elysiatools simulator not inspected for correctness.

## 4. GPU techniques, pitfalls, WebGPU status

### Takeaway
WebGPU is shipping in all four major engines as of the latest source found (Nov 2025 web.dev), but Android and Linux coverage is patchy. Single-file demos should use WebGL2 (universal) with a WebGPU option only as bonus. Checkerboard updates and per-site RNG state are the standard recipe.

### Cited Findings
- web.dev (Nov 2025): WebGPU supported in Chrome/Edge (113 originally; English page lists 144 for some platforms, other translations 113 — conflict), Firefox 141 on Windows with macOS ARM64 from 145, Linux/Android/Intel Mac in progress, Safari 26 on macOS Tahoe, iOS/iPadOS/visionOS 26; Chrome Android since 121 needs Android 12+ with Qualcomm/ARM GPUs — [web.dev](https://web.dev/blog/webgpu-supported-major-browsers)
- No 2026-specific update found by search; status after Nov 2025 unverified — [web.dev](https://web.dev/blog/webgpu-supported-major-browsers)
- Compute shaders offer workgroup shared memory useful for stencils — [Chrome developers](https://developer.chrome.com/docs/capabilities/web-apis/gpu-compute), [MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)
- Pitfalls evidenced: simultaneous all-site update is invalid (checkerboard needed) — [arXiv cs/0312006](https://arxiv.org/pdf/cs/0312006); poor RNG (LCG) used in the ibiblio page, with per-spin Tausworthe in the WebGPU one; WebGL1-era demos pack floats into RGBA8 — [pappubahry](https://www.pappubahry.com/misc/webgl/physics/); critical slowing down needs cluster updates — [arXiv:hep-ph/0111010](https://arxiv.org/pdf/hep-ph/0111010)

### Inferences
- WebGL2 float textures (RGBA32F with EXT_color_buffer_float) with ping-pong framebuffers: each pass updates one colour of the checkerboard (for gauge links in d dims, loop over direction and parity: 2d sub-passes). 128x128 is tiny; thousands of sweeps per frame are feasible, so look, not speed, is the constraint.
- Better RNG for shaders: PCG or xorshift hash of (site, sweep, seed) (own knowledge, unsourced); avoid LCG low-bit correlations; avoid float32 accumulation of observables (use reductions via mip-map or readback of small summed buffers).
- Heat-bath for SU(2) (Kennedy-Pendleton/Creutz) is branchy (rejection loops) in shaders; use Metropolis with fixed iteration count or overrelaxation (branch-free, microcanonical) mixed with Metropolis. HMC needs matrix exponentials and many passes; skip for the demo (own knowledge, unsourced).
- Z2/Z_N and U(1) (angle) are the shader-friendliest groups; SU(2) as unit quaternion (4 floats per link) is the next step; SU(3) is heavy in fragment shaders.

### Gaps
- 2026 WebGPU status (Firefox Linux/Android, Chrome Android coverage) not confirmed; caniuse/MDN not fetched.
- No measured performance figures for any browser lattice code were found.
- Hybrid Monte Carlo in browser: no existing implementation found.

## 5. Reusable open-source repos and single-file adaptability

### Takeaway
Few usable repos exist. Only kjslag/XY (MIT) and radames/Ising-Model-WebGL (MIT, 2017) have clear licences; most others have none stated, so write demos fresh and reuse only ideas.

### Cited Findings
- kjslag/XY — MIT, WebGL, near single-file; adaptable (likely yes) — [GitHub](https://github.com/kjslag/XY)
- radames/Ising-Model-WebGL — MIT, last push 2017, CPU MC, unmaintained; adaptable but weak — [ecosyste.ms](https://awesome.ecosyste.ms/projects/github.com%2Fradames%2Fising-model-webgl)
- ibiblio e-notes pages — no licence; page-source, single HTML, WebGL2; inspiration only — [ibiblio](https://ibiblio.org/e-notes/Perc/ising.htm)
- skal65535 WebGPU Ising — no licence/source link, single page; inspiration only — [skal65535](https://skal65535.github.io/ising/index.html)
- pappubahry — three.js r81, no licence; outdated — [pappubahry](https://www.pappubahry.com/misc/webgl/physics/)
- Production codes QUDA (BSD claimed), SIMULATeQCD (MIT), Grid (unconfirmed): not adaptable to a browser (CUDA/C++), reference only — see section 2.
- Leinweber videos: no licence found; do not embed.
- Textbook references: Creutz 1980 PRD 21 (above); Tong's lecture notes, Kogut review, Creutz book "Quarks, Gluons and Lattices" — not fetched in this pass.

### Inferences
- Recommended demos (ranked by looks and checkable number; numbers own-knowledge, unsourced):
  1. "Phase wheel vortices" XY at 128x128 (KT, T_KT ~ 0.893; vortex count and helicity modulus; kjslag as MIT reference).
  2. 2D compact U(1) gauge field: plaquette-phase colour, Wilson loops with area law, check <W> = (I1/I0)^area; exact and elegant.
  3. Aharonov-Bohm ring/slits on a lattice with Peierls phases: fringe shift vs flux, gauge-transformation toggle.
  4. Free scalar / phi^4 vacuum field with correlation length and Binder cumulant: 2D Ising universality, with kink-antikink domain walls in the broken phase.
  5. Casimir plates as mode-sum visual: E ~ -pi^2/(720 d^3) (3D EM) or -pi/(24 d) (1+1D scalar).
  6. 3D Z2 or SU(2) Polyakov/centre-cluster visual at the deconfinement transition (stretch goal).
- All are feasible as one HTML file with WebGL2 and no libraries; WebGPU optional.

### Gaps
- GitHub search was not directly possible (GitHub MCP failed); coverage of GitHub is via web search only, so the repo list is incomplete.
- Tong's notes URL, Kogut review and Creutz book not checked.
