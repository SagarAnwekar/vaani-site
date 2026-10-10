// @ts-nocheck
import React,{useState,useRef,useEffect} from 'react';
import {offlineAnswer} from './helpKnowledge';
// Set VITE-style endpoint at build time: HELP_API_URL env var (see build.mjs). Empty = offline answers only.
const API=typeof HELP_API_URL==='string'?HELP_API_URL:'';
const MAX_CHARS=300,MAX_Q=10;
const UI={
en:{h:'Ask Vaani',tag:'Answers in your language.',sub:'Questions about Vaani BI? Ask in English, हिंदी or मराठी.',ph:'Type your question',send:'Ask',hi:'Hi! I am the Vaani helper. Ask me what Vaani does, what the CSV needs, or what is not ready yet.',chips:['What does Vaani do?','Is my data safe?','What CSV do I need?','What does it cost?'],busy:'Thinking...',limit:'Question limit reached for this visit. Email Sagar for more.',note:'AI answers can be wrong. Do not type customer, patient or bank details. Your question is sent to an AI service.'},
hi:{h:'वाणी से पूछें',tag:'आपकी भाषा में जवाब।',sub:'Vaani BI के बारे में कुछ भी पूछें। English, हिंदी या मराठी में।',ph:'अपना सवाल लिखें',send:'पूछें',hi:'नमस्ते! मैं Vaani का सहायक हूं। पूछिए Vaani क्या करता है, CSV में क्या चाहिए, या अभी क्या तैयार नहीं है।',chips:['Vaani क्या करता है?','मेरा डेटा सुरक्षित है?','कौन सी CSV चाहिए?','कीमत क्या है?'],busy:'सोच रहा हूं...',limit:'इस बार के सवाल पूरे हुए। और के लिए Sagar को ईमेल करें।',note:'AI के जवाब गलत हो सकते हैं। ग्राहक, मरीज या बैंक की जानकारी न लिखें। आपका सवाल एक AI सेवा को जाता है।'},
mr:{h:'वाणीला विचारा',tag:'तुमच्या भाषेत उत्तरे.',sub:'Vaani BI बद्दल काहीही विचारा. English, हिंदी किंवा मराठीत.',ph:'तुमचा प्रश्न लिहा',send:'विचारा',hi:'नमस्कार! मी Vaani चा सहाय्यक आहे. Vaani काय करतो, CSV मध्ये काय हवे, किंवा काय अजून तयार नाही ते विचारा.',chips:['Vaani काय करतो?','माझा डेटा सुरक्षित आहे का?','कोणती CSV हवी?','किंमत किती?'],busy:'विचार करतोय...',limit:'या भेटीतील प्रश्न संपले. आणखी साठी Sagar ला ईमेल करा.',note:'AI ची उत्तरे चुकीची असू शकतात. ग्राहक, रुग्ण किंवा बँक माहिती लिहू नका. तुमचा प्रश्न AI सेवेला पाठवला जातो.'}};
export function HelpChat({lang='en',setLang}){
const t=UI[lang];const [msgs,setMsgs]=useState([{r:'bot',t:t.hi}]);const [q,setQ]=useState('');const [busy,setBusy]=useState(false);const [n,setN]=useState(0);const log=useRef(null);const first=useRef(true);
useEffect(()=>{if(first.current){first.current=false;return}setMsgs(m=>m.length===1?[{r:'bot',t:UI[lang].hi}]:m)},[lang]);
useEffect(()=>{if(log.current)log.current.scrollTop=log.current.scrollHeight},[msgs,busy]);
const ask=async(text,faqOnly=false)=>{text=(text||q).trim().slice(0,MAX_CHARS);if(!text||busy)return;if(n>=MAX_Q){setMsgs(m=>[...m,{r:'bot',t:t.limit}]);return}
setQ('');setN(n+1);setMsgs(m=>[...m,{r:'me',t:text}]);setBusy(true);let ans='',src='';
if(API&&!faqOnly){try{const c=new AbortController();const to=setTimeout(()=>c.abort(),30000);const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,lang}),signal:c.signal});clearTimeout(to);if(r.ok){const j=await r.json();if(j&&typeof j.reply==='string'&&j.reply){ans=j.reply;src='ai'}}}catch(e){}}
if(!ans){ans=offlineAnswer(faqOnly?(['about','privacy','csv','price'][t.chips.indexOf(text)]||text):text,lang);src=faqOnly?'faq':'offline'}
setMsgs(m=>[...m,{r:'bot',t:ans,s:src}]);setBusy(false)};
return <section className="help section" id="help"><div className="section-head" data-reveal><div><p className="eyebrow">AI HELP / TRY IT</p><h2>{t.h}<br/><em>{t.tag}</em></h2></div><p>{t.sub}</p></div>
<div className="help-shell"><div className="help-top"><div className="lang-switch" aria-label="Help language">{[['en','English'],['hi','हिंदी'],['mr','मराठी']].map(([l,v])=><button key={l} aria-pressed={lang===l} onClick={()=>setLang&&setLang(l)}>{v}</button>)}</div><span className="state">{API?'FAQ + Experimental AI':'FAQ MODE'}</span></div>
<div className="help-log" ref={log} role="log" aria-live="polite">{msgs.map((m,i)=><div key={i} className={'bubble '+m.r}><p>{m.t}</p>{m.s==='offline'&&API&&<small>Quick answer from the FAQ (AI was busy).</small>}</div>)}{busy&&<div className="bubble bot"><p className="typing">{t.busy}</p></div>}</div>
<div className="help-chips">{t.chips.map(c=><button key={c} onClick={()=>ask(c,true)} disabled={busy}>{c}</button>)}</div>
<form className="help-form" onSubmit={e=>{e.preventDefault();ask()}}><input value={q} onChange={e=>setQ(e.target.value)} maxLength={MAX_CHARS} placeholder={t.ph} aria-label={t.ph}/><button className="primary" disabled={busy||!q.trim()}>{t.send} <span>↗</span></button></form>
<p className="caption">{t.note}</p></div></section>}
