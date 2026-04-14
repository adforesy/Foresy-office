import * as THREE from 'three';

export function createOfficeScene(container, callbacks = {}) {
  const { onTimeUpdate, onStatusUpdate, onMeetingChange } = callbacks;

// ═══════════════════════════════════════════════════
// FORESY GROVE — AIエージェントチームの仮想オフィス
// ═══════════════════════════════════════════════════
class RNG{constructor(s=42){this.s=s}n(){this.s=(this.s*16807)%2147483647;return(this.s-1)/2147483646}r(a,b){return a+this.n()*(b-a)}i(a,b){return Math.floor(this.r(a,b+1))}pick(a){return a[this.i(0,a.length-1)]}}
const rng=new RNG(2026);

// Foresy Groveエージェントチーム（デスク配置用：6体）
const AGENTS=[
  {name:'SCOUT',    color:0x4ADE80,hex:'#4ADE80',role:'The Connector',   screen:'crm',      hair:0x1a3a1a,shirt:0x166534,pants:0x14532d},
  {name:'TORCH',    color:0xFBBF24,hex:'#FBBF24',role:'The Provocateur', screen:'content',  hair:0x78350f,shirt:0x92400e,pants:0x1c1917},
  {name:'RANGER',   color:0x60A5FA,hex:'#60A5FA',role:'The Pragmatist',  screen:'tasks',    hair:0x1e3a5f,shirt:0x1d4ed8,pants:0x1e3a5f},
  {name:'SENTINEL', color:0xF87171,hex:'#F87171',role:'The Skeptic',     screen:'security', hair:0x7f1d1d,shirt:0x991b1b,pants:0x1c1917},
  {name:'REVIEWER', color:0xA78BFA,hex:'#A78BFA',role:'The Auditor',     screen:'ads',      hair:0x3b0764,shirt:0x4c1d95,pants:0x1c1917},
  {name:'REPORTER', color:0x34D399,hex:'#34D399',role:'The Narrator',    screen:'report',   hair:0x064e3b,shirt:0x065f46,pants:0x0f2718},
];

// ─── シーン ────────────────────────────────────────
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x000E10);
scene.fog=new THREE.FogExp2(0x000E10,0.005);
const camera=new THREE.PerspectiveCamera(30,container.clientWidth/container.clientHeight,0.1,500);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(container.clientWidth,container.clientHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.3;
container.appendChild(renderer.domElement);

// ─── カメラ操作 ─────────────────────────────────────
let isDrag=false,prev={x:0,y:0};
let sph={theta:Math.PI/4.5,phi:Math.PI/4.5,radius:34};
const tgt=new THREE.Vector3(0,1.8,0);
let autoRot=true,autoTmr;
function updCam(){const p=Math.max(.18,Math.min(Math.PI/2.3,sph.phi));sph.phi=p;camera.position.set(sph.radius*Math.sin(p)*Math.sin(sph.theta)+tgt.x,sph.radius*Math.cos(p)+tgt.y,sph.radius*Math.sin(p)*Math.cos(sph.theta)+tgt.z);camera.lookAt(tgt)}
updCam();
renderer.domElement.addEventListener('pointerdown',e=>{isDrag=true;prev={x:e.clientX,y:e.clientY};autoRot=false;clearTimeout(autoTmr)});
addEventListener('pointerup',()=>{isDrag=false;autoTmr=setTimeout(()=>autoRot=true,6000)});
addEventListener('pointermove',e=>{if(!isDrag)return;sph.theta-=(e.clientX-prev.x)*.005;sph.phi+=(e.clientY-prev.y)*.005;prev={x:e.clientX,y:e.clientY};updCam()});
renderer.domElement.addEventListener('wheel',e=>{sph.radius=Math.max(16,Math.min(50,sph.radius+e.deltaY*.03));updCam()},{passive:true});

// ─── ライト ────────────────────────────────────────
const ambient=new THREE.AmbientLight(0xffffff,0.75);scene.add(ambient);
const sun=new THREE.DirectionalLight(0xFFF8F0,1.2);
sun.position.set(12,20,10);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-22;sun.shadow.camera.right=22;sun.shadow.camera.top=22;sun.shadow.camera.bottom=-22;sun.shadow.bias=-.001;
scene.add(sun);
scene.add(new THREE.DirectionalLight(0xC8E6C9,0.4).translateX(-10).translateY(12));
scene.add(new THREE.HemisphereLight(0xD4F0DC,0xB8CCB8,0.4));

// ─── ヘルパー ────────────────────────────────────────
const office=new THREE.Group();scene.add(office);
const M=(c,o={})=>new THREE.MeshLambertMaterial({color:c,...o});
const MB=c=>new THREE.MeshBasicMaterial({color:c});
const Glass=()=>new THREE.MeshPhysicalMaterial({color:0xBBCCDD,transparent:true,opacity:0.08,roughness:0});

// ═══════════════════════════════════════════════════
// オフィス構造
// ═══════════════════════════════════════════════════

// フロア
const fl=new THREE.Mesh(new THREE.BoxGeometry(26,.15,20),M(0xE8ECE8));
fl.position.y=-.075;fl.receiveShadow=true;office.add(fl);

// カーペット（グリーン系）
const cp=new THREE.Mesh(new THREE.BoxGeometry(10,.02,8),M(0xC8D8C8));
cp.position.set(-3,.01,0);cp.receiveShadow=true;office.add(cp);

// ガラス壁
[[0,-9.5,26,4,.06],[0,9.5,26,4,.06],[-12.5,0,.06,4,20],[12.5,0,.06,4,20]].forEach(([x,z,w,h,d])=>{
  const wall=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),Glass());
  wall.position.set(x,h/2,z);office.add(wall);
});

// 柱
[[-12.5,-9.5],[-12.5,9.5],[12.5,-9.5],[12.5,9.5]].forEach(([x,z])=>{
  const f=new THREE.Mesh(new THREE.BoxGeometry(.08,4,.08),M(0x9ABBA0));
  f.position.set(x,2,z);office.add(f);
});

// 天井（ダークグリーン寄り）
const ceil=new THREE.Mesh(new THREE.BoxGeometry(26,.1,20),new THREE.MeshLambertMaterial({color:0x081808,transparent:true,opacity:0.45}));
ceil.position.y=4.05;office.add(ceil);

// 天井照明パネル
for(let i=-2;i<=2;i++){for(let j=-1;j<=1;j++){
  const p=new THREE.Mesh(new THREE.BoxGeometry(3,.03,1),MB(0xF0F8F0));
  p.position.set(i*4.5,3.98,j*5);office.add(p);
  const pl=new THREE.PointLight(0xFFFFFF,0.25,10,1.8);
  pl.position.set(i*4.5,3.8,j*5);office.add(pl);
}}

// ═══════════════════════════════════════════════════
// 会議室（右側）
// ═══════════════════════════════════════════════════
const MRX=8,MRZ=-3;
const mrGlass=Glass();
let w=new THREE.Mesh(new THREE.BoxGeometry(.06,3.5,5.5),mrGlass);w.position.set(MRX-2.8,1.75,MRZ);office.add(w);
w=new THREE.Mesh(new THREE.BoxGeometry(1.8,3.5,.06),mrGlass);w.position.set(MRX-1.9,1.75,MRZ+2.75);office.add(w);
w=new THREE.Mesh(new THREE.BoxGeometry(1.8,3.5,.06),mrGlass);w.position.set(MRX+1.9,1.75,MRZ+2.75);office.add(w);

// 会議室フレーム
[[MRX-2.8,MRZ-2.75],[MRX-2.8,MRZ+2.75],[MRX+2.8,MRZ-2.75],[MRX+2.8,MRZ+2.75]].forEach(([fx,fz])=>{
  const f=new THREE.Mesh(new THREE.BoxGeometry(.05,3.5,.05),M(0x9ABBA0));
  f.position.set(fx,1.75,fz);office.add(f);
});

// 会議テーブル
const mt=new THREE.Mesh(new THREE.BoxGeometry(3.8,.07,1.5),M(0xDCECDC));
mt.position.set(MRX,.72,MRZ);mt.castShadow=true;mt.receiveShadow=true;office.add(mt);
[[-1.6,-.55],[-1.6,.55],[1.6,-.55],[1.6,.55]].forEach(([tx,tz])=>{
  const l=new THREE.Mesh(new THREE.BoxGeometry(.06,.7,.06),M(0xBBCCBB));
  l.position.set(MRX+tx,.35,MRZ+tz);office.add(l);
});

// 会議室チェア
const meetSeats=[
  {x:MRX-1.4,z:MRZ-1.1,ry:0},{x:MRX,z:MRZ-1.1,ry:0},{x:MRX+1.4,z:MRZ-1.1,ry:0},
  {x:MRX-1.4,z:MRZ+1.1,ry:Math.PI},{x:MRX,z:MRZ+1.1,ry:Math.PI},{x:MRX+1.4,z:MRZ+1.1,ry:Math.PI},
];
meetSeats.forEach(s=>{
  const seat=new THREE.Mesh(new THREE.BoxGeometry(.35,.04,.35),M(0x2D4A2D));
  seat.position.set(s.x,.42,s.z);office.add(seat);
  const bk=new THREE.Mesh(new THREE.BoxGeometry(.35,.32,.04),M(0x2D4A2D));
  const bz=s.z+(s.ry===0?-.19:.19);
  bk.position.set(s.x,.6,bz);office.add(bk);
  [-.12,.12].forEach(ox=>{[-.12,.12].forEach(oz=>{
    const l=new THREE.Mesh(new THREE.BoxGeometry(.03,.4,.03),M(0x5A7A5A));
    l.position.set(s.x+ox,.2,s.z+oz);office.add(l);
  })});
});

// ホワイトボード（Foresyタスク）
const wbB=new THREE.Mesh(new THREE.BoxGeometry(2.6,1.1,.03),M(0xCCCCCC));
wbB.position.set(MRX,2.2,MRZ-2.73);office.add(wbB);
const wbF=new THREE.Mesh(new THREE.BoxGeometry(2.4,.96,.02),M(0xFAFAFA));
wbF.position.set(MRX,2.2,MRZ-2.71);office.add(wbF);
// ホワイトボードテキスト（Foresyタスク）
const wbc=document.createElement('canvas');wbc.width=256;wbc.height=100;
const wbx=wbc.getContext('2d');
wbx.fillStyle='#FAFAFA';wbx.fillRect(0,0,256,100);
wbx.font='bold 16px sans-serif';wbx.fillStyle='#22C55E';wbx.fillText('GROVE Sprint',20,24);
wbx.font='10px monospace';wbx.fillStyle='#555';
wbx.fillText('目標：初クライアント獲得',20,42);
wbx.fillText('▸ Scout DM送付×5',20,58);
wbx.fillText('▸ Torch LP改善案',20,72);
wbx.fillText('▸ Reviewer 広告審査',20,86);
const wbt=new THREE.CanvasTexture(wbc);
const wbm=new THREE.Mesh(new THREE.PlaneGeometry(2.3,.92),new THREE.MeshBasicMaterial({map:wbt}));
wbm.position.set(MRX,2.2,MRZ-2.7);office.add(wbm);

// ═══════════════════════════════════════════════════
// デスク配置
// ═══════════════════════════════════════════════════
const desks=[
  {x:-8, z:-3},  // SCOUT
  {x:-4, z:-3},  // TORCH
  {x:-8, z:1.5}, // RANGER
  {x:-4, z:1.5}, // SENTINEL
  {x:0,  z:-3},  // REVIEWER
  {x:0,  z:1.5}, // REPORTER
];

// ═══════════════════════════════════════════════════
// キャラクタービルダー
// ═══════════════════════════════════════════════════
function buildChar(agent,standing=false){
  const g=new THREE.Group();
  const skin=0xDEB887;
  if(standing){
    const leftLeg=new THREE.Mesh(new THREE.BoxGeometry(.1,.4,.1),M(agent.pants));
    leftLeg.position.set(-.08,.2,0);g.add(leftLeg);
    leftLeg.userData.isLeg=true;leftLeg.userData.phase=0;
    const rightLeg=new THREE.Mesh(new THREE.BoxGeometry(.1,.4,.1),M(agent.pants));
    rightLeg.position.set(.08,.2,0);g.add(rightLeg);
    rightLeg.userData.isLeg=true;rightLeg.userData.phase=Math.PI;
    [-1,1].forEach(s=>{
      const sh=new THREE.Mesh(new THREE.BoxGeometry(.11,.05,.16),M(0x222222));
      sh.position.set(s*.08,.025,0);g.add(sh);
    });
    const torso=new THREE.Mesh(new THREE.BoxGeometry(.28,.3,.16),M(agent.shirt));
    torso.position.set(0,.58,0);torso.castShadow=true;g.add(torso);
    const col=new THREE.Mesh(new THREE.BoxGeometry(.18,.04,.1),M(0xFFFFFF));
    col.position.set(0,.74,0);g.add(col);
    [-1,1].forEach(s=>{
      const arm=new THREE.Mesh(new THREE.BoxGeometry(.08,.28,.08),M(agent.shirt));
      arm.position.set(s*.2,.5,0);g.add(arm);
      const hand=new THREE.Mesh(new THREE.BoxGeometry(.07,.08,.07),M(skin));
      hand.position.set(s*.2,.32,0);g.add(hand);
    });
    const head=new THREE.Mesh(new THREE.BoxGeometry(.2,.2,.2),M(skin));
    head.position.set(0,.86,0);head.castShadow=true;g.add(head);
    const hair=new THREE.Mesh(new THREE.BoxGeometry(.22,.08,.22),M(agent.hair));
    hair.position.set(0,.96,-.01);g.add(hair);
    const hairB=new THREE.Mesh(new THREE.BoxGeometry(.22,.14,.04),M(agent.hair));
    hairB.position.set(0,.9,-.11);g.add(hairB);
    [-1,1].forEach(s=>{
      const eye=new THREE.Mesh(new THREE.BoxGeometry(.03,.03,.01),MB(0xFFFFFF));
      eye.position.set(s*.05,.88,.11);g.add(eye);
      const pup=new THREE.Mesh(new THREE.BoxGeometry(.02,.02,.01),MB(0x1a1a2e));
      pup.position.set(s*.05,.87,.115);g.add(pup);
    });
    // バッジ（エージェントカラー）
    const badge=new THREE.Mesh(new THREE.BoxGeometry(.05,.05,.05),MB(agent.color));
    badge.position.set(.16,.65,.07);g.add(badge);
  } else {
    // 着席キャラクター
    [-1,1].forEach(s=>{
      const thigh=new THREE.Mesh(new THREE.BoxGeometry(.11,.1,.22),M(agent.pants));
      thigh.position.set(s*.09,.42,-.05);g.add(thigh);
    });
    [-1,1].forEach(s=>{
      const shin=new THREE.Mesh(new THREE.BoxGeometry(.1,.25,.1),M(agent.pants));
      shin.position.set(s*.09,.24,-.15);g.add(shin);
      const shoe=new THREE.Mesh(new THREE.BoxGeometry(.11,.05,.14),M(0x222222));
      shoe.position.set(s*.09,.1,-.15);g.add(shoe);
    });
    const torso=new THREE.Mesh(new THREE.BoxGeometry(.28,.28,.16),M(agent.shirt));
    torso.position.set(0,.62,0);torso.castShadow=true;g.add(torso);
    const col=new THREE.Mesh(new THREE.BoxGeometry(.18,.04,.1),M(0xFFFFFF));
    col.position.set(0,.77,0);g.add(col);
    [-1,1].forEach(s=>{
      const ua=new THREE.Mesh(new THREE.BoxGeometry(.08,.2,.08),M(agent.shirt));
      ua.position.set(s*.2,.6,-.04);g.add(ua);
      const fa=new THREE.Mesh(new THREE.BoxGeometry(.07,.07,.2),M(skin));
      fa.position.set(s*.2,.52,-.18);g.add(fa);
    });
    const head=new THREE.Mesh(new THREE.BoxGeometry(.2,.2,.2),M(skin));
    head.position.set(0,.9,0);head.castShadow=true;g.add(head);
    const hair=new THREE.Mesh(new THREE.BoxGeometry(.22,.08,.22),M(agent.hair));
    hair.position.set(0,1.0,.01);g.add(hair);
    const hairB=new THREE.Mesh(new THREE.BoxGeometry(.22,.14,.04),M(agent.hair));
    hairB.position.set(0,.94,.11);g.add(hairB);
    [-1,1].forEach(s=>{
      const eye=new THREE.Mesh(new THREE.BoxGeometry(.03,.03,.01),MB(0xFFFFFF));
      eye.position.set(s*.05,.92,-.11);g.add(eye);
      const pup=new THREE.Mesh(new THREE.BoxGeometry(.02,.02,.01),MB(0x1a1a2e));
      pup.position.set(s*.05,.91,-.115);g.add(pup);
    });
    const badge=new THREE.Mesh(new THREE.BoxGeometry(.05,.05,.05),MB(agent.color));
    badge.position.set(.16,.68,-.06);g.add(badge);
  }
  return g;
}

// ═══════════════════════════════════════════════════
// デスク＆エージェント構築
// ═══════════════════════════════════════════════════
const screenData=[];
const agentData=[];

AGENTS.forEach((agent,idx)=>{
  const dp=desks[idx];
  const ax=dp.x, az=dp.z;

  // デスク脚
  [[-0.65,-.3],[.65,-.3],[-.65,.3],[.65,.3]].forEach(([lx,lz])=>{
    const l=new THREE.Mesh(new THREE.BoxGeometry(.06,.7,.06),M(0xBBCCBB));
    l.position.set(ax+lx,.35,az+lz);l.castShadow=true;office.add(l);
  });
  // デスク天板
  const dTop=new THREE.Mesh(new THREE.BoxGeometry(1.5,.05,.75),M(0xE8F0E8));
  dTop.position.set(ax,.73,az);dTop.castShadow=true;dTop.receiveShadow=true;office.add(dTop);
  const dFront=new THREE.Mesh(new THREE.BoxGeometry(1.5,.38,.03),M(0xDCECDC));
  dFront.position.set(ax,.52,az-.36);office.add(dFront);

  // モニター
  const monBase=new THREE.Mesh(new THREE.BoxGeometry(.25,.02,.12),M(0x9ABBA0));
  monBase.position.set(ax,.77,az-.2);office.add(monBase);
  const monStand=new THREE.Mesh(new THREE.BoxGeometry(.03,.22,.03),M(0x9ABBA0));
  monStand.position.set(ax,.88,az-.2);office.add(monStand);
  const monBody=new THREE.Mesh(new THREE.BoxGeometry(.85,.52,.03),M(0x1A1A1A));
  monBody.position.set(ax,1.28,az-.24);monBody.castShadow=true;office.add(monBody);

  // スクリーン
  const cv=document.createElement('canvas');cv.width=128;cv.height=80;
  const cx=cv.getContext('2d');
  const tex=new THREE.CanvasTexture(cv);tex.minFilter=THREE.LinearFilter;
  const sf=new THREE.Mesh(new THREE.PlaneGeometry(.78,.46),new THREE.MeshBasicMaterial({map:tex}));
  sf.position.set(ax,1.28,az-.22);office.add(sf);
  screenData.push({canvas:cv,ctx:cx,tex,type:agent.screen,hex:agent.hex});

  // キーボード
  const kb=new THREE.Mesh(new THREE.BoxGeometry(.42,.02,.13),M(0x333333));
  kb.position.set(ax,.77,az+.02);office.add(kb);
  for(let r=0;r<3;r++)for(let c=0;c<8;c++){
    const k=new THREE.Mesh(new THREE.BoxGeometry(.04,.008,.03),M(0x444444));
    k.position.set(ax-.15+c*.042,.785,az-.03+r*.035);office.add(k);
  }
  // マウス
  const ms=new THREE.Mesh(new THREE.BoxGeometry(.06,.02,.09),M(0x333333));
  ms.position.set(ax+.42,.77,az+.02);office.add(ms);
  // マグカップ
  const mug=new THREE.Mesh(new THREE.BoxGeometry(.06,.08,.06),M(idx%2?0xFFFFFF:0x22C55E));
  mug.position.set(ax+.55,.8,az+.12);office.add(mug);
  const coff=new THREE.Mesh(new THREE.BoxGeometry(.05,.01,.05),M(0x4E342E));
  coff.position.set(ax+.55,.84,az+.12);office.add(coff);

  // チェア
  const cz=az+.55;
  const cSeat=new THREE.Mesh(new THREE.BoxGeometry(.4,.04,.4),M(0x2D4A2D));
  cSeat.position.set(ax,.44,cz);office.add(cSeat);
  const cBack=new THREE.Mesh(new THREE.BoxGeometry(.4,.42,.04),M(0x2D4A2D));
  cBack.position.set(ax,.67,cz+.19);office.add(cBack);
  [-.14,.14].forEach(ox=>{[-.14,.14].forEach(oz=>{
    const l=new THREE.Mesh(new THREE.BoxGeometry(.03,.42,.03),M(0x5A7A5A));
    l.position.set(ax+ox,.21,cz+oz);office.add(l);
  })});
  [-1,1].forEach(s=>{
    const ar=new THREE.Mesh(new THREE.BoxGeometry(.04,.03,.28),M(0x3D6B3D));
    ar.position.set(ax+s*.2,.47,cz);office.add(ar);
  });

  // デスクアンダーグロー（エージェントカラー）
  const dGlow=new THREE.PointLight(agent.color,0.2,2.5,2);
  dGlow.position.set(ax,.3,az);office.add(dGlow);

  // 着席キャラクター
  const sittingChar=buildChar(agent,false);
  sittingChar.position.set(ax,0,az+.55);
  office.add(sittingChar);

  // フローティングラベル
  const lc=document.createElement('canvas');lc.width=256;lc.height=64;
  const lctx=lc.getContext('2d');
  lctx.clearRect(0,0,256,64);
  lctx.font='600 20px Orbitron,monospace';lctx.textAlign='center';
  lctx.fillStyle=agent.hex;lctx.shadowColor=agent.hex;lctx.shadowBlur=8;
  lctx.fillText(agent.name,128,26);
  lctx.shadowBlur=0;lctx.font='300 11px monospace';lctx.fillStyle='rgba(100,180,120,.7)';
  lctx.fillText(agent.role,128,46);
  const lTex=new THREE.CanvasTexture(lc);lTex.minFilter=THREE.LinearFilter;
  const label=new THREE.Sprite(new THREE.SpriteMaterial({map:lTex,transparent:true,depthTest:false}));
  label.scale.set(1.4,.35,1);
  label.position.set(ax,1.8,az+.55);
  office.add(label);

  // 歩行キャラクター（初期は非表示）
  const walker=buildChar(agent,true);
  walker.visible=false;
  office.add(walker);

  agentData.push({
    sittingChar,walker,label,dGlow,
    home:{x:ax,z:az+.55},
    state:'sitting',
    timer:4+rng.r(0,12),
    walkTarget:null,
    agent
  });
});

// ═══════════════════════════════════════════════════
// 歩行先
// ═══════════════════════════════════════════════════
const walkDestinations=[
  {x:2,  z:7.5},
  {x:-10,z:0},
  {x:-2, z:-7},
  {x:4,  z:5},
  {x:-6, z:7},
  {x:3,  z:0},
];

// ═══════════════════════════════════════════════════
// 歩行システム
// ═══════════════════════════════════════════════════
function updateWalkers(delta){
  agentData.forEach(ad=>{
    if(ad.state==='sitting'){
      ad.timer-=delta;
      if(ad.timer<=0){
        ad.state='walking_out';
        ad.sittingChar.visible=false;
        ad.walker.visible=true;
        ad.walker.position.set(ad.home.x,0,ad.home.z);
        const dest=walkDestinations[rng.i(0,walkDestinations.length-1)];
        ad.walkTarget={x:dest.x+rng.r(-.5,.5),z:dest.z+rng.r(-.5,.5)};
        ad.walkPause=0;
      }
    } else if(ad.state==='walking_out'){
      const dx=ad.walkTarget.x-ad.walker.position.x;
      const dz=ad.walkTarget.z-ad.walker.position.z;
      const dist=Math.sqrt(dx*dx+dz*dz);
      if(dist<.2){
        ad.walkPause+=delta;
        if(ad.walkPause>2+rng.r(0,2))ad.state='walking_back';
      } else {
        const speed=1.6*delta;
        const nx=dx/dist,nz=dz/dist;
        ad.walker.position.x+=nx*speed;ad.walker.position.z+=nz*speed;
        ad.walker.rotation.y=Math.atan2(nx,nz);
        const t=performance.now()*.01;
        ad.walker.children.forEach(c=>{if(c.userData&&c.userData.isLeg)c.position.z=Math.sin(t+c.userData.phase)*.08});
      }
      ad.label.position.set(ad.walker.position.x,1.3,ad.walker.position.z);
    } else if(ad.state==='walking_back'){
      const dx=ad.home.x-ad.walker.position.x;
      const dz=ad.home.z-ad.walker.position.z;
      const dist=Math.sqrt(dx*dx+dz*dz);
      if(dist<.2){
        ad.state='sitting';ad.walker.visible=false;ad.sittingChar.visible=true;
        ad.label.position.set(ad.home.x,1.8,ad.home.z);
        ad.timer=6+rng.r(0,14);
        ad.walker.children.forEach(c=>{if(c.userData&&c.userData.isLeg)c.position.z=0});
      } else {
        const speed=1.6*delta;
        const nx=dx/dist,nz=dz/dist;
        ad.walker.position.x+=nx*speed;ad.walker.position.z+=nz*speed;
        ad.walker.rotation.y=Math.atan2(nx,nz);
        const t=performance.now()*.01;
        ad.walker.children.forEach(c=>{if(c.userData&&c.userData.isLeg)c.position.z=Math.sin(t+c.userData.phase)*.08});
      }
      ad.label.position.set(ad.walker.position.x,1.3,ad.walker.position.z);
    } else if(ad.state==='leaving'){
      const dx=ad.walkTarget.x-ad.walker.position.x;
      const dz=ad.walkTarget.z-ad.walker.position.z;
      const dist=Math.sqrt(dx*dx+dz*dz);
      if(dist<.5){
        ad.walker.visible=false;ad.state='offsite';
        ad.label.position.set(ad.home.x,1.8,ad.home.z);
      } else {
        const speed=2*delta;
        const nx=dx/dist,nz=dz/dist;
        ad.walker.position.x+=nx*speed;ad.walker.position.z+=nz*speed;
        ad.walker.rotation.y=Math.atan2(nx,nz);
        const t=performance.now()*.01;
        ad.walker.children.forEach(c=>{if(c.userData&&c.userData.isLeg)c.position.z=Math.sin(t+c.userData.phase)*.08});
      }
      ad.label.position.set(ad.walker.position.x,1.3,ad.walker.position.z);
    }
  });
}

// ═══════════════════════════════════════════════════
// 会議ロジック（Grove Meeting）
// ═══════════════════════════════════════════════════
let inMeeting=false;
const meetChars=[];
AGENTS.slice(0,6).forEach((agent,i)=>{
  const mc=buildChar(agent,false);
  const s=meetSeats[i];
  mc.position.set(s.x,0,s.z);
  mc.rotation.y=s.z<MRZ?Math.PI:0;
  mc.visible=false;
  office.add(mc);
  meetChars.push(mc);
});

function updateMeeting(minutes){
  const shouldMeet=(minutes>=600&&minutes<=630)||(minutes>=840&&minutes<=870);
  if(shouldMeet&&!inMeeting){
    inMeeting=true;if(onMeetingChange)onMeetingChange(true);
    meetChars.forEach(c=>c.visible=true);
    agentData.slice(0,6).forEach(ad=>{
      if(ad.state!=='sitting'){ad.walker.visible=false;ad.sittingChar.visible=false;}
      else{ad.sittingChar.visible=false;}
      ad.state='meeting';
    });
  } else if(!shouldMeet&&inMeeting){
    inMeeting=false;if(onMeetingChange)onMeetingChange(false);
    meetChars.forEach(c=>c.visible=false);
    agentData.slice(0,6).forEach(ad=>{
      ad.state='sitting';ad.sittingChar.visible=true;
      ad.label.position.set(ad.home.x,1.8,ad.home.z);
      ad.timer=3+rng.r(0,6);
    });
  }
}

// ═══════════════════════════════════════════════════
// オフィス備品
// ═══════════════════════════════════════════════════
// ウォータークーラー
let wc=new THREE.Mesh(new THREE.BoxGeometry(.28,.55,.28),M(0xE0E8E0));
wc.position.set(-10.5,.275,0);office.add(wc);
let wt=new THREE.Mesh(new THREE.BoxGeometry(.22,.25,.22),M(0xA8D5B8));
wt.position.set(-10.5,.675,0);office.add(wt);

// 観葉植物（Foresyの「森」）
function addPlant(px,pz,big=false){
  const s=big?1.3:1;
  const pot=new THREE.Mesh(new THREE.BoxGeometry(.28*s,.22*s,.28*s),M(0xD4ECD4));
  pot.position.set(px,.11*s,pz);pot.castShadow=true;office.add(pot);
  const leafColors=[0x22C55E,0x16A34A,0x4ADE80,0x166534,0x15803D];
  for(let i=0;i<(big?5:3);i++){
    const leaf=new THREE.Mesh(new THREE.BoxGeometry((.12+rng.r(0,.12))*s,(.2+rng.r(0,.25))*s,.12*s),M(leafColors[rng.i(0,leafColors.length-1)]));
    leaf.position.set(px+rng.r(-.06,.06)*s,.32*s+i*.18*s,pz+rng.r(-.06,.06)*s);
    leaf.rotation.y=rng.r(0,Math.PI);leaf.castShadow=true;office.add(leaf);
  }
}
addPlant(-11,8,true);addPlant(-11,-8);addPlant(11,-8);addPlant(-2,-8);addPlant(-6,8,true);addPlant(11,5);

// 本棚（グリーン系カラー）
for(let r=0;r<3;r++){
  const sh=new THREE.Mesh(new THREE.BoxGeometry(1.8,.04,.3),M(0xDCECDC));
  sh.position.set(-11.5,.5+r*.55,-5);office.add(sh);
  const bookColors=[0x22C55E,0x4ADE80,0xFBBF24,0x60A5FA,0xF87171];
  for(let b=0;b<5;b++){
    const bk=new THREE.Mesh(new THREE.BoxGeometry(.12,.35+rng.r(0,.15),.22),M(bookColors[b]));
    bk.position.set(-12.2+b*.3,.5+r*.55+.2,-5);office.add(bk);
  }
}

// ═══════════════════════════════════════════════════
// STEWARD（総括本部）レセプションデスク
// ═══════════════════════════════════════════════════
const reception=new THREE.Group();
const RCX=8,RCZ=6.5;

// メインデスク
const rcDesk=new THREE.Mesh(new THREE.BoxGeometry(2.5,.9,.6),M(0x0F2A18));
rcDesk.position.set(RCX,.45,RCZ);rcDesk.castShadow=true;reception.add(rcDesk);
const rcTop=new THREE.Mesh(new THREE.BoxGeometry(2.6,.04,.7),M(0xDCECDC));
rcTop.position.set(RCX,.92,RCZ);reception.add(rcTop);
const rcSide=new THREE.Mesh(new THREE.BoxGeometry(.6,.9,.04),M(0x0F2A18));
rcSide.position.set(RCX+1.25,.45,RCZ-.3);reception.add(rcSide);

// ForesyロゴをCanvasで描画（画像不要）
const foresyLogoCv=document.createElement('canvas');foresyLogoCv.width=256;foresyLogoCv.height=86;
const flCtx=foresyLogoCv.getContext('2d');
flCtx.clearRect(0,0,256,86);
// 背景
flCtx.fillStyle='rgba(15,42,24,0.0)';flCtx.fillRect(0,0,256,86);
// ブランド名
flCtx.font='bold 32px Syne,sans-serif';flCtx.textAlign='center';
flCtx.fillStyle='#22C55E';flCtx.shadowColor='#22C55E';flCtx.shadowBlur=12;
flCtx.fillText('foresy',128,42);
flCtx.shadowBlur=0;
// サブテキスト
flCtx.font='10px monospace';flCtx.fillStyle='rgba(74,222,128,0.6)';flCtx.letterSpacing='3px';
flCtx.fillText('GROVE — AI AGENT TEAM',128,64);
// 葉っぱアイコン（シンプルな三角形）
flCtx.fillStyle='#22C55E';flCtx.shadowColor='#22C55E';flCtx.shadowBlur=6;
flCtx.beginPath();flCtx.moveTo(128,6);flCtx.lineTo(120,16);flCtx.lineTo(136,16);flCtx.closePath();flCtx.fill();
const foresyLogoTex=new THREE.CanvasTexture(foresyLogoCv);foresyLogoTex.minFilter=THREE.LinearFilter;
const rcLogoMesh=new THREE.Mesh(
  new THREE.PlaneGeometry(1.8,.6),
  new THREE.MeshBasicMaterial({map:foresyLogoTex,transparent:true})
);
rcLogoMesh.position.set(RCX,.5,RCZ+.31);reception.add(rcLogoMesh);

// グリーングロースリップ
const rcGlow=new THREE.Mesh(new THREE.BoxGeometry(2.2,.02,.02),MB(0x22C55E));
rcGlow.position.set(RCX,.05,RCZ+.3);reception.add(rcGlow);
const rcLight=new THREE.PointLight(0x22C55E,0.4,3.5,2);
rcLight.position.set(RCX,.1,RCZ+.5);reception.add(rcLight);

// STEWARDのモニター
const rcMonBase=new THREE.Mesh(new THREE.BoxGeometry(.2,.02,.1),M(0x9ABBA0));
rcMonBase.position.set(RCX-.4,.95,RCZ+.05);reception.add(rcMonBase);
const rcMonStand=new THREE.Mesh(new THREE.BoxGeometry(.03,.18,.03),M(0x9ABBA0));
rcMonStand.position.set(RCX-.4,1.05,RCZ+.05);reception.add(rcMonStand);
const rcMonBody=new THREE.Mesh(new THREE.BoxGeometry(.6,.4,.03),M(0x1A1A1A));
rcMonBody.position.set(RCX-.4,1.35,RCZ+.08);reception.add(rcMonBody);
// ダッシュボード画面
const rcScreenCv=document.createElement('canvas');rcScreenCv.width=128;rcScreenCv.height=80;
const rcSCtx=rcScreenCv.getContext('2d');
rcSCtx.fillStyle='#0D1117';rcSCtx.fillRect(0,0,128,80);
rcSCtx.font='6px monospace';rcSCtx.fillStyle='#22C55E';
rcSCtx.fillText('GROVE DASHBOARD',10,14);
rcSCtx.fillStyle='rgba(74,222,128,0.6)';
['SCOUT ●  online','TORCH ●  online','RANGER●  online','SENTINEL● online','REVIEWER● online','REPORTER● online'].forEach((t,i)=>{
  rcSCtx.fillText(t,10,26+i*9);
});
const rcSTex=new THREE.CanvasTexture(rcScreenCv);rcSTex.minFilter=THREE.LinearFilter;
const rcScreenMesh=new THREE.Mesh(new THREE.PlaneGeometry(.55,.35),new THREE.MeshBasicMaterial({map:rcSTex}));
rcScreenMesh.position.set(RCX-.4,1.35,RCZ+.06);reception.add(rcScreenMesh);

// キーボード
const rcKb=new THREE.Mesh(new THREE.BoxGeometry(.3,.02,.1),M(0x333333));
rcKb.position.set(RCX-.4,.95,RCZ+.15);reception.add(rcKb);
const rcMouse=new THREE.Mesh(new THREE.BoxGeometry(.05,.02,.07),M(0x333333));
rcMouse.position.set(RCX-.1,.95,RCZ+.15);reception.add(rcMouse);

// チェア
const rcChairSeat=new THREE.Mesh(new THREE.BoxGeometry(.4,.04,.4),M(0x2D4A2D));
const rcChairBack=new THREE.Mesh(new THREE.BoxGeometry(.4,.42,.04),M(0x2D4A2D));
rcChairSeat.position.set(RCX-.4,.44,RCZ-.4);reception.add(rcChairSeat);
rcChairBack.position.set(RCX-.4,.67,RCZ-.59);reception.add(rcChairBack);

// STEWARDエージェント（The Director）
const stewardAgent={name:'STEWARD',color:0x22C55E,hex:'#22C55E',role:'The Director',hair:0x1a3a1a,shirt:0x14532d,pants:0x0f2718};
const stewardChar=buildChar(stewardAgent,false);
stewardChar.position.set(RCX-.4,0,RCZ-.4);
stewardChar.rotation.y=Math.PI;
reception.add(stewardChar);

// STEWARDラベル
const stwLC=document.createElement('canvas');stwLC.width=256;stwLC.height=64;
const stwCtx=stwLC.getContext('2d');
stwCtx.clearRect(0,0,256,64);
stwCtx.font='600 20px Orbitron,monospace';stwCtx.textAlign='center';
stwCtx.fillStyle='#22C55E';stwCtx.shadowColor='#22C55E';stwCtx.shadowBlur=8;
stwCtx.fillText('STEWARD',128,26);
stwCtx.shadowBlur=0;stwCtx.font='300 11px monospace';stwCtx.fillStyle='rgba(74,222,128,.7)';
stwCtx.fillText('The Director',128,46);
const stwTex=new THREE.CanvasTexture(stwLC);stwTex.minFilter=THREE.LinearFilter;
const stwLabel=new THREE.Sprite(new THREE.SpriteMaterial({map:stwTex,transparent:true,depthTest:false}));
stwLabel.scale.set(1.4,.35,1);stwLabel.position.set(RCX-.4,1.8,RCZ-.4);
reception.add(stwLabel);

office.add(reception);

// ─── ソファ・ラウンジエリア ──────────────────────────
const lounge=new THREE.Group();
const SX=10.5,SZ=6;
const sofaBase=new THREE.Mesh(new THREE.BoxGeometry(.7,.35,2),M(0x2D4A2D));
sofaBase.position.set(SX,.175,SZ);sofaBase.castShadow=true;lounge.add(sofaBase);
const sofaSeat=new THREE.Mesh(new THREE.BoxGeometry(.55,.12,1.9),M(0x3D6B3D));
sofaSeat.position.set(SX-.05,.41,SZ);lounge.add(sofaSeat);
const sofaBack=new THREE.Mesh(new THREE.BoxGeometry(.12,.4,1.9),M(0x3D6B3D));
sofaBack.position.set(SX+.35,.55,SZ);lounge.add(sofaBack);
[-1,1].forEach(s=>{
  const arm=new THREE.Mesh(new THREE.BoxGeometry(.7,.25,.15),M(0x2D4A2D));
  arm.position.set(SX,.3,SZ+s*1.05);lounge.add(arm);
});
const cTable=new THREE.Mesh(new THREE.BoxGeometry(.5,.04,1),M(0xDCECDC));
cTable.position.set(SX-.7,.38,SZ);lounge.add(cTable);
[[-0.18,-.4],[-.18,.4],[.18,-.4],[.18,.4]].forEach(([tx,tz])=>{
  const tl=new THREE.Mesh(new THREE.BoxGeometry(.04,.36,.04),M(0xBBCCBB));
  tl.position.set(SX-.7+tx,.18,SZ+tz);lounge.add(tl);
});
// テーブルの雑誌
const mag1=new THREE.Mesh(new THREE.BoxGeometry(.3,.015,.22),M(0x22C55E));
mag1.position.set(SX-.7,.4,SZ-.15);mag1.rotation.y=.2;lounge.add(mag1);
const mag2=new THREE.Mesh(new THREE.BoxGeometry(.3,.015,.22),M(0x60A5FA));
mag2.position.set(SX-.7,.4,SZ+.15);mag2.rotation.y=-.15;lounge.add(mag2);
office.add(lounge);

// ─── プリンター ──────────────────────────────────────
const prBody=new THREE.Mesh(new THREE.BoxGeometry(.7,.45,.5),M(0xE0E8E0));
prBody.position.set(3,.225,-8);prBody.castShadow=true;office.add(prBody);
const prTop=new THREE.Mesh(new THREE.BoxGeometry(.72,.04,.52),M(0xCCCCCC));
prTop.position.set(3,.47,-8);office.add(prTop);
const prTray=new THREE.Mesh(new THREE.BoxGeometry(.5,.03,.35),M(0xFAFAFA));
prTray.position.set(3,.15,-7.7);office.add(prTray);
const prLED=new THREE.Mesh(new THREE.BoxGeometry(.04,.04,.02),MB(0x22C55E));
prLED.position.set(3.25,.4,-7.74);office.add(prLED);
const prStand=new THREE.Mesh(new THREE.BoxGeometry(.6,.5,.45),M(0xBBBBBB));
prStand.position.set(3,.25,-8);office.add(prStand);

// ─── コーヒーカウンター ────────────────────────────────
const snackArea=new THREE.Group();
const counter=new THREE.Mesh(new THREE.BoxGeometry(1.6,.8,.5),M(0xDCECDC));
counter.position.set(-10.5,.4,2.5);counter.castShadow=true;snackArea.add(counter);
const ctrTop=new THREE.Mesh(new THREE.BoxGeometry(1.7,.04,.6),M(0xE8F0E8));
ctrTop.position.set(-10.5,.82,2.5);snackArea.add(ctrTop);
const coffMachine=new THREE.Mesh(new THREE.BoxGeometry(.25,.35,.2),M(0x1A1A1A));
coffMachine.position.set(-10.8,1.0,2.5);coffMachine.castShadow=true;snackArea.add(coffMachine);
const coffTop=new THREE.Mesh(new THREE.BoxGeometry(.27,.03,.22),M(0x111111));
coffTop.position.set(-10.8,1.18,2.5);snackArea.add(coffTop);
const coffLED=new THREE.Mesh(new THREE.BoxGeometry(.03,.03,.01),MB(0x22C55E));
coffLED.position.set(-10.72,1.1,2.39);snackArea.add(coffLED);
office.add(snackArea);

// ═══════════════════════════════════════════════════
// ウォールポスター（Foresyモットー）
// ═══════════════════════════════════════════════════
const posterData=[
  {x:-11.4,z:-2,color:0x22C55E,text:'先見性'},
  {x:-11.4,z:3, color:0x4ADE80,text:'丁寧に'},
  {x:-11.4,z:6, color:0xFBBF24,text:'自動化'},
  {x:11.4, z:-2,color:0x60A5FA,text:'分析力'},
  {x:11.4, z:3, color:0xF87171,text:'品質第一'},
];
posterData.forEach(p=>{
  const frame=new THREE.Mesh(new THREE.BoxGeometry(.04,.7,.5),M(0x1A1A1A));
  frame.position.set(p.x,2.2,p.z);frame.castShadow=true;office.add(frame);
  const pc=document.createElement('canvas');pc.width=100;pc.height=140;
  const px=pc.getContext('2d');
  px.fillStyle='#0A1A0A';px.fillRect(0,0,100,140);
  px.font='bold 16px sans-serif';px.textAlign='center';
  px.fillStyle=new THREE.Color(p.color).getStyle();
  px.shadowColor=px.fillStyle;px.shadowBlur=6;
  const words=p.text.split(' ');
  words.forEach((wo,i)=>px.fillText(wo,50,55+i*22));
  const ptex=new THREE.CanvasTexture(pc);
  const poster=new THREE.Mesh(new THREE.PlaneGeometry(.45,.65),new THREE.MeshBasicMaterial({map:ptex}));
  poster.position.set(p.x+(p.x<0?.03:-.03),2.2,p.z);
  poster.rotation.y=p.x<0?Math.PI/2:-Math.PI/2;
  office.add(poster);
});

// ═══════════════════════════════════════════════════
// アナログ時計
// ═══════════════════════════════════════════════════
const clockBody=new THREE.Mesh(new THREE.BoxGeometry(.5,.5,.04),M(0xFAFAFA));
clockBody.position.set(-6,2.5,-9.3);office.add(clockBody);
const clockFrame=new THREE.Mesh(new THREE.BoxGeometry(.55,.55,.03),M(0x1A1A1A));
clockFrame.position.set(-6,2.5,-9.32);office.add(clockFrame);
const clockCanvas=document.createElement('canvas');clockCanvas.width=80;clockCanvas.height=80;
const clockCtx=clockCanvas.getContext('2d');
const clockTex=new THREE.CanvasTexture(clockCanvas);clockTex.minFilter=THREE.LinearFilter;
const clockFace=new THREE.Mesh(new THREE.PlaneGeometry(.44,.44),new THREE.MeshBasicMaterial({map:clockTex}));
clockFace.position.set(-6,2.5,-9.28);office.add(clockFace);

function drawClock(minutes){
  const c=clockCtx,cw=80,ch=80,cx=cw/2,cy=ch/2;
  c.fillStyle='#FAFAFA';c.fillRect(0,0,cw,ch);
  c.fillStyle='#333';
  for(let i=0;i<12;i++){const a=i*Math.PI/6-Math.PI/2;c.fillRect(cx+Math.cos(a)*30-1,cy+Math.sin(a)*30-1,3,3)}
  const hrs=(minutes/60)%12;
  const mins=minutes%60;
  const ha=hrs*Math.PI/6-Math.PI/2;
  c.strokeStyle='#1A1A1A';c.lineWidth=2.5;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(ha)*16,cy+Math.sin(ha)*16);c.stroke();
  const ma=mins*Math.PI/30-Math.PI/2;
  c.strokeStyle='#444';c.lineWidth=1.5;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(ma)*24,cy+Math.sin(ma)*24);c.stroke();
  // 秒針（グリーン）
  const sec=(Date.now()/1000)%60;
  const sa=sec*Math.PI/30-Math.PI/2;
  c.strokeStyle='#22C55E';c.lineWidth=.8;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(sa)*26,cy+Math.sin(sa)*26);c.stroke();
  c.fillStyle='#22C55E';c.beginPath();c.arc(cx,cy,2,0,Math.PI*2);c.fill();
  clockTex.needsUpdate=true;
}

// ═══════════════════════════════════════════════════
// デスクペンダントライト
// ═══════════════════════════════════════════════════
desks.forEach((dp,i)=>{
  const cable=new THREE.Mesh(new THREE.BoxGeometry(.02,.8,.02),M(0x333333));
  cable.position.set(dp.x,3.65,dp.z);office.add(cable);
  const shade=new THREE.Mesh(new THREE.BoxGeometry(.35,.15,.35),M(0x1A1A1A));
  shade.position.set(dp.x,3.2,dp.z);office.add(shade);
  const bulb=new THREE.Mesh(new THREE.BoxGeometry(.1,.08,.1),MB(0xFFF8E0));
  bulb.position.set(dp.x,3.12,dp.z);office.add(bulb);
  const pLight=new THREE.PointLight(0xFFE8CC,0.15,4,2);
  pLight.position.set(dp.x,3.1,dp.z);office.add(pLight);
});

// ─── 天井ダクト ───────────────────────────────────────
const duct=new THREE.Mesh(new THREE.BoxGeometry(22,.15,.3),M(0xCCCCCC));
duct.position.set(0,3.9,0);office.add(duct);
[-4,4].forEach(z=>{
  const cd=new THREE.Mesh(new THREE.BoxGeometry(.3,.12,8),M(0xBBBBBB));
  cd.position.set(0,3.88,z);office.add(cd);
});

// ─── デスクミニ植物・ヘッドフォン ───────────────────────
desks.forEach((dp,i)=>{
  if(i%2===0){
    const mpot=new THREE.Mesh(new THREE.BoxGeometry(.08,.08,.08),M(0xD4ECD4));
    mpot.position.set(dp.x-.55,.8,dp.z+.2);office.add(mpot);
    for(let l=0;l<2;l++){
      const ml=new THREE.Mesh(new THREE.BoxGeometry(.06,.1+rng.r(0,.06),.06),M(0x22C55E));
      ml.position.set(dp.x-.55+rng.r(-.02,.02),.88+l*.07,dp.z+.2+rng.r(-.02,.02));
      office.add(ml);
    }
  }
});
[0,2,4].forEach(i=>{
  const dp=desks[i];
  const hpBand=new THREE.Mesh(new THREE.BoxGeometry(.2,.03,.15),M(0x1A1A1A));
  hpBand.position.set(dp.x-.5,.82,dp.z-.1);hpBand.rotation.z=.15;office.add(hpBand);
  [-1,1].forEach(s=>{
    const cup=new THREE.Mesh(new THREE.BoxGeometry(.06,.08,.08),M(0x111111));
    cup.position.set(dp.x-.5+s*.1,.8,dp.z-.1);office.add(cup);
  });
});

// ─── 浮遊する紙（レポート・広告資料）─────────────────────
const flyingPapers=[];
const paperCount=18;
const paperColors=[0x22C55E,0x4ADE80,0xFBBF24,0x60A5FA,0xF87171,0xA78BFA,0x34D399,0xFFF8E0,0x86EFAC];

for(let i=0;i<paperCount;i++){
  const pw=rng.r(.12,.2),ph=rng.r(.15,.25);
  const paper=new THREE.Mesh(
    new THREE.PlaneGeometry(pw,ph),
    new THREE.MeshLambertMaterial({color:rng.pick(paperColors),side:THREE.DoubleSide,transparent:true,opacity:0.8})
  );
  paper.position.set(rng.r(-8,6),rng.r(.5,3),rng.r(-6,7));
  paper.rotation.set(rng.r(0,Math.PI),rng.r(0,Math.PI),rng.r(0,Math.PI));
  paper.castShadow=true;office.add(paper);
  flyingPapers.push({
    mesh:paper,baseY:rng.r(1,2.8),
    driftSpeedX:rng.r(.15,.4)*(rng.n()>.5?1:-1),driftSpeedZ:rng.r(.1,.3)*(rng.n()>.5?1:-1),
    bobSpeed:rng.r(.5,1.5),bobAmp:rng.r(.2,.5),
    tumbleSpeedX:rng.r(.3,1.2)*(rng.n()>.5?1:-1),tumbleSpeedY:rng.r(.2,.8)*(rng.n()>.5?1:-1),tumbleSpeedZ:rng.r(.1,.6)*(rng.n()>.5?1:-1),
    flutterSpeed:rng.r(2,5),flutterAmp:rng.r(.05,.15),phase:rng.r(0,Math.PI*2),
  });
}

// ═══════════════════════════════════════════════════
// SCOUTの特別デスク（The Connector — 会社の顔）
// ═══════════════════════════════════════════════════
const scoutDesk=desks[0];
// サブモニター
const sm2Stand=new THREE.Mesh(new THREE.BoxGeometry(.03,.22,.03),M(0x9ABBA0));
sm2Stand.position.set(scoutDesk.x+.5,.88,scoutDesk.z-.2);office.add(sm2Stand);
const sm2Body=new THREE.Mesh(new THREE.BoxGeometry(.65,.42,.03),M(0x1A1A1A));
sm2Body.position.set(scoutDesk.x+.5,1.28,scoutDesk.z-.24);office.add(sm2Body);
const sm2Screen=new THREE.Mesh(new THREE.BoxGeometry(.58,.36,.01),MB(0x051808));
sm2Screen.position.set(scoutDesk.x+.5,1.28,scoutDesk.z-.22);office.add(sm2Screen);

// グリーンフロアリング（SCOUTの作業エリア）
const ringGeo=new THREE.RingGeometry(1.2,1.25,32);
const ringMat=new THREE.MeshBasicMaterial({color:0x22C55E,transparent:true,opacity:0.15,side:THREE.DoubleSide});
const floorRing=new THREE.Mesh(ringGeo,ringMat);
floorRing.rotation.x=-Math.PI/2;
floorRing.position.set(scoutDesk.x,.02,scoutDesk.z+.2);
office.add(floorRing);
const ringInner=new THREE.Mesh(new THREE.RingGeometry(1.05,1.08,32),new THREE.MeshBasicMaterial({color:0x22C55E,transparent:true,opacity:0.08,side:THREE.DoubleSide}));
ringInner.rotation.x=-Math.PI/2;ringInner.position.set(scoutDesk.x,.02,scoutDesk.z+.2);
office.add(ringInner);
const pulseRing=new THREE.Mesh(new THREE.RingGeometry(1.3,1.33,32),new THREE.MeshBasicMaterial({color:0x22C55E,transparent:true,opacity:0,side:THREE.DoubleSide}));
pulseRing.rotation.x=-Math.PI/2;pulseRing.position.set(scoutDesk.x,.02,scoutDesk.z+.2);
office.add(pulseRing);

// ═══════════════════════════════════════════════════
// パーティクル（ほこり・光の粒）
// ═══════════════════════════════════════════════════
const pN=40,pG=new THREE.BufferGeometry(),pP=new Float32Array(pN*3);
for(let i=0;i<pN;i++){pP[i*3]=rng.r(-11,11);pP[i*3+1]=rng.r(.5,3.5);pP[i*3+2]=rng.r(-8,8)}
pG.setAttribute('position',new THREE.BufferAttribute(pP,3));
office.add(new THREE.Points(pG,new THREE.PointsMaterial({color:0x22C55E,size:.02,transparent:true,opacity:.2})));

// ═══════════════════════════════════════════════════
// スクリーンアニメーション（Foresy業務コンテンツ）
// ═══════════════════════════════════════════════════
let frame=0;
function drawScreen(s){
  const{ctx:c,canvas:cv,type,hex}=s;
  const w=cv.width,h=cv.height;
  c.fillStyle='#0D1117';c.fillRect(0,0,w,h);
  const t=frame*.02;
  c.globalAlpha=1;

  if(type==='crm'){
    // SCOUT：見込み客CRM
    c.font='6px monospace';c.fillStyle=hex;c.globalAlpha=.7;
    c.fillText('CRM: 見込み客',6,12);
    const leads=[['田中商店','★★★'],['山田デザイン','★★☆'],['Webコンサル','★★★'],['小川建設','★☆☆']];
    leads.forEach(([nm,st],i)=>{
      c.globalAlpha=.5+Math.sin(t+i)*.1;
      c.fillStyle=hex;c.fillText(nm,6,24+i*12);
      c.fillStyle='#FBB024';c.fillText(st,82,24+i*12);
    });
    // 点滅カーソル
    if(Math.sin(t*4)>0){c.globalAlpha=.8;c.fillStyle=hex;c.fillRect(6,h-12,5,7)}

  } else if(type==='content'){
    // TORCH：コンテンツ作成
    c.fillStyle=hex;c.globalAlpha=.15;c.fillRect(8,8,w-16,h-16);
    c.font='6px monospace';c.fillStyle=hex;c.globalAlpha=.8;
    c.fillText('X投稿案 #5',8,18);
    c.globalAlpha=.5;
    c.font='5px monospace';c.fillStyle='rgba(255,255,255,.6)';
    const lines=['Google広告で','成果が出ない？','3つの原因と','改善法を解説'];
    lines.forEach((l,i)=>c.fillText(l,8,30+i*11));
    // タイピングカーソル
    if(Math.sin(t*3)>0){c.globalAlpha=.7;c.fillStyle=hex;c.fillRect(8,h-12,4,6)}

  } else if(type==='tasks'){
    // RANGER：タスク管理
    c.font='6px monospace';
    const tasks=[
      ['● DM送付×5',hex,true],
      ['● Torch LP案レビュー',hex,true],
      ['○ GA4設定確認','rgba(255,255,255,.4)',false],
      ['○ 月次報告書','rgba(255,255,255,.4)',false],
      ['○ ミーティング準備','rgba(255,255,255,.4)',false],
    ];
    tasks.forEach(([txt,cl,done],i)=>{
      c.fillStyle=cl;c.globalAlpha=done?.8:.4;
      c.fillText(txt,6,14+i*13);
    });
    // 進捗バー
    c.globalAlpha=.3;c.fillStyle='rgba(255,255,255,.1)';c.fillRect(6,h-10,w-12,4);
    c.globalAlpha=.7;c.fillStyle=hex;c.fillRect(6,h-10,(w-12)*0.4,4);

  } else if(type==='security'){
    // SENTINEL：セキュリティ監査
    c.font='6px monospace';
    const checks=[
      ['✓ ENV非公開',   '#22C55E'],
      ['✓ APIキー安全','#22C55E'],
      ['✓ Git履歴確認','#22C55E'],
      ['⚠ 数値要確認',hex],
      ['○ ポリシー確認','rgba(255,255,255,.4)'],
    ];
    checks.forEach(([txt,cl],i)=>{
      c.fillStyle=cl;c.globalAlpha=.8;c.fillText(txt,6,14+i*13);
    });
    // 点滅リスクアラート
    if(Math.sin(t*2)>0){c.globalAlpha=.4;c.fillStyle=hex;c.fillRect(6,h-10,w-12,6)}

  } else if(type==='ads'){
    // REVIEWER：Google広告ダッシュボード
    c.fillStyle=hex;
    for(let i=0;i<6;i++){
      const bh=8+Math.abs(Math.sin(t+i*.9))*36;
      c.globalAlpha=.5;c.fillRect(10+i*18,h-8-bh,12,bh);
    }
    c.strokeStyle=hex;c.globalAlpha=.7;c.lineWidth=1.5;c.beginPath();
    for(let x=0;x<w;x+=4){const y=22+Math.sin(x*.05+t)*10;x===0?c.moveTo(x,y):c.lineTo(x,y)}c.stroke();
    c.font='6px monospace';c.fillStyle=hex;c.globalAlpha=.8;
    c.fillText('CTR: 3.2%',6,12);c.fillText('CPC: ¥82',66,12);

  } else if(type==='report'){
    // REPORTER：Looker Studioレポート
    c.fillStyle='rgba(255,255,255,.06)';c.fillRect(8,8,w-16,h-16);
    c.font='6px monospace';c.fillStyle=hex;c.globalAlpha=.7;
    c.fillText('月次レポート',10,18);
    const metrics=[['表示回数','12,450'],['クリック数',' 398'],['CV数','   12'],['ROAS',' 420%']];
    metrics.forEach(([k,v],i)=>{
      c.globalAlpha=.4;c.fillStyle='rgba(255,255,255,.5)';c.fillText(k,10,30+i*12);
      c.globalAlpha=.8;c.fillStyle=hex;c.fillText(v,82,30+i*12);
    });
  }

  c.globalAlpha=1;s.tex.needsUpdate=true;
}

// ═══════════════════════════════════════════════════
// 時間システム
// ═══════════════════════════════════════════════════
let timeOfDay=600;

function lC(a,b,t){const ar=(a>>16)&0xff,ag=(a>>8)&0xff,ab=a&0xff,br=(b>>16)&0xff,bg=(b>>8)&0xff,bb=b&0xff;return(Math.round(ar+(br-ar)*t)<<16)|(Math.round(ag+(bg-ag)*t)<<8)|Math.round(ab+(bb-ab)*t)}

// Foresyの業務ステータス（日本語）
const getStatus=(m)=>{
  if(m<360) return 'ナイトシフト稼働中';
  if(m<540) return '早朝チーム始動中';
  if(m>=600&&m<=630) return 'Grove Meeting 開催中';
  if(m<720) return '全エージェント稼働中';
  if(m<780) return 'ランチ休憩中';
  if(m>=840&&m<=870) return 'スプリントレビュー中';
  if(m<1020) return '午後フォーカスタイム';
  if(m<1140) return '終業処理中';
  return 'ナイトシフト稼働中';
}

function updateTime(min){
  timeOfDay=min;
  if(onTimeUpdate)onTimeUpdate(min);
  if(onStatusUpdate)onStatusUpdate(getStatus(min));
  let df;
  if(min<360)df=0.3;else if(min<480)df=0.3+(min-360)/120*0.7;
  else if(min<1020)df=1;else if(min<1140)df=1-(min-1020)/120*0.7;else df=0.3;
  sun.intensity=.4+df*.7;ambient.intensity=.4+df*.3;
  scene.background=new THREE.Color(0x000E10);scene.fog.color=new THREE.Color(0x000E10);
  renderer.toneMappingExposure=.8+df*.5;
  if(min>960&&min<1080){sun.color=new THREE.Color(lC(0xFFF8F0,0xFFAA66,(min-960)/120))}
  else if(min>300&&min<420){sun.color=new THREE.Color(lC(0xFFF8F0,0xFFCC88,1-(min-300)/120))}
  else{sun.color=new THREE.Color(0xFFF8F0)}
  const nightF=1-df;
  agentData.forEach(a=>a.dGlow.intensity=.15+nightF*.3);
  updateMeeting(min);
}

updateTime(600);

// ═══════════════════════════════════════════════════
// サイバーパンク（ライトオフ）モード
// ═══════════════════════════════════════════════════
let cyberpunkMode=false;
const tubeLights=[];
const tubeMeshes=[];

for(let i=-2;i<=2;i++){
  const tube=new THREE.Mesh(new THREE.BoxGeometry(10,.04,.08),new THREE.MeshBasicMaterial({color:0x0A2A0A,transparent:true,opacity:0.3}));
  tube.position.set(i*4.5,3.92,0);office.add(tube);
  tubeMeshes.push(tube);
  const tl=new THREE.PointLight(0x0A2A0A,0,12,1.5);
  tl.position.set(i*4.5,3.85,0);office.add(tl);
  tubeLights.push(tl);
}

const screenLights=[];
agentData.forEach((ad,i)=>{
  const dp=desks[i];
  const sl=new THREE.PointLight(AGENTS[i].color,0,2,2);
  sl.position.set(dp.x,1.3,dp.z-.1);office.add(sl);
  screenLights.push(sl);
});

function toggleCyberpunk(){
  cyberpunkMode=!cyberpunkMode;
  if(cyberpunkMode){
    ambient.intensity=0.12;sun.intensity=0.08;renderer.toneMappingExposure=0.55;
    tubeLights.forEach(tl=>{tl.intensity=0.35;tl.color.set(0x0A2A0A)});
    tubeMeshes.forEach(tm=>{tm.material.color.set(0x114411);tm.material.opacity=0.7});
    agentData.forEach(a=>{a.dGlow.intensity=0.9;a.dGlow.distance=4.5});
    screenLights.forEach(sl=>{sl.intensity=0.5});
    fl.material.color.set(0x060C06);cp.material.color.set(0x080E08);ceil.material.opacity=0.65;
    office.children.forEach(c=>{
      if(c.isPointLight&&c.position.y>3.5&&c.position.y<3.95)c.intensity=0.03;
      if(c.isMesh&&c.material&&c.material.isMeshBasicMaterial&&c.position&&c.position.y>3.1&&c.position.y<3.15)c.material.color.set(0x112211);
      if(c.isPointLight&&c.position.y>3.0&&c.position.y<3.15){c.intensity=0.08;c.color.set(0x224422)}
    });
    rcLight.intensity=0.7;
  } else {
    updateTime(timeOfDay);
    fl.material.color.set(0xE8ECE8);cp.material.color.set(0xC8D8C8);ceil.material.opacity=0.45;
    tubeLights.forEach(tl=>{tl.intensity=0});
    tubeMeshes.forEach(tm=>{tm.material.color.set(0x0A2A0A);tm.material.opacity=0.3});
    screenLights.forEach(sl=>{sl.intensity=0});
    rcLight.intensity=0.4;
    office.children.forEach(c=>{
      if(c.isPointLight&&c.position.y>3.5&&c.position.y<3.95)c.intensity=0.25;
      if(c.isMesh&&c.material&&c.material.isMeshBasicMaterial&&c.position&&c.position.y>3.1&&c.position.y<3.15)c.material.color.set(0xFFF8E0);
      if(c.isPointLight&&c.position.y>3.0&&c.position.y<3.15){c.intensity=0.15;c.color.set(0xFFE8CC)}
    });
  }
}

// ═══════════════════════════════════════════════════
// 会話バブル（ウォータークーラー付近）
// ═══════════════════════════════════════════════════
const chatBubbles=[];
const chatPhrases=[
  '広告レビュー済み？','クライアント候補!','DM送った','LP直そう',
  '数値確認した？','ランチ行く？','タスク詰めすぎ','80/20で考えよう',
  'レポート完成！','GA4確認して','いいね！','リスクは？',
  'DM届いた?','CTR上がった','提案まとめた','次の会議は?',
];

function createBubble(x,y,z,text,color){
  const bc=document.createElement('canvas');bc.width=200;bc.height=48;
  const bx=bc.getContext('2d');
  bx.fillStyle='rgba(5,26,16,0.9)';
  const rr=(cx,cy,cw,ch,cr)=>{bx.beginPath();bx.moveTo(cx+cr,cy);bx.lineTo(cx+cw-cr,cy);bx.quadraticCurveTo(cx+cw,cy,cx+cw,cy+cr);bx.lineTo(cx+cw,cy+ch-cr);bx.quadraticCurveTo(cx+cw,cy+ch,cx+cw-cr,cy+ch);bx.lineTo(cx+cr,cy+ch);bx.quadraticCurveTo(cx,cy+ch,cx,cy+ch-cr);bx.lineTo(cx,cy+cr);bx.quadraticCurveTo(cx,cy,cx+cr,cy);bx.closePath();bx.fill()};
  rr(4,4,192,36,8);
  bx.strokeStyle=color;bx.lineWidth=1;rr(4,4,192,36,8);bx.stroke();
  bx.font='11px monospace';bx.fillStyle=color;bx.textAlign='center';
  bx.fillText(text,100,28);
  const btex=new THREE.CanvasTexture(bc);btex.minFilter=THREE.LinearFilter;
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:btex,transparent:true,depthTest:false}));
  sprite.scale.set(1.2,.3,1);sprite.position.set(x,y+.15,z);
  office.add(sprite);
  chatBubbles.push({sprite,life:3.0,startY:y+.15});
}

function checkConversations(){
  for(let i=0;i<agentData.length;i++){
    const a=agentData[i];
    if(!a.walker.visible)continue;
    for(let j=i+1;j<agentData.length;j++){
      const b=agentData[j];
      if(!b.walker.visible)continue;
      const dx=a.walker.position.x-b.walker.position.x;
      const dz=a.walker.position.z-b.walker.position.z;
      const dist=Math.sqrt(dx*dx+dz*dz);
      if(dist<1.5&&!a._chatCooldown&&!b._chatCooldown){
        const mx=(a.walker.position.x+b.walker.position.x)/2;
        const mz=(a.walker.position.z+b.walker.position.z)/2;
        const phrase=chatPhrases[Math.floor(Math.random()*chatPhrases.length)];
        createBubble(mx,1.4,mz,phrase,a.agent.hex);
        a._chatCooldown=8;b._chatCooldown=8;
      }
    }
    if(a._chatCooldown)a._chatCooldown-=0.016;
    if(a._chatCooldown<0)a._chatCooldown=0;
  }
}

function updateBubbles(delta){
  for(let i=chatBubbles.length-1;i>=0;i--){
    const b=chatBubbles[i];
    b.life-=delta;
    b.sprite.position.y=b.startY+(3-b.life)*.12;
    b.sprite.material.opacity=Math.max(0,b.life/3);
    if(b.life<=0){office.remove(b.sprite);b.sprite.material.dispose();chatBubbles.splice(i,1)}
  }
}

// ═══════════════════════════════════════════════════
// シフト変更（出退勤）
// ═══════════════════════════════════════════════════
let shiftState='working';
const arrivalOrder=[0,2,4,1,5,3];
const departOrder=[5,3,1,4,2,0];

function updateShift(minutes){
  if(minutes>=480&&minutes<=510&&shiftState!=='arriving'&&shiftState!=='working'){
    shiftState='arriving';
    arrivalOrder.forEach((idx,i)=>{
      const ad=agentData[idx];
      if(ad.state==='offsite'){
        setTimeout(()=>{
          ad.walker.visible=true;
          ad.walker.position.set(-12,0,8);
          ad.state='walking_back';
          ad.sittingChar.visible=false;
        },i*800);
      }
    });
  }
  if(minutes>510&&minutes<1080)shiftState='working';
  if(minutes>=1080&&minutes<=1110&&shiftState!=='leaving'){
    shiftState='leaving';
    departOrder.forEach((idx,i)=>{
      const ad=agentData[idx];
      setTimeout(()=>{
        if(ad.state==='sitting'){
          ad.sittingChar.visible=false;
          ad.walker.visible=true;
          ad.walker.position.copy(new THREE.Vector3(ad.home.x,0,ad.home.z));
          ad.walkTarget={x:-12,z:8};
          ad.state='leaving';
        }
      },i*800);
    });
  }
  if(minutes>1110||minutes<480){
    agentData.forEach((ad,i)=>{
      if(i===0)return;
      if(ad.state!=='offsite'){ad.sittingChar.visible=false;ad.walker.visible=false;ad.state='offsite'}
    });
    shiftState='night';
  }
  if(minutes>=480&&shiftState==='night'){
    shiftState='arriving';
    agentData.forEach(ad=>{ad.sittingChar.visible=true;ad.walker.visible=false;ad.state='sitting';ad.timer=4+rng.r(0,8)});
  }
}

// ═══════════════════════════════════════════════════
// メインアニメーションループ
// ═══════════════════════════════════════════════════
const clock=new THREE.Clock();
let lastMeetingState=false;

function animate(){
  requestAnimationFrame(animate);
  const delta=Math.min(clock.getDelta(),.05);
  const elapsed=clock.getElapsedTime();
  frame++;
  if(autoRot){sph.theta+=.0012;updCam()}
  screenData.forEach(drawScreen);
  updateWalkers(delta);
  checkConversations();updateBubbles(delta);
  updateShift(timeOfDay);

  // SCOUTのパルスリング
  const pulseT=(elapsed*.5)%1;
  pulseRing.scale.set(1+pulseT*.3,1,1+pulseT*.3);
  pulseRing.material.opacity=.15*(1-pulseT);
  ringMat.opacity=.12+Math.sin(elapsed*1.5)*.04;

  // パーティクルドリフト
  for(let i=0;i<pN;i++){
    pP[i*3]+=Math.sin(elapsed+i)*.0006;
    pP[i*3+1]+=Math.cos(elapsed*.4+i*.5)*.0003;
    if(pP[i*3+1]>3.6)pP[i*3+1]=.5;
  }
  pG.attributes.position.needsUpdate=true;

  // ラベルフローティング
  agentData.forEach((a,i)=>{if(a.state==='sitting')a.label.position.y=1.8+Math.sin(elapsed*1.1+i*1.3)*.03});
  stwLabel.position.y=1.8+Math.sin(elapsed*1.1+6)*.03;

  // 紙の漂い
  flyingPapers.forEach(fp=>{
    const p=fp.mesh;
    p.position.x+=fp.driftSpeedX*delta;p.position.z+=fp.driftSpeedZ*delta;
    p.position.y=fp.baseY+Math.sin(elapsed*fp.bobSpeed+fp.phase)*fp.bobAmp;
    p.rotation.x+=fp.tumbleSpeedX*delta;p.rotation.y+=fp.tumbleSpeedY*delta;
    p.rotation.z+=Math.sin(elapsed*fp.flutterSpeed+fp.phase)*fp.flutterAmp*delta;
    if(p.position.x>10)p.position.x=-10;if(p.position.x<-10)p.position.x=10;
    if(p.position.z>8)p.position.z=-7;if(p.position.z<-7)p.position.z=8;
  });

  drawClock(timeOfDay);
  renderer.render(scene,camera);
}
animate();

const onResize=()=>{
  camera.aspect=container.clientWidth/container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth,container.clientHeight);
};
window.addEventListener('resize',onResize);

return {
  setTime:(minutes)=>updateTime(minutes),
  toggleCyberpunk:()=>toggleCyberpunk(),
  isCyberpunk:()=>cyberpunkMode,
  destroy:()=>{
    window.removeEventListener('resize',onResize);
    renderer.dispose();
    if(container.contains(renderer.domElement))container.removeChild(renderer.domElement);
  }
};
}
