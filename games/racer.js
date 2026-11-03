// Project Circuit: pseudo-3D racer. Each track passes billboards for your projects; 3 laps-style tracks.
const cv=document.getElementById('c'),x=cv.getContext('2d'),info=document.getElementById('info');
const W=640,H=400,SEG=200,ROAD=2000,DRAW=150;
const TRACKS=[
 {name:'Tactile Sensor Circuit',projects:['Artificial tactile sensor','EIT imaging','Bio-inspired sensing'],curves:[[0,0],[20,2.5],[50,-3],[80,0],[110,4],[140,-2]],len:170},
 {name:'Autonomy Raceway',projects:['Aerial drone','LiDAR and SLAM','Collaborative navigation'],curves:[[0,0],[15,-4],[40,3],[60,-3.5],[90,5],[120,-5],[150,0]],len:180},
 {name:'Robotics Research Run',projects:['Neural motor primitives','Tensegrity robot','3D vision'],curves:[[0,2],[25,-5],[45,5],[70,-2],[100,6],[130,-6],[160,0]],len:200}];
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
 const sky=x.createLinearGradient(0,0,0,H*.68);sky.addColorStop(0,'#101c22');sky.addColorStop(.7,'#40564b');sky.addColorStop(1,'#d7a568');
 x.fillStyle=sky;x.fillRect(0,0,W,H);
 x.fillStyle='#d7ff3f';x.globalAlpha=.7;x.beginPath();x.arc(510,116,31,0,Math.PI*2);x.fill();x.globalAlpha=1;
 x.fillStyle='#17231f';
 for(let i=0;i<17;i++){const bx=i*43-18,bh=45+(i*37%75);x.fillRect(bx,218-bh,30,bh);x.fillStyle='rgba(215,255,63,.38)';for(let wy=218-bh+8;wy<210;wy+=13)x.fillRect(bx+7,wy,4,4);x.fillStyle='#17231f'}
 const ground=x.createLinearGradient(0,H/2,0,H);ground.addColorStop(0,'#35463b');ground.addColorStop(1,'#17221d');x.fillStyle=ground;x.fillRect(0,H/2,W,H/2);
 const base=Math.floor(pos/SEG);let dx=0,cx=0,maxY=H;const sc=[];
 for(let n=0;n<DRAW;n++){const s=segs[(base+n)%segs.length];cx+=dx;dx+=s.curve;
  const z=n+1-(pos%SEG)/SEG,k=1/z,sy=H/2+(H/2)*k*(1+0)-0,sx=W/2+(cx*k*-3)-pxo*W*k*.5*0+(-pxo*W/2*k)+pxo*W/2*0;
  sc.push({s,k,y:H/2+ (H/2)*k*1.3,x:W/2-pxo*W*0.5*k+cx*k*-6,w:W*k*0.9})}
 for(let n=sc.length-1;n>0;n--){const a=sc[n],b=sc[n-1];if(b.y<=a.y)continue;
  const stripe=((Math.floor(pos/SEG)+n)%4<2);
  x.fillStyle=stripe?'#34483a':'#2b3a31';x.fillRect(0,a.y,W,b.y-a.y);
  quad(a.x,a.y,a.w*1.17,b.x,b.y,b.w*1.17,stripe?'#d7ff3f':'#ff6548');
  quad(a.x,a.y,a.w,b.x,b.y,b.w,stripe?'#505955':'#414b47');
  const lane=a.w/3;x.strokeStyle='rgba(238,244,232,.55)';x.lineWidth=Math.max(1,a.k*1.5);
  for(let m=1;m<3;m++){x.beginPath();x.moveTo(a.x-a.w/2+lane*m,a.y);x.lineTo(b.x-b.w/2+lane*m,b.y);x.stroke()}
  if(a.s.sign){const sw=a.w*.27,post=a.x+a.w*1.2;
   x.fillStyle='#101713';x.fillRect(post,b.y-sw*1.55,Math.max(2,sw*.08),sw*1.55);
   x.fillStyle='#d7ff3f';x.fillRect(post-sw*.57,b.y-sw*2.15,sw*1.22,sw*.66);
   x.strokeStyle='#eef4e8';x.lineWidth=1;x.strokeRect(post-sw*.57,b.y-sw*2.15,sw*1.22,sw*.66);
   if(sw>14){x.fillStyle='#101713';x.font='700 '+Math.max(8,Math.floor(sw*.16))+'px monospace';x.textAlign='center';x.fillText(a.s.sign,post,b.y-sw*1.72,sw*1.1);x.textAlign='left'}
  }}
 x.fillStyle='rgba(16,23,19,.9)';x.fillRect(0,0,W,42);x.fillStyle='#d7ff3f';x.fillRect(0,40,W,2);
 x.fillStyle='#eef4e8';x.font='600 12px monospace';x.fillText('CIRCUIT '+String(T+1).padStart(2,'0')+'  /  '+msg.toUpperCase(),12,17);
 x.fillStyle='#8ed8d2';x.textAlign='right';x.fillText('TIME '+Math.max(0,time|0)+'  //  '+sign.length+'/3 SIGNALS',628,17);x.textAlign='left';
 x.fillStyle='#18221e';x.fillRect(0,32,W,8);x.fillStyle='#ff6548';x.fillRect(8,34,Math.min(624,Math.max(0,time/60*624)),4);
 const carX=W/2+pxo*28,carY=H-62;
 x.fillStyle='rgba(0,0,0,.4)';x.beginPath();x.ellipse(carX,carY+43,43,9,0,0,Math.PI*2);x.fill();
 x.fillStyle='#101713';x.fillRect(carX-36,carY+24,12,22);x.fillRect(carX+24,carY+24,12,22);
 x.fillStyle='#ff6548';x.beginPath();x.moveTo(carX-28,carY+27);x.lineTo(carX-24,carY+8);x.lineTo(carX-12,carY);x.lineTo(carX+12,carY);x.lineTo(carX+27,carY+10);x.lineTo(carX+32,carY+28);x.closePath();x.fill();
 x.fillStyle='#8ed8d2';x.beginPath();x.moveTo(carX-17,carY+10);x.lineTo(carX-10,carY+3);x.lineTo(carX+10,carY+3);x.lineTo(carX+20,carY+11);x.closePath();x.fill();
 x.fillStyle='#d7ff3f';x.fillRect(carX-24,carY+23,9,3);x.fillRect(carX+16,carY+23,9,3);
 x.fillStyle='#eef4e8';x.font='700 11px monospace';x.fillText(Math.round(speed*8)+' KM/H',14,H-16);
}
function quad(x1,y1,w1,x2,y2,w2,c){x.fillStyle=c;x.beginPath();x.moveTo(x1-w1/2,y1);x.lineTo(x2-w2/2,y2);x.lineTo(x2+w2/2,y2);x.lineTo(x1+w1/2,y1);x.fill()}
function loop(){step();draw();requestAnimationFrame(loop)}
info.textContent='Arrows/WASD: accelerate, brake, steer. Drive past each billboard before time runs out.';
build(0);loop();
