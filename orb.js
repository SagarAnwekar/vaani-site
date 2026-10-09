// Scene: one glossy two-tone capsule + floating pills/tablets, lit by one studio environment.
// It follows [data-stage] anchors down the page (hero -> CTA), reacts to voice-note audio.
(async function(){
  const cv=document.getElementById('orb'); if(!cv) return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const c=navigator.connection||{};
  const force=/force3d/.test(location.search);
  const weak=(navigator.deviceMemory&&navigator.deviceMemory<=1)||c.saveData||/2g/.test(c.effectiveType||'');
  if(!force&&(reduce||weak)){cv.style.display='none';return;}
  const coarse=matchMedia('(pointer: coarse)').matches;
  let THREE; try{THREE=await import('./three.module.min.js');}catch(e){window.__orbErr=String(e);cv.style.display='none';return;}
  let r; try{r=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:!coarse,powerPreference:'default'});}catch(e){window.__orbErr=String(e);cv.style.display='none';return;}
  r.setPixelRatio(Math.min(devicePixelRatio||1,coarse?1.5:2));
  r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.05;
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(32,1,.1,60);cam.position.z=12;
  // studio environment: soft box room with three bright panels
  const envS=new THREE.Scene();
  envS.add(new THREE.Mesh(new THREE.BoxGeometry(24,24,24),new THREE.MeshBasicMaterial({color:0xcfd6d1,side:THREE.BackSide})));
  [[0,9,4,12,2],[-10,2,2,2,10],[10,-1,3,2,8]].forEach(p=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(p[3],p[4]),new THREE.MeshBasicMaterial({color:new THREE.Color().setScalar(6),side:THREE.DoubleSide}));m.position.set(p[0],p[1],p[2]);m.lookAt(0,0,0);envS.add(m);});
  const pm=new THREE.PMREMGenerator(r);scene.environment=pm.fromScene(envS,.04).texture;pm.dispose();
  const key=new THREE.DirectionalLight(0xfff1e0,1.1);key.position.set(4,6,8);scene.add(key);
  const palette={ivory:0xf6f1e6,emerald:0x0b6b4f,mint:0x7fd9b6,coral:0xff6a3d,amber:0xffc24b,ink:0x15251f};
  function capsule(rad,len,a,b,seg){
    const g=new THREE.CapsuleGeometry(rad,len,seg,seg*2),pos=g.attributes.position,col=new Float32Array(pos.count*3),A=new THREE.Color(a),B=new THREE.Color(b),t=new THREE.Color();
    for(let i=0;i<pos.count;i++){const y=pos.getY(i),k=THREE.MathUtils.smoothstep(y,-.04*rad,.04*rad);t.copy(A).lerp(B,k);col[i*3]=t.r;col[i*3+1]=t.g;col[i*3+2]=t.b;}
    g.setAttribute('color',new THREE.BufferAttribute(col,3));
    return new THREE.Mesh(g,new THREE.MeshPhysicalMaterial({vertexColors:true,roughness:.22,metalness:0,clearcoat:1,clearcoatRoughness:.12}));
  }
  const root=new THREE.Group();scene.add(root);
  const hero=capsule(.62,1.5,palette.ivory,palette.emerald,coarse?14:24);hero.rotation.z=.9;root.add(hero);
  // thin voice rings
  const rings=[];for(let i=0;i<3;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(1.9,.014,8,120),new THREE.MeshBasicMaterial({color:palette.emerald,transparent:true,opacity:.0}));root.add(m);rings.push(m);}
  const combos=[[palette.coral,palette.ivory],[palette.amber,palette.ivory],[palette.mint,palette.emerald],[palette.ivory,palette.ink],[palette.coral,palette.amber],[palette.emerald,palette.mint],[palette.ivory,palette.coral],[palette.amber,palette.emerald]];
  const small=[],N=coarse?8:10;
  for(let i=0;i<N;i++){const cb=combos[i%combos.length],s=.16+(i%3)*.05,m=capsule(s,s*1.9,cb[0],cb[1],coarse?8:12);m.userData={a:i/N*Math.PI*2,rad:2.2+(i%4)*.38,sp:.18+(i%5)*.045,y:((i*37)%10-5)*.16,ph:i*1.7,rz:Math.random()*6};root.add(m);small.push(m);}
  const tabs=[],T=coarse?4:6;
  for(let i=0;i<T;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.3,coarse?16:28,coarse?10:18),new THREE.MeshPhysicalMaterial({color:[palette.ivory,palette.mint,palette.amber,palette.coral][i%4],roughness:.3,clearcoat:.8,clearcoatRoughness:.2}));m.scale.set(1,.38,1);m.userData={a:i/T*Math.PI*2+.4,rad:2.7+(i%3)*.4,sp:-.14-(i%3)*.05,y:((i*53)%10-5)*.13,ph:i*2.3};root.add(m);tabs.push(m);}
  const stages=[...document.querySelectorAll('[data-stage]')];
  let tl=0,tm=0,th=0,low=0,mid=0,mx=0,my=0,tx=0,ty=0,play=0;
  document.addEventListener('vaani-bands',e=>{[tl,tm,th]=e.detail;});
  addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5;},{passive:true});
  function size(){r.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();}
  size();addEventListener('resize',size);
  const halfH=Math.tan(cam.fov*Math.PI/360)*cam.position.z;
  const pos=new THREE.Vector3(0,0,0);let sc=0,tab=true,running=false,last=0,t=0;
  document.addEventListener('visibilitychange',()=>{tab=!document.hidden;go();});
  function frame(ts){running=false;if(!tab)return;
    const dt=Math.min((ts-last)/1000||.016,.05);last=ts;t+=dt;
    const vw=innerWidth,vh=innerHeight,asp=vw/vh;
    let best=null,bv=0;
    for(const s of stages){const b=s.getBoundingClientRect();if(b.bottom<-vh*.3||b.top>vh*1.3)continue;const cy=b.top+b.height/2,v=Math.max(0,1-Math.abs(cy-vh/2)/(vh*.62));if(v>bv){bv=v;best={b,cy};}}
    let tgt=new THREE.Vector3(vw>860?1.6:0,.2,0),ts2=0;
    if(best){const b=best.b,cx=b.left+b.width/2;tgt.set((cx/vw*2-1)*halfH*asp,-(best.cy/vh*2-1)*halfH,0);ts2=Math.min(b.width,b.height)/vh*(halfH*2)/4.1*Math.min(1,bv*2.2);}
    const k=1-Math.pow(.0008,dt);pos.lerp(tgt,k);sc+=(ts2-sc)*k;
    low+=(tl-low)*k;mid+=(tm-mid)*k;mx+=(tx-mx)*k;my+=(ty-my)*k;
    root.position.copy(pos);root.scale.setScalar(Math.max(.0001,sc));root.visible=sc>.02;
    const spy=scrollY/ (innerHeight||1);
    root.rotation.y=t*.18+mx*.8+spy*.5;root.rotation.x=my*.4;
    hero.rotation.z=.9+Math.sin(t*.6)*.08;hero.rotation.y=t*.45+spy*1.2;hero.scale.setScalar(1+low*.22);
    small.forEach(m=>{const u=m.userData,a=u.a+t*u.sp;m.position.set(Math.cos(a)*u.rad,u.y+Math.sin(t*.7+u.ph)*.18,Math.sin(a)*u.rad*.55);m.rotation.set(t*.5+u.rz,t*.35+u.ph,t*.4);});
    tabs.forEach(m=>{const u=m.userData,a=u.a+t*u.sp;m.position.set(Math.cos(a)*u.rad,u.y+Math.sin(t*.6+u.ph)*.2,Math.sin(a)*u.rad*.5);m.rotation.set(t*.4,t*.3+u.ph,.3);});
    const amp=Math.min(1,low*1.6+mid*.8);
    rings.forEach((m,i)=>{const p=((t*.5+i/3)%1);m.scale.setScalar(.8+p*(.8+amp*.9));m.material.opacity=(1-p)*(.08+amp*.5);m.rotation.x=Math.PI/2.4;m.rotation.y=t*.2;});
    r.render(scene,cam);go();}
  function go(){if(!running&&tab){running=true;requestAnimationFrame(frame);}}
  document.documentElement.classList.add('has3d');go();
  window.__orb={ok:true,N};
})();
