// v6 behaviour: Lenis smooth scroll (mouse wheels only; touch stays native), story progress, hero words, counter, optional sound.
(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],root=document.documentElement;
const bar=document.createElement('div');bar.id='prog';document.body.appendChild(bar);
// optional sound
let snd=localStorage.getItem('vsnd')==='1',ac=null;
function tone(f,d,v){if(!snd)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,ac.currentTime);g.gain.linearRampToValueAtTime(v||.05,ac.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+d+.02);}catch(e){}}
const sb=document.createElement('button');sb.id='sndbtn';sb.type='button';sb.setAttribute('aria-pressed',snd);sb.textContent=snd?'Sound on':'Sound off';
const right=$('header .right');if(right)right.insertBefore(sb,right.firstChild);
sb.onclick=()=>{snd=!snd;localStorage.setItem('vsnd',snd?'1':'0');sb.setAttribute('aria-pressed',snd);sb.textContent=snd?'Sound on':'Sound off';tone(660,.18,.06);};
document.addEventListener('click',e=>{const t=e.target.closest('a.btn,button');if(!t||t.id==='sndbtn')return;tone(t.classList.contains('play')?520:420,.12,.045);},true);
document.addEventListener('play',()=>tone(740,.25,.05),true);
// hero headline: word by word, serif italic accent on the last two words
function words(){const h=$('#h1');if(!h||h.dataset.w===h.textContent)return;const p=h.textContent.split(' ');h.innerHTML=p.map((w,i)=>'<span class="hw'+(i>=p.length-2?' g':'')+'" style="--i:'+i+'">'+w+'</span>').join(' ');h.dataset.w=h.textContent;}
words();new MutationObserver(words).observe($('#h1'),{childList:true,characterData:true,subtree:true});
if(reduce)return;
// smooth scroll on desktop wheels only
let lenis=null;
function boot(){if(fine&&window.Lenis){lenis=new Lenis({lerp:.1,smoothWheel:true});(function raf(t){lenis.raf(t);requestAnimationFrame(raf);})(performance.now());}}
if(document.readyState==='complete')boot();else addEventListener('load',boot);
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=$(a.getAttribute('href'));if(t&&lenis){e.preventDefault();lenis.scrollTo(t,{offset:-70});}}));
// story + progress
const story=$('.story'),panes=$$('.pane'),steps=$$('.steps li'),cnt=$('.big[data-count]');let cdone=false,last=-1;
function count(){if(cdone||!cnt)return;cdone=true;const t=+cnt.dataset.count,t0=performance.now();(function f(n){const k=Math.min(1,(n-t0)/1300),v=Math.round(t*(1-Math.pow(1-k,3)));cnt.textContent=v.toLocaleString('en-IN');if(k<1)requestAnimationFrame(f);})(t0);}
let tick=false;function upd(){tick=false;const h=root.scrollHeight-innerHeight,y=scrollY;bar.style.transform='scaleX('+(h>0?y/h:0)+')';
 if(story){const r=story.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));story.style.setProperty('--sp',p.toFixed(3));const i=p<.34?0:p<.67?1:2;if(i!==last){last=i;steps.forEach((s,k)=>s.classList.toggle('on',k===i));panes.forEach((s,k)=>s.classList.toggle('on',k===i));if(i===1)count();}}}
function req(){if(!tick){tick=true;requestAnimationFrame(upd);}}
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);
$$('.cards').forEach(g=>[...g.children].forEach((c,i)=>c.style.transitionDelay=(i*70)+'ms'));
if(fine)$$('.btn').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.1)+'px,'+((e.clientY-r.top-r.height/2)*.18)+'px)';});b.addEventListener('pointerleave',()=>b.style.transform='');});
upd();
})();
