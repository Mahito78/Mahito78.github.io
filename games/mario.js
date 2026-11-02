// Teaching Quest: 3 original levels. '?' blocks reveal course topics; reach the flag 'F'.
const cv=document.getElementById('c'),x=cv.getContext('2d'),T=32,info=document.getElementById('info');
const LEVELS=[
{title:'Lecture Hall 1',topics:['[Course 1]','[Course 2]','[Course 3]'],map:[
'                                                  ',
'                                                  ',
'                                                  ',
'                                                  ',
'      ?           B?B                  ?          ',
'                                                  ',
'                      E        E            F     ',
'##########  ######   #####   #########  ##########',
'##########  ######   #####   #########  ##########']},
{title:'The Exam Room',topics:['[Syllabus]','[Slides]','[Exercises]'],map:[
'                                                  ',
'                              ?                   ',
'                                                  ',
'              B?B                      B          ',
'                         ###                      ',
'               E                  E               ',
'      ###     ###       #     ##   ###    F       ',
'#####   ####   ### ### ###  ###  ####  ###########',
'#####   ####   ### ### ###  ###  ####  ###########']},
{title:'Office Hours',topics:['[Q&A]','[Projects]','[Grades]'],map:[
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
function draw(){x.fillStyle='#5c94fc';x.fillRect(0,0,640,400);x.save();x.translate(-cam,0);
 lv.forEach((r,j)=>r.forEach((c,i)=>{const X=i*T,Y=j*T+(400-lv.length*T);
  if(c==='#'){x.fillStyle='#c84c0c';x.fillRect(X,Y,T,T);x.strokeStyle='#000';x.strokeRect(X,Y,T,T)}
  else if(c==='B'){x.fillStyle='#e0a050';x.fillRect(X,Y,T,T);x.strokeRect(X,Y,T,T)}
  else if(c==='?'||c==='!'){x.fillStyle=c==='?'?'#fcb800':'#7a5a20';x.fillRect(X,Y,T,T);x.fillStyle='#000';x.font='bold 20px monospace';if(c==='?')x.fillText('?',X+11,Y+23)}
  else if(c==='F'){x.fillStyle='#fff';x.fillRect(X+14,Y-3*T,4,4*T);x.fillStyle='#2ecc40';x.fillRect(X+18,Y-3*T,24,16)}}));
 const oy=400-lv.length*T;
 x.fillStyle='#8b4513';enemies.forEach(e=>{if(!e.dead)x.fillRect(e.x,e.y+oy,28,28)});
 x.fillStyle='#e52521';x.fillRect(p.x,p.y+oy,24,28);x.fillStyle='#fdd';x.fillRect(p.x+12,p.y+oy+4,10,8);x.restore();
 x.fillStyle='#fff';x.font='16px monospace';x.fillText(LEVELS[L].title+'  |  '+msg,10,22)}
function loop(){step();draw();requestAnimationFrame(loop)}
addEventListener('keydown',e=>{keys[e.key]=1;if(' ArrowUp ArrowDown'.includes(e.key))e.preventDefault()});addEventListener('keyup',e=>keys[e.key]=0);
info.textContent='Arrows/WASD to move, Space/Up to jump. Stomp bugs, bump ? blocks to learn topics, reach the flag.';
load(0);loop();
