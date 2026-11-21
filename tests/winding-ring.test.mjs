import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"../demos/winding-ring.html"),"utf8");
const m=html.match(/\/\* PHYSICS-CORE START \*\/([\s\S]*?)\/\* PHYSICS-CORE END \*\//);
if(!m){console.log("FAIL  core block not found");process.exit(1)}
const names="zSector sectorsAuto levelsAuto ZwindRe ZwindIm Zwind kStar levelE ZenergyPart Zenergy E0 Efree J0 Jwind Jenergy pSector nSquared cosAverage errWind errEnergy neededWind neededEnergy mulberry32 gauss bridgePath wrap logK sliceCount mcNew mcWinding mcSweep blockStats TWO_PI";
const C=vm.runInNewContext(m[1]+`;({${names.split(" ").join(",")}})`,{Math,Float64Array});
let fails=0;
const check=(name,ok,detail)=>{console.log(`${ok?"PASS":"FAIL"}  ${name}  ${detail}`);if(!ok)fails++};
const PI=Math.PI;

// 1. Poisson duality
{let worst=0,n=0;
 for(const I of [0.5,1,2])for(const beta of [0.3,1,3,8,20,30])for(const th of [0,0.4,1.3,PI,4.5,-2.2,7.5,-9]){
   const a=C.Zwind(beta,th,I),b=C.Zenergy(beta,th,I);worst=Math.max(worst,Math.abs(a-b)/b);n++}
 check("Poisson duality: winding sum = energy sum (<= 1e-12 relative)",worst<=1e-12,`${n} cases, worst ${worst.toExponential(2)}`)}

// 2. E0 from -(1/beta) ln Z at large beta
{let worst=0;
 for(const I of [0.5,1,2])for(const th of [0,0.7,1.9,2.8,-1.5,4,-5.5,8]){
   const beta=60*I,e=C.Efree(beta,th,I),e0=C.E0(th,I),c=C.kStar(th);let extra=0;
   for(let k=c-30;k<=c+30;k++)if(k!==c)extra+=Math.exp(-beta*(C.levelE(k,th,I)-e0));
   worst=Math.max(worst,Math.abs(e-(e0-Math.log(1+extra)/beta)))}
 check("-(1/beta) ln Z from the winding sum = E0 - ln(1 + sum_{k != k*} e^{-beta gap})/beta (<= 1e-11)",worst<=1e-11,`worst ${worst.toExponential(2)}`)}
{let w2=0;for(const I of [0.5,1,2]){const beta=50*I;for(const th of [0,0.7,1.9,2.8,-1.5,4,-5.5,8])w2=Math.max(w2,Math.abs(C.Efree(beta,th,I)-C.E0(th,I))*beta)}
 check("-(1/beta) ln Z -> E0(theta) at beta = 50 I: beta*|diff| <= ln 2 (two levels at most degenerate)",w2<=Math.log(2)+1e-9,`worst beta*|diff| ${w2.toFixed(4)} (ln 2 = ${Math.log(2).toFixed(4)})`)}
{let worst=0;for(const I of [0.5,1,3])for(let i=0;i<200;i++){const th=-12+24*i/199;let mn=1e9;for(let k=-8;k<=8;k++)mn=Math.min(mn,C.levelE(k,th,I));worst=Math.max(worst,Math.abs(mn-C.E0(th,I)))}
 check("E0(theta) = min_k (k - theta/2pi)^2/2I",worst<=1e-14,`worst ${worst.toExponential(2)}`)}

// 3. periodicity, symmetry, crossing
{let wp=0,ws=0;
 for(const I of [0.5,1,2])for(const th of [0.2,1.1,2.9,-1.7,4.4])for(const beta of [0.5,4,25]){
   wp=Math.max(wp,Math.abs(C.Zwind(beta,th+2*PI,I)-C.Zwind(beta,th,I))/C.Zwind(beta,th,I));
   ws=Math.max(ws,Math.abs(C.Zwind(beta,-th,I)-C.Zwind(beta,th,I))/C.Zwind(beta,th,I))}
 check("Z periodic in theta (period 2 pi), relative <= 1e-12",wp<=1e-12,`worst ${wp.toExponential(2)}`);
 check("Z symmetric theta -> -theta, relative <= 1e-12",ws<=1e-12,`worst ${ws.toExponential(2)}`)}
{let we=0;for(const th of [0.3,1.5,2.7,4.0])we=Math.max(we,Math.abs(C.E0(th,1)-C.E0(-th,1)),Math.abs(C.E0(th+2*PI,1)-C.E0(th,1)));
 const I=1.3,a=C.levelE(0,PI,I),b=C.levelE(1,PI,I),a2=C.levelE(1,3*PI,I),b2=C.levelE(2,3*PI,I);
 check("E0 periodic and symmetric; levels k=0 and k=1 cross at theta=pi (also 1,2 at 3 pi), E = 1/(8I)",we<=1e-14&&Math.abs(a-b)<1e-15&&Math.abs(a2-b2)<1e-15&&Math.abs(C.E0(PI,I)-1/(8*I))<1e-15,`E0(pi) = ${C.E0(PI,I).toFixed(8)}, 1/(8I) = ${(1/(8*I)).toFixed(8)}`);
 check("lowest level switches from k=0 to k=1 at theta = pi",C.kStar(PI-1e-9)===0&&C.kStar(PI+1e-9)===1,`kStar ${C.kStar(PI-1e-9)} -> ${C.kStar(PI+1e-9)}`)}

// 4. Z real and positive; terms alternate at pi
{let maxIm=0,allPos=true;
 for(const I of [0.5,1,2])for(const beta of [0.2,1,5,15,30])for(let i=0;i<=40;i++){const th=-2*PI+4*PI*i/40,N=C.sectorsAuto(beta,I);
   maxIm=Math.max(maxIm,Math.abs(C.ZwindIm(beta,th,I,N)));if(!(C.Zwind(beta,th,I)>0))allPos=false}
 check("Z real: imaginary part of the sector sum = 0 (<= 1e-15)",maxIm<=1e-15,`max |Im Z| ${maxIm.toExponential(2)}`);
 check("Z > 0 for every theta (it is a sum of exp(-beta E_k))",allPos,"3 I x 5 beta x 41 theta")}
{let ok=true;const beta=10,I=1;let prev=null;
 for(let n=0;n<=6;n++){const t=Math.cos(PI*n)*C.zSector(n,beta,I);if(prev!==null&&Math.sign(t)===Math.sign(prev))ok=false;prev=t}
 let mono=true;for(let n=0;n<8;n++)if(!(C.zSector(n+1,beta,I)<C.zSector(n,beta,I)))mono=false;
 const Z=C.Zenergy(beta,PI,I);let alt=true;for(let N=1;N<=3;N++){const s1=Math.sign(C.ZwindRe(beta,PI,I,N)-Z),s0=Math.sign(C.ZwindRe(beta,PI,I,N-1)-Z);if(s1===s0)alt=false}
 check("at theta = pi the terms (-1)^n z_n alternate in sign, |terms| fall, and partial sums alternate around Z",ok&&mono&&alt,`terms alternate ${ok}, decreasing ${mono}, partial sums alternate ${alt}`)}

// 5. persistent current
{let worst=0,w2=0;
 for(const I of [0.5,1,2])for(const beta of [0.5,3,20])for(const th of [0.3,1.7,2.9,3.4,-2.2,5.5]){
   const a=C.Jwind(beta,th,I),b=C.Jenergy(beta,th,I);worst=Math.max(worst,Math.abs(a-b));
   const h=1e-5,dn=(Math.log(C.Zwind(beta,th+h,I))-Math.log(C.Zwind(beta,th-h,I)))/(2*h)/beta;w2=Math.max(w2,Math.abs(dn-a))}
 check("thermal current: sector form = level form (<= 1e-12), and = (1/beta) d ln Z / d theta (<= 1e-8)",worst<=1e-12&&w2<=1e-8,`worst ${worst.toExponential(2)}, finite difference ${w2.toExponential(2)}`)}
{const I=1.7,jl=C.J0(PI-1e-9,I),jr=C.J0(PI+1e-9,I);
 let saw=true;for(const th of [-1,0.5,2,3]){if(Math.abs(C.J0(th,I)-(-th/(2*PI)/(2*PI*I)))>1e-14)saw=false}
 check("zero-T current is a sawtooth: J = -theta/(4 pi^2 I) on (-pi,pi), jumps by 1/(2 pi I) at theta = pi",saw&&Math.abs((jr-jl)-1/(2*PI*I))<1e-8&&Math.abs(jl+1/(4*PI*I))<1e-8,`jump ${(jr-jl).toFixed(8)}, expected ${(1/(2*PI*I)).toFixed(8)}`);
 const b1=C.Jwind(50,PI-1.5,1),b2=C.Jwind(50,PI+1.5,1),b3=C.Jwind(0.5,PI-1.5,1);
 check("at beta = 50 the thermal current is the sawtooth on both sides of the jump (<= 1e-4); at beta = 0.5 it is far from it",Math.abs(b1-C.J0(PI-1.5,1))<1e-4&&Math.abs(b2-C.J0(PI+1.5,1))<1e-4&&Math.abs(b3-C.J0(PI-1.5,1))>1e-3,`${b1.toFixed(6)} vs ${C.J0(PI-1.5,1).toFixed(6)}; ${b2.toFixed(6)} vs ${C.J0(PI+1.5,1).toFixed(6)}; beta 0.5: ${b3.toExponential(2)}`)}

// 6. <n^2>
{let worst=0;for(const I of [0.5,1,2])for(const beta of [10,25]){const h=1e-3,lz=t=>Math.log(C.Zwind(beta,t,I));const d2=-(lz(h)-2*lz(0)+lz(-h))/(h*h);worst=Math.max(worst,Math.abs(d2-C.nSquared(beta,I))/C.nSquared(beta,I))}
 check("<n^2> = Sum n^2 z_n / Sum z_n = -d^2 ln Z / d theta^2 at theta = 0 (rel <= 1e-5)",worst<=1e-5,`worst ${worst.toExponential(2)}`)}
{let s=0;for(let n=-20;n<=20;n++)s+=C.pSector(n,6,1);
 check("p(n) is a probability distribution (sum = 1)",Math.abs(s-1)<1e-14,`sum-1 = ${(s-1).toExponential(2)}`)}

// 7. convergence helpers
{const I=1;let up=true,down=true,pw=-1,pe=1e9;
 for(const beta of [0.3,1,3,10,30]){const w=C.neededWind(beta,1.1,I,1e-10),e=C.neededEnergy(beta,1.1,I,1e-10);if(w<pw)up=false;if(e>pe)down=false;pw=w;pe=e}
 check("sectors needed grow with beta, levels needed fall with beta (tol 1e-10)",up&&down&&C.neededWind(0.3,1.1,I,1e-10)<=1&&C.neededEnergy(30,1.1,I,1e-10)<=3,`wind at beta 0.3: ${C.neededWind(0.3,1.1,I,1e-10)}, 30: ${C.neededWind(30,1.1,I,1e-10)}; energy at 0.3: ${C.neededEnergy(0.3,1.1,I,1e-10)}, 30: ${C.neededEnergy(30,1.1,I,1e-10)}`)}

// 8. sample paths
{const rng=C.mulberry32(5),zs=new Float64Array(100);for(let j=0;j<100;j++)zs[j]=C.gauss(rng);const p=C.bridgePath(2,5,1,zs);
 check("bridge path starts at 0 and ends at 2 pi n",Math.abs(p[0])<1e-14&&Math.abs(p[100]-4*PI)<1e-12,`${p[0]}, ${p[100]}`)}

// 9. Monte Carlo
{const beta=8,I=1,ex=C.nSquared(beta,I),exc=C.cosAverage(beta,2.0,I);let all=true;const out=[];let sumd=0,sume2=0;
 for(const seed of [1,2,3]){const st=C.mcNew(beta,I,seed);for(let i=0;i<40000;i++)C.mcSweep(st);
   const a=C.blockStats(st.ns,1000,n=>n*n,20),c=C.blockStats(st.ns,1000,n=>Math.cos(2.0*n),20),z1=Math.abs(a.mean-ex)/a.err,z2=Math.abs(c.mean-exc)/c.err;
   if(z1>3||z2>3)all=false;out.push(`seed ${seed}: <n^2> ${a.mean.toFixed(4)}+-${a.err.toFixed(4)} (${z1.toFixed(1)} sigma), <cos 2n> ${c.mean.toFixed(4)}+-${c.err.toFixed(4)} (${z2.toFixed(1)} sigma)`);
   sumd+=(a.mean-ex)/(a.err*a.err);sume2+=1/(a.err*a.err)}
 const comb=sumd/sume2,cerr=1/Math.sqrt(sume2);
 check(`Monte Carlo (beta/I = 8): <n^2> and <cos 2n> within 3 sigma of exact (${ex.toFixed(4)}, ${exc.toFixed(4)}) for 3 seeds`,all,out.join(" | "));
 check("Monte Carlo: three seeds together agree with exact <n^2> within 3 sigma (no bias)",Math.abs(comb)/cerr<=3,`combined offset ${(comb/cerr).toFixed(2)} sigma`)}
{const st=C.mcNew(6,1,4);for(let i=0;i<2000;i++)C.mcSweep(st);
 let ok=true;for(let i=0;i<st.N;i++)if(!(st.phi[i]===st.phi[i]))ok=false;
 check("Monte Carlo state stays finite; local acceptance between 20% and 95%",ok&&st.acc/st.tries>0.2&&st.acc/st.tries<0.95,`acceptance ${(st.acc/st.tries).toFixed(3)}`)}

console.log(fails?`\n${fails} check(s) FAILED`:"\nall checks passed");
process.exit(fails?1:0);
