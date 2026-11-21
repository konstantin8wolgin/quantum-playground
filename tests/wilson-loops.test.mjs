import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"../demos/wilson-loops.html"),"utf8");
const m=html.match(/\/\* PHYSICS-CORE START \*\/([\s\S]*?)\/\* PHYSICS-CORE END \*\//);
if(!m){console.log("FAIL  core block not found");process.exit(1)}
const names="mulberry32 wrapAngle besselI ratioI sigmaExact makeLattice li plaqAngle plaqField sweep avgCosPlaq wilsonAngle wilsonAvg topoCharge gaugeTransform maxAngleDiff makeAcc";
const C=vm.runInNewContext(m[1]+`;({${names.split(" ").join(",")}})`,{Math});
let fails=0;
const check=(name,ok,detail)=>{console.log(`${ok?"PASS":"FAIL"}  ${name}  ${detail}`);if(!ok)fails++};

// Bessel
const I0=C.besselI(0,2),I1=C.besselI(1,2);
check("Bessel I0(2), I1(2)",Math.abs(I0-2.2795853023)<1e-8&&Math.abs(I1-1.5906368546)<1e-8,`I0=${I0.toFixed(8)} I1=${I1.toFixed(8)}`);
check("I1/I0 at beta=2",Math.abs(C.ratioI(2)-0.6978)<5e-5,`${C.ratioI(2).toFixed(5)} (expect 0.6978)`);
check("sigma = -ln(I1/I0)",Math.abs(C.sigmaExact(2)+Math.log(C.ratioI(2)))<1e-15,`sigma(2)=${C.sigmaExact(2).toFixed(5)}`);

// Monte Carlo at beta=2, 32x32
const Ls=32,beta=2;
const lat=C.makeLattice(Ls,12345,false);
for(let i=0;i<300;i++)C.sweep(lat,beta,4);
const pa=C.makeAcc(10),w2=C.makeAcc(10),w3=C.makeAcc(10);let pf=null;
for(let i=0;i<600;i++){C.sweep(lat,beta,4);pf=C.plaqField(lat,pf);pa.add(C.avgCosPlaq(pf));w2.add(C.wilsonAvg(pf,Ls,2,2));w3.add(C.wilsonAvg(pf,Ls,3,3))}
const r=C.ratioI(beta);
check("<plaquette> vs I1/I0 (tol 0.01)",Math.abs(pa.mean()-r)<0.01,`measured ${pa.mean().toFixed(4)} +- ${pa.err().toFixed(4)}, exact ${r.toFixed(4)}`);
check("<W(2x2)> vs (I1/I0)^4 (tol 0.02)",Math.abs(w2.mean()-r**4)<0.02,`measured ${w2.mean().toFixed(4)} +- ${w2.err().toFixed(4)}, exact ${(r**4).toFixed(4)}`);
check("<W(3x3)> vs (I1/I0)^9 (tol 0.02)",Math.abs(w3.mean()-r**9)<0.02,`measured ${w3.mean().toFixed(4)}, exact ${(r**9).toFixed(4)}`);

// other beta
const lat2=C.makeLattice(Ls,777,true);for(let i=0;i<300;i++)C.sweep(lat2,0.8,4);
const pb=C.makeAcc(10);let pf2=null;for(let i=0;i<500;i++){C.sweep(lat2,0.8,4);pf2=C.plaqField(lat2,pf2);pb.add(C.avgCosPlaq(pf2))}
check("<plaquette> at beta=0.8, hot start (tol 0.01)",Math.abs(pb.mean()-C.ratioI(0.8))<0.01,`measured ${pb.mean().toFixed(4)}, exact ${C.ratioI(0.8).toFixed(4)}`);

// Wilson loop: links vs plaquettes
let maxd=0;
for(const [x,y,R,T] of [[0,0,1,1],[5,7,2,3],[30,31,4,2],[28,29,6,6]]){
  let s=0;for(let j=0;j<T;j++)for(let i=0;i<R;i++)s+=C.plaqAngle(lat,x+i,y+j);
  maxd=Math.max(maxd,Math.abs(C.wrapAngle(C.wilsonAngle(lat,x,y,R,T)-s)))}
check("loop angle from links = sum of plaquettes (mod 2pi)",maxd<1e-9,`max diff ${maxd.toExponential(1)}`);

// topological charge
const q=C.topoCharge(pf);
check("topological charge is an integer",Math.abs(q.raw-q.Q)<1e-9,`Q=${q.Q}, raw=${q.raw.toExponential(2)}`);

// gauge transformation
const before=C.plaqField(lat),wBefore=C.wilsonAngle(lat,3,4,5,3),linkBefore=Float64Array.from(lat.th);
C.gaugeTransform(lat);
const after=C.plaqField(lat);
const dmax=C.maxAngleDiff(before,after);
check("gauge transformation: max change of any theta_P < 1e-9",dmax<1e-9,`max change ${dmax.toExponential(2)}`);
check("gauge transformation: Wilson loop unchanged",Math.abs(Math.cos(C.wilsonAngle(lat,3,4,5,3))-Math.cos(wBefore))<1e-9,"5x3 loop");
let lm=0;for(let i=0;i<linkBefore.length;i++)lm=Math.max(lm,Math.abs(C.wrapAngle(lat.th[i]-linkBefore[i])));
check("gauge transformation: link angles change a lot",lm>1,`max link change ${lm.toFixed(2)} rad`);

// determinism
const a=C.makeLattice(8,5,true),b=C.makeLattice(8,5,true);C.sweep(a,1.5,3);C.sweep(b,1.5,3);
check("seeded RNG is deterministic",C.maxAngleDiff(a.th,b.th)===0,"same seed, same result");

console.log(fails?`\n${fails} check(s) FAILED`:"\nall checks passed");
process.exit(fails?1:0);
