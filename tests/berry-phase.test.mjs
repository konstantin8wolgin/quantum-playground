import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"../demos/berry-phase.html"),"utf8");
const m=html.match(/\/\* PHYSICS-CORE START \*\/([\s\S]*?)\/\* PHYSICS-CORE END \*\//);
if(!m){console.log("FAIL  core block not found");process.exit(1)}
const names="wrapPi dot3 cross3 unitVec anglesOf spinorAt overlap blochVec stepU applyU makePath profile simulate coneExactState totalPhase dynPhase geometricPhase omegaCone solidAngle loopPoints monopoleFlux berryExpected discreteBerry berryCurvature adiabaticCorrection phaseDeviationExact analyze slowRun";
const C=vm.runInNewContext(m[1]+`;({${names.split(" ").join(",")}})`,{Math});
let fails=0;
const check=(name,ok,detail)=>{console.log(`${ok?"PASS":"FAIL"}  ${name}  ${detail}`);if(!ok)fails++};
const PI=Math.PI,TWO=2*PI;
const rng=(()=>{let s=12345;return()=>{s=(s*1664525+1013904223)%4294967296;return s/4294967296}})();
const norm4=p=>Math.hypot(p[0],p[1],p[2],p[3]);
const cdiff=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2],a[3]-b[3]);
const wrap=C.wrapPi;

/* 1. the 2x2 step is unitary and has det 1 */
{let worst=0,wdet=0;
 for(let i=0;i<200;i++){const th1=rng()*PI,ph1=rng()*TWO,th2=rng()*PI,ph2=rng()*TWO,B=0.2+rng()*3,h=rng()*2;
   const U=C.stepU(B,h,C.unitVec(th1,ph1),C.unitVec(th2,ph2));
   // U = [[a,b],[c,d]] complex; U^dagger U - 1
   const a=[U[0],U[1]],b=[U[2],U[3]],c=[U[4],U[5]],d=[U[6],U[7]];
   const m11=a[0]*a[0]+a[1]*a[1]+c[0]*c[0]+c[1]*c[1]-1,m22=b[0]*b[0]+b[1]*b[1]+d[0]*d[0]+d[1]*d[1]-1;
   const m12r=a[0]*b[0]+a[1]*b[1]+c[0]*d[0]+c[1]*d[1],m12i=a[0]*b[1]-a[1]*b[0]+c[0]*d[1]-c[1]*d[0];
   worst=Math.max(worst,Math.abs(m11),Math.abs(m22),Math.abs(m12r),Math.abs(m12i));
   const dr=a[0]*d[0]-a[1]*d[1]-(b[0]*c[0]-b[1]*c[1]),di=a[0]*d[1]+a[1]*d[0]-(b[0]*c[1]+b[1]*c[0]);wdet=Math.max(wdet,Math.hypot(dr-1,di))}
 check("2x2 step is unitary, det 1 (200 random steps, <= 1e-14)",worst<=1e-14&&wdet<=1e-14,`worst |U^dag U - 1| ${worst.toExponential(2)}, worst |det - 1| ${wdet.toExponential(2)}`)}

/* 2. the integrator matches the exact rotating-frame solution of the cone, also at intermediate times */
{let worst=0,n=0,wmid=0;
 for(const al of [0.3,0.9,PI/2,1.9,2.7])for(const T of [0.7,3,12,60])for(const up of [true,false]){
   const N=Math.max(360,Math.ceil(T/0.01/360)*360),M=360,path=C.makePath("cone",al),sim=C.simulate(path,"uniform",1,T,N,M,up);
   const ex=C.coneExactState(al,1,T,T,up);worst=Math.max(worst,cdiff(sim.psi,ex));n++;
   for(const j of [90,180,271]){const s=[0,1,2,3].map(i=>sim.samples[j*4+i]),e=C.coneExactState(al,1,T,T*j/M,up);wmid=Math.max(wmid,cdiff(s,e))}
   if(Math.abs(norm4(sim.psi)-1)>1e-12){worst=1}}
 check("integrator = exact rotating-frame solution, 5 angles x 4 loop times x 2 spin states (<= 1e-8)",worst<=1e-8&&wmid<=1e-8,`${n} cases, worst |diff| at T ${worst.toExponential(2)}, at 3 mid times ${wmid.toExponential(2)}`)}
{const sim=C.simulate(C.makePath("wobble",1.0),"stopgo",1,50,3600,360,true);
 check("norm stays 1 over a long wobbly run (<= 1e-13)",sim.normErr<=1e-13,`norm error ${sim.normErr.toExponential(2)}`)}

/* 3. adiabatic limit: geometric phase -> -Omega/2, error ~ 1/T */
{let ok=true,det=[];
 for(const al of [0.5,1.0,PI/2,2.0,2.6]){const O=C.omegaCone(al),ex=wrap(-O/2),errs=[];
   for(const T of [250,500,1000,2000]){const r=C.slowRun({shape:"cone",alpha:al,prof:"uniform",up:true},T,0.05);errs.push(Math.abs(wrap(r.gam-ex)))}
   const ratios=[errs[0]/errs[1],errs[1]/errs[2],errs[2]/errs[3]],good=ratios.every(x=>Math.abs(x-2)<0.04)&&errs[3]<5e-3;
   if(!good)ok=false;det.push(`a=${al.toFixed(2)}: err(T=2000)=${errs[3].toExponential(2)}, halves ${ratios.map(x=>x.toFixed(3)).join("/")}`)}
 check("geometric phase -> -Omega/2, error halves when T doubles (5 angles, ratios within 2 +- 0.04)",ok,det.join("; "))}
{let worst=0;
 for(const al of [0.4,1.0,PI/2,2.2,2.8]){const T=2000,r=C.slowRun({shape:"cone",alpha:al,prof:"uniform",up:true},T,0.05),pred=C.adiabaticCorrection(al,1,T);
   worst=Math.max(worst,Math.abs(wrap(r.gam-wrap(-C.omegaCone(al)/2))-pred)/pred)}
 check("error = pi^2 sin^2(a)/(B T) to leading order (T = 2000, relative deviation <= 1e-2, the rest is the 1/T^2 term)",worst<=1e-2,`worst relative deviation ${worst.toExponential(2)}`)}
{const r=C.slowRun({shape:"cone",alpha:PI/2,prof:"uniform",up:true},4000,0.05),d=Math.abs(wrap(r.gam-PI));
 check("great circle (alpha = 90 deg): geometric phase = -pi mod 2pi, state sign flips (<= 1e-2 at T = 4000)",d<=1e-2&&Math.abs(r.Om-TWO)<1e-6,`gamma ${r.gam.toFixed(5)}, Omega ${r.Om.toFixed(8)}, |gamma + pi| ${d.toExponential(2)}`)}
{const T=40,N=36000,sim=C.simulate(C.makePath("cone",PI/2),"uniform",1,T,N,1,true),ov=C.overlap(sim.psi0,C.coneExactState(PI/2,1,T,T,true));
 check("sanity: at T=40 the exact total phase minus BT/2 is within 0.3 of the great-circle value",Math.abs(wrap(Math.atan2(ov[1],ov[0])-T/2-PI))<0.3,"")}
/* the big number on the page: default slow run */
{const o={shape:"cone",alpha:PI/3,prof:"uniform",up:true},r=C.slowRun(o,10000,0.1);
 check("page big number: |gamma_sim + Omega/2| <= 1e-3 for the default (alpha 60 deg, T = 10000)",Math.abs(r.diff)<=1e-3,`gamma ${r.gam.toFixed(6)}, -Omega/2 ${r.exp.toFixed(6)}, diff ${r.diff.toExponential(3)}`);
 check("page big number: run = exact rotating frame at T = 10000 (<= 1e-8)",r.exactErr<=1e-8,`amplitude difference ${r.exactErr.toExponential(2)}`);
 check("page big number: after removing pi^2 sin^2a/(BT) the rest <= 1e-5",Math.abs(r.diff-r.corr)<=1e-5,`rest ${(r.diff-r.corr).toExponential(2)}`)}

/* 4. independence of the speed profile (adiabatic limit) */
{const T=3000,res=[];for(const prof of ["uniform","stopgo"])for(const shape of ["cone","tilted","wobble"]){
   const r=C.slowRun({shape,alpha:1.1,prof,up:true},T,0.1);res.push([shape+"/"+prof,Math.abs(r.diff),r.Om])}
 const ok=res.every(x=>x[1]<2e-2);
 const same=Math.abs(res[0][2]-res[3][2])<1e-6&&Math.abs(res[1][2]-res[4][2])<1e-6;
 check("geometric phase independent of the speed profile (3 shapes x 2 profiles, |gamma + Omega/2| <= 2e-2 at T = 3000)",ok&&same,res.map(x=>`${x[0]}: ${x[1].toExponential(1)}`).join("; "))}
{// stronger: for the cone, uniform and non-uniform agree with each other to the 1/T size
 const a=C.slowRun({shape:"cone",alpha:1.1,prof:"uniform",up:true},8000,0.1),b=C.slowRun({shape:"cone",alpha:1.1,prof:"stopgo",up:true},8000,0.1);
 check("uniform and start-stop speed give the same phase within 3e-3 at T = 8000",Math.abs(wrap(a.gam-b.gam))<3e-3,`${a.gam.toFixed(5)} vs ${b.gam.toFixed(5)}`)}
{const A=C.slowRun({shape:"tilted",alpha:0.9,prof:"uniform",up:true},3000,0.1),B=C.slowRun({shape:"cone",alpha:0.9,prof:"uniform",up:true},3000,0.1);
 check("tilted circle has the same area as the cone: Omega equal (<= 1e-5), phases equal within 5e-3",Math.abs(A.Om-B.Om)<1e-5&&Math.abs(wrap(A.gam-B.gam))<5e-3,`Omega ${A.Om.toFixed(7)} vs ${B.Om.toFixed(7)}, gamma ${A.gam.toFixed(5)} vs ${B.gam.toFixed(5)}`)}
{// solid angle of the wobbly loop by an independent formula: Omega = 2 pi int (1 - cos theta(s)) ds
 const al=1.0,a=0.3*Math.min(al,PI-al,1);let s=0;const n=20000;for(let k=0;k<n;k++){const th=al+a*Math.sin(3*TWO*k/n);s+=(1-Math.cos(th))/n}
 const O1=TWO*s,O2=C.solidAngle(C.loopPoints(C.makePath("wobble",al),"uniform",8000));
 check("solid angle by triangles = 2pi int (1 - cos theta) ds for the wobbly loop (<= 1e-6)",Math.abs(O1-O2)<1e-6,`${O1.toFixed(8)} vs ${O2.toFixed(8)}`)}
{let worst=0;for(const al of [0.2,0.8,1.5,PI/2,2.3,3.0]){worst=Math.max(worst,Math.abs(C.solidAngle(C.loopPoints(C.makePath("cone",al),"uniform",6000))-C.omegaCone(al)))}
 check("solid angle of a cone by triangles = 2pi(1 - cos a) (<= 1e-6)",worst<=1e-6,`worst ${worst.toExponential(2)}`)}

/* 5. direction and spin state flip the sign */
{const al=1.2,T=3000;
 const f=C.slowRun({shape:"cone",alpha:al,prof:"uniform",up:true},T,0.1),b=C.slowRun({shape:"cone",alpha:al,prof:"reverse",up:true},T,0.1),d=C.slowRun({shape:"cone",alpha:al,prof:"uniform",up:false},T,0.1);
 check("reversed loop: phase = +Omega/2, sign flips (within 5e-3)",Math.abs(wrap(b.gam+f.gam))<8e-3&&Math.abs(wrap(b.gam-C.omegaCone(al)/2))<8e-3,`forward ${f.gam.toFixed(5)}, backward ${b.gam.toFixed(5)}`);
 check("anti-aligned spin: phase = +Omega/2 (within 8e-3)",Math.abs(wrap(d.gam-C.omegaCone(al)/2))<8e-3&&Math.abs(wrap(d.gam+f.gam))<1e-6,`aligned ${f.gam.toFixed(6)}, anti-aligned ${d.gam.toFixed(6)}`)}

/* 6. gauge independence and the discrete Berry phase */
{const al=1.1,pts=C.loopPoints(C.makePath("cone",al),"uniform",4000),ex=wrap(-C.omegaCone(al)/2);
 const g0=C.discreteBerry(pts,true),res=[g0];
 for(let t=0;t<4;t++){const ph=Array.from({length:pts.length},()=>rng()*TWO*3);res.push(C.discreteBerry(pts,true,k=>ph[k]))}
 const spread=Math.max(...res)-Math.min(...res),err=Math.abs(wrap(g0-ex));
 check("discrete Berry phase (product of overlaps, 4000 points) = -Omega/2 (<= 1e-6)",err<=1e-6,`${g0.toFixed(8)} vs ${ex.toFixed(8)}, diff ${err.toExponential(2)}`);
 check("gauge independence: 4 random phase conventions of the eigenstates give the same phase (<= 1e-11)",spread<=1e-11,`spread ${spread.toExponential(2)}`);
 const dn=C.discreteBerry(pts,false);check("discrete Berry phase of the anti-aligned state = +Omega/2 (<= 1e-6)",Math.abs(wrap(dn+ex))<=1e-6,`${dn.toFixed(8)}`)}
{const pts=C.loopPoints(C.makePath("wobble",1.0),"uniform",6000),O=C.solidAngle(pts),g=C.discreteBerry(pts,true);
 check("discrete Berry phase on the wobbly loop = -Omega/2 (<= 1e-6)",Math.abs(wrap(g+O/2))<=1e-6,`${g.toFixed(8)} vs ${wrap(-O/2).toFixed(8)}`)}

/* 7. Berry curvature and monopole flux */
{let worst=0;for(const th of [0.3,1.0,1.9,2.8])for(const ph of [0,1.7])worst=Math.max(worst,Math.abs(C.berryCurvature(th,ph,true)+0.5),Math.abs(C.berryCurvature(th,ph,false)-0.5));
 check("Berry curvature of the spin state = -1/2 per unit solid angle (up), +1/2 (down) (<= 1e-8)",worst<=1e-8,`worst ${worst.toExponential(2)}`)}
{const al=1.3;let flux=0;const n=4000;for(let k=0;k<n;k++){const th=(k+0.5)/n*al;flux+=C.berryCurvature(th,0.3,true)*Math.sin(th)*TWO*(al/n)}
 check("flux of the curvature through the cap = -Omega/2 (<= 1e-6)",Math.abs(flux+C.omegaCone(al)/2)<=1e-6&&Math.abs(C.monopoleFlux(C.omegaCone(al),true)+flux)<=1e-6,`flux ${flux.toFixed(8)}, -Omega/2 ${(-C.omegaCone(al)/2).toFixed(8)}`)}
check("monopole g = 1/2: flux through the whole sphere = 2 pi, phase invisible",Math.abs(C.monopoleFlux(4*PI,true)-TWO)<1e-12&&Math.abs(C.berryExpected(4*PI,true))<1e-12,"");

/* 8. page readouts come from analyze(): a full run for the default view */
{const r=C.analyze({shape:"cone",alpha:PI/3,turns:10,prof:"uniform",up:true});
 const ok=Math.abs(r.sim.psi.reduce((s,x)=>s+x*x,0)-1)<1e-12&&r.exact.err<=1e-7&&Math.abs(r.Om-PI)<1e-6&&Math.abs(wrap(r.Phi-r.dyn-r.gam))<1e-12;
 check("analyze(): default view is consistent (norm 1, exact rotating frame <= 1e-7, Omega = pi, Phi - dynamical = geometric)",ok,`Omega ${r.Om.toFixed(7)}, gamma ${r.gam.toFixed(5)}, diff ${r.diff.toFixed(5)}, exact-frame error ${r.exact.err.toExponential(2)}, fid min ${r.fidMin.toFixed(4)}`);
 check("analyze(): phase deviation from the exact cone formula = deviation from the run (<= 1e-7)",Math.abs(wrap(C.phaseDeviationExact(PI/3,1,TWO*10,true)-r.diff))<=1e-7,`${C.phaseDeviationExact(PI/3,1,TWO*10,true).toFixed(6)} vs ${r.diff.toFixed(6)}`)}
{const fast=C.analyze({shape:"cone",alpha:PI/3,turns:0.2,prof:"uniform",up:true}),slow=C.analyze({shape:"cone",alpha:PI/3,turns:30,prof:"uniform",up:true});
 check("fast loop: spin lags (lowest fidelity < 0.9), slow loop follows (> 0.99)",fast.fidMin<0.9&&slow.fidMin>0.99,`fast ${fast.fidMin.toFixed(4)}, slow ${slow.fidMin.toFixed(4)}`);
 check("fast loop: geometric phase is far from -Omega/2 (> 0.3 rad), slow loop close (< 0.05)",Math.abs(fast.diff)>0.3&&Math.abs(slow.diff)<0.05,`fast diff ${fast.diff.toFixed(4)}, slow diff ${slow.diff.toFixed(4)}`)}

console.log(fails?`\n${fails} CHECK(S) FAILED`:"\nall checks passed");
process.exit(fails?1:0);
