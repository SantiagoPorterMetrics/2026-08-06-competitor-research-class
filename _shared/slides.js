  const slides=[...document.querySelectorAll('.slide')];
  // auto-number footers by slide order so reordering never breaks page numbers
  slides.forEach((s,k)=>{const f=s.querySelector('.foot');if(f){const sp=f.querySelectorAll('span');if(sp.length)sp[sp.length-1].textContent=String(k+1).padStart(2,'0');}});
  const hud=document.getElementById('hud');
  const label=document.getElementById('layoutLabel');
  let i=0;

  // slide stepper (terminal reveal)
  const isStepper=s=>s.hasAttribute('data-stepper');
  const bsteps=s=>[...s.querySelectorAll('.bstep')];
  function maxStep(s){const d=[...s.querySelectorAll('[data-show],[data-only]')].map(e=>+(e.dataset.show||e.dataset.only));return d.length?Math.max(...d):0;}
  function applyStep(s,step){
    s.querySelectorAll('[data-show]').forEach(e=>e.classList.toggle('on',(+e.dataset.show)<=step));
    s.querySelectorAll('[data-only]').forEach(e=>e.classList.toggle('on',(+e.dataset.only)===step));
    bsteps(s).forEach((e,idx)=>{e.classList.toggle('active',idx+1===step);e.classList.toggle('done',idx+1<step);});
    s.dataset.step=step;
  }

  // video stepper (arrow-driven play -> pause at checkpoint)
  const isVStep=s=>s.hasAttribute('data-videostepper');
  const vSteps=s=>[...s.querySelectorAll('.vstep')];
  const vCps=s=>vSteps(s).map(e=>+e.dataset.at);
  function vHiIdx(s,idx){vSteps(s).forEach((e,k)=>{e.classList.toggle('active',k===idx);e.classList.toggle('done',k<idx);});}
  function vSeek(s,idx){const v=s.querySelector('video.syncvid');const cps=vCps(s);idx=Math.max(0,Math.min(cps.length-1,idx));s.dataset.vidx=idx;s.dataset.vtarget='';if(v){v.pause();try{v.currentTime=cps[idx];}catch(e){}}vHiIdx(s,idx);}
  function vPlayTo(s,idx){const v=s.querySelector('video.syncvid');const cps=vCps(s);s.dataset.vidx=idx;s.dataset.vtarget=String(cps[idx]);vHiIdx(s,idx);if(v){v.play().catch(()=>{});}}

  function render(){slides.forEach((s,k)=>s.classList.toggle('active',k===i));hud.innerHTML=(i+1)+' / '+slides.length+' &nbsp;·&nbsp; ← →';label.textContent='Layout: '+slides[i].dataset.layout;}
  function enter(n,fromBack){i=Math.max(0,Math.min(slides.length-1,n));const s=slides[i];if(isStepper(s))applyStep(s,fromBack?maxStep(s):1);if(isVStep(s))vSeek(s,fromBack?vCps(s).length-1:0);render();}
  function go(dir){const s=slides[i];
    if(dir>0){
      if(isStepper(s)){const st=+s.dataset.step||1;if(st<maxStep(s)){applyStep(s,st+1);return;}}
      if(isVStep(s)){const idx=+s.dataset.vidx||0;if(idx<vCps(s).length-1){vPlayTo(s,idx+1);return;}}
      if(i<slides.length-1)enter(i+1,false);
    }else{
      if(isStepper(s)){const st=+s.dataset.step||1;if(st>1){applyStep(s,st-1);return;}}
      if(isVStep(s)){const idx=+s.dataset.vidx||0;if(idx>0){vSeek(s,idx-1);return;}}
      if(i>0)enter(i-1,true);
    }
  }

  (function(){
    const safari=/^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
    if(safari){document.querySelectorAll('video[data-hevc]').forEach(v=>{
      v.querySelectorAll('source').forEach(x=>x.remove());
      v.src=v.dataset.hevc;v.load();if(v.autoplay)v.play().catch(()=>{});
    });}
  })();
  document.querySelectorAll('video[data-start]').forEach(v=>{
    const st=parseFloat(v.dataset.start)||0;
    v.addEventListener('loadedmetadata',()=>{try{v.currentTime=st;}catch(e){}});
  });
  document.querySelectorAll('video.syncvid').forEach(v=>{
    v.addEventListener('timeupdate',()=>{
      const s=v.closest('.slide');
      const tgt=parseFloat(s.dataset.vtarget);
      if(!isNaN(tgt)&&v.currentTime>=tgt-0.05){v.pause();try{v.currentTime=tgt;}catch(e){}s.dataset.vtarget='';}
    });
  });

  enter(0,false);

  const stage=document.querySelector('.stage');
  stage.style.transformOrigin='center center';
  const rotateHint=document.getElementById('rotateHint');
  const isMobile=()=>Math.min(window.innerWidth,window.innerHeight)<760;
  function fit(){
    const margin=isMobile()?0.985:0.94;
    const sc=Math.min(window.innerWidth/1280,window.innerHeight/720)*margin;
    stage.style.transform='scale('+sc+')';
    const portrait=window.innerHeight>window.innerWidth;
    rotateHint.style.display=(isMobile()&&portrait)?'flex':'none';
  }
  addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key===' ')go(1);
    if(e.key==='ArrowLeft')go(-1);
    if(e.key==='Home')enter(0,false);
    if(e.key==='End')enter(slides.length-1,true);
  });
  let lastSwipe=0;
  addEventListener('click',e=>{
    if(e.target.closest('a')||e.target.closest('video'))return;
    if(Date.now()-lastSwipe<450)return;
    if(e.clientX<window.innerWidth*0.25)go(-1);else go(1);
  });
  let tx=0,ty=0;
  addEventListener('touchstart',e=>{const t=e.changedTouches[0];tx=t.clientX;ty=t.clientY;},{passive:true});
  addEventListener('touchend',e=>{
    const t=e.changedTouches[0],dx=t.clientX-tx,dy=t.clientY-ty;
    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){lastSwipe=Date.now();if(dx<0)go(1);else go(-1);}
  },{passive:true});
  addEventListener('resize',fit);
  addEventListener('orientationchange',()=>setTimeout(fit,150));
  fit();
