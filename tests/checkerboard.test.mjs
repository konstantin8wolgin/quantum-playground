import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"../demos/checkerboard.html"),"utf8");
const m=html.match(/\/\* PHYSICS-CORE START \*\/([\s\S]*?)\/\* PHYSICS-CORE END \*\//);
if(!m){console.log("FAIL  core block not found");process.exit(1)}
const names="besselJ01 binom countPaths countsByR stepWeights sumByR walk bruteForce normSq normExpected exactK diracResidual convergeError fitOrder latticeOmega vgLattice vgContinuum packetRun lineFit peakFreq fft coneBuild";
const C=vm.runInNewContext(m[1]+`;({${names.split(" ").join(",")}})`,{Math});
let fails=0;
const check=(name,ok,detail)=>{console.log(`${ok?"PASS":"FAIL"}  ${name}  ${detail}`);if(!ok)fails++};

// 0. Bessel functions against known values
{const ref=[[1,0.7651976865579666,0.44005058574493355],[10,-0.2459357644513483,0.04347274616886144],[40,0.007366890584237,0.126038318037587]];
 let w=0;for(const [z,a,b] of ref){const r=C.besselJ01(z);w=Math.max(w,Math.abs(r[0]-a),Math.abs(r[1]-b))}
 check("Bessel J0, J1 at z = 1, 10, 40 match tabulated values (<= 1e-13)",w<=1e-13,`worst |diff| ${w.toExponential(2)}`)}

// 1. DP = brute force over all 2^N paths, N <= 14, both rules
for(const uni of [false,true]){
 let worst=0,cells=0;
 for(let N=1;N<=14;N++){const g=0.05+0.07*N;const bf=C.bruteForce(N,g,uni);
  for(const [s,si] of [[1,0],[-1,1]]){const w=C.walk(N,g,uni,s);
   for(const [er,ei,ej] of [[w.Rr,w.Ri,0],[w.Lr,w.Li,1]]){const b=bf[si][ej];
    for(let i=0;i<er.length;i++){worst=Math.max(worst,Math.hypot(er[i]-b.re[i],ei[i]-b.im[i]));cells++}}}}
 check(`recursion = brute force over all 2^N paths, N = 1..14, ${uni?"unitary":"plain"} rule (<= 1e-12)`,worst<=1e-12,`${cells} cells, worst |diff| ${worst.toExponential(2)}`)}

// 2. N(R) closed form = enumeration; total number of paths = 2^(N-1) per start direction
{let ok=true,n=0,tot=true;
 for(let N=1;N<=14;N++){
  const cnt={};for(let mask=0;mask<(1<<N);mask++){let x=0,R=0,prev=mask&1;x+=prev?-1:1;
    for(let i=1;i<N;i++){const b=(mask>>i)&1;x+=b?-1:1;if(b!==prev)R++;prev=b}
    const key=`${mask&1}|${x}|${R}`;cnt[key]=(cnt[key]||0)+1}
  for(const [s,si] of [[1,0],[-1,1]])for(let j=-N;j<=N;j++){const cf=C.countsByR(N,j,s);let sum=0;
   for(let R=0;R<N;R++){const e=cnt[`${si}|${j}|${R}`]||0;if(e!==cf[R]){ok=false}sum+=cf[R];n++}
   if(((N+j)&1)===0&&false)tot=false}
  for(const [s] of [[1],[-1]]){let sum=0;for(let j=-N;j<=N;j++)sum+=C.countsByR(N,j,s).reduce((a,b)=>a+b,0);if(sum!==(1<<(N-1)))tot=false}}
 check("N(R) from the closed binomial formula = N(R) counted from the list of all paths, N = 1..14 (every cell, start, R)",ok,`${n} counts compared`);
 check("all cells together: 2^(N-1) paths for each first direction",tot,"N = 1..14")}

// 2b. closed-form sum by R = recursion
{let worst=0;for(const uni of [false,true])for(const N of [3,8,13,21,30])for(const g of [0.1,0.6,1.1]){
   const w=C.walk(N,g,uni,1),w2=C.walk(N,g,uni,-1);
   for(let j=-N;j<=N;j++){if(((N+j)&1)!==0)continue;
    const a=C.sumByR(N,j,1,1,g,uni),b=C.sumByR(N,j,1,-1,g,uni),c2=C.sumByR(N,j,-1,1,g,uni),d=C.sumByR(N,j,-1,-1,g,uni);
    const i=j+N;
    const sc=Math.max(1e-300,...[a,b,c2,d].map(z=>Math.hypot(z[0],z[1])));
    // the plain rule with g > 1 sums terms of size 1e8+ with cancellations, so compare relative to the largest term of the sum
    const big=Math.max(sc,...C.countsByR(N,j,1).map((n,R)=>n*Math.pow(g,R)));
    worst=Math.max(worst,Math.max(Math.hypot(a[0]-w.Rr[i],a[1]-w.Ri[i]),Math.hypot(b[0]-w.Lr[i],b[1]-w.Li[i]),Math.hypot(c2[0]-w2.Rr[i],c2[1]-w2.Ri[i]),Math.hypot(d[0]-w2.Lr[i],d[1]-w2.Li[i]))/big)}}
 check("sum over R of N(R) stay^(N-1-R) (-i sw)^R = recursion, N up to 30, both rules (relative to the largest term <= 1e-12)",worst<=1e-12,`worst relative |diff| ${worst.toExponential(2)}`)}

// 3. m = 0: only the light-cone edges
{let ok=true,edge=0;for(const uni of [false,true]){const N=40;const w=C.walk(N,0,uni,1),w2=C.walk(N,0,uni,-1);
  for(let i=0;i<2*N+1;i++){const onR=i===2*N,onL=i===0;
   if(w.Rr[i]!==(onR?1:0)||w.Ri[i]!==0||w.Lr[i]!==0||w.Li[i]!==0)ok=false;
   if(w2.Lr[i]!==(onL?1:0)||w2.Li[i]!==0||w2.Rr[i]!==0||w2.Ri[i]!==0)ok=false}
  edge++}
 check("m = 0: start right gives one unit amplitude at the right edge x = +t and zero everywhere else (start left: left edge)",ok,`N = 40, both rules`);
 let cone=true;{const w=C.walk(30,0.3,false,1);for(let j=-30;j<=30;j++){const i=j+30;if(((30+j)&1)!==0){if(Math.hypot(w.Rr[i],w.Ri[i],w.Lr[i],w.Li[i])!==0)cone=false}}}
 check("with mass, cells of the wrong parity stay empty (only every second cell is reached)",cone,"N = 30")}

// 4. norm
{let wu=0,wp=0;for(const N of [5,20,60,200])for(const g of [0.05,0.3,0.9]){
   for(const s of [1,-1]){const a=C.normSq(C.walk(N,g,true,s)),b=C.normSq(C.walk(N,g,false,s)),e=C.normExpected(N,g,false);
    wu=Math.max(wu,Math.abs(a-1));wp=Math.max(wp,Math.abs(b/e-1))}}
 check("unitary rule: norm = 1 for every N, g, start (<= 1e-12)",wu<=1e-12,`worst |norm-1| ${wu.toExponential(2)}`);
 check("plain rule: norm = (1+g^2)^(N-1) exactly (relative <= 1e-12)",wp<=1e-12,`worst relative diff ${wp.toExponential(2)}`);
 const N=100,g=0.2;const n1=C.normSq(C.walk(N,g,false,1)),n2=C.normSq(C.walk(N+1,g,false,1));
 check("plain rule: one more tick multiplies the norm by 1 + g^2",Math.abs(n2/n1-(1+g*g))<=1e-12,`ratio - (1+g^2) = ${(n2/n1-(1+g*g)).toExponential(2)}`)}

// 5. exact propagator obeys the Dirac equation
{let worstRel=0,worstAbs=0,n=0;const h=1e-4;
 for(const m of [0.7,2,5,9])for(const [x,t] of [[0,1],[0.3,1],[-0.5,1.2],[0.6,2],[-0.2,0.5],[0.1,3]]){
  const r=C.diracResidual(x,t,m,h);worstAbs=Math.max(worstAbs,r.res);worstRel=Math.max(worstRel,r.res/r.scale);n++}
 // central differences with step h: truncation error ~ h^2 K''' /6, rounding ~ 1e-16 K/h; for h = 1e-4 both are < 1e-7 of the terms
 check("exact Bessel propagator satisfies (dt+dx)K_R = -i m K_L and (dt-dx)K_L = -i m K_R (central differences, relative to the terms <= 1e-6)",worstRel<=1e-6,`${n} points, 2 columns each, worst relative residual ${worstRel.toExponential(2)} (absolute ${worstAbs.toExponential(2)})`);
 // the residual must not be trivially small: a wrong sign breaks it
 const m0=3,x=0.2,t=1.1,K=C.exactK(x,t,m0),bad=C.exactK(x,t,-m0);
 check("sanity: the same test has teeth (the propagator with the wrong sign of m is not a solution of the same equation)",Math.hypot(K.LR[0]-bad.LR[0],K.LR[1]-bad.LR[1])>0.1,`|K_LR(m) - K_LR(-m)| = ${Math.hypot(K.LR[0]-bad.LR[0],K.LR[1]-bad.LR[1]).toFixed(3)}`)}

// 5b. initial condition of the exact propagator: small-t limit of the smooth part, and the one-turn count
{const m=2,t=1e-6,K=C.exactK(0.3*t,t,m);
 check("exact propagator at t -> 0 inside the cone: K_LR = -i m/2 (one-turn paths) and K_RR = 0",Math.hypot(K.LR[0],K.LR[1]+m/2)<1e-6&&Math.hypot(...K.RR)<1e-5,`K_LR = ${K.LR[1].toFixed(6)} i`)}

// 6. convergence to the exact propagator
for(const uni of [false,true]){
 for(const m of [2,6]){const Ns=[32,64,128,256,512,1024],res=Ns.map(N=>C.convergeError(N,1,m,uni,0.9));
  const p=C.fitOrder(res.map(r=>r.eps),res.map(r=>r.err));
  const mono=res.every((r,i)=>i===0||r.err<r.err*0+res[i-1].err);
  check(`checkerboard / (2 eps) -> exact propagator at t = 1, m = ${m}, ${uni?"unitary":"plain"} rule: fitted order between 0.8 and 1.2, error falls with every halving`,p>0.8&&p<1.2&&mono,`order ${p.toFixed(3)}, errors ${res.map(r=>r.err.toExponential(2)).join("  ")}`)}}
{ // pointwise at fixed points (not a maximum): errors at several x
 let allOk=true,txt=[];
 for(const x of [0,0.25,-0.5,0.75]){const e=[];for(const N of [128,256,512,1024]){const eps=1/N,w=C.walk(N,2*eps,false,1),j=Math.round(x*N),i=j+N,K=C.exactK(j*eps,1,2);
    e.push(Math.hypot(w.Rr[i]/(2*eps)-K.RR[0],w.Ri[i]/(2*eps)-K.RR[1]))}
  const p=C.fitOrder([1/128,1/256,1/512,1/1024],e);txt.push(`x=${x}: ${p.toFixed(2)}`);if(!(p>0.8&&p<1.2))allOk=false}
 check("pointwise at x = 0, 0.25, -0.5, 0.75 (m = 2, plain): order of the K_RR error (N = 128..1024) between 0.8 and 1.2",allOk,txt.join(", "))}
// the page's readout uses convergeError; make sure it also converges for the coarse grids used on the page
{const res=[16,32,64,128].map(N=>C.convergeError(N,1,6,false,0.9));const p=C.fitOrder(res.map(r=>r.eps),res.map(r=>r.err));
 check("page default (m = 6, N = 16..128 grids): order between 0.8 and 1.3 (coarse grids are not yet in the asymptotic range)",p>0.8&&p<1.3,`start N = 16: order ${p.toFixed(3)}`)}

// 7. lattice dispersion and packet speed
{let worst=0;for(const [k,m,eps] of [[0.5,1,0.05],[2,1,0.05],[1,3,0.1],[-1.5,2,0.02]]){const h=1e-6,num=(C.latticeOmega(k+h,m,eps)-C.latticeOmega(k-h,m,eps))/(2*h);worst=Math.max(worst,Math.abs(num-C.vgLattice(k,m,eps)))}
 check("lattice group speed cos(m eps) sin(k eps)/sin(omega eps) = numerical derivative of omega(k) (<= 1e-6)",worst<=1e-6,`worst |diff| ${worst.toExponential(2)}`)
 let l1=0,l2=0;for(const [k,m] of [[0.5,1],[2,1],[1,3]]){l1=Math.max(l1,Math.abs(C.vgLattice(k,m,1e-2)-C.vgContinuum(k,m)));l2=Math.max(l2,Math.abs(C.vgLattice(k,m,1e-3)-C.vgContinuum(k,m)))}
 check("lattice group speed -> k/sqrt(k^2+m^2) when eps -> 0, second order in eps (diff <= 1e-5 at eps = 1e-3, and 100 times smaller than at 1e-2 within 20 %)",l2<=1e-5&&Math.abs(l1/l2/100-1)<0.2,`diff ${l1.toExponential(2)} at 1e-2, ${l2.toExponential(2)} at 1e-3`)}
{const eps=0.05,T=240;
 for(const [m,k] of [[1,1],[1,3],[2,0.5],[3,-1.2]]){const r=C.packetRun({m,k,sigma:3,eps,T,mode:"pos"});
  const lf=C.lineFit(r.mean,eps,60,T),vl=C.vgLattice(k,m,eps),dn=Math.max(...Array.from(r.norm,v=>Math.abs(v-1)));
  check(`packet m = ${m}, k = ${k}: measured speed = lattice group speed within 2 % and never above 1; norm = 1 (<= 1e-9, only the far Gaussian tail can leave the grid)`,Math.abs(lf.slope-vl)<=0.02*Math.abs(vl)+0.005&&Math.abs(lf.slope)<1&&dn<=1e-9,`measured ${lf.slope.toFixed(4)}, lattice ${vl.toFixed(4)}, continuum ${C.vgContinuum(k,m).toFixed(4)}, norm dev ${dn.toExponential(1)}`)}}
// 8. Zitterbewegung frequency 2 omega
{const eps=0.05;for(const m of [3,4]){const r=C.packetRun({m,k:0,sigma:0.3,eps,T:240,mode:"R"});
  const f=C.peakFreq(Array.from(r.mean),eps,1,20),om=C.latticeOmega(0,m,eps);
  check(`Zitterbewegung, right component only, k = 0, m = ${m}: the wiggle of <x> has frequency 2 omega within 2 %`,Math.abs(f-2*om)<=0.02*2*om,`peak at ${f.toFixed(3)}, 2 omega = ${(2*om).toFixed(3)}`)}}

// 9. positive-energy start does not tremble; one-component start does
{const eps=0.05,T=240;
 for(const [m,k,sg] of [[3,0,0.3],[1.5,1.5,3],[4,-2,0.5]]){const r=C.packetRun({m,k,sigma:sg,eps,T,mode:"pos"}),lf=C.lineFit(r.mean,eps,0,T);let w=0;for(let i=0;i<=T;i++)w=Math.max(w,Math.abs(r.mean[i]-(lf.icpt+lf.slope*i*eps)));
  check(`positive-energy start (k-space projection), m = ${m}, k = ${k}, sigma = ${sg}: <x> minus a straight line stays below 1e-8 (no Zitterbewegung)`,w<1e-8,`largest deviation ${w.toExponential(2)}`)}
 const r=C.packetRun({m:3,k:0,sigma:0.3,eps,T,mode:"R"}),lf=C.lineFit(r.mean,eps,0,T);let w=0;for(let i=0;i<=T;i++)w=Math.max(w,Math.abs(r.mean[i]-(lf.icpt+lf.slope*i*eps)));
 check("right-component start, m = 3, k = 0, sigma = 0.3: wiggle size 0.119 within 5 % (as before the fix)",Math.abs(w-0.1193)<0.006,`largest deviation ${w.toFixed(4)}`)}

// 10. light-cone picture: the brightness reference is the strongest reached cell strictly inside the cone
{let worst=0,N=160;
 for(const uni of [false,true])for(const m of [3,12]){const g=m/N,a=C.coneBuild(N,g,uni,"RR").ref,b=C.coneBuild(N,g,uni,"LL").ref;worst=Math.max(worst,Math.abs(a-b)/a)}
 check("cone reference: LL (start left) mirrors RR (start right), both rules, m = 3 and 12 (relative <= 1e-6)",worst<=1e-6,`worst relative diff ${worst.toExponential(2)}`);
 const r=C.coneBuild(160,12/160,false,"RR").ref;
 check("cone reference at m = 12, N = 160, plain, RR is below the edge value 1 (about 0.889)",r>0.88&&r<0.90,`ref ${r.toFixed(4)}`);
 let z=0;for(const uni of [false,true])for(const comp of ["RR","LR","RL","LL","prob"])z=Math.max(z,C.coneBuild(80,0,uni,comp).ref);
 check("cone reference at m = 0 is 0 in every view and both rules (nothing inside the cone)",z===0,`largest ${z}`);
 // cells of the wrong parity never show the edge value: no lit cell next to the edge when m = 0
 const cb=C.coneBuild(40,0,false,"LL");let leak=0;const W=81;for(let n=2;n<=40;n++){const d=-n+1;leak=Math.max(leak,cb.mag[(n-1)*W+(40+d)])}
 check("m = 0, LL: the cell next to the left edge is empty (the edge is one cell wide)",leak===0,`value ${leak}`)}

// 11. Zitterbewegung size: wide packet keeps about 1/(2m); narrow packet is smaller and fades
{const eps=0.05,T=240,res={};for(const sg of [0.3,3]){const r=C.packetRun({m:3,k:0,sigma:sg,eps,T,mode:"R"}),lf=C.lineFit(r.mean,eps,0,T);let mx=0,late=0;
  for(let i=0;i<=T;i++){const d=Math.abs(r.mean[i]-(lf.icpt+lf.slope*i*eps));mx=Math.max(mx,d);if(i>T*0.75)late=Math.max(late,d)}res[sg]={mx,late}}
 check("wide packet (sigma = 3) keeps nearly 1/(2m) = 0.167 at late time; narrow packet (sigma = 0.3) fades to below a third of that",res[3].late>0.15&&res[0.3].late<0.056&&res[0.3].late<res[0.3].mx/2,`late ${res[3].late.toFixed(3)} (wide), ${res[0.3].late.toFixed(3)} (narrow, peak ${res[0.3].mx.toFixed(3)})`)}
console.log(fails?`\n${fails} check(s) FAILED`:"\nall checks passed");
process.exit(fails?1:0);
