const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

const header=$('.site-header');
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>35),{passive:true});

const drawer=$('.mobile-drawer');
$('.menu-toggle')?.addEventListener('click',()=>drawer.classList.add('open'));
$('.drawer-close')?.addEventListener('click',()=>drawer.classList.remove('open'));
$$('.mobile-drawer a').forEach(a=>a.addEventListener('click',()=>drawer.classList.remove('open')));

const revealIO=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add('visible');
    entry.target.querySelectorAll?.('[data-counter]').forEach(startCounter);
    revealIO.unobserve(entry.target);
  });
},{threshold:.14});
$$('[data-reveal]').forEach(el=>revealIO.observe(el));

const drawIO=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('drawn');
      drawIO.unobserve(entry.target);
    }
  });
},{threshold:.22});
$$('.draw-svg').forEach(el=>drawIO.observe(el));

function startCounter(el){
  if(el.dataset.done)return;
  el.dataset.done='1';
  const target=Number(el.dataset.counter||0);
  const start=performance.now();
  const dur=1200;
  function step(now){
    const p=Math.min((now-start)/dur,1);
    el.textContent=Math.floor(target*(1-Math.pow(1-p,3)));
    if(p<1)requestAnimationFrame(step);else el.textContent=target;
  }
  requestAnimationFrame(step);
}

const orb=$('.cursor-orb');
window.addEventListener('pointermove',e=>{
  if(!orb)return;
  orb.style.left=e.clientX+'px';
  orb.style.top=e.clientY+'px';
},{passive:true});

$$('.magnetic').forEach(el=>{
  el.addEventListener('pointermove',e=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.12;
    const y=(e.clientY-r.top-r.height/2)*.16;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener('pointerleave',()=>el.style.transform='');
});

const counter=$('.scene-counter strong');
if(counter){
  let i=0;
  setInterval(()=>{
    i=(i+1)%4;
    counter.animate([{opacity:.25,transform:'translateY(7px)'},{opacity:1,transform:'none'}],{duration:380,easing:'ease-out'});
    counter.textContent=String(i+1).padStart(2,'0');
  },3750);
}

let raf=false;
window.addEventListener('scroll',()=>{
  if(raf)return;
  raf=true;
  requestAnimationFrame(()=>{
    const y=scrollY;
    $$('[data-parallax]').forEach(el=>{
      const speed=Number(el.dataset.parallax||0);
      const rect=el.getBoundingClientRect();
      const center=rect.top+rect.height/2-innerHeight/2;
      el.style.transform=`translateY(${-center*speed}px)`;
    });
    raf=false;
  });
},{passive:true});

if(matchMedia('(hover:hover) and (pointer:fine)').matches){
  const scene=$('.scene-frame');
  scene?.addEventListener('pointermove',e=>{
    const r=scene.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    $('.scene-label')?.style.setProperty('transform',`translate(${x*10}px,${y*8}px)`);
    $('.scene-counter')?.style.setProperty('transform',`translate(${x*-7}px,${y*5}px)`);
  });
  scene?.addEventListener('pointerleave',()=>{
    if($('.scene-label'))$('.scene-label').style.transform='';
    if($('.scene-counter'))$('.scene-counter').style.transform='';
  });
}

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
