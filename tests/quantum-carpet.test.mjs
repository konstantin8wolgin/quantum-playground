import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"../demos/quantum-carpet.html"),"utf8");
const m=html.match(/\/\* PHYSICS-CORE START \*\/([\s\S]*?)\/\* PHYSICS-CORE END \*\//);
if(!m){console.log("FAIL  core block not found");process.exit(1)}
const names="frac hermiteTable hoBasis hoProfile hoCoeffs hoPsi hoOverlap mehlerReal mehlerComplex kernelSum classX classV classAction mehlerAction sinTable boxPacket boxCoeffs boxTrim boxPsi boxAuto copiesExpected copyPositions freeGauss boxByImages bouncePath T_REV";
const C=vm.runInNewContext(m[1]+`;({${names.split(" ").join(",")}})`,{Math});
let fails=0;
const check=(name,ok,detail)=>{console.log(`${ok?"PASS":"FAIL"}  ${name}  ${detail}`);if(!ok)fails++};
const cabs=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const grid=(a,b,dx)=>{const n=Math.round((b-a)/dx)+1,xs=new Float64Array(n);for(let i=0;i<n;i++)xs[i]=a+i*dx;return xs};

/* ---------- Part 1: oscillator ---------- */
// 1. Hermite functions are orthonormal
{const xs=grid(-14,14,0.01),T=C.hermiteTable(40,xs),M=xs.length;let w=0;
 for(const [a,b] of [[0,0],[3,3],[17,17],[39,39],[0,2],[5,6],[10,30]]){let s=0;for(let j=0;j<M;j++)s+=T[a*M+j]*T[b*M+j]*0.01;w=Math.max(w,Math.abs(s-(a===b?1:0)))}
 check("Hermite functions orthonormal (<= 1e-12)",w<=1e-12,`worst deviation ${w.toExponential(2)}`)}

// 2. Mehler kernel (complex time, two branches) = eigenstate sum
{let worst=0,n=0;const eps=0.3,N=260;
 for(const w of [0.7,1,1.6])for(const a of [0.4,1.3,2.9,3.6,4.8,6.0,7.2])for(const [x,x0] of [[0.3,-1.1],[1.4,0.9],[-0.8,0.2]]){
   const t=a/w,k1=C.mehlerComplex(x,x0,t,eps,w),k2=C.kernelSum(x,x0,t,eps,w,N);worst=Math.max(worst,cabs(k1,k2));n++}
 check("Mehler kernel = sum phi_n(x) phi_n(x0) e^{-iE_n t}, complex time, 3 omegas x 7 times x 3 point pairs (<= 1e-8)",worst<=1e-8,`${n} cases, worst |diff| ${worst.toExponential(2)}`)}
// real-time kernel = small-eps limit, including the -pi/2 per focus
{let worst=0;for(const a of [0.5,2.0,3.5,4.5,5.5,7.0,9.0]){const w=1.3,t=a/w,x=0.45,x0=-0.7;
   worst=Math.max(worst,cabs(C.mehlerReal(x,x0,t,w),C.mehlerComplex(x,x0,t,1e-9,w)))}
 check("real-time Mehler kernel (with -pi/2 per focus) = limit eps -> 0 of the complex-time kernel (<= 1e-6)",worst<=1e-6,`worst |diff| ${worst.toExponential(2)}`)}

// 3. composition property, complex time
{let worst=0;const w=1.1,x=0.6,x0=-0.5;const ys=grid(-14,14,0.004);
 for(const [t1,e1,t2,e2] of [[0.5,0.3,0.9,0.3],[1.2,0.35,2.4,0.3],[2.0,0.3,1.5,0.3]]){
   let re=0,im=0;for(const y of ys){const A=C.mehlerComplex(x,y,t2,e2,w),B=C.mehlerComplex(y,x0,t1,e1,w);re+=(A[0]*B[0]-A[1]*B[1])*0.004;im+=(A[0]*B[1]+A[1]*B[0])*0.004}
   worst=Math.max(worst,cabs([re,im],C.mehlerComplex(x,x0,t1+t2,e1+e2,w)))}
 check("composition: integral K(x,t2;y) K(y,t1;x0) dy = K(x,t1+t2;x0) (complex time, trapezoid, <= 1e-9)",worst<=1e-9,`worst |diff| ${worst.toExponential(2)}`)}
// 3b. composition in real time on a wave packet: kernel quadrature = eigenstate sum
{const w=1.2,N=300,xs=grid(-10,10,0.01),dx=0.01,M=xs.length,basis=C.hoBasis(N,w,xs);
 const pr=new Float64Array(M),pi_=new Float64Array(M);for(let j=0;j<M;j++){const a=C.hoProfile("two",xs[j],0.8,1.5);pr[j]=a[0];pi_[j]=a[1]}
 const c=C.hoCoeffs(N,basis,xs,dx,pr,pi_);let worst=0;
 for(const tau of [0.11,0.19,0.33,0.62,0.8]){const t=tau*2*Math.PI/w,ps=C.hoPsi(c,tau,basis,M);
   for(const j of [350,800,1000,1200]){let re=0,im=0;
     for(let i=0;i<M;i++){const K=C.mehlerReal(xs[j],xs[i],t,w),f=[pr[i],pi_[i]];re+=(K[0]*f[0]-K[1]*f[1])*dx;im+=(K[0]*f[1]+K[1]*f[0])*dx}
     // psi0 normalisation: divide by sqrt(norm)
     let nrm=0;for(let i=0;i<M;i++)nrm+=(pr[i]*pr[i]+pi_[i]*pi_[i])*dx;const s=1/Math.sqrt(nrm*c.captured);
     worst=Math.max(worst,cabs([re*s,im*s],[ps.re[j],ps.im[j]]))}}
 check("packet evolved with the Mehler kernel (quadrature, 5 times incl. past one focus) = eigenstate expansion (<= 1e-6)",worst<=1e-6,`worst |diff| ${worst.toExponential(2)}, captured ${c.captured.toFixed(10)}`)}

// 4. classical action = phase of the kernel
{let worst=0;for(const w of [0.8,1.5])for(const [x,x0,t] of [[0.4,-1,0.7],[1.2,0.5,1.9],[-0.3,0.9,3.1]]){
   const a=w*t,v=w*(x-x0*Math.cos(a))/Math.sin(a);
   worst=Math.max(worst,Math.abs(C.classX(x0,v,w,t)-x),Math.abs(C.classAction(x0,v,w,t)-C.mehlerAction(x,x0,t,w)))}
 check("classical path joining (x0,0) to (x,t): hits x, and its action = Mehler phase (<= 1e-12)",worst<=1e-12,`worst ${worst.toExponential(2)}`)}
// 5. focusing: all paths meet at -x0 at T/2 with the same action
{let maxdx=0,maxS=0,maxx=0;for(const w of [0.6,1,2.3]){const T=2*Math.PI/w;
   for(const x0 of [-1.7,0.3,1.4])for(let k=-10;k<=10;k++){const v=k*0.37*w;
     maxdx=Math.max(maxdx,Math.abs(C.classX(x0,v,w,T/2)+x0));maxS=Math.max(maxS,Math.abs(C.classAction(x0,v,w,T/2)));maxx=Math.max(maxx,Math.abs(C.classX(x0,v,w,T)-x0),Math.abs(C.classAction(x0,v,w,T)))}}
 check("classical fan: every path is at -x0 at T/2 (any speed) and back at x0 at T; action there is 0 (<= 1e-12)",Math.max(maxdx,maxS,maxx)<=1e-12,`position error ${maxdx.toExponential(1)}, action at T/2 ${maxS.toExponential(1)}, at T ${maxx.toExponential(1)}`)}
// 6. quantum focusing: psi(T/2) = e^{-i pi/2} psi0(-x); psi(T) = e^{-i pi} psi0
{const N=240,xs=grid(-14,14,0.01),dx=0.01,M=xs.length;let wMir=0,wBack=0,wA=0,wM=0,wN=0,gA=0,gM=0;let capmin=1;
 for(const w of [1,1.5,2])for(const shape of ["two","steps","spike"])for(const [x0,p] of [[0,0],[1.2,0],[-0.9,2]]){
   const basis=C.hoBasis(N,w,xs),pr=new Float64Array(M),pi_=new Float64Array(M);
   for(let j=0;j<M;j++){const a=C.hoProfile(shape,xs[j],x0,p);pr[j]=a[0];pi_[j]=a[1]}
   const c=C.hoCoeffs(N,basis,xs,dx,pr,pi_);capmin=Math.min(capmin,c.captured);
   const p0=C.hoPsi(c,0,basis,M),ph=C.hoPsi(c,0.5,basis,M),pf=C.hoPsi(c,1,basis,M);
   for(let j=0;j<M;j++){const jm=M-1-j; // x -> -x on the symmetric grid
     // e^{-i pi/2} = -i : (-i)(a+ib) = b - i a
     wMir=Math.max(wMir,Math.hypot(ph.re[j]-p0.im[jm],ph.im[j]+p0.re[jm]));
     wBack=Math.max(wBack,Math.hypot(pf.re[j]+p0.re[j],pf.im[j]+p0.im[j]))}
   const A=C.hoOverlap(c,1,1),Mi=C.hoOverlap(c,0.5,-1);wA=Math.max(wA,Math.abs(Math.hypot(A[0],A[1])-1));wM=Math.max(wM,Math.abs(Math.hypot(Mi[0],Mi[1])-1));
   gA=Math.max(gA,Math.hypot(A[0]+1,A[1]));gM=Math.max(gM,Math.hypot(Mi[0],Mi[1]+1));
   for(const tau of [0.13,0.5,0.77]){const ps=C.hoPsi(c,tau,basis,M);let s=0;for(let j=0;j<M;j++)s+=(ps.re[j]*ps.re[j]+ps.im[j]*ps.im[j])*dx;wN=Math.max(wN,Math.abs(s-1))}}
 check("image at T/2 is the mirrored start times -i: |psi(T/2) + i psi0(-x)| <= 1e-6 pointwise (27 cases)",wMir<=1e-6,`worst ${wMir.toExponential(2)}, least norm captured by ${N} modes ${capmin.toFixed(8)}`);
 check("image at T is the start times -1 (pointwise <= 1e-6)",wBack<=1e-6,`worst ${wBack.toExponential(2)}`);
 check("overlap |<psi0|psi(T)>| = 1 and |<psi0(-x)|psi(T/2)>| = 1 (<= 1e-12)",Math.max(wA,wM)<=1e-12,`errors ${wA.toExponential(1)}, ${wM.toExponential(1)}`);
 check("Gouy / zero-point phase: factor at T/2 is -i = e^{-i pi/2}, at T is -1 = e^{-i pi} (<= 1e-12)",Math.max(gA,gM)<=1e-12,`errors ${gM.toExponential(1)}, ${gA.toExponential(1)}`);
 check("norm conserved: integral |psi|^2 dx = 1 at tau = 0.13, 0.5, 0.77 (<= 1e-6, grid |x| <= 14)",wN<=1e-6,`worst ${wN.toExponential(2)}`)}
// 7. between the foci the packet is NOT back (overlap < 1)
{const N=240,xs=grid(-14,14,0.01),dx=0.01,M=xs.length,w=1,basis=C.hoBasis(N,w,xs),pr=new Float64Array(M),pi_=new Float64Array(M);
 for(let j=0;j<M;j++){const a=C.hoProfile("two",xs[j],0.8,0);pr[j]=a[0];pi_[j]=a[1]}
 const c=C.hoCoeffs(N,basis,xs,dx,pr,pi_),o=C.hoOverlap(c,0.25,1),oo=C.hoOverlap(c,0.25,-1);
 check("at T/4 neither start nor mirror image returns (both overlaps < 0.9)",Math.hypot(o[0],o[1])<0.9&&Math.hypot(oo[0],oo[1])<0.9,`|<psi0|psi>| = ${Math.hypot(o[0],o[1]).toFixed(4)}, |<mirror|psi>| = ${Math.hypot(oo[0],oo[1]).toFixed(4)}`)}

/* ---------- Part 2: box ---------- */
const Nmax=300,xq=grid(0,1,1/4096),dq=1/4096,Mq=xq.length,tabq=C.sinTable(Nmax,xq);
function packet(xc,s,n0){const p=C.boxPacket(xq,xc,s,n0*Math.PI),c0=C.boxCoeffs(Nmax,tabq,xq,dq,p.re,p.im);return C.boxTrim(c0,1e-22)}
// 8. T_rev and phases
check("T_rev = 4/pi: E_n T_rev = 2 pi n^2 for all n",Math.abs(C.T_REV-4/Math.PI)<1e-15&&[1,2,7,40].every(n=>Math.abs((n*n*Math.PI*Math.PI/2)*C.T_REV-2*Math.PI*n*n)<1e-9*n*n),`T_rev = ${C.T_REV.toFixed(8)}`);
{const c=packet(0.3,0.03,6),tab=C.sinTable(c.N,xq);
 // full revival
 const p0=C.boxPsi(c,0,tab,Mq),p1=C.boxPsi(c,1,tab,Mq),A=C.boxAuto(c,1);let d1=0;for(let j=0;j<Mq;j++)d1=Math.max(d1,Math.hypot(p0.re[j]-p1.re[j],p0.im[j]-p1.im[j]));
 check("full revival at T_rev: autocorrelation |<psi0|psi(T_rev)>|^2 = 1 (<= 1e-10) and psi(T_rev) = psi0 pointwise (<= 1e-10)",Math.abs(A[0]*A[0]+A[1]*A[1]-1)<=1e-10&&d1<=1e-10,`|A|^2 - 1 = ${(A[0]*A[0]+A[1]*A[1]-1).toExponential(1)}, max |diff| ${d1.toExponential(1)}, modes ${c.N}`);
 // mirror at 1/2: psi(1/2)(x) = - psi0(1-x)
 const ph=C.boxPsi(c,0.5,tab,Mq);let d2=0;for(let j=0;j<Mq;j++){const jm=Mq-1-j;d2=Math.max(d2,Math.hypot(ph.re[j]+p0.re[jm],ph.im[j]+p0.im[jm]))}
 check("mirror at T_rev/2: psi(x) = -psi0(1-x) (<= 1e-10)",d2<=1e-10,`max |diff| ${d2.toExponential(1)}`);
 // 1/4: (1-i)/2 psi0(x) - (1+i)/2 psi0(1-x)
 const pq=C.boxPsi(c,0.25,tab,Mq);let d3=0;for(let j=0;j<Mq;j++){const jm=Mq-1-j;
   const ar=0.5*(p0.re[j]+p0.im[j]),ai=0.5*(p0.im[j]-p0.re[j]),br=-0.5*(p0.re[jm]-p0.im[jm]),bi=-0.5*(p0.im[jm]+p0.re[jm]);
   d3=Math.max(d3,Math.hypot(pq.re[j]-ar-br,pq.im[j]-ai-bi))}
 check("T_rev/4: psi = (1-i)/2 psi0(x) - (1+i)/2 psi0(1-x), two copies (<= 1e-10)",d3<=1e-10,`max |diff| ${d3.toExponential(1)}`);
 // norm
 let wN=0;for(const tau of [0.017,0.25,0.333333,0.61,1]){const ps=C.boxPsi(c,tau,tab,Mq);let s=0;for(let j=0;j<Mq;j++)s+=(ps.re[j]*ps.re[j]+ps.im[j]*ps.im[j])*dq;wN=Math.max(wN,Math.abs(s-1))}
 check("norm conserved: integral |psi|^2 dx = 1 at 5 times (<= 1e-6; trapezoid error)",wN<=1e-6,`worst ${wN.toExponential(2)}`);
 // autocorrelation is 1 only at the revivals, below 1 elsewhere
 let mx=0;for(const tau of [0.02,0.05,0.1,0.2,0.37,0.45]){const a=C.boxAuto(c,tau);mx=Math.max(mx,a[0]*a[0]+a[1]*a[1])}
 check("autocorrelation |A|^2 stays well below 1 away from fractions (< 0.6 at 6 generic times)",mx<0.6,`largest ${mx.toFixed(4)}`)}

// 9. copies at tau = p/q: expected number from the phase pattern, and counted in the density of a narrow packet
{const xc=0.3,c=packet(xc,0.008,0),tab=C.sinTable(c.N,xq);
 for(const [p,q,want] of [[1,2,1],[1,3,3],[1,4,2],[1,5,5],[1,6,3],[1,8,4]]){
   const ce=C.copiesExpected(p,q),pos=C.copyPositions(p,q,xc),ps=C.boxPsi(c,p/q,tab,Mq);
   const rho=new Float64Array(Mq);let mx=0;for(let j=0;j<Mq;j++){rho[j]=ps.re[j]*ps.re[j]+ps.im[j]*ps.im[j];mx=Math.max(mx,rho[j])}
   const found=[];for(let j=2;j<Mq-2;j++)if(rho[j]>0.3*mx&&rho[j]>=rho[j-1]&&rho[j]>rho[j+1]){
     // merge peaks closer than 0.02
     const x=xq[j];if(!found.some(f=>Math.abs(f.x-x)<0.02))found.push({x,r:rho[j]})}
   // weight of density within +-0.04 of each predicted position
   let wt=0,fit=true;for(const z of pos){let s=0;for(let j=0;j<Mq;j++)if(Math.abs(xq[j]-z)<0.04)s+=rho[j]*dq;wt+=s;}
   const posOK=pos.every(z=>found.some(f=>Math.abs(f.x-z)<0.006));
   // expected weights: each copy |a_s|^2
   const wOK=ce.terms.every(t=>Math.abs(t.weight-1/ce.count)<1e-9);
   check(`tau = ${p}/${q}: ${ce.count} copies expected (${want}), ${found.length} peaks counted in |psi|^2, peaks sit at predicted places, weight inside them ${wt.toFixed(4)}`,
     ce.count===want&&found.length===want&&pos.length===want&&posOK&&wOK&&Math.abs(wt-1)<2e-3,`predicted x = ${pos.map(z=>z.toFixed(3)).join(", ")}; found x = ${found.map(f=>f.x.toFixed(3)).join(", ")}`)}
 // a generic time: no clean copies
 const ps=C.boxPsi(c,0.2718281,tab,Mq);let ms=0,sm=0;for(let j=0;j<Mq;j++){const r=ps.re[j]*ps.re[j]+ps.im[j]*ps.im[j];ms=Math.max(ms,r);sm+=r*dq}
 check("generic time tau = 0.2718: density has no sharp copy (peak < 25 x its mean)",ms<25*sm,`peak ${ms.toFixed(2)}, mean ${sm.toFixed(2)}; at tau = 0 the peak is ${(()=>{const p0=C.boxPsi(c,0,tab,Mq);return Math.max(...Array.from(p0.re,(r,j)=>r*r+p0.im[j]*p0.im[j])).toFixed(1)})()}`)}

// 10. method of images = mode sum
{const xc=0.5,s=0.04,k0=2*Math.PI,c=packet(xc,s,2),tab=C.sinTable(c.N,xq);let worst=0;
 for(const tau of [0.003,0.01,0.03,0.07]){const ps=C.boxPsi(c,tau,tab,Mq),t=tau*C.T_REV;
   // images need the same normalisation as the mode sum: nrm = integral of the cut Gaussian
   const nr=(()=>{let s2=0;const p=C.boxPacket(xq,xc,s,k0);for(let j=0;j<Mq;j++)s2+=(p.re[j]*p.re[j]+p.im[j]*p.im[j])*dq;return Math.sqrt(s2*c.captured)})();
   for(const j of [600,1500,2048,2900,3500]){const im=C.boxByImages(xq[j],t,xc,s,k0,40);worst=Math.max(worst,Math.hypot(im[0]/nr-ps.re[j],im[1]/nr-ps.im[j]))}}
 check("method of images: sum of free Gaussians and their sign-flipped mirrors = mode sum (<= 1e-8, 4 times x 5 points)",worst<=1e-8,`worst |diff| ${worst.toExponential(2)}`)}
// 11. bounce paths
{let ok=true;for(const v of [-7,-2.3,0.4,5.1,19]){for(const t of [0.01,0.3,1,2.2]){const b=C.bouncePath(0.3,v,t);if(b.x<-1e-12||b.x>1+1e-12)ok=false}}
 const b1=C.bouncePath(0.3,1,1);const b2=C.bouncePath(0.3,-1,1);
 check("bouncing path stays inside the box; 0.3 + 1.0 t hits the right wall once at t=1 (x=0.7), 0.3 - 1.0 t hits the left wall once (x=0.7)",ok&&b1.bounces===1&&Math.abs(b1.x-0.7)<1e-12&&b2.bounces===1&&Math.abs(b2.x-0.7)<1e-12,`bounces ${b1.bounces}, ${b2.bounces}, x ${b1.x.toFixed(3)}, ${b2.x.toFixed(3)}`)}

console.log(fails?`\n${fails} check(s) FAILED`:"\nall checks passed");
process.exit(fails?1:0);
