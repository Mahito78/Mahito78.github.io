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
const C={b:'#8ed8d2',f:'#ffcb55',k:'#ff6548',w:'#444'},NAME={b:'ROBOT',f:'GOAL',k:'WALL'};
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
function draw(){
 const D=L[cur],s=Math.floor(Math.min(600/D.w,300/D.h)),ox=(640-D.w*s)/2,oy=54;
 const bg=x.createLinearGradient(0,0,0,400);bg.addColorStop(0,'#18241f');bg.addColorStop(1,'#0d1411');x.fillStyle=bg;x.fillRect(0,0,640,400);
 x.fillStyle='rgba(215,255,63,.07)';for(let i=0;i<640;i+=24)x.fillRect(i,0,1,400);
 x.fillStyle='#101713';x.fillRect(0,0,640,42);x.fillStyle='#d7ff3f';x.fillRect(0,40,640,2);
 x.fillStyle='#eef4e8';x.font='600 13px monospace';x.fillText('RULE LAB  /  '+String(cur+1).padStart(2,'0'),14,18);
 x.fillStyle='#8ed8d2';x.textAlign='right';x.fillText(D.name.toUpperCase(),626,18);x.textAlign='left';
 x.fillStyle='#202c26';x.fillRect(ox-6,oy-6,D.w*s+12,D.h*s+12);
 x.strokeStyle='#405047';x.lineWidth=1;x.strokeRect(ox-.5,oy-.5,D.w*s+1,D.h*s+1);
 for(let row=0;row<D.h;row++)for(let col=0;col<D.w;col++){
  const X=ox+col*s,Y=oy+row*s;
  x.fillStyle=(row+col)%2?'#17221d':'#1a2721';x.fillRect(X+1,Y+1,s-2,s-2);
  x.strokeStyle='rgba(142,216,210,.08)';x.strokeRect(X+.5,Y+.5,s-1,s-1);
 }
 for(const e of ents){
  const X=ox+e.x*s,Y=oy+e.y*s;
  if(isW(e)){
   const noun=e.k.startsWith('n:'),prop=e.k.startsWith('p:'),word=e.k==='is'?'IS':noun?NAME[e.k[2]]:e.k.slice(2);
   const tone=e.k==='is'?'#eef4e8':prop?'#d7ff3f':'#8ed8d2';
   x.fillStyle='#0c1310';x.fillRect(X+4,Y+5,s-6,s-6);
   x.fillStyle='#26352d';x.fillRect(X+2,Y+2,s-6,s-6);
   x.fillStyle=tone;x.fillRect(X+2,Y+2,s-6,3);
   x.strokeStyle='rgba(238,244,232,.24)';x.strokeRect(X+2.5,Y+2.5,s-7,s-7);
   x.fillStyle=tone;x.font='700 '+Math.max(9,Math.min(14,s/4|0))+'px monospace';x.textAlign='center';x.textBaseline='middle';
   x.fillText(word,X+s/2,Y+s/2+2, s-8);
  } else {
   const cx=X+s/2,cy=Y+s/2;
   x.fillStyle='rgba(0,0,0,.4)';x.beginPath();x.ellipse(cx,cy+s*.26,s*.33,s*.13,0,0,Math.PI*2);x.fill();
   if(e.k==='b'){
    x.fillStyle='#8ed8d2';x.beginPath();x.moveTo(cx,cy-s*.3);x.lineTo(cx+s*.24,cy-s*.05);x.lineTo(cx+s*.2,cy+s*.21);x.lineTo(cx,cy+s*.32);x.lineTo(cx-s*.2,cy+s*.21);x.lineTo(cx-s*.24,cy-s*.05);x.closePath();x.fill();
    x.fillStyle='#101713';x.fillRect(cx+s*.04,cy-s*.08,s*.1,s*.08);
   }else if(e.k==='f'){
    x.fillStyle='#ffcb55';x.fillRect(cx-s*.22,cy-s*.3,s*.43,s*.58);
    x.fillStyle='#fff0c4';x.fillRect(cx-s*.15,cy-s*.2,s*.29,3);x.fillRect(cx-s*.15,cy-s*.1,s*.29,2);x.fillRect(cx-s*.15,cy,s*.2,2);
    x.fillStyle='#ff6548';x.fillRect(cx+s*.09,cy+s*.13,s*.14,s*.14);
   }else{
    x.fillStyle='#ff6548';x.beginPath();x.moveTo(cx,cy-s*.32);x.lineTo(cx+s*.28,cy);x.lineTo(cx,cy+s*.3);x.lineTo(cx-s*.28,cy);x.closePath();x.fill();
    x.strokeStyle='#ffd2c6';x.lineWidth=2;x.beginPath();x.moveTo(cx-s*.1,cy);x.lineTo(cx,cy-s*.14);x.lineTo(cx+s*.1,cy);x.lineTo(cx,cy+s*.14);x.closePath();x.stroke();
   }
  }
 }
 x.textAlign='left';x.textBaseline='alphabetic';x.fillStyle='#d7ff3f';x.fillRect(14,oy+D.h*s+14,22,2);
 x.fillStyle='#eef4e8';x.font='600 11px monospace';x.fillText(msg.toUpperCase(),44,oy+D.h*s+19);
 x.fillStyle='#a2b1a4';x.textAlign='right';x.fillText('Z / UNDO   R / RESET',626,oy+D.h*s+19);x.textAlign='left';
 window.brutalFx&&brutalFx(x,640,400);
}
addEventListener('keydown',e=>{const m={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]}[e.key];
 if(m){move(...m);e.preventDefault()}
 else if(e.key==='z'&&hist.length)ents=JSON.parse(hist.pop());else if(e.key==='r')load(cur);draw()});
info.textContent='Arrows/WASD move. Push words to rewrite the rules (e.g. PAPER IS WIN). Z undo, R reset.';
load(0);draw();
