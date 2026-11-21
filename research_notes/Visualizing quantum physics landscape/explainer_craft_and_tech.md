# Craft of interactive science explanations and single-file technical options (as of Nov 2026)

Research note: ~15 tool calls. Items without a URL were NOT verified this session; they are listed under Inferences or Gaps and flagged "(from memory)".

## 1. What makes world-class interactive explainers work (design patterns, exemplars)

### Takeaway
The strongest sources agree on: start from the simplest concrete model, give direct control of variables, link several views of one system, let the reader step between concrete and abstract, and keep interactivity optional inside an author-led narrative. Not everything should be interactive.

### Cited Findings
- Bret Victor, Explorable Explanations: "reactive documents" expose the model behind a claim so readers change assumptions and see conclusions update ("a spreadsheet without the spreadsheet"). "Explorable examples" let readers vary parameters and find patterns the author did not mention; several linked views of one system build intuition; interaction lives inside the explanation as an optional path while the author still holds up their end of the conversation. "Contextual information" lets readers look things up in place without losing position. — [Explorable Explanations](https://worrydream.com/ExplorableExplanations/)
- Bret Victor, Up and Down the Ladder of Abstraction: start with the simplest model and iterate; give direct control over variables and time (pause, rewind, jump); "step up" (show all values of a variable at once, e.g. full trajectory or metric vs parameter) to see patterns; "step down" (point at an abstraction and see the concrete instance) to explain them; link the levels; keep a fully concrete view always available to catch what abstractions hide; build custom tooling. — [Ladder of Abstraction](https://worrydream.com/LadderOfAbstraction/)
- Distill, "Communicating with Interactive Articles" lists patterns: reactive sandbox simulations; multiple linked representations; predict-then-reveal prompts (guess a trend before seeing data, encourages self-explanation); details-on-demand (tooltips, hotspots, math annotations, expandable text); scroll/step-based layouts; non-linear paths and short segments; retrieval quizzes. — [Distill 2020](https://distill.pub/2020/communicating-with-interactive-articles/)
- Same Distill article, caveats: animation is not always better than a good static graphic (best for transitions, uncertainty, causality); one study found slideshow layouts beat vertical scrolling for comprehension on desktop, mobile needs study; showing other readers' predictions did not clearly help recall; "not everything needs to be interactive"; interactive pieces are costly, may break as web tech changes, need accessibility work and mobile-bandwidth care. — [Distill 2020](https://distill.pub/2020/communicating-with-interactive-articles/)
- Ciechanowski's site is hand-built: pages load only two own scripts (`/js/base.js` plus one per-article-family file, e.g. `/js/light.js`, 264 KB, with a 2D canvas context and one `experimental-webgl` probe), own CSS, and Google Fonts; no three.js/regl/KaTeX/MathJax strings appear in the light.js file I inspected. Base.js contains custom touch handling (`genericTouchHandler`). — direct inspection of [lights-and-shadows article](https://ciechanow.ski/lights-and-shadows/), [light.js](https://ciechanow.ski/js/light.js), [base.js](https://ciechanow.ski/js/base.js)
- Explorabl.es is a loosely organised community collection of explorable explanations; open source on GitHub; the page itself gives little concrete craft advice. — [explorabl.es](https://explorabl.es/)

### Inferences
- A "layered museum" maps cleanly to Victor's ladder: Layer 0 striking sim with 1-2 controls; Layer 1 predict prompt; Layer 2 linked abstract view (phase space, spectrum, plot against parameter) that responds when you drag in the sim and vice versa; Layer 3 equations (KaTeX) in `<details>`; Layer 4 raw parameters/code.
- Ciechanowski's recipe (hand-written, library-free, per-article code) suggests plain JS + canvas/WebGL per page is viable and long-lived; libraries are a convenience, not a requirement. The WebGL claim is weak (only one `experimental-webgl` string found); I did not confirm what he uses for 3D.
- From memory, NOT verified this session, worth the report writer checking before citing: Nicky Case (ncase.me, e.g. "Parable of the Polygons", "The Evolution of Trust", his "How to Explorable" guidance), Red Blob Games (redblobgames.com, "make the diagram the interface", sliders and draggable handles), Steven Wittens/acko.net (MathBox, "Making Things With Maths", WebGL/GPU-first), Complexity Explorables (complexity-explorables.org, Dirk Brockmann, one parameter-rich simulation per page, many with sliders and presets), Falstad (falstad.com/mathphysics.html; Java applets ported to JS, circuit and quantum-wave sims, "Quantum Particle in a 1-D Box" family), Seeing Theory (seeingtheory.io), Mathigon, Ben Eater/3Blue1Brown "Visualizing quaternions" (eater.net/quaternions; explorable video), Quanta interactives. Treat all as exemplar candidates only.

### Gaps
- No primary source found for Ciechanowski's own description of his process (searched; nothing returned). Only inspection of his shipped code.
- Nicky Case, Red Blob, Wittens, Brockmann, Falstad, Seeing Theory, Mathigon, Eater/Sanderson, Quanta pages not fetched (call budget); no cited design claims for them.
- Quantitative evidence on how many readers use interactivity: Distill calls the evidence limited and mentions a widely cited publisher anecdote that few readers do (unsourced there).

## 2. Evidence from physics-education research (PhET, QuVis)

### Takeaway
PhET and QuVis designs are validated mainly by think-aloud student interviews and iterative redesign, not large controlled trials. Findings favour simple start states, restrained visuals, implicit (built-in) scaffolding, and plain consistent representations over spectacle. QuVis has one concrete example where a visualisation change reduced a misconception.

### Cited Findings
- PhET design principles came from 200+ student interviews; early target was college undergrads; evidence is mostly qualitative. — [PhET Interview Paper Part I (search summary)](https://phet.colorado.edu/publications/archive/PhET%20interview%20Paper%20Part%20I.htm); [PhET publications](https://phet.colorado.edu/publications/PhET%20Interview%20Paper%20Final.pdf)
- PhET interviews: students give equal importance to every visual feature, so emphasise only the features carrying the learning goal; do not overwhelm with new information at once; use familiar real-world objects as an entry point; keep representations consistent across sims. — [PhET Interview Paper Part II](https://phet.colorado.edu/publications/archive/PhET%20interview%20Paper%20Part%20II.pdf)
- Backgrounds can help but competed with central features and distracted in early designs; a clear visual split between play area and control panel (different background colour) fixed confusion about where dragging works. — [PhET Part II](https://phet.colorado.edu/publications/archive/PhET%20interview%20Paper%20Part%20II.pdf)
- Starting 'Radio Waves' with the electron oscillating on its own overwhelmed students; in manual mode they did not realise the blue dot was movable; fixed with a "wiggle-me" cue. — [PhET Part II](https://phet.colorado.edu/publications/archive/PhET%20interview%20Paper%20Part%20II.pdf)
- Help bubbles with written instructions failed: unfamiliar words, students read quickly, text disappeared, so they were lost; a simple slider/radio-button UI needed no instruction. — [PhET Part II](https://phet.colorado.edu/publications/archive/PhET%20interview%20Paper%20Part%20II.pdf)
- Implicit scaffolding (Podolefsky, Moore, Perkins): guide through affordances, constraints, cueing and feedback built into the tool, instead of explicit instructions ("guides without students feeling guided"); supports students posing questions, designing experiments, predicting and using evidence; students tend to explore extreme conditions, so choose slider limits to highlight useful contrast cases (e.g. max vs zero friction). — [arXiv 1306.6544](https://arxiv.org/pdf/1306.6544)
- QuVis (St Andrews): 90+ research-based sims by 2014; developed with observation sessions and class trials (17-sim set: 42 hours, 19 volunteers); authors report learning benefits at intro and advanced levels and positive perception. — [Kohnle et al., AJP 2015 summary](https://research-portal.st-andrews.ac.uk/en/publications/enhancing-student-learning-of-two-level-quantum-systems-with-inte/)
- QuVis visualisation study: a revised single-photon depiction cut the frequency of the misconception that a photon splits into two half-energy parts; the revision was adopted in all QuVis single-photon sims. Results come from the group's own papers; no independent replication found. — [arXiv 1410.0867](https://arxiv.org/pdf/1410.0867)

### Inferences
- "Looks good" is not the criterion; what the picture implies is. For quantum demos, the visual metaphor itself can plant misconceptions (photon splitting, "particle as little ball"), so pick representations deliberately and label them.
- Practical rules: start in a calm, simple state; one salient cue to touch (pulsing handle); few controls first; sliders with limits that reveal extremes; visually separate sim from controls; no decorative backgrounds; same colour for the same quantity across all demos; do not rely on pop-up instructions.
- Predict-then-test is supported by PhET's goal framework and Distill's pattern list but I found no effect-size data.

### Gaps
- No large controlled-trial effect sizes for PhET fidelity/engagement found; PhET PDFs were parsed locally only for design statements.
- QuVis sources include conference abstracts with limited detail.
- Did not retrieve Wieman/Adams/Perkins controlled comparisons (e.g. simulation vs real equipment) or the "seductive details" literature.

## 3. Technical options for single-file demos (WebGL2/WebGPU, libraries, recording)

### Takeaway
Use WebGL2 (plus Canvas 2D) as the default: ~97% support and works everywhere on double-click. Treat WebGPU compute as an optional enhancement with a WebGL2 or CPU fallback; Firefox on Linux/Android is still not stable and Safari support is listed partial.

### Cited Findings
- WebGL2 global support 97.29%; Chrome 56+, Edge 79+, Safari 15+ (incl. iOS), Firefox 51+. — [caniuse WebGL2](https://caniuse.com/webgl2)
- WebGPU global support 88.63% (86.83% full + 1.8% partial); Chrome/Edge 113+, Chrome Android 157 listed, Safari 26.0 onward listed as partial (macOS) and iOS 26 supported, Firefox desktop and Android listed disabled by default on caniuse. — [caniuse WebGPU](https://caniuse.com/webgpu)
- web.dev (25 Nov 2025): Chrome/Edge 113+ on Windows (D3D12), macOS, ChromeOS; Android 121+ on Android 12+ with Qualcomm/ARM GPUs; Firefox 141 Windows, 145 macOS Tahoe 26 on ARM64; Firefox Linux, Android, Intel Macs "in progress"; Chromium on Linux "in progress"; Safari 26 on macOS/iOS/iPadOS/visionOS 26. — [web.dev](https://web.dev/blog/webgpu-supported-major-browsers)
- Status wiki (edited May 2026 per search summary): Firefox Linux "Nightly" only, Android disabled by default; Mozilla expects to ship Linux and work on Android in 2026. A Mozilla bug from 2026 reports a Linux regression with blank WebGPU in some nightlies. — [gpuweb Implementation Status](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status); [Bugzilla 2029256](https://bugzilla.mozilla.org/show_bug.cgi?id=2029256)
- MediaRecorder is Baseline widely available since April 2021; API: `new MediaRecorder(stream, {mimeType})`, `start(timeslice)`, `ondataavailable`, `MediaRecorder.isTypeSupported()`. Container support differs by browser (WebM in Chromium/Firefox, MP4/H.264 in Safari and newer Chromium), so test at runtime. `canvas.captureStream(fps)` supplies the stream (this part and MIME details were from the summariser's general knowledge, not the MDN page). — [MDN MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- KaTeX via CDN: `katex.min.css` + deferred `katex.min.js` + `contrib/auto-render.min.js`; offline needs the `fonts/` folder next to the CSS because font URLs are relative, so a true single file needs extra work (e.g. base64-inlining fonts in CSS). — [KaTeX browser docs](https://katex.org/docs/browser.html)

### Inferences
- Single-file architecture: one `.html` with inline `<style>`/`<script type="module">`; shared look via copy-pasted small CSS block (or a build-free "generator" script that stamps a template into each file). Double-click means `file://`: avoid `fetch()` of local files, ES-module imports from relative paths, and Web Workers from files (Chrome blocks them); embed data as JS literals and use blob URLs for workers.
- GPU compute without WebGPU: ping-pong float textures in WebGL2 (`EXT_color_buffer_float`, `RGBA32F`/`RGBA16F` framebuffers) running fragment-shader steppers. This fits wave-equation, Schrodinger split-step, lattice, diffusion demos, and works on phones. Use WebGPU compute only where particle counts or FFT sizes need it, with feature detection (`navigator.gpu`) and fallback.
- Library choices (from memory, unverified versions): raw WebGL2 or twgl/regl for 2D-field sims (small); three.js only for real 3D scenes; D3 for linked plots; KaTeX for equations. Pin exact CDN versions. For offline, download the library and inline it in a `<script>` tag (three.js is ~600 KB+ minified, regl ~70 KB, twgl ~40 KB; sizes from memory).
- Phones: cap devicePixelRatio (e.g. min(dpr, 2)), use half-float textures, fixed-timestep with adaptive substeps, pause when off-screen (IntersectionObserver) and when tab hidden, one canvas per page, `touch-action: none` on canvases, handle `webglcontextlost`.
- Recording for YouTube: in-page "Record" button using `canvas.captureStream(60)` + MediaRecorder (WebM VP9 on desktop Chromium/Firefox; convert with ffmpeg for YouTube if needed); for frame-exact deterministic output, step the simulation with fixed dt and export frames (CCapture.js-style or `canvas.toBlob`) then assemble with ffmpeg. I did not verify CCapture.js maintenance status. Use `preserveDrawingBuffer` or capture right after render in the same task.

### Gaps
- Could not read the live gpuweb Implementation Status page (relied on a search summary); status for Nov 2026 of Firefox Linux/Android WebGPU is unconfirmed. Safari "partial" on caniuse unexplained.
- Not verified: current CDN versions/sizes of three.js, regl, twgl, D3; CCapture.js status; Chrome's `file://` worker/module restrictions; WebGPU compute in a single file examples; mobile GPU performance numbers.
- Mobile WebGPU: only Chrome Android 12+ (Qualcomm/ARM) and iOS 26 per sources; no performance data.

## 4. Accessibility, hosting and packaging

### Takeaway
GitHub Pages serves a folder of static HTML for free from a public repo, so a landing `index.html` plus one file per demo works with no build. Accessibility needs deliberate effort and is a known cost of interactive pieces.

### Cited Findings
- GitHub Pages: repo with `index.html` at the top of the published branch/folder (e.g. `/docs` on `main`); enable in Settings > Pages; deploy can take up to 10 minutes; add an empty `.nojekyll` to skip Jekyll for plain HTML; free accounts need a public repo; no server-side languages. Docs state no size/bandwidth limits on that page. — [GitHub Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- Distill notes interactive pieces need accessibility work, may break as web tech changes, and must account for mobile bandwidth. — [Distill 2020](https://distill.pub/2020/communicating-with-interactive-articles/)

### Inferences
- Landing page: static grid of cards (title, one-line hook, thumbnail/looping WebM or poster image, "layer depth" tags), each linking to `demos/<name>.html`; also works from `file://` with relative links. Add `prefers-reduced-motion` handling (start paused), keyboard-operable sliders (native `<input type=range>`), visible focus, text alternatives and a plain-text description per demo, colour-blind-safe palettes (not red/green), `prefers-color-scheme`, and responsive layout with large touch targets. Use `<meta viewport>` and avoid pinch-zoom lock.
- Keep data/prompt in repo (`PROMPT.md`, `DATA.md`) per user rules.
- Known GitHub Pages soft limits (1 GB site, 100 GB/month bandwidth) are from memory, not verified here.

### Gaps
- No source fetched on WCAG practices for canvas simulations or on a packaging pattern for multi-demo single-file sites.
