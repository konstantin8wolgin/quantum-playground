import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"..","demos","su3-colours.html"),"utf8");
const m=html.match(/\/\* PHYSICS-CORE START \*\/([\s\S]*?)\/\* PHYSICS-CORE END \*\//);
if(!m){console.log("FAIL  physics core block not found");process.exit(1)}
const names="cadd cmul cconj cabs2 mZero mId mAdd mSub mScale mMul mDag mVec mTrace mNorm mDet mComm GELL expm genU normSq fStruct rng randomState randomWalkDrift QUARK_W ROOTS mesonSums wKey S3";
const P=vm.runInNewContext(`"use strict";${m[1]};({${names.split(" ").join(",")}})`,{});

let fails=0;
function check(name,ok,info=""){console.log(`${ok?"PASS":"FAIL"}  ${name}${info?"  ["+info+"]":""}`);if(!ok)fails++}
const {GELL,mMul,mSub,mDag,mNorm,mId,mScale,mComm,mTrace,genU,expm,mDet,S3}=P;
const r=P.rng(42);

// 1 generators: Hermitian, traceless, tr(la lb) = 2 delta
{let worst=0;
 for(let a=0;a<8;a++){worst=Math.max(worst,mNorm(mSub(GELL[a],mDag(GELL[a]))),Math.hypot(...mTrace(GELL[a])));
  for(let b=0;b<8;b++){const t=mTrace(mMul(GELL[a],GELL[b]));worst=Math.max(worst,Math.abs(t[0]-(a===b?2:0)),Math.abs(t[1]))}}
 check("1  Gell-Mann matrices: Hermitian, traceless, tr(λaλb)=2δ (8 independent = dim SU(3))",worst<1e-14,worst.toExponential(1));}

// 2 exp(i t λ/2): unitary, det 1 (also for large t)
{let wu=0,wd=0;
 for(let k=0;k<8;k++)for(const t of [0.3,1.7,-4.2,25,60]){const U=genU(k,t);
  wu=Math.max(wu,mNorm(mSub(mMul(mDag(U),U),mId())));const d=mDet(U);wd=Math.max(wd,Math.hypot(d[0]-1,d[1]))}
 check("2  U=exp(i t λk/2) is unitary and det U = 1 for all 8 generators",wu<1e-12&&wd<1e-12,`unitary ${wu.toExponential(1)}, det ${wd.toExponential(1)}`);}

// 3 exponential against closed forms
{const t=1.3,c=Math.cos(t/2),s=Math.sin(t/2);
 const U=genU(0,t);
 const exact=[[[c,0],[0,s],[0,0]],[[0,s],[c,0],[0,0]],[[0,0],[0,0],[1,0]]];
 const e1=mNorm(mSub(U,exact));
 const U8=genU(7,t),ph=t/2/S3;
 const e8=Math.max(Math.hypot(U8[0][0][0]-Math.cos(ph),U8[0][0][1]-Math.sin(ph)),Math.hypot(U8[2][2][0]-Math.cos(-2*ph),U8[2][2][1]-Math.sin(-2*ph)),mNorm(mSub(genU(2,2*Math.PI),[[[-1,0],[0,0],[0,0]],[[0,0],[-1,0],[0,0]],[[0,0],[0,0],[1,0]]])));
 check("3  exponential matches closed forms (λ1 block, λ8 phases, λ3 at 2π gives diag(−1,−1,1))",e1<1e-13&&e8<1e-13,`${e1.toExponential(1)}, ${e8.toExponential(1)}`);}

// 4 exp of a general generator mix is a group element (expm vs product of halves)
{const A=mScale(GELL[3],[0,0.9]);const E=expm(A),H=expm(mScale(A,[0.5,0]));
 const e=mNorm(mSub(E,mMul(H,H)));
 check("4  expm(A) = expm(A/2)² (semigroup property)",e<1e-13,e.toExponential(1));}

// 5 [λ1/2, λ2/2] = i λ3/2 and f123 = 1
{const l=mComm(mScale(GELL[0],[0.5,0]),mScale(GELL[1],[0.5,0])),rr=mScale(GELL[2],[0,0.5]);
 const e=mNorm(mSub(l,rr)),f=P.fStruct(0,1,2);
 check("5  [λ1/2, λ2/2] = i·λ3/2 and f123 = 1",e<1e-14&&Math.abs(f-1)<1e-14,`err ${e.toExponential(1)}, f123=${f}`);}

// 6 f458 = sqrt(3)/2 (plus f147 = 1/2, f246 = 1/2, f678 = sqrt(3)/2)
{const f=P.fStruct(3,4,7),ok=Math.abs(f-S3/2)<1e-14&&Math.abs(P.fStruct(0,3,6)-0.5)<1e-14&&Math.abs(P.fStruct(1,3,5)-0.5)<1e-14&&Math.abs(P.fStruct(5,6,7)-S3/2)<1e-14&&Math.abs(P.fStruct(1,0,2)+1)<1e-14;
 check("6  f458 = √3/2 (also f147 = f246 = 1/2, f678 = √3/2, antisymmetry)",ok,`f458=${f.toFixed(12)}`);}

// 7 unitarity after 1000 random steps
{const w=P.randomWalkDrift(1000,12345),w2=P.randomWalkDrift(1000,777);
 check("7  Σ|c|² = 1 after 1000 random steps (drift < 1e-12)",w<1e-12&&w2<1e-12,`${w.toExponential(1)}, ${w2.toExponential(1)}`);}

// 8 order matters: λ1 and λ4 do not commute; λ3 and λ8 do
{const t=0.9,A=mMul(genU(3,t),genU(0,t)),B=mMul(genU(0,t),genU(3,t));
 const d=mNorm(mSub(A,B)),d3=mNorm(mComm(GELL[2],GELL[7])),dsmall=mNorm(mSub(mMul(genU(3,0.05),genU(0,0.05)),mMul(genU(0,0.05),genU(3,0.05))));
 check("8  U4·U1 ≠ U1·U4 (λ1, λ4), small-t difference ~ t², and [λ3, λ8] = 0",d>0.05&&d3<1e-14&&dsmall<d/50,`diff ${d.toFixed(3)}, small ${dsmall.toExponential(1)}`);}

// 9 weights of quarks from the diagonals
{const W=P.QUARK_W,ok=Math.abs(W[0][0]-0.5)<1e-14&&Math.abs(W[0][1]-1/3)<1e-14&&Math.abs(W[1][0]+0.5)<1e-14&&Math.abs(W[1][1]-1/3)<1e-14&&Math.abs(W[2][0])<1e-14&&Math.abs(W[2][1]+2/3)<1e-14;
 check("9  weights u(½,⅓) d(−½,⅓) s(0,−⅔) from λ3/2 and λ8/√3",ok);
 const Q=W.map(w=>w[0]+w[1]/2);
 check("9b charges Q = I3 + Y/2 = 2/3, −1/3, −1/3",Math.abs(Q[0]-2/3)<1e-14&&Math.abs(Q[1]+1/3)<1e-14&&Math.abs(Q[2]+1/3)<1e-14);}

// 10 nine quark-antiquark sums: 7 points, multiplicities 1,1,1,1,1,1,3
{const M=P.mesonSums(),mult=Object.values(M).map(v=>v.count).sort((a,b)=>a-b);
 const centre=M["0,0"];
 check("10 3⊗3̄: 9 sums give 7 distinct points, multiplicities 1,1,1,1,1,1,3 (= 8 + 1)",mult.length===7&&mult.join()==="1,1,1,1,1,1,3"&&centre&&centre.count===3,mult.join());}

// 11 six roots form a hexagon and are ladder eigenvalues: [H, E_ij] = (w_i − w_j)·E_ij
{const R=P.ROOTS;let worst=0;
 for(const rt of R){const E=P.mZero();E[rt.to][rt.from]=[1,0];
  const h3=mScale(GELL[2],[0.5,0]),h8=mScale(GELL[7],[1/S3,0]);
  const c3=mSub(mComm(h3,E),mScale(E,[rt.w[0],0])),c8=mSub(mComm(h8,E),mScale(E,[rt.w[1],0]));
  worst=Math.max(worst,mNorm(c3),mNorm(c8))}
 const lens=R.map(v=>Math.hypot(v.w[0],v.w[1]*Math.sqrt(3)/1)); // length in (I3, √3/2·Y·2) metric
 const keys=new Set(R.map(v=>P.wKey(v.w)));
 // roots land octet corners from the centre
 const M=P.mesonSums();const allCorner=R.every(v=>M[P.wKey(v.w)]&&M[P.wKey(v.w)].count===1);
 check("11 six roots = quark weight differences, [H,E]=root·E, and they point to the six hexagon corners",R.length===6&&keys.size===6&&worst<1e-14&&allCorner,`worst ${worst.toExponential(1)}`);}

// 12 determinant rule: dimension count 9 for U(3) vs 8 for SU(3)
{const detI=mDet(P.expm(mScale(mId(),[0,0.7])));   // exp(i 0.7·1) has det e^{i 2.1} ≠ 1: the 9th direction
 const ok=Math.abs(detI[0]-Math.cos(2.1))<1e-12&&Math.abs(detI[1]-Math.sin(2.1))<1e-12&&Math.abs(Math.hypot(...detI)-1)<1e-12;
 check("12 identity direction leaves SU(3) (det = e^{3iφ} ≠ 1): 9 − 1 = 8 dimensions",ok);}

console.log(fails?`\n${fails} check(s) FAILED`:"\nall checks passed");
process.exit(fails?1:0);
