import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"../demos/feynman-mirror.html"),"utf8");
const m=html.match(/\/\* PHYSICS-CORE START \*\/([\s\S]*?)\/\* PHYSICS-CORE END \*\//);
if(!m){console.log("FAIL  core block not found");process.exit(1)}
const names="TAU sinc mirrorL mirrorDL mirrorD2L mirrorStationary taper makeStrips mirrorArrows sumArrows statPhaseAbs2 scrapeMask scrapeScore gratingMeasure refrT refrLeastTime refrAngles refrArrows filmR filmDelta filmTwoArrow filmAiry filmSeries filmTerms";
const C=vm.runInNewContext(m[1]+`;({${names.split(" ").join(",")}})`,{Math});
let fails=0;
const check=(name,ok,detail)=>{console.log(`${ok?"PASS":"FAIL"}  ${name}  ${detail}`);if(!ok)fails++};

/* ---- part 1: mirror ---- */
const S={x:-4,y:3},P={x:4,y:3},k=C.TAU/0.8;
check("equal-angle point is x=0 for S=(-4,3), P=(4,3)",Math.abs(C.mirrorStationary(S,P))<1e-12&&Math.abs(C.mirrorDL(0,S,P))<1e-12,`x*=${C.mirrorStationary(S,P)}`);
{ // random geometries: dL/dx = 0 exactly at x*, and sin(in) = sin(out) there
  let worst=0;
  for(const [sx,sy,px,py] of [[-4,3,1,2],[-2,1,7,4],[-6,5,3,0.5],[0,2,0,2],[-3,1,9,6]]){
    const a={x:sx,y:sy},b={x:px,y:py},x=C.mirrorStationary(a,b);worst=Math.max(worst,Math.abs(C.mirrorDL(x,a,b)))}
  check("dL/dx = 0 at the equal-angle point (5 geometries)",worst<1e-12,`max |dL/dx| = ${worst.toExponential(2)}`)}
{ // strip sum -> stationary phase result, and converges as strips -> many
  const lam=0.8,kk=C.TAU/lam;let rs=[];
  for(const N of [40,60,80,640,5120]){const st=C.makeStrips(N,-8,8,true),a=C.mirrorArrows(st,S,P,kk);rs.push(C.sumArrows(a.re,a.im).abs2/C.statPhaseAbs2(st,S,P,kk))}
  check("strip sum vs stationary phase, lambda=0.8, N=60 (tol 2%)",Math.abs(rs[1]-1)<0.02,`ratio ${rs[1].toFixed(4)}`);
  check("strip sum vs stationary phase, N=80 (tol 2%)",Math.abs(rs[2]-1)<0.02,`ratio ${rs[2].toFixed(4)}`);
  check("mirror sum converges as strips -> many (N=640 vs 5120, tol 1e-3)",Math.abs(rs[3]-rs[4])<1e-3,`${rs[3].toFixed(5)} vs ${rs[4].toFixed(5)}`);
  const k2=C.TAU/0.2,st=C.makeStrips(5120,-8,8,true),a=C.mirrorArrows(st,S,P,k2),q=C.sumArrows(a.re,a.im).abs2/C.statPhaseAbs2(st,S,P,k2);
  check("shorter wave (lambda=0.2): ratio closer to 1 (tol 0.2%)",Math.abs(q-1)<0.002,`ratio ${q.toFixed(5)}`)}
{ // middle strips give the sum: the outer strips alone give much less
  const st=C.makeStrips(80,-8,8,true),a=C.mirrorArrows(st,S,P,k),full=C.sumArrows(a.re,a.im).abs2,keep=new Uint8Array(80),mk=new Uint8Array(80);
  for(let i=0;i<80;i++){keep[i]=Math.abs(st.x[i])>4?1:0;mk[i]=Math.abs(st.x[i])<2?1:0}
  const out=C.sumArrows(a.re,a.im,keep).abs2,mid=C.sumArrows(a.re,a.im,mk).abs2;
  check("outer strips (|x|>4, half the mirror) give < 15% of the full |sum|^2",out<0.15*full,`outer/full = ${(out/full).toFixed(3)}`);
  check("middle strips (|x|<2) give the same order as the full sum (0.5 to 2.5)",mid/full>0.5&&mid/full<2.5,`mid/full = ${(mid/full).toFixed(3)}`)}
{ // scraping makes the light at the detector much stronger
  const D={x:0,y:3},st=C.makeStrips(80,-8,8,true),a=C.mirrorArrows(st,S,D,k),before=C.sumArrows(a.re,a.im).abs2,keep=C.scrapeMask(a),after=C.sumArrows(a.re,a.im,keep).abs2;
  check("scraping raises |A|^2 at the detector (N=80, P=(0,3))",after>4*before,`before ${before.toFixed(3)}, after ${after.toFixed(3)}, gain x${(after/before).toFixed(1)}`)}
{ // grating law, far field: d (sin out - sin in) = m lambda with m = 1; peak of the scraped mirror sits at the target angle
  const lam=1,kk=C.TAU/lam,R=1e6,ti=0.6,to=-0.2,Sf={x:-R*Math.sin(ti),y:R*Math.cos(ti)},
    Pf=(t)=>({x:R*Math.sin(t),y:R*Math.cos(t)}),st=C.makeStrips(6000,-400,400,false);
  const a=C.mirrorArrows(st,Sf,Pf(to),kk),keep=C.scrapeMask(a),g=C.gratingMeasure(st,keep,Sf,Pf(to),lam,0,C.scrapeScore(a));
  const formula=lam/(Math.sin(ti)-Math.sin(to));
  check("grating period from the mask = lambda/(sin in - sin out) (tol 1%)",Math.abs(g.d-formula)/formula<0.01,`d=${g.d.toFixed(4)}, formula ${formula.toFixed(4)}`);
  check("grating law d (sin out - sin in) = m lambda, m = 1 (tol 1%)",Math.abs(g.m-1)<0.01,`m = ${g.m.toFixed(4)}`);
  let bt=0,bv=-1;for(let j=0;j<=2000;j++){const t=to-0.05+0.1*j/2000,b=C.mirrorArrows(st,Sf,Pf(t),kk),v=C.sumArrows(b.re,b.im,keep).abs2;if(v>bv){bv=v;bt=t}}
  const sinOutPeak=Math.sin(bt),sinPred=Math.sin(ti)-lam/g.d;
  check("peak angle of the scraped mirror vs grating formula (tol 2e-3 in sin)",Math.abs(sinOutPeak-sinPred)<2e-3,`peak sin = ${sinOutPeak.toFixed(5)}, formula ${sinPred.toFixed(5)}`);
  const sp=C.mirrorArrows(st,Sf,Pf(ti),kk),spec=C.sumArrows(sp.re,sp.im).abs2,full=C.sumArrows(sp.re,sp.im,C.scrapeMask(sp)).abs2;
  check("unscraped mirror: strong light at the equal angle, weak at the target",C.sumArrows(a.re,a.im).abs2<0.01*spec,`at target ${C.sumArrows(a.re,a.im).abs2.toFixed(1)}, at equal angle ${spec.toFixed(1)}`)}

/* ---- part 2: refraction ---- */
{ let worst=0,cnt=0;
  for(const n of [1,1.2,1.33,1.5,1.9,2.4])for(const [sx,sy,px,py] of [[-3,3,4,3],[-4,1,2,5],[-1,6,8,0.5],[-8,2,-7,2],[0,1,6,1]]){
    const Sa={x:sx,y:sy},Pa={x:px,y:py},x=C.refrLeastTime(Sa,Pa,n),q=C.refrAngles(x,Sa,Pa);worst=Math.max(worst,Math.abs(q.ratio-n));cnt++}
  check(`Snell's law from the least-time point: sin(in)/sin(out) = n (${cnt} cases, tol 1e-6)`,worst<1e-6,`max |ratio - n| = ${worst.toExponential(2)}`)}
{ const Sa={x:-3,y:3},Pa={x:4,y:3},n=1.5,x=C.refrLeastTime(Sa,Pa,n);
  check("derivative of travel time vanishes there (tol 1e-7)",Math.abs(C.refrT(x+1e-6,Sa,Pa,n)-C.refrT(x-1e-6,Sa,Pa,n))<1e-10,`x*=${x.toFixed(6)}`)}
{ // refraction arrows: strips near the least-time point give most of the sum
  const Sa={x:-3,y:3},Pa={x:4,y:3},n=1.5,kk=C.TAU/0.5,x=C.refrLeastTime(Sa,Pa,n),st=C.makeStrips(4000,-10,10,true),a=C.refrArrows(st,Sa,Pa,n,kk),keep=new Uint8Array(4000);
  for(let i=0;i<4000;i++)keep[i]=Math.abs(st.x[i]-x)<1.5?1:0;
  const f=C.sumArrows(a.re,a.im,keep).abs2/C.sumArrows(a.re,a.im).abs2;
  check("refraction: strips within 1.5 of the least-time point carry the sum (tol 15%)",Math.abs(f-1)<0.15,`ratio ${f.toFixed(3)}`)}

/* ---- part 3: glass sheet ---- */
{ const n=1.5,r=C.filmR(n);
  check("front arrow length r = (n-1)/(n+1) = 0.2 for n = 1.5",Math.abs(r-0.2)<1e-15,`r=${r}`);
  check("single surface reflects r^2 = 4 %",Math.abs(r*r-0.04)<1e-15,`${(100*r*r).toFixed(3)} %`);
  const two=(d)=>C.filmTwoArrow(n,d).R;
  check("two arrows: R = 0 at thickness 0",two(0)<1e-30,`R=${two(0)}`);
  check("two arrows: maximum 4 r^2 = 16 % at delta = pi",Math.abs(two(Math.PI)-4*r*r)<1e-14&&Math.abs(two(Math.PI)-0.16)<1e-14,`${(100*two(Math.PI)).toFixed(4)} %`);
  let mx=0;for(let i=0;i<=20000;i++)mx=Math.max(mx,two(C.TAU*i/20000));
  check("two arrows: scan finds no value above 16 %",mx<=0.16+1e-12,`max ${(100*mx).toFixed(4)} %`);
  const A=(d)=>C.filmAiry(n,d),maxA=4*r*r/((1+r*r)*(1+r*r));
  check("Airy maximum = 4 r^2/(1+r^2)^2 = 14.79 % (tol 1e-12)",Math.abs(A(Math.PI)-maxA)<1e-12&&Math.abs(maxA-0.147929)<1e-6,`${(100*A(Math.PI)).toFixed(4)} % (formula ${(100*maxA).toFixed(4)} %)`);
  let worst=0;for(const nn of [1.1,1.33,1.5,2,3])for(let i=0;i<=360;i++){const d=C.TAU*i/360;worst=Math.max(worst,Math.abs(C.filmAiry(nn,d)-C.filmSeries(nn,d,200).R))}
  check("Airy formula = direct sum of all bounce arrows (5 indices, 361 phases, tol 1e-12)",worst<1e-12,`max diff ${worst.toExponential(2)}`);
  const s2=C.filmSeries(n,Math.PI/2,2).R,s20=C.filmSeries(n,Math.PI/2,20).R;
  check("bounce series converges quickly (2 bounces vs 20, tol 1e-3)",Math.abs(s2-s20)<1e-3,`${s2.toFixed(6)} vs ${s20.toFixed(6)}`);
  check("period: R repeats when 2nt grows by one wavelength",Math.abs(A(C.filmDelta(n,0.1,0.55))-A(C.filmDelta(n,0.1+0.55/(2*n),0.55)))<1e-12,"delta -> delta + 2 pi");
  check("two-arrow value is above Airy at the top (16 % vs 14.8 %)",two(Math.PI)>A(Math.PI),`${(100*two(Math.PI)).toFixed(2)} % vs ${(100*A(Math.PI)).toFixed(2)} %`);
  check("n = 1 (no glass): no reflection",C.filmAiry(1,1.234)===0&&C.filmTwoArrow(1,1.234).R===0,"R = 0")}

console.log(fails?`\n${fails} check(s) FAILED`:"\nall checks passed");
process.exit(fails?1:0);
