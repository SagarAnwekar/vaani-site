// Voice ring: GPU-animated particle ring. All motion is in the vertex shader, JS only feeds 4 numbers per frame.
// Behaviour: idle = slow breathing ("listening"); voice note playing = ring swells with low/mid/high audio bands.
(async function(){
  const cv=document.getElementById('orb'); if(!cv) return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const c=navigator.connection||{};
  const weak=(navigator.hardwareConcurrency||4)<=2||(navigator.deviceMemory&&navigator.deviceMemory<=2)||c.saveData||/2g/.test(c.effectiveType||'');
  const force=/force3d/.test(location.search);if(!force&&(reduce||weak||innerWidth<480)){cv.style.display='none';return;}
  const coarse=matchMedia('(pointer: coarse)').matches;
  let THREE; try{THREE=await import('./three.module.min.js');}catch(e){window.__orbErr=String(e);cv.style.display='none';return;}
  let r; try{r=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:false,powerPreference:'low-power'});}catch(e){window.__orbErr=String(e);cv.style.display='none';return;}
  r.setPixelRatio(Math.min(devicePixelRatio||1,coarse?1.25:1.75));
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,1,.1,50);cam.position.z=8;
  const N=coarse?1400:3200, a=new Float32Array(N*3);
  for(let i=0;i<N;i++){a[i*3]=i/N; a[i*3+1]=Math.random(); a[i*3+2]=Math.random();}
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(N*3),3));
  g.setAttribute('aData',new THREE.BufferAttribute(a,3));
  g.boundingSphere=new THREE.Sphere(new THREE.Vector3(),20);
  const U={uT:{value:0},uLow:{value:0},uMid:{value:0},uHigh:{value:0},uPx:{value:r.getPixelRatio()},uS:{value:0}};
  // uS = scroll progress 0..1. Shapes: ring (voice) -> bars (sales) -> sphere (your data) -> ring.
  const m=new THREE.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,
   vertexShader:`attribute vec3 aData;uniform float uT,uLow,uMid,uHigh,uPx,uS;varying float vA;
    float sm(float a,float b,float x){return smoothstep(a,b,x);}
    void main(){
     float u=aData.x,ang=u*6.28318;
     float wob=sin(ang*5.+uT*1.1)*(.04+uMid*.3)+sin(ang*2.+uT*.5)*(.03+uLow*.25);
     float rad=2.4+aData.y*.45+.05*sin(uT*.8)+wob+uLow*.5;
     vec3 ring=vec3(cos(ang)*rad,sin(ang)*rad,sin(ang*3.+uT+aData.z*6.28)*(.2+uMid*.4));
     float ph=acos(1.-2.*aData.x),th=aData.x*2400.;
     float sr=2.35+.04*sin(uT+th)+uLow*.3;
     vec3 sph=vec3(sr*sin(ph)*cos(th),sr*cos(ph),sr*sin(ph)*sin(th));
     float w=sm(.15,.4,uS)*(1.-sm(.7,.92,uS));
     vec3 p=mix(ring,sph,w);
     vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
     gl_PointSize=(1.8+aData.z*1.8+uHigh*2.)*uPx*(8./-mv.z);vA=.28+.5*aData.y;}`,
   fragmentShader:`varying float vA;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;
     gl_FragColor=vec4(.12,.31,.15,vA*(1.-d*1.8));}`});
  const pts=new THREE.Points(g,m);scene.add(pts);
  let mx=0,my=0,tx=0,ty=0;
  addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5);},{passive:true});
  let sc=0;const dbg=/[?&]s=([0-9.]+)/.exec(location.search);function scroll(){if(dbg){sc=+dbg[1];return;}const h=document.documentElement.scrollHeight-innerHeight;sc=h>0?Math.min(1,Math.max(0,scrollY/h)):0;}
  addEventListener('scroll',scroll,{passive:true});scroll();
  function size(){const w=innerWidth,h=innerHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();const d=w>860;pts.position.x=d?2.7:0;pts.position.y=d?0:2.2;pts.scale.setScalar(d?.78:.55);}
  size();addEventListener('resize',size);
  let tl=0,tm=0,th=0,tab=true,running=false;
  document.addEventListener('vaani-bands',e=>{[tl,tm,th]=e.detail});
  document.addEventListener('visibilitychange',()=>{tab=!document.hidden;go();});
  let last=0,ss=0;
  function frame(t){running=false;if(!tab)return;
    const dt=Math.min((t-last)/1000||0.016,.05);last=t;U.uT.value+=dt;
    const k=1-Math.pow(.001,dt);U.uLow.value+=(tl-U.uLow.value)*k;U.uMid.value+=(tm-U.uMid.value)*k;U.uHigh.value+=(th-U.uHigh.value)*k;
    ss+=(sc-ss)*(1-Math.pow(.02,dt));U.uS.value=ss;
    mx+=(tx-mx)*k;my+=(ty-my)*k;pts.rotation.y=mx*.35;pts.rotation.x=my*.2;
    r.render(scene,cam);go();}
  function go(){if(!running&&tab){running=true;requestAnimationFrame(frame);}}
  document.documentElement.classList.add('has3d');go();
  window.__orb={ok:true,N};
})();
