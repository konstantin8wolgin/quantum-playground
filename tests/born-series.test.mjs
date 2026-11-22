import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"../demos/born-series.html"),"utf8");
const m=html.match(/\/\* PHYSICS-CORE START \*\/([\s\S]*?)\/\* PHYSICS-CORE END \*\//);
if(!m){console.log("FAIL  core block not found");process.exit(1)}
const names="cmul cadd csub cdiv cabs cpow prob potentialSites integralOfV combElems exactElems scatter exactAmps deltaExact doubleDeltaExact barrierExact transmissionBarrierFormula bornSeries partialSum growthRate rhoDouble firstBornFormula".split(" ");
const C=vm.runInNewContext(m[1]+`;({${names.join(",")}})`,{Math});
let fails=0;
const check=(name,ok,detail)=>{console.log(`${ok?"PASS":"FAIL"}  ${name}  ${detail}`);if(!ok)fails++};
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const ks=[0.3,0.9,1.7,3.2,5.5];

// 1. transfer matrix against analytic results
{let w=0;for(const k of ks)for(const g of [-3,-0.7,0.4,2.5]){const a=C.exactAmps("delta",g,k),b=C.deltaExact(g,k);w=Math.max(w,dist(a.t,b.t),dist(a.r,b.r))}
 check("single delta: transfer matrix = 1/(1+ig/k) and r (<= 1e-10)",w<=1e-10,`worst diff ${w.toExponential(2)}, e.g. g=2.5,k=1.7: t=${C.deltaExact(2.5,1.7).t.map(x=>x.toFixed(6))}`)}
{let w=0;for(const k of ks)for(const g of [-3,-0.7,0.4,2.5]){const a=C.exactAmps("double",g,k),b=C.doubleDeltaExact(g,k,1);w=Math.max(w,dist(a.t,b.t),dist(a.r,b.r))}
 check("double delta: transfer matrix = Dyson 2x2 solution (<= 1e-10)",w<=1e-10,`worst diff ${w.toExponential(2)}`)}
{let w=0,wT=0;for(const k of ks)for(const V of [-4,-1,0.3,1,3,8]){const a=C.exactAmps("barrier",V,k),b=C.barrierExact(V,1,k);w=Math.max(w,dist(a.t,b.t),dist(a.r,b.r));wT=Math.max(wT,Math.abs(C.prob(a.t)-C.transmissionBarrierFormula(V,1,k)))}
 check("square barrier/well: transfer matrix = analytic t, r (<= 1e-10), also tunnelling regime V>E",w<=1e-10&&wT<=1e-10,`worst diff t,r ${w.toExponential(2)}, T formula ${wT.toExponential(2)}`)}
{const V=-3,k=Math.sqrt(Math.PI*Math.PI-6),a=C.exactAmps("barrier",V,k);
 check("well V0=-3: perfect transmission at k=sqrt(pi^2-6) (q*w = pi)",Math.abs(C.prob(a.t)-1)<1e-12,`k=${k.toFixed(5)}, |t|^2=${C.prob(a.t).toFixed(14)}`)}

// 2. unitarity
{let w=0;for(const nm of ["delta","double","barrier","gauss"])for(const k of ks)for(const s of [-5,-1,0.5,2,6]){const a=C.exactAmps(nm,s,k,400);w=Math.max(w,Math.abs(C.prob(a.t)+C.prob(a.r)-1))}
 check("|t|^2 + |r|^2 = 1 for all four potentials, many k and strengths (<= 1e-10)",w<=1e-10,`worst ${w.toExponential(2)}`)}
{const a=C.exactAmps("barrier",1,2),b=C.exactAmps("barrier",0,2);
 check("zero potential: t = 1, r = 0",dist(b.t,[1,0])<1e-14&&C.cabs(b.r)<1e-14,`t=${b.t}, r=${b.r}`);
 const L=C.exactAmps("gauss",1.3,1.1,800),L2=C.exactAmps("gauss",1.3,1.1,1600);
 check("Gaussian: comb of 800 kicks vs 1600 kicks agree (<= 1e-5)",dist(L.t,L2.t)<=1e-5,`diff ${dist(L.t,L2.t).toExponential(2)}`)}

// 3. single delta: the Born series is the geometric series, term by term
{let w=0,tag="";for(const [g,k] of [[0.5,2],[-1.2,3],[3,2],[-2,1],[0.9,1]]){const B=C.bornSeries(C.potentialSites("delta",g,1),k,12),gam=[0,-g/k];
   for(let n=0;n<=12;n++){const f=C.cpow(gam,n);w=Math.max(w,dist(B.t[n],f)/Math.max(1,C.cabs(f)),dist(B.r[n],n?f:[0,0])/Math.max(1,C.cabs(f)))}}
 const B=C.bornSeries(C.potentialSites("delta",0.5,1),2,3);
 check("delta: t_n = r_n = (g/ik)^n term by term, orders 0..12, five cases (rel <= 1e-12)",w<=1e-12,`worst ${w.toExponential(2)}; g=0.5,k=2: t1=${B.t[1].map(x=>x.toFixed(6))} t2=${B.t[2].map(x=>x.toFixed(6))}`)}
{const g=0.8,k=2,B=C.bornSeries(C.potentialSites("delta",g,1),k,60),p=C.partialSum(B.t,60),ex=C.deltaExact(g,k).t;
 check("delta g/k=0.4: 60-term sum = 1/(1+ig/k) (<= 1e-14)",dist(p,ex)<=1e-14,`diff ${dist(p,ex).toExponential(2)}, t=${ex.map(x=>x.toFixed(8))}`)}
{const g=3,k=2,B=C.bornSeries(C.potentialSites("delta",g,1),k,30),ex=C.deltaExact(g,k).t,e=[5,10,20,30].map(N=>dist(C.partialSum(B.t,N),ex));
 const rho=C.growthRate(C.potentialSites("delta",g,1),k);
 check("delta g/k=1.5: series diverges, error grows like 1.5^N; growth rate rho = |g|/k (<= 1e-6)",e[0]<e[1]&&e[1]<e[2]&&e[2]<e[3]&&e[3]>1e4&&Math.abs(rho-1.5)<1e-6,`errors N=5,10,20,30: ${e.map(x=>x.toExponential(1)).join(", ")}; rho=${rho.toFixed(8)}`)}
{const a=C.growthRate(C.potentialSites("delta",-2,1),1.99),b=C.growthRate(C.potentialSites("delta",-2,1),2.01);
 check("attractive delta g=-2 (bound state at E=-2): series converges only for k > |g|",a>1&&b<1,`rho(k=1.99)=${a.toFixed(5)}, rho(k=2.01)=${b.toFixed(5)}`)}

// 4. numerical Born series for extended potentials
{const S=C.potentialSites("barrier",0.5,4000),k=2,B=C.bornSeries(S,k,40),p=C.partialSum(B.t,40),pr=C.partialSum(B.r,40),ex=C.barrierExact(0.5,1,k),exc=C.scatter(k,C.combElems(S));
 check("weak barrier V0=0.5, k=2: order-40 sum = exact t and r (<= 1e-6)",dist(p,ex.t)<=1e-6&&dist(pr,ex.r)<=1e-6,`|t_40-t| ${dist(p,ex.t).toExponential(2)}, |r_40-r| ${dist(pr,ex.r).toExponential(2)}`);
 check("same sum against the exact solution of the SAME row of kicks (<= 1e-12)",dist(p,exc.t)<=1e-12,`diff ${dist(p,exc.t).toExponential(2)} (the 1e-7..1e-9 gap above is the grid)`);
 const e=[1,2,3,4,5].map(N=>dist(C.partialSum(B.t,N),ex.t)),rho=C.growthRate(S,k);
 let ratio=e[4]/e[3];check("error falls by about rho per order",e[4]<e[3]&&e[3]<e[2]&&Math.abs(ratio-rho)<0.15,`errors ${e.map(x=>x.toExponential(1)).join(" ")}; ratio ${ratio.toFixed(3)}, rho ${rho.toFixed(3)}`)}
{const S=C.potentialSites("gauss",1,800),k=2,B=C.bornSeries(S,k,60),p=C.partialSum(B.t,60),ex=C.exactAmps("gauss",1,k,800);
 check("Gaussian bump V0=1, k=2: order-60 sum = exact (<= 1e-12)",dist(p,ex.t)<=1e-12,`diff ${dist(p,ex.t).toExponential(2)}, T=${C.prob(ex.t).toFixed(6)}`)}
{const S=C.potentialSites("barrier",6,600),r1=C.growthRate(S,1),B=C.bornSeries(S,1,30),ex=C.barrierExact(6,1,1),e=[5,10,20,30].map(N=>dist(C.partialSum(B.t,N),ex.t));
 check("strong barrier V0=6, k=1: rho > 1 and the series diverges",r1>1&&e[0]<e[1]&&e[1]<e[2]&&e[2]<e[3]&&e[3]>1e6,`rho=${r1.toFixed(3)}, errors N=5..30: ${e.map(x=>x.toExponential(1)).join(", ")}`)}
{const S=C.potentialSites("barrier",-3,600),r1=C.growthRate(S,1.97),r2=C.growthRate(S,4);
 check("well V0=-3: rho>1 at the resonance k=1.97, rho<1 at k=4",r1>1&&r2<1,`rho(1.97)=${r1.toFixed(3)}, rho(4)=${r2.toFixed(3)}`)}
{let w=0,lines=[];for(const [g,k] of [[1,0.7],[-2,1],[1.5,1],[1,2],[-0.5,3.3],[2,0.5]]){const rr=C.growthRate(C.potentialSites("double",g,1),k,400,100),f=C.rhoDouble(g,k,1);w=Math.max(w,Math.abs(rr-f)/f);lines.push(f.toFixed(3))}
 check("two spikes: growth rate = (|g|/k) 2 max(|cos|,|sin|)(ka/2) (rel <= 1e-3)",w<=1e-3,`worst rel ${w.toExponential(2)}; rho values ${lines.join(" ")}`)}
{const S=C.potentialSites("double",1,1),B=C.bornSeries(S,1,10),ex=C.doubleDeltaExact(1,1,1),e=[4,6,8,10].map(N=>dist(C.partialSum(B.t,N),ex.t));
 check("two spikes g=1, k=1 (|g|/k = 1, rho = 1.76): diverges although a single spike would be borderline",e[3]>e[0]&&e[3]>1,`errors ${e.map(x=>x.toExponential(1)).join(", ")}`)}
{let n=0,all=true;for(const [g,k] of [[0.3,2],[-0.4,3],[0.5,1.5],[-1,4]]){const S=C.potentialSites("double",g,1),B=C.bornSeries(S,k,12),ex=C.doubleDeltaExact(g,k,1);if(C.growthRate(S,k)<0.9){n++;if(dist(C.partialSum(B.t,12),ex.t)>1e-2)all=false}}
 check("two spikes: converging cases approach the Dyson solution",all&&n>=3,`${n} converging cases checked`)}

// 5. first Born approximation = Fourier transform of V
{let w=0,wr=0,det="";for(const nm of ["delta","double","barrier","gauss"])for(const k of [0.6,1.4,2.8])for(const s of [-1.5,0.7]){
   const B=C.bornSeries(C.potentialSites(nm,s,3000),k,1),f=C.firstBornFormula(nm,s,k);w=Math.max(w,dist(B.t[1],f.t1));wr=Math.max(wr,dist(B.r[1],f.r1))}
 const f=C.firstBornFormula("barrier",0.7,1.4);
 check("first Born t1 = (1/ik) int V, r1 = (1/ik) int V e^{2ikx} (<= 1e-6)",w<=1e-6&&wr<=1e-6,`worst t1 ${w.toExponential(1)}, r1 ${wr.toExponential(1)}; barrier V0=0.7,k=1.4: r1=${f.r1.map(x=>x.toFixed(6))}`);
 check("integral of V (first Born t1 = -i*intV/k)",Math.abs(C.integralOfV("gauss",1)-0.4*Math.sqrt(2*Math.PI))<1e-14&&C.integralOfV("double",2)===4,"gauss 0.4 sqrt(2 pi), double 2g")}
{const k=3,S=C.potentialSites("barrier",0.4,2000),B=C.bornSeries(S,k,30),ex=C.barrierExact(0.4,1,k),T1=1-C.prob(B.r[1]),Tex=C.prob(ex.t),Tt=C.prob([1+B.t[1][0],B.t[1][1]]);
 check("first Born T = 1-|r1|^2 is close to exact at high k; |1+t1|^2 is above 1 (not a probability)",Math.abs(T1-Tex)<0.01&&Tt>1,`exact ${Tex.toFixed(5)}, 1-|r1|^2 ${T1.toFixed(5)}, |1+t1|^2 ${Tt.toFixed(5)}`)}
{const S=C.potentialSites("barrier",0.4,1000),k=[1,2,4,8].map(kk=>C.growthRate(S,kk));
 check("rho falls with k (fast particle needs fewer kicks)",k[0]>k[1]&&k[1]>k[2]&&k[2]>k[3],`rho(k=1,2,4,8) = ${k.map(x=>x.toFixed(4)).join(", ")}`)}

{const rg=C.growthRate(C.potentialSites("delta",3,1),2),rb=C.growthRate(C.potentialSites("barrier",5,400),2),re=C.growthRate(C.potentialSites("delta",-2,1),2);
 check("rho >= 1 without a bound state: repulsive delta g=3,k=2 (1.5), barrier V0=5,k=2 (~2.2); edge g=-2,k=2 is rho=1",Math.abs(rg-1.5)<1e-9&&rb>2&&Math.abs(re-1)<1e-9,`delta ${rg.toFixed(4)}, barrier ${rb.toFixed(4)}, edge ${re.toFixed(6)}`)}
console.log(fails?`\n${fails} check(s) FAILED`:"\nall checks passed");
process.exit(fails?1:0);
