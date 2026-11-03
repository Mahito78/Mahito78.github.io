(function(){
const page=document.body.dataset.page||'home';
const pages=[['index.html','Home','home'],['teaching.html','Teaching','teaching'],['research.html','Research','research'],['projects.html','Projects','projects']];
const secret={teaching:'games/mario.html',research:'games/baba.html',projects:'games/racer.html'};
const h=document.createElement('header');h.className='site';
h.innerHTML='<div class="in"><a class="brand" href="'+(document.body.dataset.root||'')+'index.html">Mahito78</a><nav>'+
pages.map(p=>'<a href="'+(document.body.dataset.root||'')+p[0]+'"'+(p[2]===page?' class="on"':'')+'>'+p[1]+'</a>').join('')+'</nav></div>';
document.body.prepend(h);
// Brutalist chrome: ticker, vertical rail, pattern blocks, glitch text
const seg='RECALIBRATING <b>//</b> AI <b>//</b> ROBOTICS <b>//</b> TACTILE SENSING <b>//</b> SLAM <b>//</b> COMPUTER VISION <b>//</b> SIGNAL 01 ONLINE <b>//</b> ';
const tk=document.createElement('div');tk.className='ticker';tk.setAttribute('aria-hidden','true');
tk.innerHTML='<div>'+seg.repeat(3)+seg.repeat(3)+'</div>';
h.after(tk);
const rail=document.createElement('div');rail.className='rail';rail.setAttribute('aria-hidden','true');
rail.innerHTML='<i class="chk"></i><span>Mehdi Abdelwahed</span><span class="out">Mehdi Abdelwahed</span><span>AI // Robotics</span><i></i>';
document.body.prepend(rail);document.body.classList.add('has-rail');
const mainEl=document.querySelector('main');
if(mainEl)mainEl.insertAdjacentHTML('afterbegin','<div class="deco" aria-hidden="true"><i class="d-dots"></i><i class="d-stripes"></i><i class="d-check"></i><b>NULL // 01</b></div>');
document.querySelectorAll('h1').forEach(e=>e.dataset.text=e.innerText);
// Shared canvas pass for the hidden games: scanlines, checker tag, periodic glitch slices
let fx=0;
window.brutalFx=(c,W,H)=>{fx++;c.save();
 c.fillStyle='rgba(0,0,0,.14)';for(let y=0;y<H;y+=3)c.fillRect(0,y,W,1);
 for(let i=0;i<4;i++)for(let j=0;j<2;j++){c.fillStyle=(i+j)%2?'#101713':'#ff6548';c.fillRect(W-68+i*16,H-20+j*8,16,8)}
 const ph=fx%170;
 if(ph<7){const n=3;for(let k=0;k<n;k++){const sy=((fx*37+k*113)%(H-40))+20,sh=8+(k*9)%22,dx=((k+ph)%2?1:-1)*(6+ph*3);
   c.drawImage(c.canvas,0,sy,W,sh,dx,sy,W,sh)}
  c.globalCompositeOperation='screen';c.fillStyle='rgba(255,79,216,.18)';c.fillRect(0,(fx*53)%(H-30),W,14);
  c.fillStyle='rgba(142,216,210,.14)';c.fillRect(0,(fx*29+90)%(H-30),W,8)}
 c.restore()};
const f=document.createElement('footer');f.className='site';
f.innerHTML='© '+new Date().getFullYear()+' Mahito78 · <span id="views">…</span> page views';
document.body.append(f);
// Dynamic page views: shared counter per page via public API, local fallback
const key='mahito78-github-io-'+page;
const seen='pv:'+key;
const local=()=>{const n=(+localStorage.getItem(seen)||0)+1;localStorage.setItem(seen,n);return n+' (local)'};
const shown=v=>document.getElementById('views').textContent=v;
const first=!sessionStorage.getItem(seen);sessionStorage.setItem(seen,1);
fetch('https://abacus.jasoncameron.dev/'+(first?'hit':'get')+'/mahito78.github.io/'+page)
 .then(r=>r.json()).then(d=>shown((d.value??0).toLocaleString())).catch(()=>shown(local()));
// Hidden pages: type "play" on a section page
if(secret[page]){let b='';addEventListener('keydown',e=>{b=(b+e.key).slice(-4).toLowerCase();if(b==='play')location.href=secret[page]})}
// reveal-on-scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.style.opacity=1;e.target.style.transform='none'}}));
document.querySelectorAll('.card').forEach(c=>{c.style.opacity=0;c.style.transform='translateY(14px)';c.style.transition='.5s';io.observe(c)});
})();
