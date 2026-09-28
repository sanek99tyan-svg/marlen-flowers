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
  const visual = $('.hero-visual');
  const flower = $('.hero-flower-svg');
  if(innerWidth > 800){
    visual.style.transform = `translateY(${y*.05}px)`;
    flower.style.marginBottom = `${y*.03}px`;
  }
});
