// Project Circuit: pseudo-3D racer. Each track passes billboards for your projects; 3 laps-style tracks.
const cv=document.getElementById('c'),x=cv.getContext('2d'),info=document.getElementById('info');
const W=640,H=400,SEG=200,ROAD=2000,DRAW=150;
const TRACKS=[
 {name:'Cape Prototype',projects:['[Project 1]','[Project 2]','[Project 3]'],curves:[[0,0],[20,2.5],[50,-3],[80,0],[110,4],[140,-2]],len:170},
 {name:'Repo Raceway',projects:['[Project 4]','[Project 5]','[Project 6]'],curves:[[0,0],[15,-4],[40,3],[60,-3.5],[90,5],[120,-5],[150,0]],len:180},
 {name:'Deploy Drive',projects:['[Project 7]','[Project 8]','[Project 9]'],curves:[[0,2],[25,-5],[45,5],[70,-2],[100,6],[130,-6],[160,0]],len:200}];
let T=0,segs,pos,pxo,speed,time,score,sign,done,msg='';
function build(n){const t=TRACKS[n];segs=[];
 for(let i=0;i<t.len;i++){let c=0;for(const [s,v] of t.curves)if(i>=s)c=v;segs.push({curve:c,hill:Math.sin(i/12)*40,sign:null})}
 t.projects.forEach((p,k)=>segs[Math.floor((k+1)*t.len/4)].sign=p);
 pos=0;pxo=0;speed=0;time=60;sign=[];done=false;msg=t.name}
const keys={};addEventListener('keydown',e=>{keys[e.key]=1;if(e.key.startsWith('Arrow'))e.preventDefault()});addEventListener('keyup',e=>keys[e.key]=0);
function step(){
 if(done){if(keys.Enter){T=(T+1)%TRACKS.length;build(T)}return}
 speed+=(keys.ArrowUp||keys.w||keys.z?1:-.5)*.05*SEG*.04;
 if(keys.ArrowDown||keys.s)speed-=SEG*.01;
 const lim=SEG*0.18;speed=Math.max(0,Math.min(speed,lim));
 const i=Math.floor(pos/SEG)%segs.length,seg=segs[i];
 pxo+=((keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a||keys.q?1:0))*.03*speed/lim*1.4;
 pxo-=seg.curve*.0025*speed/lim*1.4;
 if(Math.abs(pxo)>1){speed*=.94;pxo=Math.sign(pxo)*Math.min(Math.abs(pxo),1.4)}
 if(seg.sign&&!sign.includes(seg.sign)&&Math.abs(pxo)<.8){sign.push(seg.sign);msg='Visited '+seg.sign}
 pos+=speed;time-=1/60;
 if(pos/SEG>=segs.length){done=true;msg='Finished '+TRACKS[T].name+'! Enter = next track'}
 if(time<=0&&!done){build(T)}}
function draw(){
 x.fillStyle='#72d7ee';x.fillRect(0,0,W,H/2);x.fillStyle='#10aa10';x.fillRect(0,H/2,W,H/2);
 const base=Math.floor(pos/SEG);let dx=0,cx=0,maxY=H;const sc=[];
 for(let n=0;n<DRAW;n++){const s=segs[(base+n)%segs.length];cx+=dx;dx+=s.curve;
  const z=n+1-(pos%SEG)/SEG,k=1/z,sy=H/2+(H/2)*k*(1+0)-0,sx=W/2+(cx*k*-3)-pxo*W*k*.5*0+(-pxo*W/2*k)+pxo*W/2*0;
  sc.push({s,k,y:H/2+ (H/2)*k*1.3,x:W/2-pxo*W*0.5*k+cx*k*-6,w:W*k*0.9})}
 for(let n=sc.length-1;n>0;n--){const a=sc[n],b=sc[n-1];if(b.y<=a.y)continue;
  const col=((Math.floor(pos/SEG)+n)%4<2);
  x.fillStyle=col?'#10aa10':'#009a00';x.fillRect(0,a.y,W,b.y-a.y);
  quad(a.x,a.y,a.w*1.15,b.x,b.y,b.w*1.15,col?'#fff':'#c00');
  quad(a.x,a.y,a.w,b.x,b.y,b.w,col?'#6b6b6b':'#696969');
  if(a.s.sign){const sw=a.w*.25;x.fillStyle='#222';x.fillRect(a.x+a.w*1.2,b.y-sw*1.4,sw*.1,sw*1.4);x.fillStyle='#ffd23f';x.fillRect(a.x+a.w*1.2-sw*.5,b.y-sw*1.9,sw*1.2,sw*.6);
   if(sw>12){x.fillStyle='#000';x.font=Math.floor(sw*.2)+'px monospace';x.fillText(a.s.sign,a.x+a.w*1.2-sw*.45,b.y-sw*1.5)}}}
 x.fillStyle='#e52521';x.fillRect(W/2-24,H-60,48,28);x.fillStyle='#222';x.fillRect(W/2-30,H-40,10,14);x.fillRect(W/2+20,H-40,10,14);
 x.fillStyle='#fff';x.font='16px monospace';
 x.fillText(msg+' | '+Math.round(speed*8)+' km/h | time '+Math.max(0,time|0)+' | '+sign.length+'/3 projects',10,22)}
function quad(x1,y1,w1,x2,y2,w2,c){x.fillStyle=c;x.beginPath();x.moveTo(x1-w1/2,y1);x.lineTo(x2-w2/2,y2);x.lineTo(x2+w2/2,y2);x.lineTo(x1+w1/2,y1);x.fill()}
function loop(){step();draw();requestAnimationFrame(loop)}
info.textContent='Arrows/WASD: accelerate, brake, steer. Drive past each billboard before time runs out.';
build(0);loop();
