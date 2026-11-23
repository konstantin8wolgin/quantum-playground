// Node checks for demos/xy-vortices.html ("Broken symmetry").
// The page has no PHYSICS-CORE block, so this test cuts the two physics parts
// out of the page source by their section markers and runs them with a stub $().
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"../demos/xy-vortices.html"),"utf8");
const cut=(a,b)=>{const i=html.indexOf(a),j=html.indexOf(b,i);if(i<0||j<0)throw new Error("marker not found: "+a);return html.slice(i,j)};
const rngSrc=html.match(/function mulberry32[^\n]*/)[0];
const part1=cut("/* ================= Part 1","const cam=");
const p1fns=cut("function radialFreq","function read1");
const part2=cut("/* ================= Part 2","const off=");

let fails=0;
const check=(name,ok,detail)=>{console.log(`${ok?"PASS":"FAIL"}  ${name}  ${detail}`);if(!ok)fails++};

/* ---------- Part 1: ball on the Mexican hat ---------- */
function hat(mu2,gam){
  const params={mu:mu2,gam};
  return vm.runInNewContext(`${part1}\n${p1fns}\n;({get ball(){return ball},set ball(b){ball=b},step1,radialFreq,angSpeed,r0,energy1,barrier1,rTurn,rInner,angMom,get hist(){return hist},clear(){hist=[]}})`,
    {Math,$:id=>({value:params[id]})});
}
for(const mu2 of [1,0.5]){
  const H=hat(mu2,0);H.ball={x:H.r0(mu2)+0.02,y:0,vx:0,vy:0};
  for(let i=0;i<300;i++)H.step1(10);
  const w=H.radialFreq(),pred=2*Math.sqrt(mu2);
  check(`Higgs mode mu2=${mu2}: frequency = 2 mu`,Math.abs(w-pred)/pred<0.01,`measured ${w.toFixed(4)}, exact ${pred.toFixed(4)}`);
}
{const H=hat(-1,0);H.ball={x:0.12,y:0,vx:0,vy:0};for(let i=0;i<300;i++)H.step1(10);
 const w=H.radialFreq(),pred=Math.sqrt(2);
 check("symmetric bowl mu2=-1: frequency = sqrt(2|mu2|)",Math.abs(w-pred)/pred<0.01,`measured ${w.toFixed(4)}, exact ${pred.toFixed(4)}`)}
{const H=hat(1,0),r=H.r0(1);H.ball={x:r,y:0,vx:0,vy:0.3};
 const Lz=b=>b.x*b.vy-b.y*b.vx,L0=Lz(H.ball);for(let i=0;i<300;i++)H.step1(10);
 const d=Math.abs(Lz(H.ball)-L0)/Math.abs(L0);
 check("Goldstone direction: no friction keeps angular momentum",d<1e-3,`relative change ${d.toExponential(2)}`)}
{const H=hat(1,0.5);H.ball={x:1.5,y:0.3,vx:0,vy:0};for(let i=0;i<2000;i++)H.step1(10);
 const r=Math.hypot(H.ball.x,H.ball.y);
 check("with friction the ball settles in the valley r0 = sqrt(mu2/(2 lam))",Math.abs(r-H.r0(1))<1e-3,`r ${r.toFixed(5)}, r0 ${H.r0(1).toFixed(5)}`)}


/* ---------- Part 1: big pushes, over the hump ---------- */
{const H=hat(1,0);check("hump height = mu^4/(4 lam) = 1 for mu2 = 1",Math.abs(H.barrier1(1)-1)<1e-12,`${H.barrier1(1)}`)}
for(const [v,over] of [[1.3,false],[1.5,true],[2.5,true]]){
  const H=hat(1,0),r=H.r0(1);H.ball={x:r,y:0,vx:-v,vy:0};const E0=H.energy1();let rmin=9,rmax=0,Emax=0;
  for(let i=0;i<4000;i++){H.step1(1);const b=H.ball,rr=Math.hypot(b.x,b.y);rmin=Math.min(rmin,rr);rmax=Math.max(rmax,rr);Emax=Math.max(Emax,Math.abs(H.energy1()-E0))}
  const crossed=rmin<0.05;
  check(`push to the centre with speed ${v} (E = ${E0.toFixed(3)}, hump 1): ${over?"goes over the top":"turns back before the top"}`,crossed===over,`closest approach ${rmin.toFixed(4)}`);
  check(`  energy conserved without friction (relative <= 5e-4)`,Emax/E0<5e-4,`drift ${(Emax/E0).toExponential(2)}`);
  check(`  outer turning point = rTurn(E) (<= 1e-2)`,Math.abs(rmax-H.rTurn(E0,1))<1e-2,`${rmax.toFixed(4)} vs ${H.rTurn(E0,1).toFixed(4)}`);
}

{const H=hat(1,0),r=H.r0(1);H.ball={x:r,y:0,vx:-1.5,vy:0.25};const E=H.energy1(),L=H.angMom();let rmin=9;
 for(let i=0;i<4000;i++){H.step1(1);rmin=Math.min(rmin,Math.hypot(H.ball.x,H.ball.y))}
 check("with sideways motion the ball misses the centre; closest distance = rInner(E, L) (<= 2e-3)",rmin>0.05&&Math.abs(rmin-H.rInner(E,L,1))<2e-3,`E ${E.toFixed(3)} (> hump 1), L ${L.toFixed(3)}: closest ${rmin.toFixed(4)} vs ${H.rInner(E,L,1).toFixed(4)}`)}

/* ---------- Part 2: XY model ---------- */
function xy(seed){
  const src=`${rngSrc}\n${part2.replace("mulberry32(5)",`mulberry32(${seed})`)}\n;({th,L,NS,sweep,energy,vortices,addPair,hot,cold,get sweeps(){return sweeps}})`;
  return vm.runInNewContext(src,{Math,Float64Array,Int32Array});
}
{const X=xy(5);X.cold();check("cold start energy per site = -2",Math.abs(X.energy()+2)<1e-12,`${X.energy()}`);
 X.addPair(64,64);const v=X.vortices(),pos=v.filter(q=>q[2]>0).length,neg=v.filter(q=>q[2]<0).length;
 check("addPair makes one vortex and one antivortex",pos===1&&neg===1,`+${pos} / -${neg}`)}
for(const T of [0.1,0.2]){
  const X=xy(11);X.cold();for(let i=0;i<200;i++)X.sweep(T);
  let s=0,n=0;for(let i=0;i<200;i++){X.sweep(T);if(i%2===0){s+=X.energy();n++}}
  const E=s/n,sw=-2+T/2;
  check(`E/N at T=${T} vs spin-wave -2+T/2 (tol 0.01)`,Math.abs(E-sw)<0.01,`measured ${E.toFixed(4)}, spin-wave ${sw.toFixed(4)}`);
}
{const X=xy(3);X.hot();const v=X.vortices(),net=v.reduce((a,q)=>a+q[2],0);
 check("hot start: many vortices, total winding 0 on the torus",v.length>1000&&net===0,`${v.length} vortices, net winding ${net}`)}
{const X=xy(7);X.hot();const n0=X.vortices().length;for(let i=0;i<300;i++)X.sweep(0.3);const n1=X.vortices().length;
 check("cooling below T_KT removes most vortices",n1<0.1*n0,`${n0} -> ${n1}`)}

console.log(fails?`\n${fails} check(s) failed`:"\nall checks passed");
process.exit(fails?1:0);
