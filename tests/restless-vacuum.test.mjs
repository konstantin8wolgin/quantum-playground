import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"../demos/restless-vacuum.html"),"utf8");
const m=html.match(/\/\* PHYSICS-CORE START \*\/([\s\S]*?)\/\* PHYSICS-CORE END \*\//);
if(!m){console.log("FAIL  core block not found");process.exit(1)}
const names="mulberry32 gauss omegaK modeSetup phiCovExact phiVarExact windowVarExact zeroPointEnergy fieldFromAmps sampleAmps sampleField ouStep windowAccumulate casimirSum casimirClosed casimirRemainder casimirForce CAS_A CAS_B";
const C=vm.runInNewContext(m[1]+`;({${names.split(" ").join(",")}})`,{Math});
let fails=0;
const check=(name,ok,detail)=>{console.log(`${ok?"PASS":"FAIL"}  ${name}  ${detail}`);if(!ok)fails++};
const rel=(x,y)=>Math.abs(x/y-1);

/* Jacobi eigen-decomposition of a small symmetric matrix */
function jacobi(A){const n=A.length,V=A.map((_,i)=>A.map((_,j)=>i===j?1:0));A=A.map(r=>r.slice());
  for(let sweep=0;sweep<100;sweep++){let off=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)off+=A[i][j]**2;if(off<1e-26)break;
    for(let p=0;p<n;p++)for(let q=p+1;q<n;q++){if(Math.abs(A[p][q])<1e-300)continue;
      const th=(A[q][q]-A[p][p])/(2*A[p][q]),t=Math.sign(th||1)/(Math.abs(th)+Math.sqrt(th*th+1)),c=1/Math.sqrt(t*t+1),s=t*c;
      for(let k=0;k<n;k++){const kp=A[k][p],kq=A[k][q];A[k][p]=c*kp-s*kq;A[k][q]=s*kp+c*kq}
      for(let k=0;k<n;k++){const pk=A[p][k],qk=A[q][k];A[p][k]=c*pk-s*qk;A[q][k]=s*pk+c*qk}
      for(let k=0;k<n;k++){const kp=V[k][p],kq=V[k][q];V[k][p]=c*kp-s*kq;V[k][q]=s*kp+c*kq}}}
  return{val:A.map((r,i)=>r[i]),vec:V}}

/* 1. exact formulas against the direct matrix: C = (1/2) K^(-1/2), K = m^2 I + (2 on diagonal, -1 on neighbours, ring) */
for(const [N,mass] of [[6,0.7],[8,0.15],[7,1.3]]){
  const K=Array.from({length:N},(_,i)=>Array.from({length:N},(_,j)=>(i===j?2+mass*mass:0)+(((i-j+N)%N===1||(j-i+N)%N===1)?-1:0)));
  const {val,vec}=jacobi(K);
  const Cm=(i,j)=>{let s=0;for(let q=0;q<N;q++)s+=vec[i][q]*vec[j][q]/Math.sqrt(val[q]);return 0.5*s};
  let md=0;for(let d=0;d<N;d++)md=Math.max(md,Math.abs(Cm(0,d)-C.phiCovExact(N,mass,d)));
  check(`covariance formula vs 0.5*K^(-1/2), N=${N} m=${mass}`,md<1e-12,`max diff ${md.toExponential(1)}, <phi^2> exact ${C.phiVarExact(N,mass).toFixed(6)}, matrix ${Cm(0,0).toFixed(6)}`);
  for(const w of [1,2,3]){if(w>N/2)continue;
    let s=0;for(let i=0;i<w;i++)for(let j=0;j<w;j++)s+=Cm(i,j);s/=w*w;
    check(`window variance vs matrix, N=${N} w=${w}`,Math.abs(s-C.windowVarExact(N,mass,w))<1e-12,`${C.windowVarExact(N,mass,w).toFixed(6)} vs ${s.toFixed(6)}`)}
  let e=0;for(let q=0;q<N;q++)e+=0.5*Math.sqrt(val[q]);
  check(`zero-point energy = sum of omega/2 from matrix, N=${N}`,Math.abs(e-C.zeroPointEnergy(N,mass))<1e-12,`${e.toFixed(6)}`)}

/* 2. mode basis is orthonormal */
{const ms=C.modeSetup(10,0.4),N=10;let md=0;
  for(let p=0;p<N;p++)for(let q=0;q<N;q++){let s=0;for(let i=0;i<N;i++)s+=ms.U[p*N+i]*ms.U[q*N+i];md=Math.max(md,Math.abs(s-(p===q?1:0)))}
  check("mode basis orthonormal (N=10)",md<1e-12,`max dev ${md.toExponential(1)}`);
  const ms7=C.modeSetup(7,0.4);let md7=0;for(let p=0;p<7;p++)for(let q=0;q<7;q++){let s=0;for(let i=0;i<7;i++)s+=ms7.U[p*7+i]*ms7.U[q*7+i];md7=Math.max(md7,Math.abs(s-(p===q?1:0)))}
  check("mode basis orthonormal (N=7, odd)",md7<1e-12,`max dev ${md7.toExponential(1)}`)}

/* 3. sampled <phi^2> vs exact */
for(const [N,mass] of [[64,0.5],[128,0.3],[256,0.05]]){
  const ms=C.modeSetup(N,mass),rng=C.mulberry32(777+N),out=new Float64Array(N);let s=0,S=3000,c1=0;
  for(let t=0;t<S;t++){C.sampleField(ms,rng,out);let q=0;for(let i=0;i<N;i++)q+=out[i]*out[i];s+=q/N;c1+=out[0]*out[1]}
  const ex=C.phiVarExact(N,mass);
  check(`sampled <phi^2> vs exact within 2%, N=${N} m=${mass}`,rel(s/S,ex)<0.02,`sampled ${(s/S).toFixed(5)}, exact ${ex.toFixed(5)}, off ${(rel(s/S,ex)*100).toFixed(2)}%`)}
{const N=32,mass=0.5,ms=C.modeSetup(N,mass),rng=C.mulberry32(5),out=new Float64Array(N);let c1=0,S=40000;
  for(let t=0;t<S;t++){C.sampleField(ms,rng,out);c1+=out[0]*out[1]}
  const ex=C.phiCovExact(N,mass,1);
  check("sampled neighbour covariance vs exact (tol 0.01 abs)",Math.abs(c1/S-ex)<0.01,`sampled ${(c1/S).toFixed(4)}, exact ${ex.toFixed(4)}`)}

/* 4. window variance, sampled */
{const N=64,mass=0.5,ms=C.modeSetup(N,mass),rng=C.mulberry32(99),out=new Float64Array(N),Pp=new Float64Array(2*N+1),acc=new Float64Array(N/2+1);const S=4000;
  for(let t=0;t<S;t++){C.sampleField(ms,rng,out);C.windowAccumulate(out,N,N/2,acc,Pp)}
  let worst=0,txt=[];for(const w of [1,4,16,32]){const r=rel(acc[w]/S,C.windowVarExact(N,mass,w));worst=Math.max(worst,r);txt.push(`w=${w}: ${(acc[w]/S).toFixed(5)}/${C.windowVarExact(N,mass,w).toFixed(5)}`)}
  check("window-average variance sampled vs exact within 3%",worst<0.03,txt.join("  "));
  check("window average jitters less than one site",C.windowVarExact(N,mass,8)<C.windowVarExact(N,mass,1)&&C.windowVarExact(N,mass,32)<C.windowVarExact(N,mass,8),"exact variance falls with w")}

/* 5. heavier field jitters less */
check("heavier field jitters less",C.phiVarExact(128,1.5)<C.phiVarExact(128,0.3)&&C.phiVarExact(128,0.3)<C.phiVarExact(128,0.05),`m=0.05: ${C.phiVarExact(128,0.05).toFixed(4)}, 0.3: ${C.phiVarExact(128,0.3).toFixed(4)}, 1.5: ${C.phiVarExact(128,1.5).toFixed(4)}`);

/* 6. OU update keeps the variance */
{const N=16,mass=0.4,ms=C.modeSetup(N,mass),rng=C.mulberry32(31),S=20000,dt=0.3;
  const sum=new Float64Array(N),A=new Float64Array(N);
  for(let t=0;t<S;t++){C.sampleAmps(ms,rng,A);C.ouStep(A,ms.s2,ms.gam,dt,rng);for(let q=0;q<N;q++)sum[q]+=A[q]*A[q]}
  let worst=0;for(let q=0;q<N;q++)worst=Math.max(worst,rel(sum[q]/S,ms.s2[q]));
  check("OU step keeps mode variance (ensemble, within 5%)",worst<0.05,`worst mode off ${(worst*100).toFixed(2)}%`);
  // from rest, long run converges to the exact variance (time average)
  const B=new Float64Array(N);let tot=0,T=150000;
  for(let t=0;t<T;t++){C.ouStep(B,ms.s2,ms.gam,0.5,rng);if(t>100){let s=0;for(let i=0;i<N;i++)s+=B[i]*B[i];tot+=s}}
  const exSum=ms.s2.reduce((p,q)=>p+q,0);
  check("OU walk from rest converges to ground-state variance (3%)",rel(tot/(T-101),exSum)<0.03,`time average ${(tot/(T-101)).toFixed(4)}, exact ${exSum.toFixed(4)}`);
  // and the field made from the OU state has the right <phi^2>
  const out=new Float64Array(N);let ph=0,cnt=0;for(let t=0;t<60000;t++){C.ouStep(B,ms.s2,ms.gam,0.5,rng);if(t%3===0){C.fieldFromAmps(ms,B,out);let q=0;for(let i=0;i<N;i++)q+=out[i]*out[i];ph+=q/N;cnt++}}
  check("OU field <phi^2> vs exact (4%)",rel(ph/cnt,C.phiVarExact(N,mass))<0.04,`${(ph/cnt).toFixed(4)} vs ${C.phiVarExact(N,mass).toFixed(4)}`)}

/* 7. Casimir */
{let md=0;for(const L of [2,3,5,12,40,200,1000])md=Math.max(md,Math.abs(C.casimirSum(L)-C.casimirClosed(L))/Math.max(1,Math.abs(C.casimirSum(L))));
  check("closed-form sum = direct sum (rel 1e-10)",md<1e-10,`max rel diff ${md.toExponential(1)}`)}
check("omega_n = 2 sin(n pi/2L) sums to 2E",Math.abs(2*C.casimirSum(7)-(()=>{let s=0;for(let n=1;n<7;n++)s+=2*Math.sin(n*Math.PI/14);return s})())<1e-12,"L=7");
check("bulk coefficient a = 2/pi, surface b = -1/2",Math.abs(C.CAS_A-2/Math.PI)<1e-15&&C.CAS_B===-0.5,"");
for(const L of [100,400,2000]){
  const Ec=C.casimirSum(L)-C.CAS_A*L-C.CAS_B,x=L*Ec;
  check(`L*(E-bulk-surface) -> -pi/24 within 1%, L=${L}`,rel(x,-Math.PI/24)<0.01,`${x.toFixed(5)} vs ${(-Math.PI/24).toFixed(5)} (${(rel(x,-Math.PI/24)*100).toFixed(3)}%)`)}
check("small L=12 already within 1%",rel(12*C.casimirRemainder(12),-Math.PI/24)<0.01,`${(12*C.casimirRemainder(12)).toFixed(5)}`);
for(const L of [20,100]){const F=C.casimirForce(L);
  check(`force is attractive and matches -pi/(24 L^2), L=${L} (2%)`,F<0&&rel(F,-Math.PI/(24*L*L))<0.02,`${F.toExponential(4)} vs ${(-Math.PI/(24*L*L)).toExponential(4)}`)}
check("force scales as 1/L^2",Math.abs(C.casimirForce(20)/C.casimirForce(40)-4)<0.1,`ratio ${(C.casimirForce(20)/C.casimirForce(40)).toFixed(3)}`);

console.log(fails?`\n${fails} check(s) FAILED`:"\nall checks passed");
process.exit(fails?1:0);
