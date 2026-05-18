(function(W,D){'use strict';var _wSrc='const K=new Uint32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);function rotr(x,n){return(x>>>n)|(x<<(32-n))}function sha256(data){const msg=new Uint8Array(data);const len=msg.length;const bitLen=len*8;const padLen=((len+9)%64===0?len+9:len+9+(64-(len+9)%64));const padded=new Uint8Array(padLen);padded.set(msg);padded[len]=0x80;const dv=new DataView(padded.buffer);dv.setUint32(padLen-4,bitLen,false);let h0=0x6a09e667,h1=0xbb67ae85,h2=0x3c6ef372,h3=0xa54ff53a,h4=0x510e527f,h5=0x9b05688c,h6=0x1f83d9ab,h7=0x5be0cd19;const W=new Uint32Array(64);for(let i=0;i<padded.length;i+=64){for(let j=0;j<16;j++)W[j]=dv.getUint32(i+j*4,false);for(let j=16;j<64;j++){const s0=rotr(W[j-15],7)^rotr(W[j-15],18)^(W[j-15]>>>3);const s1=rotr(W[j-2],17)^rotr(W[j-2],19)^(W[j-2]>>>10);W[j]=(W[j-16]+s0+W[j-7]+s1)|0}let a=h0,b=h1,c=h2,d=h3,e=h4,f=h5,g=h6,h=h7;for(let j=0;j<64;j++){const S1=rotr(e,6)^rotr(e,11)^rotr(e,25);const ch=(e&f)^(~e&g);const t1=(h+S1+ch+K[j]+W[j])|0;const S0=rotr(a,2)^rotr(a,13)^rotr(a,22);const maj=(a&b)^(a&c)^(b&c);const t2=(S0+maj)|0;h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0}h0=(h0+a)|0;h1=(h1+b)|0;h2=(h2+c)|0;h3=(h3+d)|0;h4=(h4+e)|0;h5=(h5+f)|0;h6=(h6+g)|0;h7=(h7+h)|0}const out=new Uint8Array(32);const ov=new DataView(out.buffer);[h0,h1,h2,h3,h4,h5,h6,h7].forEach((v,i)=>ov.setUint32(i*4,v,false));return out}function leadingZeroBits(hash){let c=0;for(let i=0;i<hash.length;i++){if(hash[i]===0)c+=8;else{let b=hash[i];while(!(b&0x80)){c++;b<<=1;}break;}}return c}self.onmessage=function(e){const{challengeHex,difficulty}=e.data;const chal=new Uint8Array(32);for(let i=0;i<16;i++)chal[i]=parseInt(challengeHex.substr(i*2,2),16);const buf=new Uint8Array(40);buf.set(chal,0);const view=new DataView(buf.buffer);const t0=Date.now();let nonce=0;while(nonce<0x100000000){view.setUint32(32,nonce>>>0,true);view.setUint32(36,0,true);const hash=sha256(buf);if(leadingZeroBits(hash)>=difficulty){self.postMessage({type:"done",nonce,hashes:nonce+1,elapsed:Date.now()-t0});return;}nonce++;if((nonce&8191)===0){const pct=Math.min(99,nonce/Math.pow(2,difficulty)*100);self.postMessage({type:"progress",nonce,pct});}}self.postMessage({type:"error",msg:"Nonce exhausted"});};';
function _mkWorker(){var b=new Blob([_wSrc],{type:'application/javascript'});return new Worker(URL.createObjectURL(b));}
function _pow(hex,diff,onPct){return new Promise(function(ok,fail){var w=_mkWorker();w.onmessage=function(e){var d=e.data;if(d.type==='progress'){if(onPct)onPct(d.pct);}else if(d.type==='done'){w.terminate();ok(d.nonce);}else if(d.type==='error'){w.terminate();fail(new Error(d.msg));}};w.onerror=function(e){w.terminate();fail(e);};w.postMessage({challengeHex:hex,difficulty:diff});});}
function _fp(){var gl,ext,r='';try{gl=D.createElement('canvas').getContext('webgl')||D.createElement('canvas').getContext('experimental-webgl');if(gl){ext=gl.getExtension('WEBGL_debug_renderer_info');r=ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);}}catch(e){}var trip=false;try{var st=new Error().stack||'';trip=st.indexOf('puppeteer')>-1||st.indexOf('playwright')>-1||st.indexOf('selenium')>-1;}catch(e){}return{webglrenderer:r,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,hardwareconcurrency:navigator.hardwareConcurrency||0,innerw:W.innerWidth,innerh:W.innerHeight,availw:screen.availWidth,availh:screen.availHeight,devicememory:navigator.deviceMemory||0,webdriver:!!navigator.webdriver,ischromeruntimemissing:typeof W.chrome!=='undefined'&&typeof W.chrome.runtime==='undefined',errorstacktripwire:trip};}
function _traj(){var pts=[],t0=Date.now();function ev(e){var cs=(e.getCoalescedEvents?e.getCoalescedEvents():null)||[e];for(var i=0;i<cs.length;i++)pts.push([Math.round(cs[i].clientX),Math.round(cs[i].clientY),Date.now()-t0]);}D.addEventListener('pointermove',ev);return{stop:function(){D.removeEventListener('pointermove',ev);return pts.slice();}};}
function _post(base,path,body){return fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(r){var tok=r.headers.get('x-captcha-token');return r.json().then(function(d){return{ok:r.ok,status:r.status,data:d,token:tok};}).catch(function(){return{ok:r.ok,status:r.status,data:{},token:tok};});});}
function _get(base,path){return fetch(base+path).then(function(r){var tok=r.headers.get('x-captcha-token');return r.json().then(function(d){return{ok:r.ok,status:r.status,data:d,token:tok};}).catch(function(){return{ok:r.ok,status:r.status,data:{},token:tok};});});}
var _css='.captxa{font-family:system-ui,sans-serif;display:inline-block;min-width:200px}.captxa-msg{font-size:.875rem;min-height:1.4em;padding:.3rem 0;color:#555}.captxa-msg.captxa-ok{color:#437a22}.captxa-msg.captxa-err{color:#a12c7b}.captxa-track{display:none;height:4px;background:#e5e7eb;border-radius:9999px;overflow:hidden;margin:.4rem 0}.captxa-bar{height:100%;width:0;background:#01696f;transition:width .25s}.captxa-pz{display:none;margin-top:.5rem}.captxa-hint{font-size:.8rem;color:#666;margin-bottom:.4rem;user-select:none}.captxa-cv{display:block;border-radius:.5rem;cursor:grab;touch-action:none;user-select:none;max-width:100%}.captxa-cv.drag{cursor:grabbing}.captxa-ok{margin-top:.6rem;padding:.45rem 1.2rem;background:#01696f;color:#fff;border:none;border-radius:.5rem;font-size:.875rem;cursor:pointer;transition:background .18s}.captxa-ok:disabled{background:#9ca3af;cursor:not-allowed}.captxa-ok:not(:disabled):hover{background:#0c4e54}';
var _cssOk=false;
function _cssInject(){if(_cssOk)return;_cssOk=true;var s=D.createElement('style');s.textContent=_css;D.head.appendChild(s);}
function _widget(el,opts,done,fail){
var base=opts.serverUrl.replace(/\/+$/,'');
el.innerHTML='<div class="captxa"><div class="captxa-msg"></div><div class="captxa-track"><div class="captxa-bar"></div></div><div class="captxa-pz"><p class="captxa-hint">Drag the piece to fill the gap</p><canvas class="captxa-cv"></canvas><button class="captxa-ok" disabled>Verify</button></div></div>';
var root=el.firstElementChild,msg=root.querySelector('.captxa-msg'),track=root.querySelector('.captxa-track'),bar=root.querySelector('.captxa-bar'),pzEl=root.querySelector('.captxa-pz'),cv=root.querySelector('.captxa-cv'),btn=root.querySelector('.captxa-ok');
function sm(t,c){msg.textContent=t;msg.className='captxa-msg captxa-'+c;}
function sb(p){bar.style.width=p+'%';}
function ne(m){return new Error(m);}
runSimple();
function runSimple(){
sm('Verifying\u2026','info');track.style.display='block';
var rec=_traj();
_post(base,'/challenge/simp',_fp()).then(function(r){
if(!r.ok){rec.stop();if(r.data&&r.data.error==='Do_complex_captcha'){track.style.display='none';runComplex();return;}track.style.display='none';sm('Verification failed','err');if(fail)fail(ne(r.data&&r.data.error||'Challenge failed'));return;}
var ct=r.data.challenge_token,hex=r.data.pow_challenge,diff=r.data.pow_difficulty;
_pow(hex,diff,sb).then(function(nonce){
sb(100);
_post(base,'/solve/simp',{challenge_token:ct,pow_solution:nonce,trajectory:rec.stop()}).then(function(s){
track.style.display='none';
if(s.ok&&s.token){sm('\u2713 Verified','ok');done(s.token);}
else{sm('Verification failed','err');if(fail)fail(ne(s.data&&s.data.error||'Solve failed'));}
}).catch(function(e){track.style.display='none';sm('Network error','err');if(fail)fail(e);});
}).catch(function(e){rec.stop();track.style.display='none';sm('Error','err');if(fail)fail(e);});
}).catch(function(e){rec.stop();track.style.display='none';sm('Network error','err');if(fail)fail(e);});
}
function runComplex(){
sm('Extra verification required\u2026','info');track.style.display='block';
_get(base,'/challenge/complex').then(function(r){
if(!r.ok){track.style.display='none';sm('Verification failed','err');if(fail)fail(ne(r.data&&r.data.error||'Challenge failed'));return;}
var ct=r.data.challenge_token,hex=r.data.pow_challenge,diff=r.data.pow_difficulty,pz=r.data.puzzle;
var powNonce=null,powDone=false;
_pow(hex,diff,sb).then(function(n){powNonce=n;powDone=true;chkRdy();}).catch(function(e){sm('Error','err');if(fail)fail(e);});
pzEl.style.display='block';
var pW=pz.width||400,pH=pz.height||300,pSz=pz.piece_size||pz.pieceSize||80;
var px=pz.piece_start_x||0,py=pz.piece_y||pz.piece_start_y||0;
cv.width=pW;cv.height=pH;
var sc=Math.min(1,440/pW);cv.style.width=Math.round(pW*sc)+'px';cv.style.height=Math.round(pH*sc)+'px';
var bgI=new Image(),pcI=new Image(),bgL=false,pcL=false,drag=false,dox=0,doy=0,traj=[],placed=false;
function mime(b){return b.startsWith('/9j/')?'image/jpeg':'image/png';}
function draw(){if(!bgL||!pcL)return;var ctx=cv.getContext('2d');ctx.clearRect(0,0,pW,pH);ctx.drawImage(bgI,0,0);ctx.drawImage(pcI,px,py);}
bgI.onload=function(){bgL=true;draw();};pcI.onload=function(){pcL=true;draw();};
bgI.src='data:'+mime(pz.background)+';base64,'+pz.background;
pcI.src='data:'+mime(pz.piece)+';base64,'+pz.piece;
function gc(e){var rr=cv.getBoundingClientRect();return{x:(e.clientX-rr.left)*(pW/rr.width),y:(e.clientY-rr.top)*(pH/rr.height)};}
function chkRdy(){btn.disabled=!(powDone&&placed);}
cv.addEventListener('pointerdown',function(e){
e.preventDefault();
var c=gc(e);
drag=true;dox=c.x-px;doy=c.y-py;
traj=[[px,py,e.timeStamp]];
cv.classList.add('drag');
if(cv.setPointerCapture)cv.setPointerCapture(e.pointerId);
});
cv.addEventListener('pointermove',function(e){
if(!drag)return;e.preventDefault();
var evs=(e.getCoalescedEvents?e.getCoalescedEvents():null)||[e];
for(var i=0;i<evs.length;i++){
var c=gc(evs[i]),t=evs[i].timeStamp;
var npx=Math.round(Math.max(0,Math.min(pW-pSz,c.x-dox)));
var npy=Math.round(Math.max(0,Math.min(pH-pSz,c.y-doy)));
if(traj.length>0){
var l=traj[traj.length-1],ddx=npx-l[0],ddy=npy-l[1],dt=t-l[2];
var steps=Math.max(Math.hypot(ddx,ddy)>0?Math.ceil(Math.hypot(ddx,ddy)/4):0,dt>0?Math.floor(dt/16):0);
for(var s=1;s<steps;s++){var rr=s/steps;traj.push([Math.round(l[0]+ddx*rr),Math.round(l[1]+ddy*rr),l[2]+dt*rr]);}
}
px=npx;py=npy;
traj.push([px,py,t]);
}
draw();chkRdy();
});
function onEnd(e){
if(!drag)return;drag=false;cv.classList.remove('drag');
if(cv.releasePointerCapture&&e.pointerId!=null)cv.releasePointerCapture(e.pointerId);
traj.push([px,py,e.timeStamp]);
placed=px>0;chkRdy();
}
cv.addEventListener('pointerup',onEnd);cv.addEventListener('pointercancel',onEnd);
btn.addEventListener('click',function(){
btn.disabled=true;sm('Verifying puzzle\u2026','info');
function ensureMin(raw,min){
if(raw.length>=min||raw.length<2)return raw;
var res=[],segs=raw.length-1,sps=Math.ceil(min/segs)+1;
for(var i=0;i<segs;i++){
var x1=raw[i][0],y1=raw[i][1],t1=raw[i][2],x2=raw[i+1][0],y2=raw[i+1][1],t2=raw[i+1][2];
res.push([x1,y1,t1]);
for(var s=1;s<sps;s++){var rv=s/sps;res.push([Math.round(x1+(x2-x1)*rv),Math.round(y1+(y2-y1)*rv),t1+(t2-t1)*rv]);}
}
res.push(raw[raw.length-1]);return res;
}
var rt=ensureMin(traj,65);
if(rt.length>0){var t0=rt[0][2];rt=rt.map(function(p){return[p[0],p[1],Math.round(p[2]-t0)];});}
_post(base,'/solve/complex',{challenge_token:ct,pow_solution:powNonce,puzzle_x:px,puzzle_y:py,trajectory:rt}).then(function(s){
track.style.display='none';
if(s.ok&&s.token){pzEl.style.display='none';sm('\u2713 Verified','ok');done(s.token);}
else{sm('Puzzle failed. Try again.','err');btn.disabled=false;if(fail)fail(ne(s.data&&s.data.error||'Puzzle failed'));}
}).catch(function(e){track.style.display='none';sm('Network error','err');btn.disabled=false;if(fail)fail(e);});
});
}).catch(function(e){track.style.display='none';sm('Network error','err');if(fail)fail(e);});
}
}
function _injectToken(opts,token){
if(!opts.form)return;
var f=typeof opts.form==='string'?D.querySelector(opts.form):opts.form;
if(!f)return;
var n=opts.tokenFieldName||'captcha_token';
var h=f.querySelector('input[name="'+n+'"]');
if(!h){h=D.createElement('input');h.type='hidden';h.name=n;f.appendChild(h);}
h.value=token;
}
W.Captxa={
render:function(id,opts){
_cssInject();
var el=typeof id==='string'?D.getElementById(id):id;
if(!el)throw new Error('Captxa: container not found');
if(!opts||!opts.serverUrl)throw new Error('Captxa: serverUrl required');
_widget(el,opts,function(token){_injectToken(opts,token);if(opts.onVerify)opts.onVerify(token);},opts.onError||null);
}
};
})(window,document);
