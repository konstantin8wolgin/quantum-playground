# Visualizing the Standard Model Lie groups U(1), SU(2), SU(3): existing resources, code, and demo ideas

Method note: ~19 tool calls (web search + fetch). Many hits were seen only as search snippets; each item says what was actually opened. Licences are listed only where found; "not stated" means the fetched page showed none (NOT the same as public domain).

## 1. SU(2): spin-1/2, Bloch sphere, spinor flag, belt/plate trick, 720 degrees, double cover, S3 and Hopf, quaternions

### Takeaway
SU(2) has rich existing material, but mostly as videos or old Java/Flash/Mathematica applets. The belt-trick / SU(2)-path animation by Greg Egan and Bob Palais's visualizer are the canonical conceptual sources. No ready browser-native belt trick or spinor-flag demo was found, so these are gaps a new single-file WebGL demo can fill. Reusable open-source code exists for the Bloch sphere (three.js) and the Hopf fibration (Sage, C++/OpenGL).

### Cited Findings
- Belt/plate trick: 360 degree rotation of an object with attached strings does not restore the state; 720 degrees does. It illustrates that SU(2) double-covers SO(3) and is simply connected. — [Wikipedia: Plate trick](https://en.wikipedia.org/wiki/Plate_trick) (article text CC BY-SA 4.0; image licences not stated on page)
- Wikipedia external links for animations: Greg Egan's Dirac belt trick applet incl. SU(2) path (https://www.gregegan.net/APPLETS/21/21.html); double-belt animation (https://vimeo.com/62228139); extended trick for fermion exchange (https://vimeo.com/62143283); mechanical linkage video (https://www.youtube.com/watch?v=oRPCoEq05Zk); Kauffman "Air on the Dirac Strings" (http://www.evl.uic.edu/hypercomplex/html/dirac.html); Balinese cup trick (https://www.youtube.com/watch?v=Rzt_byhgujg); virtualmathmuseum Dirac belt (https://virtualmathmuseum.org/Surface/dirac-belt/DiracBelt.html); BeltTrick.gif on Commons — [Wikipedia: Plate trick](https://en.wikipedia.org/wiki/Plate_trick). The page does NOT mention Jason Hise, so his animations were not located/verified.
- Egan's applet: shows the belt trick with an inset of SO(3) drawn as a ball; created Sept 2000; companion notes explain SU(2) as 2x2 unitary det-1 matrices double covering SO(3); Egan's SO(4)/quaternion applet is at gregegan.net/APPLETS/22/22.html. Bob Palais reports Egan's belt centreline motion was constructed ad hoc, not derived from the homotopy. (search snippets only) — [Egan 21](https://gregegan.net/APPLETS/21/21.html), [Egan notes](https://gregegan.net/APPLETS/21/DiracNotes.html), [Palais links](https://www.math.utah.edu/~palais/links.html)
- Bob Palais: "A visualization of Dirac's Belt Trick and Feynman's Plate Trick" with quaternions (URL name "JavaBeltPlateQuat", so probably a Java applet; fetch was not completed) — [Palais](https://www.math.utah.edu/~palais/JavaBeltPlateQuat/belt.html)
- Holroyd's "spinor linkage": mechanical plate-trick device, 13 rigid bodies, 12 hinge joints — [arXiv 2107.01681](https://arxiv.org/abs/2107.01681)
- Wolfram Demonstrations: "Dirac Belt Trick Simulation Showing Double Cover of SO(3) by SU(2)" (needs Wolfram player; not open code) — [link](https://demonstrations.wolfram.com/DiracBeltTrickSimulationShowingDoubleCoverOfSO3BySU2/)
- 3Blue1Brown "Visualizing quaternions (4d numbers) with stereographic projection" (2018, ~32 min); lesson page links source `github.com/3b1b/videos/blob/master/_2018/quaternions.py` (Python/manim); footer (c) 2026 Grant Sanderson; no licence stated on the page; Hopf never mentioned on the page — [3b1b lesson](https://www.3blue1brown.com/lessons/quaternions)
- Ben Eater's explorable quaternion videos (eater.net/quaternions) are widely described as interactive versions of the 3b1b videos with Eater doing the web development. My direct fetch returned only the title, so features, source and licence are NOT verified — [Julia discourse thread](https://discourse.julialang.org/t/visualizing-quaternions-an-explorable-video-series/16861)
- Niles Johnson Hopf fibration video (22 Aug 2011): S3 built from circles over S2, with Hopf links, Hopf bands, nested tori. Tools: Sage, Tachyon ray tracer, Audacity, FFmpeg. Source on production-notes page; GitHub nilesjohnson/hopf_fibration is GPL v2+ per search result. Site content is CC BY-NC 4.0. — [nilesjohnson.net/hopf](https://nilesjohnson.net/hopf), [production notes](https://nilesjohnson.net/hopf-production.html), [slides](https://nilesjohnson.net/notes/Hopf-fib-vis.pdf)
- mwalczyk/hopf: C++/OpenGL (needs DSA) interactive Hopf explorer using Johnson's fibre parametrisation, stereographic projection, 4 point-mapping modes on S2 (great circle, random, loxodrome, curl), .obj export; licence CC BY 4.0 — [GitHub](https://github.com/mwalczyk/hopf)
- Dimensions (Leys, Ghys, Alvarez): chapters 7-8 cover the Hopf fibration. Licence reported as CC BY-NC-ND 3.0 (from a paper footnote and library catalogue, not confirmed on the site) — [Ch7](https://dimensions-math.org/Dim_CH7_E.htm), [Alvarez-Leys paper](https://www.math-art.eu/Documents/pdfs/Alvarez-Leys,%208.pdf). NoDerivatives means: link/embed, do not remix footage.
- Hopf fibration theory/visualisation papers: [arXiv 2003.09236](https://arxiv.org/abs/2003.09236) (synthetic construction), [arXiv 2212.01642](https://arxiv.org/abs/2212.01642) (elementary introduction, quaternion-based), [Harvard Knill exhibit](https://people.math.harvard.edu/~knill/teaching/math22a2018/exhibits/threesphere/index.html), [Heidelberg HEGL](https://hegl.mathi.uni-heidelberg.de/visualizing-the-hopf-fibration/) (all snippets only).
- Bloch sphere open-source (search snippets, licences mostly unchecked): teddy55codes/blochsphere (npm `interactive-blochsphere`, three.js, MIT); klezm/bloch (arbitrary 2x2 matrices, Node, GitHub Pages); matan-bebop/spin (HTML5, m4 build); kherb27/Blochy; th3-Rocha/Bloch-sphere-with-React-Three-Fiber — [matan-bebop/spin](https://github.com/matan-bebop/spin), [klezm/bloch](https://www.Github.com/klezm/bloch), [npm](https://www.npmjs.com/package/interactive-blochsphere), [R3F](https://github.com/th3-Rocha/Bloch-sphere-with-React-Three-Fiber), [Blochy](https://github.com/kherb27/Blochy)
- Penrose-Rindler flag: a spinor maps to a null flag (flagpole + flag plane); rotating the spinor by theta rotates the flag plane by 2 theta. Source: Mathews slides. No interactive flagpole visualiser found. — [Mathews slides](https://www.danielmathews.info/wp-content/uploads/2024/01/23-04-26_Monash_talk_slides.pdf)
- "Spinorial ball": a physical/browser/phone macroscopic qubit encoding orientation as colours of two complex components — [arXiv 2411.15059](https://arxiv.org/html/2411.15059v1)
- Physics SE/Overflow intuition: "visualise the action, not the group"; SU(2) acts on a spinor, SU(3) has no SO(3)-like picture — [PhysicsOverflow 40215](https://physicsoverflow.org/40215)

### Inferences
- (Inference, standard maths) A unit quaternion q = (a,b,c,d) is a spinor (alpha,beta) = (a+ib, c+id); the Bloch vector, Hopf image and rotation axis are all derived from it. One single-file demo can show all four linked: S3 point (stereographically projected), Bloch point + phase "flag", a 3D object rotated by q, and the path in SU(2) vs SO(3) ball.
- A browser belt/plate trick is feasible without physics simulation: drive a ribbon whose frame at arc-parameter s is slerp-scaled (e.g. rotation t*f(s) about an axis), the standard construction behind Egan's/Palais's animations. Must be written from scratch; Egan's applet is closed-source Java (licence unknown).
- The Penrose flag on a Bloch sphere (arrow = Bloch vector, flag plane angle = phase) is a striking, uncovered gap: shows that 360 degrees flips the flag, 720 restores it.
- Johnson's fibre parametrisation (formulas in production notes) is easy to port to JS/three.js; his code is GPL, so port from the maths, not the code, if the single file should have a permissive licence.

### Gaps
- Jason Hise belt-trick animations: not located.
- eater.net content details/source/licence: not verified (page body not retrievable).
- Licences for klezm/bloch, spin, Blochy, R3F repo: not checked.
- Palais applet technology and current availability: not verified (Java applets no longer run in browsers).

## 2. U(1): phase rotation, charge conservation, electromagnetism

### Takeaway
No standout dedicated U(1) visual was found in this pass; only generic gauge-symmetry explainers. The best demo is easy to build from scratch: a complex amplitude as a rotating arrow with a local phase gradient revealing the gauge field.

### Cited Findings
- Interactive gauge-symmetry diagram page mapping U(1) to the photon, SU(2) to the weak force, SU(3) to the strong force (content not verified) — [vectree gauge symmetry](https://vectree.io/c/gauge-symmetry-principles)
- Quanta video on the Standard Model, hosted by Aeon (visual content not verified) — [Aeon](https://www.aeon.co/videos/the-standard-model-might-be-the-most-successful-theory-in-science-but-what-is-it)
- A MathAtlas page demonstrates SO(2) exponential flow: a slider drives a particle from a tangent line onto the circle, wrapping past 2 pi. This is the same group as U(1) — [MathAtlas exponential map](https://instantcube.vercel.app/lie-groups/exponential-map)
- Lecture-style intro to gauge theories and group theory in particle physics — [arXiv 2602.01258](https://arxiv.org/abs/2602.01258)

### Inferences
- (Standard physics, not sourced here) Global U(1): multiply psi by e^{i theta}; physics unchanged; Noether gives conserved charge. Local U(1): theta(x); need A_mu to compensate; this is electromagnetism. A 2D demo: a field of arrows (colour = phase); drag a "local rotation" bump; show how the gradient is cancelled by an A-field arrow field. Strongly feasible in 2D canvas/WebGL.
- Weak hypercharge vs electromagnetic U(1) mixing (Weinberg angle) could be a later add-on.

### Gaps
- No verified U(1)-specific interactive demo found; no sources for gauge-field "phase compensation" animation.

## 3. SU(3): colour triplet, Gell-Mann, subgroups, torus/Cartan, weight diagrams, root system, group manifold slices, colour demos

### Takeaway
Weight diagrams (triangle, hexagon octet, decuplet) have a few web/notebook tools, but no polished public-audience interactive was found. Nothing found visualises "what an SU(3) element does to a colour triplet" interactively. Literature gives the key conceptual route: visualise the action and low-dimensional slices, not the 8-D manifold.

### Cited Findings
- Weight-diagram web app for sl(3) irreps (m,n): hexagons; quarks (1,0), antiquarks (0,1), adjoint (1,1); 3x3x3 = 10+8+8+1. Tech, source and licence not stated; last edited July 2024 — [rl596.user.srcf.net/su3_reps](https://rl596.user.srcf.net/su3_reps)
- giochanturia/SU3-multiplets: Python Jupyter notebook (Multiplets.ipynb) drawing triplet, antitriplet, sextet, octet, decuplet, built by I-spin lowering then V+/U- steps (after Zee); no licence file visible; no web demo — [GitHub](https://github.com/giochanturia/SU3-multiplets)
- Quark (I3, Y): u (1/2, 1/3), d (-1/2, 1/3), s (0, -2/3). Octet from 3 x 3bar = 8 + 1; decuplet is a triangle from 6 x 3 = 10 + 8 — [SJSU Watkins](https://www2.sjsu.edu/faculty/watkins/particle.htm), [Mainz handout](https://wwwth.kph.uni-mainz.de/files/2019/02/ws1819_handout_15.pdf), [arXiv hep-ph/0001123](https://arxiv.org/pdf/hep-ph/0001123)
- Qutrit visualisation: Festenstein's "octant" method covers all 8 parameters of a qutrit state, Bloch-sphere-like — [arXiv 2304.01741](https://arxiv.org/abs/2304.01741); Three-dimensional visualisation of qutrit states — [arXiv 1611.02701](https://arxiv.org/pdf/1611.02701); "The Qutrit Bloch Sphere" — [arXiv 2601.06240](https://arxiv.org/pdf/2601.06240); also [arXiv 2411.16480](https://arxiv.org/pdf/2411.16480) (all abstracts/snippets only)
- Qutrit papers note SU(d>2) is a proper subgroup of SO(d^2-1), so state space is a proper subset of a ball; use cross-sections and projections. In Gell-Mann coordinates a 2D section (n1,n2) gives a disc of radius 1/sqrt(3) — same arXiv pair as above (1611.02701 and the Gell-Mann parametrisation snippet; exact paper for the disc fact not isolated).
- Colour-charge teaching paper: Inscoe and Lancaster, SU(3) colour dynamics in undergraduate QM; VPython visualisation; no code link — [arXiv 1907.12520](https://arxiv.org/abs/1907.12520). Colour-charge vectors in (Q3, Q8) space with HSV hue — same paper (snippet claim).
- "A group theoretical treatise on color mixing" (colours as SU(3) triplet) — [arXiv 2211.03417](https://arxiv.org/pdf/2211.03417)
- Oregon State "Geometry of Lie groups" text: Gell-Mann matrices as basis, root diagram of su(3) — [GELG su3](https://books.physics.oregonstate.edu/GELG/su3.html)
- Intuition: no isomorphism with a rotation group; "visualise the action" — [PhysicsOverflow 40215](https://physicsoverflow.org/40215)
- Baez and Huerta, "The Algebra of Grand Unified Theories": gentle intro to SM group U(1) x SU(2) x SU(3) as representation theory of particles (GUT parts out of scope) — [arXiv 0904.1556](https://arxiv.org/abs/0904.1556)
- Lie algebra/group/exp visuals: MathAtlas "Lie Groups and Lie Algebras" section: SO(2) flow, SO(3) exponential on a ball, Taylor series, logarithm explorer with fold at pi rotation; neighbours /lie-groups/matrix-lie-groups and /lie-groups/so3-rotations; no source/licence stated — [MathAtlas](https://instantcube.vercel.app/lie-groups/exponential-map)

### Inferences
- Concrete SU(3) demo recipes (standard maths, my construction):
  1. Action on a triplet: 3 complex amplitudes drawn as 3 phasor wheels (R, G, B hue) with magnitudes as bar heights; sliders for the 8 parameters, or per-generator "hold-to-flow" buttons (exp(i t lambda_a)). Show the colour mixture as a swatch. Generators lambda_3, lambda_8 only rotate phases (torus); lambda_1,2 / 4,5 / 6,7 mix pairs.
  2. Three SU(2) subgroups (I, U, V): each mixes one pair of colours; show each as a Bloch sphere on that pair; "the three Bloch spheres, one per colour pair" is a striking, uncovered visual.
  3. Weight/root diagrams: (I3,Y) plane; quark triangle, antiquark triangle, octet hexagon with centre doubled, decuplet triangle; clicking a root vector (6 of them) shows the ladder operator moving a state; hexagon symmetry = Weyl group. Needs only 2D canvas/SVG. Well-defined data (given above).
  4. Group-shape slices: maximal torus T2 (flat torus, from lambda_3, lambda_8); SU(2) subgroup = S3 (Hopf-able); coset SU(3)/SU(2) = S5; SU(3)/T2 = flag manifold (6 Weyl chambers); projective states of a qutrit = CP2 (Festenstein octant). These slices are well known maths; no browser visualisations found.
  5. Colour-neutral condition: R+G+B (phase-sum) = singlet; the Q3, Q8 colour-charge plane with HSV hue maps the triangle neatly.
- Because all 8 parameters cannot be seen at once, demo (a) first (action), then (c) weights, matches the literature's own advice.

### Gaps
- No interactive "colour charge" web demo found.
- No visualisation of SU(3) group manifold slices found (only qutrit state-space papers).
- Licences of the weight-diagram app and SU3-multiplets repo: not stated.
- No source for Casimir visual explainers (not searched in depth).

## 4. Reusable code and licensing summary, single-file HTML feasibility

### Takeaway
Most legally reusable code is small (three.js Bloch spheres, MIT); big-name assets (Johnson, Dimensions, 3b1b) are NC/ND or unstated, so use them as references/links and re-implement maths from scratch. Everything proposed fits a single HTML file with inline JS, with three.js (MIT) loaded from a CDN or inlined.

### Cited Findings
| Resource | Stack | Licence | Single-file adaptable? |
|---|---|---|---|
| nilesjohnson/hopf_fibration | Sage/Python, Tachyon | GPL v2+ (search result); site CC BY-NC 4.0 | Port formulas only; code is Python |
| mwalczyk/hopf | C++/OpenGL/GLSL | CC BY 4.0 | Port algorithm; GLSL ideas to WebGL2 |
| teddy55codes/blochsphere | three.js, npm | MIT (search snippet) | Yes, small |
| klezm/bloch | Node, GitHub Pages | unchecked | Possibly |
| matan-bebop/spin | HTML5, m4 build | unchecked | Possibly |
| 3b1b quaternions.py | Python manim | not stated | Reference only |
| Dimensions movie | video | CC BY-NC-ND 3.0 (reported) | Link/embed only |
| Egan applets | Java applet | not stated | Reference only |
| SU3-multiplets | Python notebook | not stated | Data/algorithm only |
| su3_reps app | web | not stated | Reference only |
Sources: as cited above ([mwalczyk](https://github.com/mwalczyk/hopf), [Johnson](https://nilesjohnson.net/hopf), [npm](https://www.npmjs.com/package/interactive-blochsphere), [3b1b](https://www.3blue1brown.com/lessons/quaternions), [Dimensions](https://dimensions-math.org/Dim_CH7_E.htm)).

### Inferences
- Ranking of striking-yet-feasible demos: (1) spinor/quaternion linked view: 3D object + Bloch sphere with Penrose flag + S3 stereographic point + path; 360 vs 720 degree slider. (2) Belt/ribbon trick with SU(2) path and SO(3) ball inset. (3) Hopf fibre explorer driven by dragging a Bloch point (fibre = phase circle). (4) SU(3) triplet phasor panel with three coupled Bloch spheres (I/U/V). (5) Weight/root diagram with clickable ladder operators and rep selector (3, 3bar, 6, 8, 10, general (m,n)). (6) U(1) local phase field with compensating gauge field. (7) Torus + flag-manifold slices of SU(3) later.
- Teach order matches user plan: (a) action on state = items 1, 4; (c) weights = item 5; shape = items 3, 7.

### Gaps
- No search of GitHub directly (GitHub MCP failed to connect; only web search used), so smaller repos (Observable, Shadertoy) are under-covered: no Observable notebook or Shadertoy for these groups was found or searched specifically.
- No YouTube explainer on the full SM gauge group was verified; arXiv physics.ed-ph coverage limited to 1907.12520.
