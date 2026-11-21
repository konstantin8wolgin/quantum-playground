import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {Worker,isMainThread,parentPort,workerData} from "node:worker_threads";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"../demos/aharonov-bohm.html"),"utf8");
const m=html.match(/\/\* PHYSICS-CORE START \*\/([\s\S]*?)\/\* PHYSICS-CORE END \*\//);
if(!m){console.log("FAIL  core block not found");process.exit(1)}
const loadCore=()=>vm.runInNewContext(m[1]+";({abParams,abInit,abStep,abNorm,abSwitchCut,abApplyH,abPathSum,abFringeShift,abRelDiff,AB_PATH_SIGN,AB_GAUGE_SIGMA})",{Math,Float64Array,Int32Array,Uint8Array,Object,Array});
const C=loadCore();
function runOne(phi,cut,opts){
  const C=loadCore();
  const P=C.abParams({alpha:2*Math.PI*phi,cut});const S=C.abInit(P);
  let nmin=1e9,nmax=0,sw=false;
  while(S.t<P.T){C.abStep(S);
    if(opts.switchAt&&!sw&&S.t>=opts.switchAt){sw=true;C.abSwitchCut(S,opts.switchTo)}
    if(S.steps%50===0&&S.t<=300){const n=C.abNorm(S);nmin=Math.min(nmin,n);nmax=Math.max(nmax,n)}}
  return{acc:Array.from(S.acc),nmin,nmax};
}
if(!isMainThread){const w=workerData;parentPort.postMessage(runOne(w.phi,w.cut,w.opts));process.exit(0)}
let fails=0;
const out=(ok,msg)=>{console.log((ok?"PASS  ":"FAIL  ")+msg);if(!ok)fails++};
const NX=600,NY=360;
const P=C.abParams({});
function run(phi,cut,opts={}){
  return new Promise((res,rej)=>{const t0=Date.now();
    const w=new Worker(fileURLToPath(import.meta.url),{workerData:{phi,cut,opts}});
    w.on("message",r=>{console.log(`      run phi=${phi} cut=${cut}${opts.switchTo?"->"+opts.switchTo:""}: ${((Date.now()-t0)/1000).toFixed(1)} s`);r.acc=Float64Array.from(r.acc);res(r)});
    w.on("error",rej)})}
const [r0,r5,r5u,r1,r25,r5s]=await Promise.all([run(0,"right"),run(0.5,"right"),run(0.5,"up"),run(1,"right"),run(0.25,"right"),run(0.5,"right",{switchAt:150,switchTo:"up"})]);

/* path sums */
const ps=a=>{const o=new Float64Array(NY);C.abPathSum(P,2*Math.PI*a,o);return o};
const pRef=ps(0);
const sh=(ref,cur)=>C.abFringeShift(P,ref,cur);
/* (3) probability */
{const dev=Math.max(Math.abs(r0.nmax-1),Math.abs(r0.nmin-1),Math.abs(r5.nmax-1),Math.abs(r5.nmin-1));
 out(dev<0.01,`(3) total probability before absorption (t <= 300): max deviation ${(dev*100).toFixed(3)} % (limit 1 %)`)}
/* (1) fringe shifts */
const s5=sh(r0.acc,r5.acc),s25=sh(r0.acc,r25.acc),p5=sh(pRef,ps(0.5)),p25=sh(pRef,ps(0.25)),s25p=sh(pRef,r25.acc);
console.log(`      spacing ${s5.spacing.toFixed(1)}; shifts sim 0.5: ${s5.shift.toFixed(3)}, sim 0.25: ${s25.shift.toFixed(3)}, path 0.25: ${p25.shift.toFixed(3)}`);
out(Math.abs(Math.abs(s5.shift)-0.5)<0.05,`(1a) shift at Phi/Phi0 = 0.5: |${s5.shift.toFixed(3)}| = 0.5 +- 0.05`);
out(Math.abs(Math.abs(s25.shift)-0.25)<0.05,`(1b) shift at Phi/Phi0 = 0.25: |${s25.shift.toFixed(3)}| = 0.25 +- 0.05`);
out(Math.sign(s25.shift)===Math.sign(p25.shift)&&Math.abs(s25.shift-p25.shift)<0.05,`(1c) sim shift ${s25.shift.toFixed(3)} agrees in sign and size with path sum ${p25.shift.toFixed(3)}`);
{const d=C.abRelDiff(r1.acc,r0.acc);out(d<0.02,`(1d) pattern at Phi/Phi0 = 1 equals Phi = 0: relative difference ${d.toExponential(2)} (limit 2e-2)`)}
{const o=ps(1);let mx=0;for(let i=0;i<NY;i++)mx=Math.max(mx,Math.abs(o[i]-pRef[i]));out(mx<1e-9,`(1e) path sum at Phi/Phi0 = 1 equals Phi = 0 (max diff ${mx.toExponential(1)})`)}
/* (2) gauge */
{const d=C.abRelDiff(r5u.acc,r5.acc);out(d<1e-3,`(2a) cut right vs cut up, same flux: relative difference ${d.toExponential(2)} (limit 1e-3)`)}
{const d=C.abRelDiff(r5s.acc,r5.acc);out(d<1e-3,`(2b) cut moved during the run (gauge transformation of psi): relative difference ${d.toExponential(2)} (limit 1e-3)`)}
/* (4) leapfrog stays unitary with the gauge change */
{const dev=Math.max(Math.abs(r5s.nmax-1),Math.abs(r5s.nmin-1));out(dev<0.01,`(3b) probability with a cut change at t=150: max deviation ${(dev*100).toFixed(3)} %`)}
console.log(fails?`\n${fails} check(s) FAILED`:"\nall checks passed");
process.exit(fails?1:0);
