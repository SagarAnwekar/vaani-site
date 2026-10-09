// Premium polish layer: scroll progress, parallax, 3D phone tilt, flow-line scroll, magnetic buttons, optional UI sound.
(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches, fine=matchMedia('(hover:hover)').matches;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
// 1 progress bar
const bar=document.createElement('div');bar.id='prog';document.body.appendChild(bar);
// 2 optional sound (off by default, WebAudio synthesized, no files)
let snd=localStorage.getItem('vsnd')==='1',ac=null;
function tone(f,d,v,type){if(!snd)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(0,ac.currentTime);g.gain.linearRampToValueAtTime(v||.05,ac.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+d+.02);}catch(e){}}
const sb=document.createElement('button');sb.id='sndbtn';sb.type='button';sb.setAttribute('aria-pressed',snd);sb.textContent=snd?'Sound on':'Sound off';
const right=$('header .right');if(right)right.insertBefore(sb,right.firstChild);
sb.onclick=()=>{snd=!snd;localStorage.setItem('vsnd',snd?'1':'0');sb.setAttribute('aria-pressed',snd);sb.textContent=snd?'Sound on':'Sound off';tone(660,.18,.06);};
document.addEventListener('click',e=>{const t=e.target.closest('a.btn,button');if(!t||t.id==='sndbtn')return;tone(t.classList.contains('play')?520:420,.12,.045);},true);
document.addEventListener('play',e=>{tone(740,.25,.05)},true);
let seen=new Set();new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting&&!seen.has(x.target)){seen.add(x.target);if(x.target.tagName==='SECTION')tone(300,.15,.02);}}),{threshold:.35});
if(reduce)return;
// 3 scroll: progress, parallax, flow line
const phone=$('.phone'),flow=$('.flow3d'),cards=$$('.cards .card');
let tx=0,ty=0;
if(fine)addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5;},{passive:true});
function upd(){const h=document.documentElement.scrollHeight-innerHeight,y=scrollY;bar.style.transform='scaleX('+(h>0?y/h:0)+')';
 if(phone){const f=Math.min(1,y/600);phone.style.transform='perspective(900px) rotateY('+(tx*-10-f*8)+'deg) rotateX('+(ty*6)+'deg) translateY('+(-y*.06)+'px)';}
 if(flow){const r=flow.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.8-r.top)/(r.height+innerHeight*.3)));flow.style.setProperty('--p',p.toFixed(3));$$('.fs').forEach((s,i)=>s.classList.toggle('on',p>(i*.28+.12)));}
 cards.forEach((c,i)=>{const r=c.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const d=(r.top+r.height/2-innerHeight/2)/innerHeight;c.style.setProperty('--py',(d*-14).toFixed(1)+'px');});}
let tick=false;function req(){if(!tick){tick=true;requestAnimationFrame(()=>{tick=false;upd();});}}
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);
if(fine){(function loop(){requestAnimationFrame(loop);if(phone&&(Math.abs(tx)>.001||Math.abs(ty)>.001))upd();})();
 $$('.btn').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.12)+'px,'+((e.clientY-r.top-r.height/2)*.2)+'px)';});b.addEventListener('pointerleave',()=>b.style.transform='');});}
// stagger reveal
$$('.cards').forEach(g=>[...g.children].forEach((c,i)=>c.style.transitionDelay=(i*80)+'ms'));
upd();
})();
