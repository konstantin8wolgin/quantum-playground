import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";
const dir=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(dir,"../demos/order-matters.html"),"utf8");
const m=html.match(/\/\* PHYSICS-CORE START \*\/([\s\S]*?)\/\* PHYSICS-CORE END \*\//);
if(!m){console.log("FAIL  physics core block not found");process.exit(1);}
const P=vm.runInNewContext(m[1]+"\n({branchStats,mulberry32,sampleParticle,matComm,matScale,matMaxDiff,SX,SY,SZ,packet,commXP,expectC,ratioErr,psiTable,wignerMap,integralW,minW,marginals,psiDensity,momentsW,WN,WH,WD})");
let bad=0;
const check=(name,val,exp,tol)=>{const ok=Math.abs(val-exp)<=tol;if(!ok)bad++;
  console.log(`${ok?"PASS":"FAIL"}  ${name}: ${(+val).toPrecision(6)} (expect ${(+exp).toPrecision(6)} ± ${tol})`);};
const NB=[[false,false],[false,true],[false,false]];
/* panel 1 */
let s=P.branchStats("up",[0,90,0],NB);
check("chain z,x(block x-),z: P(z+)",s.det[0],0.25,1e-12);
check("chain z,x(block x-),z: P(z-)",s.det[1],0.25,1e-12);
check("chain: share z+ of arrivals",s.share[0],0.5,1e-12);
s=P.branchStats("up",[0,0,0],[[false,true],[false,true],[false,true]]);
check("z,z,z: P(z+)",s.det[0],1,1e-12);
s=P.branchStats("mixed",[0],[[false,false]]);
check("unpolarised, one magnet: P(+)",s.det[0],0.5,1e-12);
s=P.branchStats("up",[60],[[false,false]]);
check("z-up then axis 60 deg: P(+)=cos^2(30deg)",s.det[0],0.75,1e-12);
s=P.branchStats("up",[0,45,90],[[false,true],[false,true],[false,true]]);
check("z,45,x all blocked-: P(x+)=cos^4(22.5deg)",s.det[0],Math.pow(Math.cos(Math.PI/8),4),1e-12);
{const run=()=>{const r=P.mulberry32(7);let a=0,b=0,st=0;const N=20000;
  for(let i=0;i<N;i++){const q=P.sampleParticle(r,"up",[0,90,0],NB);if(q.stop>=0)st++;else if(q.out[2]===1)a++;else b++;}
  return[a/N,b/N,st/N];};
  const r1=run(),r2=run();
  check("sampled P(z+) (20000, seeded)",r1[0],0.25,0.015);
  check("sampled P(z-)",r1[1],0.25,0.015);
  check("sampled blocked share",r1[2],0.5,0.015);
  check("seed repeatable",r1[0]===r2[0]&&r1[1]===r2[1]?1:0,1,0);}
/* panel 2 */
for(const [sg,k0,xc] of [[1,1.5,0.5],[0.6,2,-2],[1.6,0,2],[1,0,0]]){
  const {re,im}=P.packet(sg,k0,xc),C=P.commXP(re,im),e=P.expectC(re,im,C.cR,C.cI);
  check(`<[x,p]> real part (sigma ${sg}, k0 ${k0}, x0 ${xc})`,e[0],0,1e-3);
  check(`<[x,p]> imag part (sigma ${sg}, k0 ${k0}, x0 ${xc})`,e[1],1,1e-3);
  check(`pointwise [x,p]psi/psi error, centre (sigma ${sg}, k0 ${k0})`,P.ratioErr(re,im,C.cR,C.cI),0,1e-3);
}
{const A=P.matComm(P.SX,P.SZ),B=P.matScale(P.SY,[0,-2]);check("[sx,sz] = -2i sy, max entry diff",P.matMaxDiff(A,B),0,1e-12);}
/* panel 3 */
const cases=[["coh",{x0:1,p0:0.5}],["coh",{x0:-2,p0:2}],["sq",{r:0.5}],["sq",{r:-0.5}],["fock",{n:0}],["fock",{n:1}],["fock",{n:2}],["fock",{n:3}],["cat",{d:4}],["cat",{d:5}]];
const maps={};
for(const [k,p] of cases){const t=P.psiTable(k,p),W=P.wignerMap(t.re,t.im);maps[k+JSON.stringify(p)]={t,W};
  check(`integral W = 1 (${k} ${JSON.stringify(p)})`,P.integralW(W),1,1e-3);}
{const {t,W}=maps['fock{"n":1}'];check("Fock 1: W(0,0) = -1/pi",W[P.WH*P.WN+P.WH],-1/Math.PI,1e-3);
  check("Fock 1: lowest W is negative (<-0.3)",P.minW(W)<-0.3?1:0,1,0);}
{const {W}=maps['coh{"x0":1,"p0":0.5}'];const m=P.momentsW(W);
  check("coherent: dx*dp",m.prod,0.5,1e-3);check("coherent: <x>",m.mx,1,1e-3);check("coherent: <p>",m.mp,0.5,1e-3);
  check("coherent: W peak at (x0,p0) = 1/pi",W[(P.WH+5)*P.WN+(P.WH+10)],1/Math.PI,1e-3);
  check("coherent: lowest W >= 0",P.minW(W)>-1e-6?1:0,1,0);}
{const m=P.momentsW(maps['sq{"r":0.5}'].W);check("squeezed r=0.5: dx*dp",m.prod,0.5,1e-3);
 check("squeezed r=0.5: dx = e^-r/sqrt2",m.dx,Math.exp(-0.5)/Math.SQRT2,1e-3);}
{const m=P.momentsW(maps['fock{"n":1}'].W);check("Fock 1: dx*dp = 3/2",m.prod,1.5,1e-3);}
for(const k of ['cat{"d":4}','fock{"n":3}','sq{"r":0.5}']){const {t,W}=maps[k];const mg=P.marginals(W),d=P.psiDensity(t.re,t.im);let g=0;
  for(let i=0;i<P.WN;i++)g=Math.max(g,Math.abs(mg.mx[i]-d[i]));check(`x marginal = |psi|^2 (${k})`,g,0,1e-3);}
check("cat D=4: lowest W is negative (<-0.1)",P.minW(maps['cat{"d":4}'].W)<-0.1?1:0,1,0);
console.log(bad?`\n${bad} check(s) FAILED`:"\nall checks passed");
process.exit(bad?1:0);
