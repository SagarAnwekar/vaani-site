// Voice ring: GPU-animated particle ring. All motion is in the vertex shader, JS only feeds 4 numbers per frame.
// Behaviour: idle = slow breathing ("listening"); voice note playing = ring swells with low/mid/high audio bands.
(async function(){
  const cv=document.getElementById('orb'); if(!cv) return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const c=navigator.connection||{};
  const weak=(navigator.hardwareConcurrency||4)<=2||(navigator.deviceMemory&&navigator.deviceMemory<=2)||c.saveData||/2g/.test(c.effectiveType||'');
  const force=/force3d/.test(location.search);if(!force&&(reduce||weak||innerWidth<860)){cv.style.display='none';return;}
  const coarse=matchMedia('(pointer: coarse)').matches;
  let THREE; try{THREE=await import('./three.module.min.js');}catch(e){window.__orbErr=String(e);cv.style.display='none';return;}
  let r; try{r=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:false,powerPreference:'low-power'});}catch(e){window.__orbErr=String(e);cv.style.display='none';return;}
  r.setPixelRatio(Math.min(devicePixelRatio||1,coarse?1.25:1.75));
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,1,.1,50);cam.position.z=8;
  const N=coarse?1600:3600, a=new Float32Array(N*3), seed=new Float32Array(N*2);
  for(let i=0;i<N;i++){a[i*3]=i/N*Math.PI*2; a[i*3+1]=Math.random(); a[i*3+2]=Math.random(); seed[i*2]=Math.random();seed[i*2+1]=Math.random();}
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(N*3),3)); // unused, needed for bounds
  g.setAttribute('aData',new THREE.BufferAttribute(a,3));
  g.boundingSphere=new THREE.Sphere(new THREE.Vector3(),6);
  const U={uT:{value:0},uLow:{value:0},uMid:{value:0},uHigh:{value:0},uPx:{value:r.getPixelRatio()}};
  const m=new THREE.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,
   vertexShader:`attribute vec3 aData;uniform float uT,uLow,uMid,uHigh,uPx;varying float vA;
    void main(){float ang=aData.x;float breathe=.06*sin(uT*.8);
     float wob=sin(ang*5.+uT*1.3)*(.05+uMid*.35)+sin(ang*11.-uT*1.9)*(.025+uHigh*.3)+sin(ang*2.+uT*.5)*(.04+uLow*.3);
     float rad=2.35+aData.y*.5+breathe+wob+uLow*.55;
     float z=sin(ang*3.+uT+aData.z*6.28)*(.25+uMid*.6);
     vec3 p=vec3(cos(ang)*rad,sin(ang)*rad,z);
     vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
     gl_PointSize=(2.2+aData.z*2.2+uHigh*3.)*uPx*(8./-mv.z);vA=.35+.65*aData.y;}`,
   fragmentShader:`varying float vA;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;
     gl_FragColor=vec4(.12,.31,.15,vA*(1.-d*1.6));}`});
  const pts=new THREE.Points(g,m);scene.add(pts);
  function size(){const b=cv.parentElement.getBoundingClientRect();r.setSize(b.width,b.height,false);cam.aspect=b.width/b.height;cam.updateProjectionMatrix();pts.position.x=b.width>860?2.6:0;pts.position.y=b.width>860?0:1.4;pts.scale.setScalar(.75);}
  size();addEventListener('resize',size);
  let tl=0,tm=0,th=0,vis=true,tab=true,running=false;
  document.addEventListener('vaani-bands',e=>{[tl,tm,th]=e.detail});
  new IntersectionObserver(e=>{vis=e[0].isIntersecting;go();}).observe(cv.parentElement);
  document.addEventListener('visibilitychange',()=>{tab=!document.hidden;go();});
  let last=0;
  function frame(t){running=false;if(!vis||!tab)return;
    const dt=Math.min((t-last)/1000||0.016,.05);last=t;U.uT.value+=dt;
    const k=1-Math.pow(.001,dt);U.uLow.value+=(tl-U.uLow.value)*k;U.uMid.value+=(tm-U.uMid.value)*k;U.uHigh.value+=(th-U.uHigh.value)*k;
    pts.rotation.z+=dt*.05;r.render(scene,cam);go();}
  function go(){if(!running&&vis&&tab){running=true;requestAnimationFrame(frame);}}
  document.documentElement.classList.add('has3d');go();
  window.__orb={ok:true,N};
})();
