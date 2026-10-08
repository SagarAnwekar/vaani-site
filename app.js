const T={
 en:{hero:"Your shop's numbers, as a voice message.",lead:"Every morning at 9, one WhatsApp voice note: yesterday's sale, cash, who owes you money, and which medicines are about to expire. You type nothing.",cta:"Start 7 days free on WhatsApp",hear:"Hear a sample"},
 hi:{hero:"आपकी दुकान के आंकड़े, एक वॉइस मैसेज में।",lead:"हर सुबह 9 बजे व्हाट्सऐप पर एक वॉइस नोट: कल की बिक्री, नकद, किसने उधारी देनी है, और कौन सी दवाइयाँ एक्सपायर होने वाली हैं। टाइप कुछ नहीं करना।",cta:"व्हाट्सऐप पर 7 दिन मुफ़्त शुरू करें",hear:"नमूना सुनिए"},
 mr:{hero:"तुमच्या दुकानाचे आकडे, एका व्हॉइस मेसेजमध्ये.",lead:"रोज सकाळी 9 वाजता व्हॉट्सअ‍ॅपवर एक व्हॉइस नोट: काल किती विक्री, रोख, कोणाची उधारी बाकी, आणि कोणती औषधे एक्सपायर होणार. काहीही टाइप करायचे नाही.",cta:"व्हॉट्सअ‍ॅपवर 7 दिवस मोफत सुरू करा",hear:"नमुना ऐका"}
};
function setLang(l){document.documentElement.lang=l;document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.l===l));
 document.getElementById('h1').textContent=T[l].hero;document.getElementById('lead').textContent=T[l].lead;document.getElementById('cta1').textContent=T[l].cta;document.getElementById('cta2').textContent=T[l].hear;
 try{localStorage.setItem('l',l)}catch(e){}}
document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.l)));
setLang(new URLSearchParams(location.search).get('l')||(()=>{try{return localStorage.getItem('l')}catch(e){}})()||'en');
// hero voice note
const hv=document.getElementById('heroAudio'),pb=document.getElementById('heroPlay'),vn=document.getElementById('heroVn');
let raf,ctx,an,data;
pb.addEventListener('click',()=>{ if(hv.paused){hv.src='audio/'+document.documentElement.lang+'_morning.mp3';hv.play();}else hv.pause();});
hv.addEventListener('play',()=>{pb.textContent='❚❚';pb.setAttribute('aria-label','Pause');vn.dataset.playing='true';
 try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();if(!an){const s=ctx.createMediaElementSource(hv);an=ctx.createAnalyser();an.fftSize=64;s.connect(an);an.connect(ctx.destination);data=new Uint8Array(an.frequencyBinCount);}
 (function tick(){raf=requestAnimationFrame(tick);an.getByteFrequencyData(data);const n=data.length,b=(x,y)=>{let s=0;for(let i=x;i<y;i++)s+=data[i];return s/(y-x)/255};document.dispatchEvent(new CustomEvent('vaani-bands',{detail:[b(0,4),b(4,14),b(14,n)]}));})();}catch(e){}});
function stop(){pb.textContent='▶';pb.setAttribute('aria-label','Play voice note');vn.dataset.playing='false';cancelAnimationFrame(raf);document.dispatchEvent(new CustomEvent('vaani-bands',{detail:[0,0,0]}));}
hv.addEventListener('pause',stop);hv.addEventListener('ended',stop);
// one audio at a time
document.querySelectorAll('audio').forEach(a=>a.addEventListener('play',()=>document.querySelectorAll('audio').forEach(o=>{if(o!==a)o.pause()})));
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
// lazy 3D after first paint
addEventListener('load',()=>setTimeout(()=>{const s=document.createElement('script');s.type='module';s.src='orb.js';document.body.appendChild(s)},300));
