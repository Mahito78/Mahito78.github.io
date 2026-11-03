// Teaching Quest: 3 original levels. '?' blocks reveal course topics; reach the flag 'F'.
const cv=document.getElementById('c'),x=cv.getContext('2d'),T=32,info=document.getElementById('info');
const LEVELS=[
{title:'Perception Deck',topics:['AI','Robotics','Image processing'],map:[
'                                                  ',
'                                                  ',
'                                                  ',
'                                                  ',
'      ?           B?B                  ?          ',
'                                                  ',
'                      E        E            F     ',
'##########  ######   #####   #########  ##########',
'##########  ######   #####   #########  ##########']},
{title:'Embedded Systems Bay',topics:['Embedded systems','Computer science','Real-time computing'],map:[
'                                                  ',
'                              ?                   ',
'                                                  ',
'              B?B                      B          ',
'                         ###                      ',
'               E                  E               ',
'      ###     ###       #     ##   ###    F       ',
'#####   ####   ### ### ###  ###  ####  ###########',
'#####   ####   ### ### ###  ###  ####  ###########']},
{title:'Autonomy Lab',topics:['Computer vision','Robot control','Autonomous systems'],map:[
'                                                  ',
'       ?                   ?                      ',
'                                                  ',
'     ###       E     ###        ###       B?B     ',
'                                                  ',
'   ##      ###     ##     ##  E       ##        F ',
'####  ####   ######   #####   ####  ###  #########',
'####  ####   ######   #####   ####  ###  #########',
'####  ####   ######   #####   ####  ###  #########']}];
let L=0,lv,p,enemies,cam,keys={},msg='',got=[];
function load(n){const m=LEVELS[n].map;lv=m.map(r=>r.split(''));enemies=[];
 lv.forEach((r,j)=>r.forEach((c,i)=>{if(c==='E'){enemies.push({x:i*T,y:j*T,vx:-1,dead:false});r[i]=' '}}));
 p={x:40,y:0,vx:0,vy:0,g:false};cam=0;got=[];msg=LEVELS[n].title}
const solid=(i,j)=>{const c=(lv[j]||[])[i];return c==='#'||c==='?'||c==='B'||c==='!'};
function box(o,w,h,dx,dy){// move with tile collision, returns hit tile
 let hit=null;o.x+=dx;
 for(let j=Math.floor(o.y/T);j<=Math.floor((o.y+h-1)/T);j++)for(let i=Math.floor(o.x/T);i<=Math.floor((o.x+w-1)/T);i++)if(solid(i,j)){o.x=dx>0?i*T-w:(i+1)*T;o.vx=dx>0&&o.bounce?-Math.abs(o.vx):o.bounce?Math.abs(o.vx):o.vx;if(!o.bounce)o.vx=0}
 o.y+=dy;o.g=false;
 for(let j=Math.floor(o.y/T);j<=Math.floor((o.y+h-1)/T);j++)for(let i=Math.floor(o.x/T);i<=Math.floor((o.x+w-1)/T);i++)if(solid(i,j)){
  if(dy>0){o.y=j*T-h;o.g=true}else{o.y=(j+1)*T;hit=[i,j]}o.vy=0}
 return hit}
function step(){
 if(p.y>lv.length*T+100)return load(L);
 p.vx=(keys.ArrowRight||keys.d?1:0)*3.2-(keys.ArrowLeft||keys.a||keys.q?1:0)*3.2;
 if((keys.ArrowUp||keys[' ']||keys.w||keys.z)&&p.g){p.vy=-11.5}
 p.vy=Math.min(p.vy+.55,12);
 box(p,24,28,p.vx,0);const hit=box(p,24,28,0,p.vy);
 if(hit&&lv[hit[1]][hit[0]]==='?'){const t=LEVELS[L].topics[got.length%3];got.push(t);lv[hit[1]][hit[0]]='!';msg='Learned: '+t}
 for(const e of enemies){if(e.dead)continue;e.bounce=true;e.vy=0;const o={x:e.x,y:e.y,vx:e.vx,bounce:true};box(o,28,28,o.vx,3);e.x=o.x;e.y=o.y;e.vx=o.vx;
  // turn at ledges
  if(!solid(Math.floor((e.x+(e.vx>0?30:-2))/T),Math.floor(e.y/T)+1))e.vx=-e.vx;
  if(Math.abs(p.x-e.x)<26&&Math.abs(p.y-e.y)<30){if(p.vy>1&&p.y<e.y){e.dead=true;p.vy=-8}else load(L)}}
 const fi=Math.floor((p.x+12)/T),fj=Math.floor((p.y+14)/T);
 if((lv[fj]||[])[fi]==='F'){L++;if(L>=LEVELS.length){msg='All levels cleared!';L=0}load(L)}
 cam=Math.max(0,Math.min(p.x-260,lv[0].length*T-cv.width))}
function draw(){
 const sky=x.createLinearGradient(0,0,0,400);sky.addColorStop(0,'#101c22');sky.addColorStop(.7,'#263b38');sky.addColorStop(1,'#53604c');
 x.fillStyle=sky;x.fillRect(0,0,640,400);
 x.save();x.globalAlpha=.35;x.strokeStyle='#d7ff3f';x.lineWidth=1;
 for(let i=0;i<17;i++){const sx=((i*71-cam*.14)%760+760)%760-60;x.beginPath();x.moveTo(sx,70);x.lineTo(sx+48,70);x.lineTo(sx+48,74);x.lineTo(sx,74);x.stroke()}
 x.fillStyle='#8ed8d2';
 for(let i=0;i<9;i++){const sx=((i*113-cam*.22)%900+900)%900-100,sy=130+(i%3)*28;x.beginPath();x.moveTo(sx,sy);x.lineTo(sx+58,sy-40);x.lineTo(sx+112,sy);x.fill()}
 x.restore();
 x.save();x.translate(-cam,0);
 lv.forEach((r,j)=>r.forEach((c,i)=>{
  const X=i*T,Y=j*T+(400-lv.length*T);
  if(c==='#'||c==='B'){
   const base=c==='#'?'#435849':'#31443c';
   x.fillStyle=base;x.fillRect(X,Y,T,T);
   x.fillStyle=c==='#'?'#91ad68':'#719084';x.fillRect(X,Y,T,4);
   x.fillStyle='rgba(8,16,14,.5)';x.fillRect(X+4,Y+8,T-8,T-12);
   x.strokeStyle='rgba(215,255,63,.24)';x.strokeRect(X+.5,Y+.5,T-1,T-1);
   x.fillStyle='#d7ff3f';x.fillRect(X+5,Y+T-5,5,2);
  } else if(c==='?'||c==='!'){
   x.fillStyle=c==='?'?'#d7ff3f':'#586657';x.fillRect(X+2,Y+2,T-4,T-4);
   x.fillStyle='#101713';x.fillRect(X+5,Y+5,T-10,T-10);
   if(c==='?'){x.fillStyle='#d7ff3f';x.font='700 20px sans-serif';x.textAlign='center';x.fillText('?',X+16,Y+23)}
   x.strokeStyle='#d7ff3f';x.strokeRect(X+2.5,Y+2.5,T-5,T-5);
  } else if(c==='F'){
   x.fillStyle='#d7ff3f';x.fillRect(X+12,Y-3*T,3,4*T);
   x.fillStyle='#ff6548';x.beginPath();x.moveTo(X+15,Y-3*T);x.lineTo(X+48,Y-3*T+8);x.lineTo(X+15,Y-3*T+18);x.fill();
  }
 }));
 const oy=400-lv.length*T;
 enemies.forEach(e=>{if(e.dead)return;const ey=e.y+oy;
  x.fillStyle='#ff6548';x.beginPath();x.ellipse(e.x+14,ey+17,14,11,0,Math.PI,Math.PI*2);x.fill();
  x.fillStyle='#f2e9cf';x.fillRect(e.x+7,ey+13,5,5);x.fillRect(e.x+18,ey+13,5,5);
  x.fillStyle='#101713';x.fillRect(e.x+9,ey+15,2,2);x.fillRect(e.x+20,ey+15,2,2);
 });
 const py=p.y+oy;
 x.fillStyle='#d7ff3f';x.beginPath();x.moveTo(p.x+3,py+27);x.lineTo(p.x+5,py+7);x.lineTo(p.x+12,py+2);x.lineTo(p.x+22,py+7);x.lineTo(p.x+22,py+27);x.closePath();x.fill();
 x.fillStyle='#101713';x.fillRect(p.x+14,py+8,6,6);x.fillStyle='#ff6548';x.fillRect(p.x+2,py+24,10,4);x.fillRect(p.x+15,py+24,10,4);
 x.restore();
 x.fillStyle='rgba(16,23,19,.9)';x.fillRect(0,0,640,38);
 x.fillStyle='#d7ff3f';x.fillRect(0,36,640,2);
 x.fillStyle='#eef4e8';x.font='600 13px monospace';x.fillText('FIELD '+String(L+1).padStart(2,'0')+'  /  '+LEVELS[L].title.toUpperCase(),12,17);
 x.fillStyle='#a2b1a4';x.font='11px monospace';x.fillText(msg,12,31);
 x.textAlign='right';x.fillStyle='#8ed8d2';x.fillText('TOPICS '+got.length+'  //  '+Math.floor(p.x/T)+'M',628,23);x.textAlign='left';
}
function loop(){step();draw();requestAnimationFrame(loop)}
addEventListener('keydown',e=>{keys[e.key]=1;if(' ArrowUp ArrowDown'.includes(e.key))e.preventDefault()});addEventListener('keyup',e=>keys[e.key]=0);
info.textContent='Arrows/WASD to move, Space/Up to jump. Stomp bugs, bump ? blocks to learn topics, reach the flag.';
load(0);loop();
