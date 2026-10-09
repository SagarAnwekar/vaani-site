// @ts-nocheck
let ctx=null,source=null,finish=null,serial=0;
const cache=new Map();
export function stopAudio(){serial++;if(source){source.onended=null;try{source.stop()}catch{}}source=null;const ended=finish;finish=null;window.__audioActive=0;ended?.()}
export async function playAudio(url,onStart,onEnd){stopAudio();const ticket=serial;finish=onEnd;ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();try{await ctx.resume();let pending=cache.get(url);if(!pending){pending=fetch(url).then(r=>{if(!r.ok)throw Error('Sample did not load');return r.arrayBuffer()}).then(bytes=>ctx.decodeAudioData(bytes));cache.set(url,pending)}const buffer=await pending;if(ticket!==serial)return;source=ctx.createBufferSource();source.buffer=buffer;source.connect(ctx.destination);source.onended=()=>{source=null;window.__audioActive=0;const ended=finish;finish=null;ended?.()};source.start();window.__audioActive=1;onStart?.()}catch(e){cache.delete(url);if(ticket===serial)stopAudio();throw e}}
