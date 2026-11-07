const CACHE='numora-cache-v30';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(CORE);await self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('numora-cache-')&&k!==CACHE)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
if(r.mode==='navigate'||u.pathname.endsWith('/index.html')){e.respondWith((async()=>{try{const fresh=await fetch(r,{cache:'no-store'});if(fresh.ok){const c=await caches.open(CACHE);await c.put('./index.html',fresh.clone())}return fresh}catch{const c=await caches.open(CACHE);return await c.match('./index.html')||new Response('Offline copy not ready',{status:503})}})());return}
e.respondWith((async()=>{const c=await caches.open(CACHE),hit=await c.match(r);if(hit)return hit;try{const x=await fetch(r);if(x.ok)await c.put(r,x.clone());return x}catch{return new Response('',{status:504})}})())
});