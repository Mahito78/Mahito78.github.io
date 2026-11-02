// Research Rules: Baba-style puzzle with original levels. Push words to form "X IS Y" rules.
const cv=document.getElementById('c'),x=cv.getContext('2d'),info=document.getElementById('info');
// legend: lowercase objects, UPPER words: noun words are N:name, IS = '=', props: Y=YOU W=WIN P=PUSH S=STOP
const L=[
{name:'Hypothesis',w:9,h:7,
 ents:[['b',1,3,'obj'],['f',7,3,'obj'],
  ['n:b',1,1],['is',2,1],['p:YOU',3,1],['n:f',5,5],['is',6,5],['p:WIN',7,5]]},
{name:'Peer Review',w:10,h:7,
 ents:[['b',1,5,'obj'],['f',8,1,'obj'],['k',5,3,'obj'],
  ['n:b',1,1],['is',2,1],['p:YOU',3,1],['n:f',7,5],['is',8,5],['p:WIN',9,5],
  ['n:k',4,1],['is',5,1],['p:STOP',6,1]]},
{name:'Paradigm Shift',w:10,h:7,
 ents:[['b',1,3,'obj'],['f',8,3,'obj'],...[0,1,2,3,4,5,6].map(y=>['k',5,y,'obj']),
  ['n:b',1,0],['is',2,0],['p:YOU',3,0],['n:k',1,5],['is',2,5],['p:STOP',3,5],['n:f',6,0],['is',7,0],['p:WIN',8,0]]}];
const C={b:'#e8a',f:'#fd3',k:'#888',w:'#444'},NAME={b:'AUTHOR',f:'PAPER',k:'BIAS'};
let lv,ents,cur=0,hist=[],msg='';
function load(n){cur=n;const d=L[n];ents=[];d.ents.forEach(e=>ents.push({k:e[0],x:e[1],y:e[2]}));hist=[];msg=d.name}
const isW=e=>e.k.includes(':')||e.k==='is';
function rules(){const r={};
 for(const a of ents.filter(e=>e.k.startsWith('n:')))for(const [dx,dy] of [[1,0],[0,1]]){
  const i=ents.find(e=>e.k==='is'&&e.x===a.x+dx&&e.y===a.y+dy),p=i&&ents.find(e=>e.k.startsWith('p:')&&e.x===a.x+2*dx&&e.y===a.y+2*dy);
  if(p)(r[a.k.slice(2)]??=new Set()).add(p.k.slice(2))}
 return r}
const has=(r,k,p)=>r[k]&&r[k].has(p);
function push(e,dx,dy,r){const nx=e.x+dx,ny=e.y+dy,D=L[cur];
 if(nx<0||ny<0||nx>=D.w||ny>=D.h)return false;
 for(const o of ents.filter(o=>o!==e&&o.x===nx&&o.y===ny)){
  if(isW(o)||has(r,o.k,'PUSH')){if(!push(o,dx,dy,r))return false}
  else if(has(r,o.k,'STOP'))return false}
 e.x=nx;e.y=ny;return true}
function move(dx,dy){hist.push(JSON.stringify(ents));const r=rules();
 for(const e of ents.filter(e=>has(r,e.k,'YOU')))push(e,dx,dy,r);
 const r2=rules();
 if(ents.some(y=>has(r2,y.k,'YOU')&&ents.some(f=>has(r2,f.k,'WIN')&&f.x===y.x&&f.y===y.y))){
  msg='Solved! '+(cur+1<L.length?'Next level…':'All levels cleared');setTimeout(()=>load((cur+1)%L.length),900)}
 else if(!ents.some(y=>has(r2,y.k,'YOU')))msg='No YOU rule — press Z to undo or R to reset';
 else msg=L[cur].name}
function draw(){const D=L[cur],s=Math.min(640/D.w,400/D.h)|0;x.fillStyle='#111';x.fillRect(0,0,640,400);
 x.fillStyle='#1a1a2e';x.fillRect(0,0,D.w*s,D.h*s);
 for(const e of ents){const X=e.x*s,Y=e.y*s;
  if(isW(e)){x.fillStyle='#222';x.fillRect(X+2,Y+2,s-4,s-4);x.fillStyle=e.k==='is'?'#fff':e.k.startsWith('p:')?'#6c6':'#e69';
   x.font='bold '+(s/5.5|0)+'px monospace';x.textAlign='center';x.fillText(e.k==='is'?'IS':e.k.startsWith('n:')?NAME[e.k[2]]:e.k.slice(2),X+s/2,Y+s/1.8)}
  else{x.fillStyle=C[e.k];x.fillRect(X+s*.15,Y+s*.15,s*.7,s*.7)}}
 x.textAlign='left';x.fillStyle='#fff';x.font='14px monospace';x.fillText(msg,6,D.h*s+16)}
addEventListener('keydown',e=>{const m={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]}[e.key];
 if(m){move(...m);e.preventDefault()}
 else if(e.key==='z'&&hist.length)ents=JSON.parse(hist.pop());else if(e.key==='r')load(cur);draw()});
info.textContent='Arrows/WASD move. Push words to rewrite the rules (e.g. PAPER IS WIN). Z undo, R reset.';
load(0);draw();
