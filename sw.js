/* Caches app files only. User progress lives in localStorage, which a service worker never touches. */
var V='hub-v7',FILES=['./','index.html','app.js','i18n.js','space.js','data.js','data_mind.js','data_res.js','data_med.js','data_car.js','data_exm.js','data_lang.js','manifest.webmanifest','icon.svg'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(FILES.map(function(f){return c.add(f).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);if(u.origin!==location.origin)return;
e.respondWith(fetch(r).then(function(n){if(n&&n.ok){var cp=n.clone();caches.open(V).then(function(c){c.put(r,cp)})}return n}).catch(function(){return caches.match(r).then(function(m){return m||caches.match('index.html')})}))});
