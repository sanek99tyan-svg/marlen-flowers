const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

const header = $('.topbar');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 40));

const menu = $('.mobile-menu');
$('.menu-btn').addEventListener('click', () => menu.classList.add('open'));
$('.menu-close').addEventListener('click', () => menu.classList.remove('open'));
$$('.mobile-menu a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      if(entry.target.classList.contains('counter')) animateCounter(entry.target);
      io.unobserve(entry.target);
    }
  });
},{threshold:.14});
$$('.reveal, .counter').forEach(el => io.observe(el));

const lineIO = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('animate'); });
},{threshold:.35});
$$('.line-art').forEach(el => lineIO.observe(el));

function animateCounter(el){
  const target = Number(el.dataset.target || 0);
  const start = performance.now();
  const dur = 1200;
  const step = now => {
    const p = Math.min((now-start)/dur,1);
    el.textContent = Math.floor(target*(1-Math.pow(1-p,3)));
    if(p<1) requestAnimationFrame(step); else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const glow = $('.cursor-glow');
window.addEventListener('pointermove', e => {
  glow.style.left = e.clientX+'px';
  glow.style.top = e.clientY+'px';
});

$$('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX-r.left-r.width/2)*.12;
    const y = (e.clientY-r.top-r.height/2)*.18;
    btn.style.transform = `translate(${x}px,${y}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = 'translate(0,0)');
});

window.addEventListener('scroll', () => {
  const y = scrollY;
  const flower = $('.hero-flower-svg');
  if(innerWidth > 800 && flower){
    flower.style.marginBottom = `${y*.03}px`;
  }
});


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}


// Luxury motion: drawn botanical signatures
const botanicalIO = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('animate'); botanicalIO.unobserve(e.target); } });
},{threshold:.22});
$$('.botanical-signature').forEach(el => botanicalIO.observe(el));

// Hero reel counter synchronized to 4.5s steps
const reelIndex = $('.reel-index b');
if(reelIndex){
  let reelStep = 0;
  setInterval(() => {
    reelStep = (reelStep + 1) % 4;
    reelIndex.animate([{opacity:.25,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'ease-out'});
    reelIndex.textContent = String(reelStep + 1).padStart(2,'0');
  },4500);
}

// Premium 3D tilt for collection cards on pointer devices
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
  $$('.collection-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY-r.top)/r.height-.5)*-5;
      const ry = ((e.clientX-r.left)/r.width-.5)*6;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave',()=> card.style.transform='');
  });
}

// Slow parallax for selected premium blocks
let ticking=false;
window.addEventListener('scroll',()=>{
  if(ticking) return;
  ticking=true;
  requestAnimationFrame(()=>{
    const y=scrollY;
    $$('.line-art.left').forEach(el=>el.style.transform=`translateY(${y*.018}px)`);
    $$('.line-art.right').forEach(el=>el.style.transform=`scaleX(-1) translateY(${-y*.012}px)`);
    ticking=false;
  });
},{passive:true});
