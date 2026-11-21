import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"../demos/string-breaking.html"),"utf8");
const m=html.match(/\/\* PHYSICS-CORE START \*\/([\s\S]*?)\/\* PHYSICS-CORE END \*\//);
if(!m){console.log("FAIL  core block not found");process.exit(1)}
const names="popcount makeBasis extField linkFields buildH matvec jacobiEigen lanczos observables placeCharges solveCharges rValues curveSlopes";
const C=vm.runInNewContext(m[1]+`;({${names.split(" ").join(",")}})`,{Math});
let fails=0;
const check=(name,ok,detail)=>{console.log(`${ok?"PASS":"FAIL"}  ${name}  ${detail}`);if(!ok)fails++};
const toDense=H=>{const A=[];for(let i=0;i<H.dim;i++){A.push(new Float64Array(H.dim));A[i][i]=H.diag[i];for(let k=H.rowPtr[i];k<H.rowPtr[i+1];k++)A[i][H.col[k]]+=H.val[k]}return A};

// ---- N = 6 : Hamiltonian, hermiticity, charge conservation
const N6=6,B6=C.makeBasis(N6),P6={m:0.7,w:1.1,J:1,ext:C.extField(N6,2,4,0.8)};
const H6=C.buildH(B6,P6),A6=toDense(H6);
check("sector size C(6,3)",B6.dim===20,`dim=${B6.dim}`);
let asym=0;for(let i=0;i<B6.dim;i++)for(let j=0;j<B6.dim;j++)asym=Math.max(asym,Math.abs(A6[i][j]-A6[j][i]));
check("Hamiltonian is hermitian (real symmetric)",asym<1e-14,`max |H_ij - H_ji| = ${asym.toExponential(1)}`);

// independent full 2^6 matrix straight from the formula, then restricted to the sector
const full=(()=>{const D=1<<N6,F=[];for(let i=0;i<D;i++)F.push(new Float64Array(D));
  for(let s=0;s<D;s++){let e=0;const sz=n=>((s>>n)&1)?1:-1;
    for(let n=0;n<N6;n++)e+=0.5*P6.m*Math.pow(-1,n)*sz(n);
    for(let n=0;n<N6-1;n++){let L=0;for(let k=0;k<=n;k++)L+=(sz(k)+Math.pow(-1,k))/2;
      if(n>=2&&n<4)L+=0.8;e+=P6.J*L*L}
    F[s][s]=e;
    for(let n=0;n<N6-1;n++){const a=(s>>n)&1,b=(s>>(n+1))&1;if(a!==b)F[s^(3<<n)][s]+=-P6.w}}
  return F})();
let dmax=0;for(let i=0;i<B6.dim;i++)for(let j=0;j<B6.dim;j++)dmax=Math.max(dmax,Math.abs(full[B6.states[i]][B6.states[j]]-A6[i][j]));
check("sparse sector H equals independent full 64x64 H restricted to the sector",dmax<1e-12,`max diff ${dmax.toExponential(1)}`);
// Q = sum sigma^z/2 commutes with H in the full matrix: no element joins different popcounts
let leak=0;for(let s=0;s<64;s++)for(let t=0;t<64;t++)if(full[s][t]!==0&&C.popcount(s)!==C.popcount(t))leak++;
check("charge conservation: H never joins different total charge",leak===0,`${leak} forbidden matrix elements`);

// ---- Lanczos vs dense
const dense=C.jacobiEigen(A6);
const lz=C.lanczos(H6,{vec:true,nvals:2,maxIt:200});
check("Lanczos ground energy vs dense diagonalisation, N=6 (<=1e-9)",Math.abs(lz.E0-dense.vals[0])<1e-9,`Lanczos ${lz.E0.toFixed(12)}  dense ${dense.vals[0].toFixed(12)}  diff ${Math.abs(lz.E0-dense.vals[0]).toExponential(1)}`);
check("Lanczos first excited energy vs dense, N=6 (<=1e-9)",Math.abs(lz.E1-dense.vals[1])<1e-9,`Lanczos ${lz.E1.toFixed(12)}  dense ${dense.vals[1].toFixed(12)}`);
const Hpsi=new Float64Array(B6.dim);C.matvec(H6,lz.psi,Hpsi);let rmax=0;for(let i=0;i<B6.dim;i++)rmax=Math.max(rmax,Math.abs(Hpsi[i]-lz.E0*lz.psi[i]));
check("ground vector satisfies H psi = E psi",rmax<1e-8,`residual ${rmax.toExponential(1)}`);
// larger: N=12 Lanczos vs independent Rayleigh quotient is variational: E <= <psi|H|psi>, and also stable between starts
const B12=C.makeBasis(12),H12=C.buildH(B12,{m:0.5,w:1,J:1,ext:C.extField(12,4,8,1)});
const l12=C.lanczos(H12,{vec:true,nvals:1,maxIt:200}),l12b=C.lanczos(H12,{vec:true,nvals:1,maxIt:120,tol:1e-13});
const y=new Float64Array(B12.dim);C.matvec(H12,l12.psi,y);let rq=0,res=0;for(let i=0;i<B12.dim;i++){rq+=y[i]*l12.psi[i]}for(let i=0;i<B12.dim;i++)res=Math.max(res,Math.abs(y[i]-rq*l12.psi[i]));
check("N=12: Lanczos eigenvector residual small, energy stable",res<1e-5&&Math.abs(l12.E0-l12b.E0)<1e-9,`E0=${l12.E0.toFixed(9)} residual ${res.toExponential(1)}`);

// ---- Gauss law and neutrality in the ground state (N=12, r=4)
const B=C.makeBasis(12),Pq={m:0.5,w:1,J:1};
const s4=C.solveCharges(B,{...Pq,q:1,r:4},{vec:true,nvals:1,maxIt:200});
let tot=0;for(const v of s4.rho)tot+=v;
check("zero total charge in the ground state",Math.abs(tot)<1e-9,`sum <rho_n> = ${tot.toExponential(1)}`);
let gmax=0;for(let n=0;n<11;n++){const prev=n?s4.L[n-1]:0,ext=s4.ext[n]-(n?s4.ext[n-1]:0);gmax=Math.max(gmax,Math.abs(s4.L[n]-prev-s4.rho[n]-ext))}
check("Gauss law: <L_n> - <L_(n-1)> = <rho_n> + static charge at n",gmax<1e-9,`max violation ${gmax.toExponential(1)}`);
let nrm=0;for(const v of s4.psi)nrm+=v*v;
check("state normalised",Math.abs(nrm-1)<1e-10,`norm ${nrm.toFixed(12)}`);

// ---- strong coupling w = 0 : V(r) = J q^2 r exactly
const N=12,none0=C.solveCharges(B,{m:4,w:0,J:1,q:0,r:2},{vec:false}).E0;
for(const q of [1,0.5,0.8]){let md=0;const out=[];
  for(const r of [2,4,6]){const V=C.solveCharges(B,{m:4,w:0,J:1,q,r},{vec:false}).E0-none0;md=Math.max(md,Math.abs(V-q*q*r));out.push(V.toFixed(6))}
  check(`w=0: V(r) = J q^2 r exactly, q=${q}, r=2,4,6`,md<1e-9,`V = ${out.join(", ")}  expected ${[2,4,6].map(r=>(q*q*r).toFixed(6)).join(", ")}  max err ${md.toExponential(1)}`)}
// J scaling
{const V=C.solveCharges(B,{m:4,w:0,J:2.5,q:1,r:4},{vec:false}).E0-C.solveCharges(B,{m:4,w:0,J:2.5,q:0,r:4},{vec:false}).E0;
 check("w=0: V scales with J (J=2.5, r=4, q=1)",Math.abs(V-10)<1e-9,`V=${V.toFixed(9)} expected 10`)}

// ---- q = 0 equals the empty chain
{const e0=C.solveCharges(B,{...Pq,q:0,r:2},{vec:false}).E0,e1=C.solveCharges(B,{...Pq,q:0,r:8},{vec:false}).E0;
 check("q=0: E(r) equals E(no charges) for any r",Math.abs(e0-e1)<1e-10,`E(r=2)=${e0.toFixed(10)} E(r=8)=${e1.toFixed(10)}`)}

// ---- string breaking: q=1 breaks, q=0.5 does not
const curve=(q,m,w,N)=>{const BB=C.makeBasis(N),e0=C.solveCharges(BB,{m,w,J:1,q:0,r:2},{vec:false}).E0;
  return C.rValues(N).map(r=>C.solveCharges(BB,{m,w,J:1,q,r},{vec:false}).E0-e0)};
{const V=curve(1,0.5,1,12),s=C.curveSlopes(V),ratio=s.large/s.mid;
 check("q=1 breaks: slope at large r < 20% of slope at small r (N=12, m=0.5, w=1)",ratio<0.2,`V(r=2,4,6,8) = ${V.map(v=>v.toFixed(3)).join(", ")}  slopes ${s.mid.toFixed(3)} -> ${s.large.toFixed(3)}  ratio ${ratio.toFixed(3)}`)}
{const V=curve(1,0.5,1,14),s=C.curveSlopes(V),ratio=s.large/s.mid;
 check("q=1 breaks also on N=14",ratio<0.2,`ratio ${ratio.toFixed(3)}  V = ${V.map(v=>v.toFixed(3)).join(", ")}`)}
{const V=curve(0.5,0.5,1,12),s=C.curveSlopes(V),ratio=s.large/s.mid;
 check("q=0.5 does not break: slope stays large (ratio > 0.8)",ratio>0.8,`V = ${V.map(v=>v.toFixed(3)).join(", ")}  ratio ${ratio.toFixed(3)}`)}
{const V=curve(0.5,0.5,1,14),s=C.curveSlopes(V),ratio=s.large/s.mid;
 check("q=0.5 does not break on N=14",ratio>0.8,`ratio ${ratio.toFixed(3)}`)}
// string tension at finite w is below strong coupling here, and equals it at w=0
{const V=curve(1,2,0,12),s=C.curveSlopes(V);check("w=0, m=2: sigma from V(2)/2 equals J q^2 = 1",Math.abs(s.small-1)<1e-9,`sigma=${s.small.toFixed(9)}`)}

console.log(fails?`\n${fails} check(s) FAILED`:"\nall checks passed");
process.exit(fails?1:0);
