/* Flounder Dash — original procedural artwork, zero dependencies. */
'use strict';
const $ = id => document.getElementById(id);
const canvas = $('sea'), ctx = canvas.getContext('2d');
let W=1000,H=600,clock=0,last=0,mode='menu',objects=[],particles=[],lane=1,visualLane=1;
let distance=0,pearls=0,speed=18,spawn=0,action='',actionTime=0,shield=0,invincible=0,best=0,sound=false,audio;
try { best=Number(localStorage.getItem('flounder-best'))||0; } catch (_) {}
$('best').innerHTML=best+' <i>m</i>';
function resize(){const r=canvas.getBoundingClientRect();W=r.width;H=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=W*d;canvas.height=H*d;ctx.setTransform(d,0,0,d,0,0);}
new ResizeObserver(resize).observe(canvas);
function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,Math.PI*2);ctx.fill();}
function path(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fill();}
function line(points,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();}
function project(l,z){const p=Math.max(0,1-z/120);const scale=.08+.92*p*p;return{x:W/2+(l-1)*W*.245*scale,y:H*.28+H*.57*p*p,s:scale};}
function tone(freq=600,duration=.08){if(!sound)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(freq*.55,audio.currentTime+duration);g.gain.setValueAtTime(.07,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration);}catch(_){}}
function fish(x,y,s){ctx.save();ctx.translate(x,y);ctx.rotate((lane-visualLane)*.13);ctx.scale(s,s);const flap=Math.sin(clock*10)*6;
path([[-24,14],[-53,28+flap],[-48,0],[-24,-4]],'#d89048');
path([[-15,-19],[4,-38-flap/3],[25,-24]],'#f3bb65');path([[-10,20],[9,35+flap/3],[29,18]],'#e2a252');
ellipse(0,0,42,26,'#f0bd6c');ellipse(4,-4,34,20,'#f6cf86');
for(let i=0;i<8;i++){const a=i*2.4;ellipse(Math.cos(a)*25-5,Math.sin(a)*14,3,2,'#d6954d');}
ellipse(23,-11,9,9,'#fff8dd');ellipse(35,-2,8,8,'#fff8dd');ellipse(26,-11,4,5,'#143f48');ellipse(38,-2,3.5,4.5,'#143f48');ellipse(27,-13,1.4,1.5,'white');line([[24,13],[31,15],[37,11]],'#905a36',2);ctx.restore();}
function plant(x,y,s,color,seed){ctx.strokeStyle=color;ctx.lineWidth=8*s;ctx.lineCap='round';for(let j=0;j<4;j++){ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x+Math.sin(seed+j)*30*s,y-35*s,x+(j-1.5)*24*s+Math.sin(clock+seed)*6*s,y-55*s,x+(j-1.5)*23*s,y-(60+j%2*35)*s);ctx.stroke();}}
function background(){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#087e92');g.addColorStop(.5,'#087580');g.addColorStop(1,'#064657');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
for(let i=0;i<5;i++)path([[W*(i*.25-.2),0],[W*(i*.25-.12),0],[W*(i*.25+.28),H],[W*(i*.25+.02),H]],'#a4f9bd08');
ellipse(W*.5,H*.3,W*.35,H*.14,'#3ba29a25');
path([[W*.4,H*.3],[W*.6,H*.3],[W*1.15,H],[W*-.15,H]],'#57a49924');
for(let l of [.5,1.5]){const a=project(l,120),b=project(l,-25);line([[a.x,a.y],[b.x,b.y]],'#a5d4a320',2);}
for(let i=0;i<16;i++){const z=(i*9+(120-(distance*1.8)%9))%144;const p=project(0,z);ellipse(W/2+(Math.sin(i*43)*W*.6)*p.s,p.y,3*p.s,1.2*p.s,'#b4d4a653');}
for(let i=0;i<22;i++){const x=(Math.sin(i*127)*.5+.5)*W,y=H-((clock*(8+i%4*4)+i*67)%(H+30));ctx.strokeStyle='#d3fff330';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x+Math.sin(clock+i)*8,y,2+i%4,0,Math.PI*2);ctx.stroke();}
for(let side of [-1,1])for(let i=0;i<7;i++){const z=((i*21-distance*1.8)%145+145)%145,p=project(1+side*1.85,z);plant(p.x,p.y+30*p.s,p.s*(.8+i%2*.3),i%2?'#156d69':'#318c7b',i);ellipse(p.x,p.y+28*p.s,35*p.s,14*p.s,'#164f5b');}
for(let i=0;i<7;i++){let x=((i*173+clock*(8+i))%(W+100))-50,y=H*(.14+.035*(i%4));ellipse(x,y,8,3,'#05526466');path([[x-6,y],[x-14,y-5],[x-14,y+5]],'#05526466');}}
function drawObject(o){const p=project(o.lane,o.z),s=p.s*Math.min(W/900,1.15),x=p.x,y=p.y;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
if(o.type==='pearl'){ellipse(0,-25,12,12,'#ffeeba33');ellipse(0,-25,8,8,'#ffefc5');ellipse(-2,-28,3,3,'#fffdf2');}
if(o.type==='shield'){ellipse(0,-28,24,24,'#92f4f63b');ctx.strokeStyle='#b7ffef';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-28,23,0,7);ctx.stroke();ctx.fillStyle='#d4ffdd';ctx.font='22px Arial';ctx.textAlign='center';ctx.fillText('✦',0,-20);}
if(o.type==='coral'){ellipse(0,8,43,13,'#103f4c66');plant(0,0,.9,'#eb967e',o.lane);plant(7,0,.55,'#ffc09d',2);}
if(o.type==='log'){ellipse(0,10,53,12,'#103f4c66');ctx.fillStyle='#9e7854';ctx.fillRect(-46,-27,92,30);ellipse(-46,-12,10,15,'#bc9567');ellipse(46,-12,10,15,'#d6b47c');line([[-37,-17],[30,-17]],'#735a45',3);line([[-31,-6],[20,-6]],'#c49d6e',2);}
if(o.type==='jelly'){for(let i=-2;i<=2;i++){let a=Math.sin(clock*5+i)*8;line([[i*12,-51],[i*12+a,-27],[i*12,-7]],'#e4b1db',3);}ellipse(0,-65,36,28,'#c997d9');ellipse(-10,-72,15,9,'#ecc5eb');ellipse(-10,-56,3,4,'#563e75');ellipse(10,-56,3,4,'#563e75');}
ctx.restore();}
function burst(x,y,color){for(let i=0;i<12;i++)particles.push({x,y,vx:(Math.random()-.5)*190,vy:(Math.random()-.5)*190,t:.6,color});}
function updateHud(){$('distance').innerHTML=Math.floor(distance)+' <i>m</i>';$('pearls').textContent=pearls;$('speed').textContent=Math.round(speed*3)+'% CURRENT';$('zone').textContent=distance>900?'THE TWILIGHT REEF':distance>400?'CORAL CANYON':'SUNLIT SHALLOWS';$('power').textContent=shield>0?'BUBBLE SHIELD · '+Math.ceil(shield)+'s':'';}
function start(){distance=0;pearls=0;speed=18;objects=[];particles=[];spawn=1;lane=visualLane=1;action='';actionTime=shield=invincible=0;mode='playing';$('overlay').classList.add('hidden');$('pause').textContent='Ⅱ';$('pause').setAttribute('aria-label','Pause game');updateHud();tone(500);}
function finish(){mode='over';best=Math.max(best,Math.floor(distance));try{localStorage.setItem('flounder-best',best);}catch(_){}$('best').innerHTML=best+' <i>m</i>';show('A GOOD DAY TO BE A FISH','One more <em>swim?</em>',Math.floor(distance)+' meters explored · '+pearls+' pearls collected<br>Personal best: '+best+' meters','Swim again →');tone(130,.3);}
function show(label,title,message,button){$('label').textContent=label;$('title').innerHTML=title;$('message').innerHTML=message;$('start').textContent=button;$('overlay').classList.remove('hidden');}
function pause(){if(mode==='playing'){mode='paused';show('TAKE A BREATHER','Just <em>floating.</em>','Your reef adventure is right where you left it.','Keep swimming →');$('pause').textContent='▶';$('pause').setAttribute('aria-label','Resume game');}else if(mode==='paused'){mode='playing';$('overlay').classList.add('hidden');$('pause').textContent='Ⅱ';$('pause').setAttribute('aria-label','Pause game');}}
function input(a){if(mode!=='playing')return;if(a==='left')lane=Math.max(0,lane-1);if(a==='right')lane=Math.min(2,lane+1);if((a==='jump'||a==='dive')&&actionTime<=0){action=a;actionTime=.95;tone(a==='jump'?350:200,.12);}}
function row(){const blocked=Math.floor(Math.random()*3),type=['coral','log','jelly'][Math.floor(Math.random()*3)];objects.push({lane:blocked,z:120,type,hit:false});let free=(blocked+1+Math.floor(Math.random()*2))%3;for(let i=0;i<4;i++)objects.push({lane:free,z:120+i*6,type:'pearl',hit:false});if(Math.random()<.16)objects.push({lane:(blocked+2)%3,z:145,type:'shield',hit:false});}
function update(dt){distance+=speed*dt;speed=Math.min(36,18+distance/100);spawn-=dt;if(spawn<=0){row();spawn=1.55;}shield=Math.max(0,shield-dt);invincible=Math.max(0,invincible-dt);actionTime=Math.max(0,actionTime-dt);if(!actionTime)action='';visualLane+=(lane-visualLane)*Math.min(1,dt*15);
for(const o of objects){let previous=o.z;o.z-=speed*2*dt;if(!o.hit&&previous>2&&o.z<=2){o.hit=true;if(Math.abs(visualLane-o.lane)<.42){const p=project(o.lane,0);if(o.type==='pearl'){pearls++;burst(p.x,p.y-25,'#fff0be');tone(750+pearls%5*90);}else if(o.type==='shield'){shield=10;burst(p.x,p.y-25,'#b0fff6');tone(1000,.2);}else{const avoids=(o.type==='log'&&action==='jump'&&actionTime>.12&&actionTime<.88)||(o.type==='jelly'&&action==='dive');if(!avoids&&invincible<=0){if(shield>0){shield=0;invincible=1.4;burst(p.x,p.y-25,'#b0fff6');tone(230);}else{finish();break;}}}}}}
objects=objects.filter(o=>o.z>-15);updateHud();}
function frame(now){const dt=Math.min(.035,(now-last)/1000||.016);last=now;if(mode!=='paused')clock+=dt;if(mode==='playing')update(dt);background();
objects.filter(o=>!o.hit).sort((a,b)=>b.z-a.z).forEach(drawObject);
const p=project(visualLane,0),jump=action==='jump'?Math.sin(actionTime/.95*Math.PI)*H*.19:0,dive=action==='dive';ellipse(p.x,p.y+16,43*Math.min(W/900,1),9,'#002f4944');const fs=Math.min(W/750,.95)*(dive?.65:1);const fy=p.y-27-jump+(dive?22:Math.sin(clock*4)*3);
if(shield>0){ellipse(p.x,fy,62*fs,49*fs,'#b6ffee22');ctx.strokeStyle='#b6ffee';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(p.x,fy,62*fs,49*fs,0,0,7);ctx.stroke();}
ctx.globalAlpha=invincible>0&&Math.sin(clock*30)>0?.4:1;fish(p.x,fy,fs);ctx.globalAlpha=1;
for(const q of particles){if(mode!=='paused'){q.t-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;}ctx.globalAlpha=Math.max(0,q.t/.6);ellipse(q.x,q.y,3,3,q.color);}ctx.globalAlpha=1;particles=particles.filter(q=>q.t>0);requestAnimationFrame(frame);}
$('start').onclick=()=>mode==='paused'?pause():start();$('pause').onclick=pause;$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'Sound on':'Sound off';$('sound').setAttribute('aria-label',sound?'Disable sound':'Enable sound');tone();};
document.addEventListener('keydown',e=>{if(e.target instanceof HTMLButtonElement&&(e.code==='Space'||e.code==='Enter'))return;const a={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',Space:'jump',ArrowDown:'dive',KeyS:'dive'}[e.code];if(a){e.preventDefault();if(!e.repeat)input(a);}if(e.code==='KeyP'||e.code==='Escape'){e.preventDefault();pause();}if(e.code==='Enter'&&mode!=='playing'){mode==='paused'?pause():start();}});
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();input(b.dataset.action);}));
let touch=null;canvas.addEventListener('pointerdown',e=>{touch={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointerup',e=>{if(!touch)return;const dx=e.clientX-touch.x,dy=e.clientY-touch.y;if(Math.max(Math.abs(dx),Math.abs(dy))>20)input(Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'dive':'jump');touch=null;});canvas.addEventListener('pointercancel',()=>touch=null);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='playing')pause();});resize();requestAnimationFrame(frame);
