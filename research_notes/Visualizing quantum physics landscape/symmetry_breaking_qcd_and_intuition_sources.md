# Symmetry breaking, Goldstone/Higgs, QCD interactions, and intuition-first sources

Scope note: about 15 tool calls. Search was US-only and snippet-based, so many catalogue items are leads, not verified tools. Items without a fetched page are marked "unverified". Uncited background knowledge appears only under Inferences or Gaps.

## 1. Existing visualizations, simulations and analogies (catalogue with URLs, licences, tech)

### Takeaway
Browser demos exist for the XY model and for the Mexican-hat potential, but I found no polished browser demo of the Abelian Higgs mechanism ("Goldstone mode eaten by the gauge field") and no interactive QCD flux-tube or Lund-string demo. The QCD material is mostly lattice animations (Leinweber) and one Wikipedia string-breaking animation.

### Cited Findings
- kjslag XY model: WebGL simulation of the classical XY model with soft spins. Each pixel is a spin coloured by direction. Holding the mouse attracts vortices and repels antivortices. Controls: stiffness, thermal coupling, temperature, force strength, time step, steps per frame, grid sizes up to 2048x1024. The demo page states no licence; check the repo for one. Tech: WebGL. — [demo](https://kjslag.github.io/XY), [repo](https://github.com/kjslag/XY)
- The kjslag demo has no explicit quench or cooling-rate control in what I read. A Kibble–Zurek version would need an added temperature ramp. — [demo](https://kjslag.github.io/XY)
- Search found no dedicated browser Kibble–Zurek demo. Kibble–Zurek vortex-density scaling in 2D and 3D XY models is confirmed in simulation papers. — [arXiv 2105.11680](https://arxiv.org/pdf/2105.11680v3); search result on [XY simulations](https://web3.arxiv.org/pdf/2507.16168)
- Cambridge "Higgs Simulator" (Lester group): has a manual and a "Theoretical Background" PDF noting the complex scalar potential is Mexican-hat shaped. Search summary describes adjustable mass and quartic parameters and an interaction term, apparently a scalar-field wave-packet tool, not a gauge-field Higgs model. The platform, tech and licence are not established (my fetch returned only a PDF image). — [manual](https://www.hep.phy.cam.ac.uk/~lester/higgs-simulator/manual.pdf), [background](https://www.hep.phy.cam.ac.uk/~lester/higgs-simulator/Theoretical_Background.pdf)
- Wolfram Demonstrations "The Higgs Particle": simplified interactive model with a downloadable source notebook. Wolfram Player or Cloud is needed; the licence is Wolfram's own terms (unverified). — [demo](https://demonstrations.wolfram.com/TheHiggsParticle/)
- Homo Deus Lab: a site listing "Higgs Field & Symmetry Breaking" and "Quark Confinement" simulators. The quark-confinement page covers Cornell potential, flux tubes, string breaking and asymptotic freedom. The simulator is embedded by iframe and showed only "Loading simulation..." in my fetch, so I could not assess it. Code is said to be in GitHub `homo-techno/simulations`, package `quark-confinement`. No licence is named on the page. Updated 2026-03-20. Treat quality as unverified. — [page](https://homo-deus-lab.pages.dev/lab/particle-physics/quark-confinement/), [Higgs listing](https://homo-deus-lab.pages.dev/lab/particle-physics/)
- Elysia Tools: "Linear Sigma Model" visualization showing the Mexican hat, Higgs mode versus Goldstone bosons (from search snippet only; unverified). — [listing](https://elysiatools.com/en/visualizations/categories/Math?page=6)
- Imaginary.org has a "Higgs Potential" item (snippet only; unverified). — [link](https://www.imaginary.org/fr/node/963)
- Blog series "Illustrating the Higgs mechanism" (freethoughtblogs, 2016) exists as a visual explainer (unverified content). — [link](https://freethoughtblogs.com/atrivialknot/2016/06/27/illustrating-the-higgs-mechanism-part-1)
- Leinweber (Adelaide) QCD-vacuum animations: 2000 paper "Visualizations of the QCD Vacuum" shows action and topological-charge density slices and instanton behaviour under cooling. A 2018 proceedings paper reviews chromo-electromagnetic field structure, centre-vortex evolution at finite temperature and QED+QCD field correlations. Animations are on YouTube. Also a flux-tube still image between two quarks, and stereoscopic chromo-magnetic field images. They are videos and images, not interactive. Licences not stated. — [hep-lat/0004025](https://arxiv.org/pdf/hep-lat/0004025), [arXiv 1903.08308](https://arxiv.org/abs/1903.08308v1), [PoS](https://pos.sissa.it/334/325/pdf), [arXiv 2009.12044](https://pdf.arxiv.org/pdf/2009.12044), [flux-tube image](https://www.adelaide.edu.au/adelaidean/image5403/flux_tube.jpg.html), [center vortices](https://digital.library.adelaide.edu.au/dspace/bitstream/2440/127544/2/hdl_127544.pdf)
- Wikipedia "Color confinement" has an animation of a gluon tube lengthening until it snaps into a new quark-antiquark pair, and gives the Cornell potential V(r) = -4 alpha_s/(3r) + sigma r with sigma about 1 GeV/fm. The image licence is not confirmed; check its Commons page. Wikipedia text is CC BY-SA. — [article](https://en.wikipedia.org/wiki/Color_confinement)
- Lund string model: space-time hadronization picture by Ferreres-Solé and Sjöstrand is implemented in Pythia (open source, GPL-family licence per Pythia project; not verified here). No interactive Lund visualization found. — [arXiv 1808.04619](https://arxiv.org/pdf/1808.04619), [PYTHIA 8.3 guide](https://arxiv.org/pdf/2203.11601)
- The 1+1D Schwinger model shows confinement and string breaking with a linear potential, like QCD. It is the standard toy model for a string-breaking demo. — [arXiv 2509.03586](https://arxiv.org/pdf/2509.03586), [arXiv 1509.00246](https://arxiv.org/pdf/1509.00246)
- Lattice studies of flux-tube structure in full QCD exist and give real data for pictures. — [arXiv 2409.20168](https://arxiv.org/pdf/2409.20168), [arXiv 2003.07244](https://arxiv.org/pdf/2003.07244)
- Helmut Linde, "A New Way of Visualizing Quantum Fields": overlays random classical states of a chain of coupled oscillators with a grayscale wave-function density, so particles appear as excitations of a chain. Eur. J. Phys. 39(3). Good intuition for free fields; no gauge or QCD content. — [arXiv 1907.11311](https://arxiv.org/abs/1907.11311)
- Hybrid analog-digital simulation of the Abelian Higgs model (2026) and quantum-simulator proposals exist, but they are research papers, not teaching tools. — [arXiv 2603.12391](https://arxiv.org/pdf/2603.12391), [arXiv 2107.11366](https://arxiv.org/pdf/2107.11366)
- Lattice Abelian Higgs simulations (cosmic strings, vortex networks) exist as research code and papers, which supplies the physics and algorithms for a simple demo. — [arXiv 0812.1929](https://arxiv.org/pdf/0812.1929), [hep-ph/0107171](https://arxiv.org/pdf/hep-ph/0107171)

### Inferences
- The most reusable open-source starting point is the kjslag XY WebGL code. Check its licence before adapting it.
- The gap in existing browser demos is exactly the user's complaint. Nothing found shows the Abelian-Higgs step (Goldstone mode becoming the longitudinal photon, flux expelled) in a live field simulation.
- Likely approach for a single-file demo: write fresh WebGL or Canvas code for a 2D lattice Landau–Ginzburg or Abelian-Higgs relaxation, so no licence problem arises.

### Gaps
- Licences for the Cambridge simulator, Homo Deus Lab code, Elysia Tools and Leinweber videos are not confirmed.
- I did not search for PhET, CERN education resources, Perimeter Institute outreach, or Particle Zoo for these topics; I cannot say what they offer.
- I did not search GitHub directly (the GitHub MCP was unavailable), so there may be unfound repos for Landau–Ginzburg, lattice gauge theory, or Higgs visualizations.
- No source found for an interactive Lund-string, asymptotic-freedom or gluon self-interaction demo. This is "not found", not "does not exist".

## 2. Deepest intuitive pictures (candidates for interactive demos)

### Takeaway
The best-sourced pictures are: Strassler's "field as a property that can be on or off", the Anderson picture of a photon gaining mass so that fields die within a London depth, and the flux-tube/string-breaking picture of confinement. Strassler also gives the honest picture of virtual particles as disturbances probed differently at different scales.

### Cited Findings
- Strassler rejects the "molasses/soup/crowd" Higgs analogy. Reasons: it would let you detect steady motion (violating relativity), conflicts with Newton's laws (mass resists change in motion, not motion), does not explain proton mass, and misrepresents a field as a substance. — [Strassler 2024](https://profmattstrassler.com/2024/04/16/why-the-higgs-field-is-nothing-like-molasses-soup-or-a-crowd/)
- Strassler's replacement pictures: the Higgs field as a property of a substance (like air pressure, which has no weight of its own), and as wind that is "on" (nonzero average value) versus "off". He points to his book "Waves in an Impossible Sea" and his technical web pages for the full story. — same source
- In a superconductor the U(1) gauge symmetry is broken, which gives a gapless phase (Goldstone) mode. Anderson (1962) showed Coulomb interaction lifts it to the plasma frequency, and the photon gains mass. — [arXiv 2512.02637](https://arxiv.org/abs/2512.02637)
- The photon mass sets the London penetration depth (tens to hundreds of nm), so magnetic field decays inside the bulk (Meissner effect). — [arXiv 2008.08799](https://arxiv.org/pdf/2008.08799)
- Standard statement: when a matter field couples to a gauge field there is no physical Goldstone mode; the gauge field "swallows" it, leaving a massive boson. One source disputes identifying the Goldstone mode with the plasmon. — [arXiv 2008.08799](https://arxiv.org/pdf/2008.08799); contested in [arXiv 1906.02097](https://arxiv.org/pdf/1906.02097)
- The amplitude mode of the superconducting order parameter is the analogue of the Higgs boson. Its detection has been hard; ultrafast and nonlinear THz methods have made progress recently. — [arXiv 2512.02637](https://arxiv.org/abs/2512.02637)
- Virtual particles: Strassler calls them calculational lines in Feynman diagrams, "disturbances", not particles. The "pop in and out of existence" picture is "so misleading". Honest picture: an electron probed gently is a simple object; probed at high energy and short times it shows a churning cloud, and both descriptions are true for their measurements. Misleading images: short-lived real particles, "the electron is an illusion", lines as physical trajectories. — [Strassler 2011](https://profmattstrassler.com/2011/10/10/virtual-particles-not-particles-at-all/)
- Baez FAQ also warns Feynman-diagram lines are not classical particle paths. — [Baez FAQ](https://math.ucr.edu/home/baez/physics/Quantum/virtual_particles.html)
- Confinement picture: energy stored in the flux tube grows linearly with separation; when it exceeds the rest energy of a quark-antiquark pair, the tube snaps and creates new pair(s) (string breaking, hadronization). — [Wikipedia](https://en.wikipedia.org/wiki/Color_confinement)
- Tong's Gauge Theory notes (about 400 pages) cover Wilson loops, instantons, anti-screening, confinement, "Higgs vs. confining phase", lattice gauge theory, chiral symmetry breaking and the Abelian-Higgs vortices (in 2D). The page itself gives no intuitive pictures beyond the topic list. — [Tong](https://davidtong.org/teaching/gauge-theory/)

### Inferences
- Candidate demos (ordered by feasibility in one HTML file):
  1. Mexican-hat explorer: ball on the hat, slider for the potential coefficient, radial mode (Higgs) versus tangential mode (Goldstone) ringing. Pair with a 1D chain of "spins on the brim" showing the Goldstone mode as a long-wavelength wave (spin wave / sound wave).
  2. 2D XY lattice cool-down (extend kjslag idea): slow versus fast quench, count vortices, show the Kibble–Zurek dependence of defect density on quench rate. The 2D XY topological transition is the main caveat.
  3. Abelian-Higgs toggle: same lattice with a gauge field. Switch "gauge coupling on" and show the phase wave disappear while an applied magnetic field gets expelled within a penetration depth. Add vortex lines carrying quantised flux. This is the picture that matches the user's complaint, and it is the one nobody seems to have in a browser.
  4. String breaking in 1+1D (Schwinger-style or a simple 2D flux-line cartoon): drag two quarks apart, watch energy rise linearly, tube snaps, two mesons. Label it as a cartoon of the Cornell potential.
  5. Probe-scale slider for the electron/proton (honest "virtual particle" picture): zoom resolution, show structure appear. Needs care to avoid showing "little particles popping".
  6. Lund string hadronization: a 1+1D string with random breakups giving a hadron list (simplified Lund fragmentation). Check this against Pythia output for credibility.
- I judge items 1 to 3 best for a general audience, because they show what the Lagrangian result means in a physical system. These judgments are mine, not from sources.

### Gaps
- I found no source for specific "Goldstone modes as sound or spin waves" demos or for Landau–Ginzburg browser simulators. Those pictures (phonons from broken translation; magnons from broken rotation) are standard condensed-matter teaching, but I have no cited source in this pass.
- Asymptotic freedom visualization and gluon self-interaction pictures: none found.
- Leinweber's own site content was not fetched, only papers.

## 3. Intuition-first texts and what mental pictures they give

### Takeaway
Only partly covered. Verified so far: Strassler (blog), Tong (notes, which are technical), Linde (field visualization paper), Schwichtenberg (symmetry-first textbook). Feynman QED, Zee, Penrose, Baez, Susskind, PBS Space Time, 3Blue1Brown and Physics Explained were not verified in this pass.

### Cited Findings
- Strassler, "Of Particular Significance" and the book "Waves in an Impossible Sea": field-as-property pictures and the "particles as ripples/disturbances" language (see section 2). — [blog](https://profmattstrassler.com/)
- Tong: 400-page gauge theory notes, technical, aimed at beginning graduate students; strong on confinement, Higgs vs confining phase, chiral symmetry breaking. A separate Standard Model course page exists. — [Tong](https://davidtong.org/teaching/gauge-theory/)
- Schwichtenberg, "Physics from Symmetry" (Springer, 2015; 2nd edition 2018): self-contained and pedagogical, builds physics from symmetry principles (rotation and Lorentz groups, canonical quantization of free fields), uses little formalism; one reviewer says it is hard without some background. — [Springer](https://www.springer.com/in/book/9783319367569), [review summary](https://pro-physik.de/buecher/physics-from-symmetry)
- Linde's chain-of-oscillators picture for fields (section 1). — [arXiv 1907.11311](https://arxiv.org/abs/1907.11311)
- Baez FAQ on virtual particles (section 2). — [Baez](https://math.ucr.edu/home/baez/physics/Quantum/virtual_particles.html)
- Stanford Encyclopedia has an entry "Symmetry and Symmetry Breaking" (not read). — [SEP](https://plato.stanford.edu/eNtRIeS/symmetry-breaking/)

### Inferences
- From general knowledge (uncited here): Feynman's "QED" uses arrows (clock hands) for amplitudes; Zee's "Fly by Night Physics" teaches dimensional analysis and order-of-magnitude reasoning; Susskind's Theoretical Minimum is equation-first. These should be verified before the report writer relies on them.

### Gaps
- Not researched: Feynman QED, Zee (both books), Penrose, Baez beyond the FAQ, Susskind, PBS Space Time, 3Blue1Brown, Physics Explained, Sabine Hossenfelder. A prior search for Zee and Baez Higgs material returned nothing relevant.

## 4. What physicists say is missing in educational QFT/Standard Model visualizations

### Takeaway
Little direct evidence found. The best-supported statements: Linde says visualization options for QFT are lacking; Strassler says common analogies (molasses, virtual particles popping in and out) mislead.

### Cited Findings
- Linde's paper aims to give intuition for QFT mathematics because students lack a way to visualize quantum fields. — [arXiv 1907.11311](https://arxiv.org/abs/1907.11311)
- Strassler argues the standard analogies break basic physics principles (see section 2), so what is "missing" is a correct picture of fields as properties and disturbances, not substances and particles. — [Strassler 2024](https://profmattstrassler.com/2024/04/16/why-the-higgs-field-is-nothing-like-molasses-soup-or-a-crowd/), [2011](https://profmattstrassler.com/2011/10/10/virtual-particles-not-particles-at-all/)
- Education research I found concentrates on quantum mechanics (PhET simulations, student difficulties), not QFT or the Standard Model. — [PhET paper](https://arxiv.org/pdf/0709.4503), [QM difficulties review](https://arxiv.org/pdf/1504.02056)
- Physicists disagree on parts of the Higgs-in-superconductors story (Goldstone vs plasmon identification). A demo must not state this as settled. — [arXiv 1906.02097](https://arxiv.org/pdf/1906.02097) vs [arXiv 2008.08799](https://arxiv.org/pdf/2008.08799)
- A mirror of the Color confinement article (cavac.at) contained an embedded instruction line unrelated to the topic. I did not follow it and recommend not using that mirror. — [mirror](https://cavac.at/cavacopedia/Color%20confinement)

### Inferences
- The shared complaint is that visuals show particles and cartoons; none connect a Lagrangian feature (potential shape, gauge coupling) to a visible behaviour change. A slider that toggles gauge coupling and shows the mode vanish would fill that gap. This is my inference.

### Gaps
- No physics.ed-ph paper found on student difficulties with the Standard Model, Higgs, or Feynman diagrams. Queries not tried: "Feynman diagram misconceptions", "particle physics education research", CERN and Perimeter materials.
