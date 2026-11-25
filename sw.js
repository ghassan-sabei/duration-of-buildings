// يخلي التطبيق ينفتح بدون إنترنت (على ويندوز والمتصفح) ويجيب آخر نسخة لما يكون في نت
const C='dob-v1';
const F=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./fb.js'];
const X=['https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js','https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F).then(()=>Promise.all(X.map(u=>c.add(new Request(u,{mode:'cors'})).catch(()=>{}))))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('dob-')&&x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  // بس ملفات التطبيق ومكتبات PDF؛ السيرفر (Firebase) وفحص الإنترنت ما يمرّون من هنا
  if(e.request.method!=='GET') return;
  if(!(u.origin===self.location.origin||u.hostname==='cdnjs.cloudflare.com')) return;
  e.respondWith(fetch(e.request).then(r=>{ if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));} return r; })
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
});
