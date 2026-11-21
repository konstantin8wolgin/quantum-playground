import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"../demos/tunnelling.html"),"utf8");
const m=html.match(/\/\* PHYSICS-CORE START \*\/([\s\S]*?)\/\* PHYSICS-CORE END \*\//);
if(!m){console.log("FAIL  core block not found");process.exit(1)}
const names="mulberry32 rotTime pathQ fanWeight fanSum gaussFan propK heatKernel potV potDV omegaWell S0Closed S0Numeric kinkX kinkResidual deltaESemi sturmCount tridiagEig gridSpectrum splittingExact makePath sweepPath kinkCenters countKinks accumCorr fitDecay";
const C=vm.runInNewContext(m[1]+`;({${names.split(" ").join(",")}})`,{Math});
let fails=0;
const check=(name,ok,detail)=>{console.log(`${ok?"PASS":"FAIL"}  ${name}  ${detail}`);if(!ok)fails++};

// 1. eigen-solver: harmonic oscillator
const ho=C.gridSpectrum(x=>0.5*x*x,1,1,400,8,3);
check("eigen-solver: harmonic oscillator E0, E1, E2 (tol 1e-3)",Math.abs(ho[0]-0.5)<1e-3&&Math.abs(ho[1]-1.5)<1e-3&&Math.abs(ho[2]-2.5)<1e-3,`${ho.map(v=>v.toFixed(5)).join(", ")} (expect 0.5, 1.5, 2.5)`);
const d2=new Float64Array([2,2,2,2]),e2=new Float64Array([-1,-1,-1]);
check("eigen-solver: 4x4 tridiagonal (2,-1) lowest",Math.abs(C.tridiagEig(d2,e2,0)-(2-2*Math.cos(Math.PI/5)))<1e-10,`${C.tridiagEig(d2,e2,0).toFixed(8)}`);

// 2. S0 and kink
const lam=3,a=1;
const S0n=C.S0Numeric(lam,a,2000),S0c=C.S0Closed(lam,a);
check("S0: numeric integral of sqrt(2V) vs (4 sqrt2/3) sqrt(lam) a^3",Math.abs(S0n-S0c)<1e-8,`numeric ${S0n.toFixed(8)}, closed ${S0c.toFixed(8)}`);
check("omega = sqrt(8 lam a^2) equals sqrt(V''(a))",Math.abs(C.omegaWell(lam,a)-Math.sqrt((C.potDV(a+1e-4,lam,a)-C.potDV(a-1e-4,lam,a))/2e-4))<1e-5,`omega=${C.omegaWell(lam,a).toFixed(5)}`);
let rmax=0,rel=0;for(let t=-1.5;t<=1.5;t+=0.1){const r=Math.abs(C.kinkResidual(t,0.2,lam,a,1e-3));rmax=Math.max(rmax,r);rel=Math.max(rel,r/Math.abs(C.potDV(C.kinkX(t,0.2,lam,a),lam,a)+1e-9))}
check("kink solves x''=V'(x) (max residual)",rmax<1e-3,`max |x''-V'| = ${rmax.toExponential(2)} (V' up to ~${Math.abs(C.potDV(0.58*a,lam,a)).toFixed(1)})`);
// kink action = S0
let Sk=0;const h=1e-3;for(let t=-8;t<8;t+=h){const x=C.kinkX(t,0,lam,a),xd=(C.kinkX(t+h/2,0,lam,a)-C.kinkX(t-h/2,0,lam,a))/h;Sk+=(xd*xd/2+C.potV(x,lam,a))*h}
check("kink Euclidean action = S0",Math.abs(Sk-S0c)<1e-3,`integral ${Sk.toFixed(5)}, S0 ${S0c.toFixed(5)}`);

// 3. Wick-rotated free propagator
const K90=C.propK(1,1,1.3,Math.PI/2,0.8),hk=C.heatKernel(1,1,1.3,0.8);
check("propagator at theta=pi/2 equals heat kernel",Math.abs(K90[0]-hk)<1e-12&&Math.abs(K90[1])<1e-12,`K=${K90[0].toFixed(6)}+${K90[1].toExponential(1)}i, heat ${hk.toFixed(6)}`);
const K0=C.propK(1,1,1.3,0,0.8),mag0=Math.hypot(K0[0],K0[1]);
check("propagator at theta=0: |K| = sqrt(m/(2 pi hbar t))",Math.abs(mag0-Math.sqrt(1/(2*Math.PI*1.3)))<1e-12,`|K|=${mag0.toFixed(6)}`);
const F0=C.fanSum(1,1,1,0,1,2.5,51);let dl=0;for(const z of F0.w)dl=Math.max(dl,Math.abs(Math.hypot(z[0],z[1])-1));
check("theta=0: all arrow lengths are 1",dl<1e-12,`max |len-1| = ${dl.toExponential(1)}`);
const F90=C.fanSum(1,1,1,Math.PI/2,1,2.5,51);let im=0,pos=true;for(const z of F90.w){im=Math.max(im,Math.abs(z[1]));if(z[0]<=0)pos=false}
check("theta=pi/2: all weights real and positive (no turning)",im<1e-12&&pos,`max |Im| = ${im.toExponential(1)}`);
const Fb=C.fanSum(1,1,1,Math.PI/2,1,6,4001),Gb=C.gaussFan(1,1,1,Math.PI/2,1);
check("theta=pi/2: fan sum -> exact Gaussian integral",Math.abs(Fb.sum[0]-Gb[0])<1e-6&&Math.abs(Gb[1])<1e-12,`sum ${Fb.sum[0].toFixed(6)}, exact ${Gb[0].toFixed(6)}`);
const Fc=C.fanSum(1,1,1,0.7,1,6,4001),Gc=C.gaussFan(1,1,1,0.7);const Gc2=C.gaussFan(1,1,1,0.7,1);
check("theta=0.7: fan sum -> exact Gaussian integral",Math.hypot(Fc.sum[0]-Gc2[0],Fc.sum[1]-Gc2[1])<1e-6,`sum ${Fc.sum[0].toFixed(5)}+${Fc.sum[1].toFixed(5)}i, exact ${Gc2[0].toFixed(5)}+${Gc2[1].toFixed(5)}i`);

// 4. splitting: exact vs Monte Carlo vs semiclassical
const ex=C.splittingExact(lam,a,1,400);
const e6=C.splittingExact(6,1,1,400),e20=C.splittingExact(20,1,1,400);
const r6=C.deltaESemi(6,1,1)/e6.dE,r20=C.deltaESemi(20,1,1)/e20.dE;
check("semiclassical estimate improves with S0/hbar (lam=6: S0=4.6, lam=20: S0=8.4)",Math.abs(r20-1)<0.2&&Math.abs(r20-1)<Math.abs(r6-1),`semi/exact = ${r6.toFixed(3)} at lam=6, ${r20.toFixed(3)} at lam=20`);
const N=300,beta=10;let kinks=0,nS=0,p=null;const rs=[];
for(const seed of [4242,1,2]){p=C.makePath(N,beta,lam,a,1,seed);
  for(let i=0;i<300;i++)C.sweepPath(p);
  const sum=new Float64Array((N>>1)+1);let n=0;
  for(let i=0;i<8000;i++){C.sweepPath(p);if(i%2===0){C.accumCorr(p,sum);n++;nS++;kinks+=C.countKinks(p.x,a)}}
  rs.push(C.fitDecay(Array.from(sum,v=>v/n),p.eps,beta,0.5).r)}
const worst=Math.max(...rs.map(r=>Math.abs(r/ex.dE-1)));
check("Delta E: exact diagonalisation vs MC correlator, 3 seeds x 8000 sweeps (each within 10%)",worst<0.10,`exact ${ex.dE.toFixed(4)}, MC ${rs.map(r=>r.toFixed(4)).join(", ")}, semiclassical ${C.deltaESemi(lam,a,1).toFixed(4)}`);
check("MC kinks per path ~ beta dE/2 (dilute gas, 40%)",Math.abs(kinks/nS/(beta*ex.dE/2)-1)<0.4,`measured ${(kinks/nS).toFixed(2)}, guess ${(beta*ex.dE/2).toFixed(2)}`);
check("MC acceptance sensible",p.acc/p.tries>0.2&&p.acc/p.tries<0.95,`${(100*p.acc/p.tries).toFixed(0)}%`);
const q=C.makePath(N,beta,lam,a,1,1);const qq=C.makePath(N,beta,lam,a,1,1);C.sweepPath(q);C.sweepPath(qq);
check("seeded RNG is deterministic",q.x.every((v,i)=>v===qq.x[i]),"same seed, same path");

console.log(fails?`\n${fails} check(s) FAILED`:"\nall checks passed");
process.exit(fails?1:0);
