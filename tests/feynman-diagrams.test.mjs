import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"../demos/feynman-diagrams.html"),"utf8");
const m=html.match(/\/\* PHYSICS-CORE START \*\/([\s\S]*?)\/\* PHYSICS-CORE END \*\//);
if(!m){console.log("FAIL  core block not found");process.exit(1)}
const names="mulberry32 dfact nfact coefMom seriesCoefs partial quad Zexact phi2exact logSeries seriesDiv termRatio bestTrunc forEachPairing graphOf canonical isConnected symmetryFactor enumerateTopologies randomPairing topologyKey tadpoleCount g2terms";
const C=vm.runInNewContext(m[1]+`;({${names.split(" ").join(",")}})`,{Math});
let fails=0;
const check=(name,ok,detail)=>{console.log(`${ok?"PASS":"FAIL"}  ${name}  ${detail}`);if(!ok)fails++};
const gs=[0.001,0.01,0.1,0.5,1,2,5];

// 1. two independent quadratures
let worst=0;
for(const g of gs)for(const k of [0,2,4]){
  const a=C.quad(g,k,"trap",0.02,14),b=C.quad(g,k,"simpson",0.004,12);worst=Math.max(worst,Math.abs(a-b)/Math.max(1,Math.abs(a)))}
check("quadratures agree (trapezoid vs Simpson, <= 1e-10)",worst<=1e-10,`worst diff ${worst.toExponential(2)}`);
check("Z(0) = 1 and Z(1) value",Math.abs(C.Zexact(0)-1)<1e-12&&Math.abs(C.Zexact(1)-0.9189189059)<1e-9,`Z(0)=${C.Zexact(0).toFixed(12)}, Z(1)=${C.Zexact(1).toFixed(10)}`);

// 2. series coefficients: formula vs moments by quadrature
let cw=0;
for(let n=0;n<=6;n++){const mom=C.quad(0,4*n,"trap",0.02,14);let pre=1;for(let k=1;k<=n;k++)pre*=-1/24/k;
  const viaQuad=pre*mom,f=C.coefMom(n,0);cw=Math.max(cw,Math.abs(viaQuad-f)/Math.abs(f))}
check("a_n from formula = a_n from Gaussian moments by quadrature (rel 1e-9)",cw<1e-9,`worst rel diff ${cw.toExponential(2)}, a1=${C.coefMom(1,0)}, a2=${C.coefMom(2,0).toFixed(8)} (35/384=${(35/384).toFixed(8)})`);
check("(4n-1)!! values",C.dfact(3)===3&&C.dfact(7)===105&&C.dfact(11)===10395,"3, 105, 10395");
// series reproduces Z at small g
{const a=C.seriesCoefs(0,20);let w=0;for(const g of [0.005,0.01,0.02]){const bt=C.bestTrunc(g,a,20);w=Math.max(w,Math.abs(C.partial(g,a,bt.N)-C.Zexact(g)))}
 check("best partial sum matches exact Z at small g (< 1e-12)",w<1e-12,`worst err ${w.toExponential(2)}`)}

// 3. enumeration of pairings and topologies
const E1=C.enumerateTopologies(1),E2=C.enumerateTopologies(2),E3=C.enumerateTopologies(3);
check("n=1: 3 pairings, one topology (figure-eight, S=8)",E1.total===3&&E1.list.length===1&&E1.list[0].S===8&&E1.list[0].count===3,`total ${E1.total}, topologies ${E1.list.length}, S=${E1.list[0].S}`);
const byc=E2.list.map(e=>e.count+":"+e.S).sort().join(" ");
check("n=2: 105 pairings, 3 topologies with counts 72/24/9 and S = 16/48/128",E2.total===105&&E2.list.length===3&&byc==="24:48 72:16 9:128",`total ${E2.total}, count:S = ${byc}`);
check("n=2: only dumbbell and sunset are connected",E2.list.filter(e=>e.connected).map(e=>e.S).sort((a,b)=>a-b).join()==="16,48","connected S = 16, 48");
check("n=3: 10395 pairings, 7 topologies (4 connected)",E3.total===10395&&E3.list.length===7&&E3.list.filter(e=>e.connected).length===4,`total ${E3.total}, topologies ${E3.list.length}`);
let sOK=true;for(const E of [E1,E2,E3])for(const e of E.list)if(Math.abs(e.S-e.Sformula)>1e-9)sOK=false;
check("S from counting = S from the symmetry formula, n=1..3",sOK,"|Aut| * prod 2^l l! * prod m!");
for(const [n,E] of [[1,E1],[2,E2],[3,E3]]){const w=E.list.reduce((s,e)=>s+1/e.S,0),ex=C.dfact(4*n-1)/(C.nfact(n)*Math.pow(24,n));
  check(`n=${n}: sum 1/S = (4n-1)!!/(n!*24^n)`,Math.abs(w-ex)<1e-13,`${w.toFixed(10)} vs ${ex.toFixed(10)}`)}
// random sampling vs exact shares
{const rng=C.mulberry32(7),tally=new Map(),M=20000;for(let i=0;i<M;i++){const k=C.topologyKey(C.randomPairing(2,rng),2);tally.set(k,(tally.get(k)||0)+1)}
 let dev=0;for(const e of E2.list)dev=Math.max(dev,Math.abs((tally.get(e.key)||0)/M-e.count/105));
 check("n=2: random pairings follow the exact shares (20000 draws, tol 0.01)",dev<0.01,`largest gap ${dev.toFixed(4)}`)}

// 4. ln Z coefficients
const a=C.seriesCoefs(0,12),c=C.logSeries(a,12);
check("ln Z: c1=-1/8, c2=1/12, c3=-11/96, c4=17/72",Math.abs(c[1]+1/8)<1e-14&&Math.abs(c[2]-1/12)<1e-14&&Math.abs(c[3]+11/96)<1e-14&&Math.abs(c[4]-17/72)<1e-14,`${c.slice(1,5).map(x=>x.toFixed(6)).join(", ")}`);
{let ok=true,det="";for(const [n,E] of [[1,E1],[2,E2],[3,E3]]){const cs=E.list.filter(e=>e.connected).reduce((s,e)=>s+1/e.S,0);const sg=n%2?-1:1;if(Math.abs(sg*cs-c[n])>1e-13)ok=false;det+=` n=${n}: ${cs.toFixed(6)}`}
 check("ln Z coefficients = signed sum of CONNECTED diagram weights, n=1..3",ok,det)}
check("disconnected part: a2 - c2 = a1^2/2 = 1/128",Math.abs(a[2]-c[2]-1/128)<1e-14,`${(a[2]-c[2]).toFixed(8)}`);
{const g=0.001,lz=Math.log(C.Zexact(g)),r=(lz-c[1]*g-c[2]*g*g-c[3]*g**3)/g**4;
 check("ln Z by quadrature: c4 recovered (rel 1e-2)",Math.abs(r-c[4])<1e-2*Math.abs(c[4]),`numeric ${r.toFixed(5)}, series ${c[4].toFixed(5)}`)}

// 5. asymptotic behaviour
{const ok=[1,5,10,20].every(n=>Math.abs(C.termRatio(n,1)-Math.abs(C.coefMom(n+1,0)/C.coefMom(n,0)))<1e-9*C.termRatio(n,1));
 check("term ratio formula g(4n+1)(4n+3)/(24(n+1)) matches coefficients",ok,"n=1,5,10,20");
 const r=[1,5,10,20,40].map(n=>C.termRatio(n,0.1));let inc=true;for(let i=1;i<r.length;i++)if(r[i]<=r[i-1])inc=false;
 check("term ratio grows without bound (series diverges)",inc&&C.termRatio(1000,0.1)>50,`ratios at g=0.1: ${r.map(x=>x.toFixed(2)).join(", ")}`)}
{const a20=C.seriesCoefs(0,20),Z=C.Zexact(1),z20=C.partial(1,a20,20);
 check("g=1: 20-term sum is far off, best N is 1 (error < 0.05)",Math.abs(z20-Z)>1e9&&C.bestTrunc(1,a20,20).N===1&&Math.abs(C.partial(1,a20,1)-Z)<0.05,`Z=${Z.toFixed(6)}, Z_1=${C.partial(1,a20,1).toFixed(6)}, Z_20=${z20.toExponential(2)}`)}
{const a20=C.seriesCoefs(0,20),Z=C.Zexact(0.1),bt=C.bestTrunc(0.1,a20,20),err=Math.abs(C.partial(0.1,a20,bt.N)-Z);
 check("g=0.1: best cut-off N=14, error ~ smallest term (factor 3)",bt.N===14&&err<3*bt.term&&err>bt.term/3&&err<1e-7,`N=${bt.N}, error ${err.toExponential(2)}, smallest term ${bt.term.toExponential(2)}`)}
{const a20=C.seriesCoefs(0,20),n1=C.bestTrunc(1,a20,20).N,n2=C.bestTrunc(0.3,a20,20).N,n3=C.bestTrunc(0.1,a20,20).N;
 check("best cut-off N grows as g falls (about 3/(2g))",n1<n2&&n2<n3,`N(1)=${n1}, N(0.3)=${n2}, N(0.1)=${n3}`)}

// 6. two-point function
{const t=C.tadpoleCount();
 check("tadpole: 15 pairings of 6 legs = 3 joined + 12 tadpole; coefficient -12/24 = -1/2",t.total===15&&t.bubble===3&&t.tad===12&&Math.abs(t.coef+0.5)<1e-15,`${t.bubble} + ${t.tad} = ${t.total}, coef ${t.coef}`)}
const b=C.seriesCoefs(1,10),d=C.seriesDiv(b,C.seriesCoefs(0,10),10);
check("<phi^2> series: 1 - g/2 + 2g^2/3 - 11g^3/8",Math.abs(d[0]-1)<1e-14&&Math.abs(d[1]+0.5)<1e-14&&Math.abs(d[2]-2/3)<1e-14&&Math.abs(d[3]+11/8)<1e-14,d.slice(0,4).map(x=>x.toFixed(5)).join(", "));
{const g=1e-4,r=(C.phi2exact(g)-1)/g;check("<phi^2> first-order coefficient by quadrature = -1/2 (tol 1e-3)",Math.abs(r+0.5)<1e-3,`(<phi^2>-1)/g = ${r.toFixed(5)} at g=1e-4`);
 const g2=0.01,r2=(C.phi2exact(g2)-1+g2/2)/(g2*g2);check("<phi^2> second-order coefficient by quadrature = 2/3 (tol 0.05)",Math.abs(r2-2/3)<0.05,`${r2.toFixed(4)}`)}
{const g=0.1,ex=C.phi2exact(g),e1=Math.abs(C.partial(g,d,1)-ex);check("<phi^2> at g=0.1: error of 1-g/2 is O(g^2)",e1<0.01&&e1>0.0005,`exact ${ex.toFixed(6)}, 1-g/2=${(1-g/2).toFixed(6)}, error ${e1.toExponential(2)}`)}

// 7. QED g-2 cartoon numbers
{const t=C.g2terms(1/137.035999),s=t[0]+t[1]+t[2];
 check("QED: first three terms of a_e match the measured 0.00115965218 (< 1e-10)",Math.abs(s-0.00115965218)<1e-10,`sum ${s.toFixed(11)}, terms ${t.map(x=>x.toExponential(3)).join(" ")}`);
 check("QED: Schwinger term alpha/2pi = 0.0011614",Math.abs(t[0]-0.0011614098)<1e-9,t[0].toFixed(10))}

console.log(fails?`\n${fails} check(s) FAILED`:"\nall checks passed");
process.exit(fails?1:0);
