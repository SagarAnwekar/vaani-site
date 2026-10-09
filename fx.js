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
// 3 scroll
const phone=$('.phone'),story=$('.story'),root=document.documentElement,cards=$$('.cards .card');
let tx=0,ty=0;
if(fine)addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5;},{passive:true});
const panes=$$('.pane'),steps=$$('.steps li'),cnt=$('.big[data-count]');let cdone=false,lastStep=-1;
function count(){if(cdone)return;cdone=true;const t=+cnt.dataset.count,t0=performance.now();(function f(n){const k=Math.min(1,(n-t0)/1400),v=Math.round(t*(1-Math.pow(1-k,3)));cnt.textContent=v.toLocaleString('en-IN');if(k<1)requestAnimationFrame(f);})(t0);}
const secs=$$('main section'),hues=[0,-25,20,45,-10,30];
function upd(){const h=root.scrollHeight-innerHeight,y=scrollY;bar.style.transform='scaleX('+(h>0?y/h:0)+')';root.style.setProperty('--sy',y);root.style.setProperty('--hue',(Math.sin(y/900)*28).toFixed(1));
 if(phone){const f=Math.min(1,y/600);phone.style.transform='perspective(900px) rotateY('+(tx*-12-f*8)+'deg) rotateX('+(ty*7)+'deg) translateY('+(-y*.08)+'px)';}
 if(story){const r=story.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));story.style.setProperty('--sp',p.toFixed(3));root.style.setProperty('--sp',p.toFixed(3));
  const i=p<.34?0:p<.67?1:2;if(i!==lastStep){lastStep=i;steps.forEach((s,k)=>s.classList.toggle('on',k===i));panes.forEach((s,k)=>s.classList.toggle('on',k===i));if(i===1)count();}}
 }
let tick=false;function req(){if(!tick){tick=true;requestAnimationFrame(()=>{tick=false;upd();});}}
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);
if(fine){(function loop(){requestAnimationFrame(loop);if(phone&&(Math.abs(tx)>.001||Math.abs(ty)>.001))upd();})();
 $$('.btn').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.12)+'px,'+((e.clientY-r.top-r.height/2)*.2)+'px)';});b.addEventListener('pointerleave',()=>b.style.transform='');});
 cards.forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');}));}
else{new IntersectionObserver(es=>es.forEach(x=>x.target.classList.toggle('lit',x.intersectionRatio>.6)),{threshold:[0,.6]}) && cards.forEach(c=>{});const io2=new IntersectionObserver(es=>es.forEach(x=>x.target.classList.toggle('lit',x.isIntersecting&&x.intersectionRatio>.6)),{threshold:[.6]});cards.forEach(c=>io2.observe(c));}
// hero headline: word-by-word, accent on last words (re-run on language change)
function words(){const h=$('#h1');if(!h||h.dataset.w===h.textContent)return;const parts=h.textContent.split(' ');h.innerHTML=parts.map((w,i)=>'<span class="hw'+(i>=parts.length-2?' g':'')+'" style="--i:'+i+'">'+w+'</span>').join(' ');h.dataset.w=h.textContent;}
words();new MutationObserver(words).observe($('#h1'),{childList:true,characterData:true,subtree:true});
$$('.cards').forEach(g=>[...g.children].forEach((c,i)=>c.style.transitionDelay=(i*90)+'ms'));
upd();
})();
