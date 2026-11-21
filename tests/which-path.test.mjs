import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"../demos/which-path.html"),"utf8");
const m=html.match(/\/\* PHYSICS-CORE START \*\/([\s\S]*?)\/\* PHYSICS-CORE END \*\//);
if(!m){console.log("FAIL  core block not found");process.exit(1)}
const names="DEFAULTS mulberry32 ampPair trapz makeCurves normP pmArr fringePoints visibilityFP overlapFromTheta distinguish makeSampler sampleFrom makeEraserSampler sampleEraser gRatio gAt momentTable estimateOverlap";
const C=vm.runInNewContext(m[1]+`;({${names.split(" ").join(",")}})`,{Math});
let fails=0;
const check=(name,ok,detail)=>{console.log(`${ok?"PASS":"FAIL"}  ${name}  ${detail}`);if(!ok)fails++};
const out=(x)=>Array.from(x);

for(const d of [16,20,28]){
  const P={...C.DEFAULTS,d},cv=C.makeCurves(P),fp=C.fringePoints(P),D0=P.lam*P.L/d;
  // 1. visibility from the exact curve = |overlap|
  let worst=0,line="";
  for(const th of [0,30,60,90,120,150,180]){
    const ov=C.overlapFromTheta(th),V=C.visibilityFP(fp,ov);worst=Math.max(worst,Math.abs(V-Math.abs(ov)));line+=` ${th}:${V.toFixed(4)}`}
  check(`d=${d}: visibility from exact curve = cos(theta/2), all theta (<= 1e-3)`,worst<=1e-3,`worst ${worst.toExponential(2)};${line}`);
  check(`d=${d}: first fringe distance close to lambda L/d`,Math.abs(fp.y[2]/D0-1)<0.02,`${fp.y[2].toFixed(3)} vs ${D0.toFixed(3)}`);
  // 2. V^2 + D^2 = 1
  let w2=0;for(let th=0;th<=180;th+=5){const ov=C.overlapFromTheta(th),V=C.visibilityFP(fp,ov),D=C.distinguish(ov);w2=Math.max(w2,Math.abs(V*V+D*D-1))}
  check(`d=${d}: V^2 + D^2 = 1 for pure marker states (<= 2e-3)`,w2<=2e-3,`worst ${w2.toExponential(2)}`);
  // visibility also from a direct scan of the plain curve (independent check, without envelope fix)
  const Pc=a=>{const q=C.ampPair(a,P);return 0.5*(q.p1+q.p2)+q.c12};
  const vd=(Pc(0)-Pc(fp.y[1]))/(Pc(0)+Pc(fp.y[1]));
  check(`d=${d}: plain (Pmax-Pmin)/(Pmax+Pmin) at ov=1 is 1 (<= 5e-4; slit strengths differ by ~1e-4 off axis)`,Math.abs(vd-1)<5e-4,`${vd.toFixed(6)}`);
  // 3. eraser sums
  const er=C.makeEraserSampler(cv),P180=C.normP(cv,0);let md=0,tot=0;
  for(let i=0;i<cv.n;i++)md=Math.max(md,Math.abs(er.Pp[i]+er.Pm[i]-P180[i]));
  tot=C.trapz(er.Pp,cv.dy)+C.trapz(er.Pm,cv.dy);
  check(`d=${d}: eraser P+ + P- = P(theta=180) on the grid (<= 1e-15)`,md<=1e-15,`max diff ${md.toExponential(2)}`);
  check(`d=${d}: eraser piles carry total probability 1 (<= 1e-12)`,Math.abs(tot-1)<1e-12,`${tot.toFixed(14)}`);
  // direct amplitude identity: 1/4|psi1+psi2|^2 via ampPair at off-grid points
  let wd=0;for(const y of [3.3,17.7,-42.1,90.9]){const q=C.ampPair(y,P);const a1=0.25*(q.p1+q.p2+2*q.c12),a2=0.25*(q.p1+q.p2-2*q.c12);
    wd=Math.max(wd,Math.abs(a1+a2-0.5*(q.p1+q.p2))/(0.5*(q.p1+q.p2)),a1<0||a2<0?1:0)}
  check(`d=${d}: P+ and P- are never negative, sum = (p1+p2)/2`,wd<1e-12,`${wd.toExponential(1)}`);
  const vp=C.visibilityFP(fp,1),vm=C.visibilityFP(fp,-1);
  check(`d=${d}: P+ and P- have visibility 1 (>= 0.9995); sum has 0 (<= 1e-3)`,vp>=0.9995&&vm>=0.9995&&C.visibilityFP(fp,0)<1e-3,`V+=${vp.toFixed(6)} V-=${vm.toFixed(6)} V(sum)=${C.visibilityFP(fp,0).toExponential(1)}`);
  // P- has a minimum at the centre, P+ a maximum: anti-fringes
  const ic=(cv.n-1)/2;check(`d=${d}: P+ peaks at centre, P- is dark there (anti-fringes)`,er.Pp[ic]>50*er.Pm[ic],`P+(0)=${er.Pp[ic].toExponential(2)} P-(0)=${er.Pm[ic].toExponential(2)}`);
  // 4. normalisation and cross-term size
  let wn=0,ci=0;for(const th of [0,60,120,180]){wn=Math.max(wn,Math.abs(C.trapz(C.normP(cv,C.overlapFromTheta(th)),cv.dy)-1))}
  ci=Math.abs(C.trapz(cv.c12,cv.dy))/cv.N0;
  check(`d=${d}: normP integrates to 1; cross term inside window is small (<2%)`,wn<1e-12&&ci<0.02,`norm err ${wn.toExponential(1)}, |int c12|/N0 = ${ci.toExponential(2)}`);
  // symmetry
  let ws=0;for(let i=0;i<cv.n;i++)ws=Math.max(ws,Math.abs(cv.inc[i]-cv.inc[cv.n-1-i])/cv.inc[ic]);
  check(`d=${d}: pattern is mirror symmetric (<= 1e-10)`,ws<1e-10,`${ws.toExponential(1)}`);
}

// 5. dots match P(y): chi-square and KS, several seeds
{
  const P={...C.DEFAULTS,d:20},cv=C.makeCurves(P);
  // independent reference: fine Simpson integration of the exact curve, not the sampler grid
  const NBINS=40,fine=40,edges=[...Array(NBINS+1).keys()].map(i=>-P.Y+i*2*P.Y/NBINS);
  const dens=(ov)=>y=>{const q=C.ampPair(y,P);return 0.5*(q.p1+q.p2)+ov*q.c12};
  const binMass=(f)=>{const mass=[];for(let b=0;b<NBINS;b++){const a=edges[b],h=(edges[b+1]-a)/(2*fine);let s=f(a)+f(edges[b+1]);for(let j=1;j<2*fine;j++)s+=f(a+j*h)*(j%2?4:2);mass.push(s*h/3)}const T=mass.reduce((x,y)=>x+y,0);return mass.map(x=>x/T)};
  for(const th of [0,90,180]){
    const ov=C.overlapFromTheta(th),exp=binMass(dens(ov)),samp=C.makeSampler(C.normP(cv,ov),cv),N=200000;
    for(const seed of [1,2,3]){
      const rng=C.mulberry32(seed*101),cnt=new Array(NBINS).fill(0),ys=[];
      for(let i=0;i<N;i++){const y=C.sampleFrom(samp,rng);ys.push(y);cnt[Math.min(NBINS-1,Math.floor((y+P.Y)/(2*P.Y)*NBINS))]++}
      let chi=0;for(let b=0;b<NBINS;b++){const e=N*exp[b];chi+=(cnt[b]-e)**2/e}
      // KS against CDF at bin edges plus linear interpolation inside bins (bins are fine enough)
      ys.sort((a,b)=>a-b);let ks=0;const cdfEdge=[0];for(const x of exp)cdfEdge.push(cdfEdge[cdfEdge.length-1]+x);
      let j=0;for(let b=0;b<NBINS;b++){let c=0;while(j<N&&ys[j]<edges[b+1]){j++;c++}ks=Math.max(ks,Math.abs(j/N-cdfEdge[b+1]))}
      check(`dots th=${th} seed=${seed}: chi-square (39 dof) < 73 and KS at bin edges sqrt(N)*D < 1.95`,chi<73&&Math.sqrt(N)*ks<1.95,`chi2=${chi.toFixed(1)}, sqrt(N)*D=${(Math.sqrt(N)*ks).toFixed(2)}`)}
  }
  // eraser dots: joint (sign, bin) chi-square
  const er=C.makeEraserSampler(cv),N=200000,expP=binMass(y=>{const q=C.ampPair(y,P);return 0.25*(q.p1+q.p2+2*q.c12)}),expM=binMass(y=>{const q=C.ampPair(y,P);return 0.25*(q.p1+q.p2-2*q.c12)});
  const mP=(()=>{let s=0;const f=y=>{const q=C.ampPair(y,P);return 0.25*(q.p1+q.p2+2*q.c12)};const g=y=>{const q=C.ampPair(y,P);return 0.25*(q.p1+q.p2-2*q.c12)};let a=0,b=0;const M=4000,h=2*P.Y/M;for(let i=0;i<=M;i++){const y=-P.Y+i*h,w=(i==0||i==M)?0.5:1;a+=w*f(y)*h;b+=w*g(y)*h}return a/(a+b)})();
  for(const seed of [4,5,6]){
    const rng=C.mulberry32(seed*977),cp=new Array(NBINS).fill(0),cm=new Array(NBINS).fill(0);
    for(let i=0;i<N;i++){const [y,s]=C.sampleEraser(er,rng),b=Math.min(NBINS-1,Math.floor((y+P.Y)/(2*P.Y)*NBINS));if(s>0)cp[b]++;else cm[b]++}
    let chi=0;for(let b=0;b<NBINS;b++){const e1=N*mP*expP[b],e2=N*(1-mP)*expM[b];chi+=(cp[b]-e1)**2/e1+(cm[b]-e2)**2/e2}
    const np=cp.reduce((a,b)=>a+b,0);
    check(`eraser dots seed=${seed}: sorted piles match P+ and P- (chi-square, 79 dof) < 125`,chi<125,`chi2=${chi.toFixed(1)}, '+' share ${(np/N).toFixed(4)} (exact ${mP.toFixed(4)})`);
    // sum of both piles has no fringes: compare to P(180)
    let chi2=0;const e0=binMass(dens(0));for(let b=0;b<NBINS;b++){const e=N*e0[b],o=cp[b]+cm[b];chi2+=(o-e)**2/e}
    check(`eraser dots seed=${seed}: unsorted sum matches the no-stripe pattern (chi-square, 39 dof) < 73`,chi2<73,`chi2=${chi2.toFixed(1)}`);
  }
}

// 6. estimate of the overlap from dots
{
  const P={...C.DEFAULTS,d:20},cv=C.makeCurves(P),g=C.gRatio(cv),tab=C.momentTable(cv,g);let line="",okAll=true;
  for(const th of [0,60,90,140,180]){
    const ov=C.overlapFromTheta(th),samp=C.makeSampler(C.normP(cv,ov),cv),rng=C.mulberry32(th+17),N=100000;let s=0,s2=0;
    for(let i=0;i<N;i++){const gg=C.gAt(cv,g,C.sampleFrom(samp,rng));s+=gg;s2+=gg*gg}
    const mean=s/N,e=C.estimateOverlap(tab,mean,s2/N-mean*mean,N);
    if(!(Math.abs(e.ov-ov)<4*e.sigma+1e-3&&e.sigma<0.01))okAll=false;
    line+=` ${th}:${e.ov.toFixed(3)}+-${e.sigma.toFixed(3)}(true ${ov.toFixed(3)})`}
  check("overlap estimated from 1e5 dots agrees within 4 sigma",okAll,line);
}
console.log(fails?`\n${fails} check(s) FAILED`:"\nall checks passed");
process.exit(fails?1:0);
