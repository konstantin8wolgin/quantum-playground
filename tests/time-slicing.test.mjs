import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"../demos/time-slicing.html"),"utf8");
const m=html.match(/\/\* PHYSICS-CORE START \*\/([\s\S]*?)\/\* PHYSICS-CORE END \*\//);
if(!m){console.log("FAIL  core block not found");process.exit(1)}
const names="fft makeGrid copyPsi normOf scalePsi l2diff gaussPacket POTS potVec POT_START freeStep potStep oneStep evolve freeGaussAt freeExact hermiteRows harmonicExact referenceState fitOrder convergence imagRun energyExpect groundStateError Vharm sliceTerms pathAction classicalHarm classicalActionHarm straightActionHarm samplePath bridgeFrom makePath classicalPolyError";
const C=vm.runInNewContext(m[1]+`;({${names.split(" ").join(",")}})`,{Math});
let fails=0;
const check=(name,ok,detail)=>{console.log(`${ok?"PASS":"FAIL"}  ${name}  ${detail}`);if(!ok)fails++};

const G=C.makeGrid(256,32);          // the page grid

// 1. FFT round trip + known transform
{const n=256,re=new Float64Array(n),im=new Float64Array(n);for(let j=0;j<n;j++){re[j]=Math.sin(0.1*j)+0.3*Math.cos(1.7*j);im[j]=Math.cos(0.37*j)}
 const r0=Float64Array.from(re),i0=Float64Array.from(im);C.fft(re,im,false);C.fft(re,im,true);let w=0;for(let j=0;j<n;j++)w=Math.max(w,Math.abs(re[j]-r0[j]),Math.abs(im[j]-i0[j]));
 check("FFT round trip (<= 1e-13)",w<=1e-13,`worst ${w.toExponential(2)}`);
 // plane wave e^{2 pi i 5 j/n} -> single spike of height n at k=5
 const a=new Float64Array(n),b=new Float64Array(n);for(let j=0;j<n;j++){a[j]=Math.cos(2*Math.PI*5*j/n);b[j]=Math.sin(2*Math.PI*5*j/n)}
 C.fft(a,b,false);let off=0;for(let k=0;k<n;k++)if(k!==5)off=Math.max(off,Math.hypot(a[k],b[k]));
 check("FFT of a plane wave is one spike of height n",Math.abs(a[5]-n)<1e-10&&off<1e-10,`spike ${a[5].toFixed(10)}, rest ${off.toExponential(1)}`)}

// 2. free step = exact free kernel applied by quadrature
{const g=C.makeGrid(512,40),s=0.8,x0=-0.5,k0=1.2,eps=0.4,p=C.gaussPacket(g,x0,k0,s);C.freeStep(p,g,eps,false);
 const dy=0.01,ys=[];for(let y=-14;y<=14+1e-9;y+=dy)ys.push(y);
 const f=ys.map(y=>{const z=y-x0,A=Math.pow(2*Math.PI*s*s,-0.25)*Math.exp(-z*z/(4*s*s));return [A*Math.cos(k0*y),A*Math.sin(k0*y)]});
 let worst=0;
 for(const j of [180,230,256,300,340,380]){const x=g.x[j];let re=0,im=0;
   for(let i=0;i<ys.length;i++){const d=x-ys[i],ph=d*d/(2*eps),c=Math.cos(ph),sn=Math.sin(ph);re+=(c*f[i][0]-sn*f[i][1])*dy;im+=(c*f[i][1]+sn*f[i][0])*dy}
   // prefactor (2 pi i eps)^(-1/2) = (2 pi eps)^(-1/2) e^{-i pi/4}
   const A=1/Math.sqrt(2*Math.PI*eps),cq=Math.cos(-Math.PI/4),sq=Math.sin(-Math.PI/4),qr=A*(re*cq-im*sq),qi=A*(re*sq+im*cq);
   worst=Math.max(worst,Math.hypot(qr-p.re[j],qi-p.im[j]))}
 check("FFT free step = exact free kernel K_eps(x,y)=sqrt(1/(2 pi i eps)) exp(i (x-y)^2/(2 eps)) by quadrature (<= 1e-8)",worst<=1e-8,`6 points, worst |diff| ${worst.toExponential(2)}`)}

// 3. free particle: N steps give the same result, and the exact spreading Gaussian
{const s=0.8,x0=-1,k0=1.5,T=2,p0=C.gaussPacket(G,x0,k0,s),V=C.potVec(G,"free"),res={};
 for(const N of [1,4,64,256])res[N]=C.evolve(p0,G,V,T,N,N===4?"plain":"sym");
 let d=0;for(const N of [4,64,256])d=Math.max(d,C.l2diff(res[N],res[1],G));
 check("free particle: N = 1, 4, 64, 256 give the same wave (<= 1e-10)",d<=1e-10,`worst L2 difference ${d.toExponential(2)}`);
 // exact spreading Gaussian, infinite line (large enough box that images do not matter)
 const gb=C.makeGrid(512,64),pb=C.gaussPacket(gb,x0,k0,s),r=C.evolve(pb,gb,C.potVec(gb,"free"),T,7,"sym");
 let w=0;for(let j=0;j<gb.n;j++){const e=C.freeGaussAt(gb.x[j],T,x0,k0,s);w=Math.max(w,Math.hypot(e[0]-r.re[j],e[1]-r.im[j]))}
 check("free particle: result = exact spreading Gaussian (infinite-line formula, box 64) (<= 1e-10)",w<=1e-10,`worst pointwise |diff| ${w.toExponential(2)}`);
 const ex=C.freeExact(G,x0,k0,s,T,3);const w2=C.l2diff(res[64],ex,G);
 check("free particle on the page grid: result = exact Gaussian with periodic images (<= 1e-10)",w2<=1e-10,`L2 diff ${w2.toExponential(2)}`)}

// 4. norm conserved (unitary steps)
{let worst=0;for(const pot of ["free","harm","dwell","step"])for(const sc of ["plain","sym"]){const st=C.POT_START[pot],p0=C.gaussPacket(G,st.x0,st.k0,st.s),n0=C.normOf(p0,G);
   const p=C.evolve(p0,G,C.potVec(G,pot),4,256,sc);worst=Math.max(worst,Math.abs(C.normOf(p,G)-n0))}
 check("norm conserved: 4 potentials x 2 splittings x 256 steps (<= 1e-12)",worst<=1e-12,`worst |norm - start| ${worst.toExponential(2)}`)}

// 5. harmonic exact reference is itself right: eigenstate sum = coherent state, which is known exactly
{const s=Math.SQRT1_2,x0=1.2,T=2.5,p0=C.gaussPacket(G,x0,0,s),e=C.harmonicExact(G,p0,T,120);
 // coherent state: centre x0 cos T, momentum -x0 sin T, phase -omega T/2 + (x0^2/4)(sin 2T... ) handled by modulus comparison
 let w=0;const xc=x0*Math.cos(T);for(let j=0;j<G.n;j++){const z=G.x[j]-xc,mod=Math.pow(Math.PI,-0.25)*Math.exp(-z*z/2);w=Math.max(w,Math.abs(Math.hypot(e.re[j],e.im[j])-mod))}
 check("oscillator eigenstate sum for the ground-state-width packet = moving coherent state, modulus (<= 1e-10)",w<=1e-10&&Math.abs(e.captured-1)<1e-10,`worst ${w.toExponential(2)}, captured ${e.captured.toFixed(12)}`)}

// 6. harmonic trap: convergence orders (plain 1, symmetric 2), fit on N = 16..256
const Ns=[1,2,4,8,16,32,64,128,256];
{for(const [s,T] of [[0.5,3],[Math.SQRT1_2,3],[1,3],[0.5,1.5],[0.7,5]]){
   const R=C.convergence(G,s,T,Ns);
   check(`order of plain split = 1 +- 0.15 (s=${s.toFixed(3)}, T=${T})`,Math.abs(R.orderP-1)<=0.15,`fitted ${R.orderP.toFixed(4)}`);
   check(`order of symmetric split = 2 +- 0.15 (s=${s.toFixed(3)}, T=${T})`,Math.abs(R.orderS-2)<=0.15,`fitted ${R.orderS.toFixed(4)}`);
   const mono=R.errS.every((e,i)=>i===0||e<R.errS[i-1])&&R.errP.every((e,i)=>i===0||e<R.errP[i-1]);
   check(`errors fall at every doubling of N (s=${s.toFixed(3)}, T=${T})`,mono,`sym N=1..256: ${R.errS.map(e=>e.toExponential(1)).join(" ")}`);
   const fw=Math.max(...R.errF);
   check(`free particle: error is at rounding level for every N (<= 1e-12) (s=${s.toFixed(3)}, T=${T})`,fw<=1e-12,`worst ${fw.toExponential(2)}`)}}
// 7. large N matches the exact answer
{const R=C.convergence(G,0.5,3,Ns);
 check("harmonic trap, N = 256 symmetric: distance to exact wave <= 2e-4",R.errS[8]<=2e-4,`${R.errS[8].toExponential(2)}`);
 check("harmonic trap, N = 256 plain: distance to exact wave <= 5e-2",R.errP[8]<=5e-2,`${R.errP[8].toExponential(2)}`);
 check("symmetric split beats plain at every N >= 16",R.errS.every((e,i)=>i<4||e<R.errP[i]),"")}
// 7b. fine reference used for the double well agrees with N = 4096 and the page reference for the trap is the exact one
{const st=C.POT_START.dwell,p0=C.gaussPacket(G,st.x0,st.k0,st.s),V=C.potVec(G,"dwell"),a=C.evolve(p0,G,V,3,2048,"sym"),b=C.evolve(p0,G,V,3,4096,"sym");
 const d=C.l2diff(a,b,G);check("double-well reference (N = 2048) is converged: differs from N = 4096 by <= 1e-6",d<=1e-6,`${d.toExponential(2)}`);
 const stH=C.POT_START.harm,pH=C.gaussPacket(G,stH.x0,stH.k0,stH.s),ref=C.referenceState(G,"harm",pH,3,stH),fine=C.evolve(pH,G,C.potVec(G,"harm"),3,2048,"sym");
 const d2=C.l2diff(ref.psi,fine,G);check("page reference for the trap (eigenstates) = fine slicing run (N = 2048) (<= 1e-6)",ref.kind==="exact"&&d2<=1e-6,`${d2.toExponential(2)}`)}

// 8. discrete action of polygon paths -> classical action
{const xa=-1,xb=1.2;
 for(const T of [1,2,3]){const Scl=C.classicalActionHarm(xa,xb,T),errs=[];const Ms=[4,8,16,32,64,128,256];
   for(const N of Ms)errs.push(Math.abs(C.pathAction(C.samplePath(t=>C.classicalHarm(xa,xb,T,t),N,T),T,C.Vharm)-Scl));
   const order=C.fitOrder(Ms,errs,4);check(`classical polygon: S_N -> S_cl (harmonic exact formula), order 2 +- 0.1 (T=${T})`,Math.abs(order-2)<=0.1&&errs[6]<1e-4,`order ${order.toFixed(4)}, error at N=256 ${errs[6].toExponential(2)}`)}
 const T=2,Sst=C.straightActionHarm(xa,xb,T),errs=[],Ms=[4,8,16,32,64,128,256];
 for(const N of Ms)errs.push(Math.abs(C.pathAction(C.samplePath(t=>xa+(xb-xa)*t/T,N,T),T,C.Vharm)-Sst));
 const order=C.fitOrder(Ms,errs,4);check("straight-line polygon: S_N -> exact action of the straight line, order 2 +- 0.1",Math.abs(order-2)<=0.1,`order ${order.toFixed(4)}, error at N=256 ${errs[6].toExponential(2)}`);
 // the page helper
 const e8=C.classicalPolyError(8,2,xa,xb),e16=C.classicalPolyError(16,2,xa,xb);
 check("page helper classicalPolyError falls by 4 per doubling (3.9 .. 4.1)",Math.abs(e8/e16-4)<0.1,`ratio ${(e8/e16).toFixed(4)}`)}
// 8b. classical path is stationary: action of the classical polygon is the minimum (T < pi); wiggles raise S_N
{const xa=-1,xb=1.2,T=2,N=16,cl=C.makePath("classical",N,T,xa,xb,null,null),S0=C.pathAction(cl,T,C.Vharm);let ok=true,minRise=1e9;
 for(let k=1;k<N;k++)for(const d of [-0.05,0.05]){const q=Float64Array.from(cl);q[k]+=d;const r=C.pathAction(q,T,C.Vharm)-S0;minRise=Math.min(minRise,r)}
 // first-order change of S_N around the classical polygon is of order eps^2 (not eps): compare small and large wiggle
 const q1=Float64Array.from(cl),q2=Float64Array.from(cl);q1[5]+=0.02;q2[5]+=0.04;const r1=C.pathAction(q1,T,C.Vharm)-S0,r2=C.pathAction(q2,T,C.Vharm)-S0;
 check("classical polygon is (nearly) stationary: moving one dot changes S_N by an amount that grows as the square of the move (ratio 3.5 .. 4.5)",Math.abs(r2/r1-4)<0.5,`rise ${r1.toExponential(2)} -> ${r2.toExponential(2)}, ratio ${(r2/r1).toFixed(3)}`)}
// 8c. makePath
{const T=2,N=8,coef=[0.3,-0.2,0.1,0.05],z=new Float64Array(64);for(let i=0;i<64;i++)z[i]=Math.sin(7.3*i)+Math.cos(2.1*i);const br=C.bridgeFrom(z);
 let ok=true;for(const kind of ["classical","smooth","rough"]){const p=C.makePath(kind,N,T,-1,1.2,coef,br);if(Math.abs(p[0]+1)>1e-14||Math.abs(p[N]-1.2)>1e-14)ok=false}
 const p64=C.makePath("rough",64,T,-1,1.2,coef,br),p8=C.makePath("rough",8,T,-1,1.2,coef,br);let same=true;for(let k=0;k<=8;k++)if(Math.abs(p8[k]-p64[k*8])>1e-14)same=false;
 check("path generator: ends fixed for every kind; the rough path at N = 8 is the rough path at N = 64 seen every 8th point",ok&&same&&Math.abs(br[0])<1e-14&&Math.abs(br[64])<1e-14,"")}

// 9. imaginary time: ground-state energy, two grids
{const cases=[{n:256,L:32},{n:128,L:20}];
 for(const {n,L} of cases){const g=C.makeGrid(n,L),p0=C.gaussPacket(g,2,0,0.5);
   const fine=C.imagRun(g,"harm",p0,0.01,2400,"sym").E[2399],mid=C.imagRun(g,"harm",p0,0.05,480,"sym").E[479],plain=C.imagRun(g,"harm",p0,0.05,480,"plain").E[479],plain2=C.imagRun(g,"harm",p0,0.025,960,"plain").E[959];
   check(`imaginary time, symmetric split, eps = 0.01, grid ${n} points / box ${L}: E0 = 0.5 +- 1e-4`,Math.abs(fine-0.5)<=1e-4,`E0 = ${fine.toFixed(7)}`);
   check(`imaginary time, symmetric split, eps = 0.05, grid ${n} points / box ${L}: E0 = 0.5 +- 2e-3`,Math.abs(mid-0.5)<=2e-3,`E0 = ${mid.toFixed(7)}`);
   const e1=C.imagRun(g,"harm",p0,0.1,120,"plain"),e2=C.imagRun(g,"harm",p0,0.05,240,"plain"),f1=C.imagRun(g,"harm",p0,0.1,120,"sym"),f2=C.imagRun(g,"harm",p0,0.05,240,"sym");
   check(`imaginary time, grid ${n}: plain and symmetric split give the same decay rate (<= 1e-8 apart); error falls x4 per halving of eps (3.5 .. 4.5)`,Math.abs(plain-C.imagRun(g,"harm",p0,0.05,480,"sym").E[479])<=1e-8&&Math.abs((e1.E[119]-0.5)/(e2.E[239]-0.5)-4)<0.5,`plain ${plain.toFixed(8)}`);
   const sp=[C.groundStateError(e1.psi,g),C.groundStateError(e2.psi,g)],ss=[C.groundStateError(f1.psi,g),C.groundStateError(f2.psi,g)];
   check(`imaginary time, grid ${n}: shape error falls x2 per halving of eps for the plain split (order 1) and x4 for the symmetric split (order 2)`,Math.abs(sp[0]/sp[1]-2)<0.3&&Math.abs(ss[0]/ss[1]-4)<0.6,`plain ${sp[0].toExponential(2)} -> ${sp[1].toExponential(2)} (x${(sp[0]/sp[1]).toFixed(2)}), sym ${ss[0].toExponential(2)} -> ${ss[1].toExponential(2)} (x${(ss[0]/ss[1]).toFixed(2)})`)} // symmetric error falls by 4 when eps halves
 const g=C.makeGrid(256,32),p0=C.gaussPacket(g,2,0,0.5),a=C.imagRun(g,"harm",p0,0.2,60,"sym").E[59]-0.5,b=C.imagRun(g,"harm",p0,0.1,120,"sym").E[119]-0.5;
 check("imaginary time, symmetric split: energy error falls by 4 when eps halves (3.5 .. 4.5)",Math.abs(a/b-4)<0.5,`errors ${a.toExponential(2)}, ${b.toExponential(2)}, ratio ${(a/b).toFixed(3)}`);
 // expectation value of H in the relaxed state
 const r=C.imagRun(g,"harm",p0,0.02,600,"sym"),Eh=C.energyExpect(r.psi,g,C.potVec(g,"harm"));
 check("relaxed state: <H> = 0.5 +- 1e-3 (independent check from the wave itself)",Math.abs(Eh-0.5)<=1e-3,`<H> = ${Eh.toFixed(6)}`)}

// 10. the page's own imaginary-time run (TAU4 and EPS4 read from the page): every halving offered falls by 4 (sym shape), 2 (plain shape), 4 (energy)
{const TAU=+html.match(/TAU4=(\d+)/)[1],EPS=JSON.parse(html.match(/EPS4=(\[[^\]]*\])/)[1]);
 const g=C.makeGrid(256,32),p0=C.gaussPacket(g,2,0,0.5),res={};
 for(const sc of ["sym","plain"])for(const e of EPS){const st=Math.round(TAU/e),r=C.imagRun(g,"harm",p0,e,st,sc);res[sc+e]={E:r.E[st-1]-0.5,w:C.groundStateError(r.psi,g)}}
 let bad="",n=0;for(const e of EPS){const h=EPS.find(x=>Math.abs(x-e/2)<1e-12);if(h===undefined)continue;n++;
   const fs=res["sym"+e].w/res["sym"+h].w,fp=res["plain"+e].w/res["plain"+h].w,fe=res["sym"+e].E/res["sym"+h].E;
   if(Math.abs(fs-4)>0.35||Math.abs(fp-2)>0.3||Math.abs(fe-4)>0.35)bad+=` eps ${e}->${h}: sym x${fs.toFixed(2)}, plain x${fp.toFixed(2)}, E x${fe.toFixed(2)};`}
 check(`page run (tau = ${TAU}): every halving of eps offered (${n}) gives shape x4 (sym), x2 (plain), energy x4`,n===3&&bad==="",bad||"all halvings ok")}

// 11. claims in the text: Part 2 default N, symmetric vs plain at N = 4 and N >= 16; Part 1 sliced stationary point
{const N0=+html.match(/const A2=\{pot:"harm",N:(\d+)/)[1],r=C.convergence(G,0.7071,3,[4,16,32,64]);
 check("Part 2 default N = 16; symmetric error is smaller than plain from N = 16 (x2, x4, x8) and about equal at N = 4",N0===16&&r.errP[1]/r.errS[1]>1.8&&r.errP[2]/r.errS[2]>3.5&&r.errP[3]/r.errS[3]>7&&Math.abs(r.errP[0]/r.errS[0]-1)<0.2,`N=4 ${r.errP[0].toFixed(3)} vs ${r.errS[0].toFixed(3)}; N=16 ${r.errP[1].toFixed(4)} vs ${r.errS[1].toFixed(4)}; N=32 ${r.errP[2].toFixed(4)} vs ${r.errS[2].toFixed(4)}`)}
{const xa=-1,xb=1.2,stat=(N,T)=>{const cl=Array.from({length:N+1},(_,k)=>C.classicalHarm(xa,xb,T,k*T/N));let best=1e9,bx=0;
   for(let x=-4;x<=4;x+=0.001){const p=cl.slice();p[1]=x;const v=C.pathAction(Float64Array.from(p),T,C.Vharm);if(v<best){best=v;bx=x}}return [bx,cl[1]]};
 const a=stat(2,3),b=stat(4,3),c=stat(2,2);
 check("Part 1 text: N = 2, T = 3 sliced minimum (0.36) is far from the classical dot (1.41); N = 4 and N = 2, T = 2 are close (< 0.05)",Math.abs(a[0]-0.357)<0.01&&Math.abs(a[0]-a[1])>1&&Math.abs(b[0]-b[1])<0.05&&Math.abs(c[0]-c[1])<0.05,`N2T3 ${a[0].toFixed(3)} vs ${a[1].toFixed(3)}; N4T3 ${b[0].toFixed(3)} vs ${b[1].toFixed(3)}; N2T2 ${c[0].toFixed(3)} vs ${c[1].toFixed(3)}`)}

console.log(fails?`\n${fails} check(s) FAILED`:"\nall checks passed");
process.exit(fails?1:0);
