import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"../demos/flux-vortices.html"),"utf8");
const m=html.match(/\/\* PHYSICS-CORE START \*\/([\s\S]*?)\/\* PHYSICS-CORE END \*\//);
if(!m){console.log("FAIL  core block not found");process.exit(1)}
const names="mulberry32 wrapAngle makeModel setCoupling initVortices addVortex fluxField totalFlux edgeA boundaryWinding energyParts step relax gaugeTransform radialEnergy dipSeparation";
const C=vm.runInNewContext(m[1]+`;({${names.split(" ").join(",")}})`,{Math});
let fails=0;
const check=(name,ok,detail)=>{console.log(`${ok?"PASS":"FAIL"}  ${name}  ${detail}`);if(!ok)fails++};
const DT=0.15,TWO_PI=2*Math.PI;
const xiOf=mod=>Math.max(1.5,Math.min(6,1.2/Math.sqrt(mod.lam+1e-9)));
function run(L,e,kappa,gauge,list,steps,pure){const mod=C.makeModel(L,e,kappa,gauge);C.initVortices(mod,list(L),xiOf(mod),pure);C.relax(mod,steps,DT);return mod}
const centre=(L,n)=>[{x:(L-1)/2,y:(L-1)/2,n}];

// 1. flux quantisation
for(const n of[1,2,-1]){
  const mod=run(64,0.25,1,true,L=>centre(L,n),1500);
  const q=C.totalFlux(mod)/TWO_PI,w=C.boundaryWinding(mod),ea=C.edgeA(mod)/TWO_PI;
  check(`flux quantisation n=${n}: total flux/2pi = n (tol 1e-3)`,Math.abs(q-n)<1e-3&&w.n===n&&Math.abs(w.raw-n)<1e-9,`flux/2pi=${q.toFixed(5)}, edge winding of phi=${w.raw.toFixed(6)}`);
  check(`flux = sum of A around the edge (exact identity) n=${n}`,Math.abs(q-ea)<1e-10,`diff ${Math.abs(q-ea).toExponential(1)}`);
}

// 2. energy decreases monotonically
{const cases=[["gauged n=1 (start A=0)",true,L=>centre(L,1),false],["gauged n=-2",true,L=>centre(L,-2),false],["global n=1",false,L=>centre(L,1),false],
    ["two vortices, pure-gauge start",true,L=>[{x:12,y:15.5,n:1},{x:19,y:15.5,n:1}],true]];
  for(const [name,g,list,pure] of cases){
    const mod=C.makeModel(32,0.3,0.8,g);C.initVortices(mod,list(32),xiOf(mod),pure);
    let prev=C.energyParts(mod).total,worst=-Infinity,e0=prev;
    for(let k=0;k<400;k++){C.step(mod,DT);const E=C.energyParts(mod).total;worst=Math.max(worst,E-prev);prev=E}
    check(`energy never rises under gradient flow: ${name}`,worst<=1e-12,`start ${e0.toFixed(3)} -> end ${prev.toFixed(3)}, largest single-step change ${worst.toExponential(1)} (negative = fell)`)}}

// 3. gauge invariance
{const mod=C.makeModel(32,0.3,0.7,true);C.initVortices(mod,[{x:13.2,y:15.5,n:2},{x:20,y:14,n:-1}],2,false);C.relax(mod,60,DT);
  const E0=C.energyParts(mod).total,F0=C.totalFlux(mod),f0=C.fluxField(mod).slice(),ab=Math.abs;
  const amp0=Float64Array.from(mod.pr,(r,i)=>Math.hypot(r,mod.pi[i])),pr0=Float64Array.from(mod.pr);
  C.gaugeTransform(mod,C.mulberry32(99));
  const E1=C.energyParts(mod).total,f1=C.fluxField(mod);
  let df=0,da=0,dp=0;for(let i=0;i<f1.length;i++){df=Math.max(df,ab(f1[i]-f0[i]));da=Math.max(da,ab(Math.hypot(mod.pr[i],mod.pi[i])-amp0[i]));dp=Math.max(dp,ab(mod.pr[i]-pr0[i]))}
  check("energy invariant under a random gauge transformation (rel <= 1e-10)",ab(E1-E0)/ab(E0)<=1e-10,`E before ${E0.toFixed(6)}, after ${E1.toFixed(6)}, rel ${(ab(E1-E0)/ab(E0)).toExponential(1)}`);
  check("flux per square and |phi| unchanged by the transformation",df<1e-10&&da<1e-12&&Math.abs(C.totalFlux(mod)-F0)<1e-10,`max change of F ${df.toExponential(1)}, of |phi| ${da.toExponential(1)}`);
  check("gauge transformation changes phi a lot (it is a real change)",dp>0.5,`max change of Re phi ${dp.toFixed(2)}`)}

// 4. BPS energy per unit winding (continuum value 2 pi)
{const m1=run(96,0.2,1,true,L=>centre(L,1),1200),r1=C.energyParts(m1).total/TWO_PI;
  check("BPS point, n=1, e=0.2, 96x96: E/(2 pi) within 2% of 1",Math.abs(r1-1)<0.02,`E = ${(r1*TWO_PI).toFixed(4)}, exact 2pi = ${TWO_PI.toFixed(4)}, ratio ${r1.toFixed(4)}`);
  const m2=run(64,0.25,1,true,L=>centre(L,2),1500),r2=C.energyParts(m2).total/TWO_PI/2;
  check("BPS point, n=2, e=0.25, 64x64: E/(2 pi n) within 2% of 1",Math.abs(r2-1)<0.02,`E/n = ${(r2*TWO_PI).toFixed(4)}, ratio ${r2.toFixed(4)}`);
  const m3=run(64,0.25,2,true,L=>centre(L,1),1500),r3=C.energyParts(m3).total/TWO_PI;
  check("away from BPS (kappa=2) energy is above 2 pi",r3>1.01,`E/(2 pi) = ${r3.toFixed(4)}`)}

// 5. global vortex energy grows with size, gauged one does not
{const Ls=[16,32,64],Eg=[],Ea=[];
  for(const L of Ls){Eg.push(C.energyParts(run(L,0.25,1,false,L=>centre(L,1),1500)).total);Ea.push(C.energyParts(run(L,0.25,1,true,L=>centre(L,1),1500)).total)}
  const exact=TWO_PI*Math.log(2);
  check("global vortex: energy grows by 2 pi ln2 per doubling of size (tol 12%)",
    Math.abs((Eg[1]-Eg[0])/exact-1)<0.12&&Math.abs((Eg[2]-Eg[1])/exact-1)<0.12,`E(16,32,64) = ${Eg.map(v=>v.toFixed(3)).join(", ")}; steps ${(Eg[1]-Eg[0]).toFixed(3)}, ${(Eg[2]-Eg[1]).toFixed(3)} vs exact ${exact.toFixed(3)}`);
  check("gauged vortex: energy does not grow with size (32 -> 64 changes < 0.01)",Math.abs(Ea[2]-Ea[1])<0.01,`E(16,32,64) = ${Ea.map(v=>v.toFixed(4)).join(", ")}`);
  const prof=C.radialEnergy(run(64,0.25,1,false,L=>centre(L,1),1500),31.5,31.5,32);
  check("radial energy of global vortex: slope vs ln r is 2 pi n^2 (tol 10%)",Math.abs((prof[29]-prof[9])/Math.log(3)/TWO_PI-1)<0.1,`slope ${((prof[29]-prof[9])/Math.log(3)).toFixed(3)}, exact ${TWO_PI.toFixed(3)}`)}

// 6. forces between two vortices (simulation)
{const two=k=>{const mod=C.makeModel(64,0.35,k,true);C.initVortices(mod,[{x:27.5,y:31.5,n:1},{x:35.5,y:31.5,n:1}],xiOf(mod),true);const s0=C.dipSeparation(mod);C.relax(mod,1500,DT);return[s0,C.dipSeparation(mod)]};
  const [a0,a1]=two(2),[b0,b1]=two(0.5);
  check("type II (kappa=2): two vortices repel",a1>a0+2,`separation ${a0.toFixed(2)} -> ${a1.toFixed(2)} sites`);
  check("type I (kappa=0.5): two vortices attract",b1<b0-3,`separation ${b0.toFixed(2)} -> ${b1.toFixed(2)} sites`)}

// determinism
{const a=C.mulberry32(5),b=C.mulberry32(5);check("seeded RNG is deterministic",a()===b()&&a()===b(),"same seed, same numbers")}

console.log(fails?`\n${fails} check(s) FAILED`:"\nall checks passed");
process.exit(fails?1:0);
