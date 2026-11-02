(function(){
const page=document.body.dataset.page||'home';
const pages=[['index.html','Home','home'],['teaching.html','Teaching','teaching'],['research.html','Research','research'],['projects.html','Projects','projects']];
const secret={teaching:'games/mario.html',research:'games/baba.html',projects:'games/racer.html'};
const h=document.createElement('header');h.className='site';
h.innerHTML='<div class="in"><a class="brand" href="'+(document.body.dataset.root||'')+'index.html">Mahito78</a><nav>'+
pages.map(p=>'<a href="'+(document.body.dataset.root||'')+p[0]+'"'+(p[2]===page?' class="on"':'')+'>'+p[1]+'</a>').join('')+'</nav></div>';
document.body.prepend(h);
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
