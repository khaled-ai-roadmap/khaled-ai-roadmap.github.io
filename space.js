(function(){
var K='learnhub.ws',WS;
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function uid(){return 'x'+Math.random().toString(36).slice(2,9)}
function load(){try{WS=JSON.parse(localStorage.getItem(K)||'null')}catch(e){}if(!WS)WS={pages:[],cur:null};}
function save(){try{localStorage.setItem(K,JSON.stringify(WS))}catch(e){}}
var TPL={
 log:{t:'سجل المذاكرة',e:'📚',type:'db',cols:[{id:'a',n:'الموضوع',ty:'text'},{id:'b',n:'التاريخ',ty:'date'},{id:'c',n:'الساعات',ty:'number'},{id:'d',n:'الحالة',ty:'select',o:['لسه','شغال','خلص']},{id:'e',n:'تمّت',ty:'check'}]},
 plan:{t:'مخطط الأسبوع',e:'🗓️',type:'db',cols:[{id:'a',n:'المهمة',ty:'text'},{id:'b',n:'اليوم',ty:'date'},{id:'c',n:'الأولوية',ty:'select',o:['عالية','متوسطة','منخفضة']},{id:'d',n:'تمّت',ty:'check'}]},
 goals:{t:'أهدافي',e:'🎯',type:'db',cols:[{id:'a',n:'الهدف',ty:'text'},{id:'b',n:'الموعد',ty:'date'},{id:'c',n:'الحالة',ty:'select',o:['فكرة','شغال','تحقق']},{id:'d',n:'ملاحظات',ty:'text'}]},
 proj:{t:'مشاريعي',e:'🚀',type:'db',cols:[{id:'a',n:'المشروع',ty:'text'},{id:'b',n:'التسليم',ty:'date'},{id:'c',n:'الحالة',ty:'select',o:['فكرة','شغال','خلص']},{id:'d',n:'رابط',ty:'text'}]},
 note:{t:'صفحة جديدة',e:'📝',type:'doc'}
};
function mkPage(k){var t=TPL[k],p={id:uid(),t:t.t,e:t.e,type:t.type,tags:[],view:'table'};if(t.type==='db'){p.cols=t.cols.map(function(c){return Object.assign({},c)});p.rows=[]}else p.blocks=[{id:uid(),k:'p',t:'',d:0}];return p}
function curPage(){return WS.pages.filter(function(p){return p.id===WS.cur})[0]}
var R;
function render(){load();var h='<a class="back" href="#/">← المهارات</a><h2>🗂️ مساحتي</h2><p class="sub">صفحات وجداول وملاحظات ومتابعة. بتتحفظ في متصفحك بس، ومعاها تصدير ونسخ. المزامنة بين الأجهزة جاية لاحقا.</p>';
 var p=curPage();
 if(!p){h+='<section class="card"><h3>ابدأ من قالب</h3><div class="hsel">'+Object.keys(TPL).map(function(k){return '<button class="chip" data-new="'+k+'">'+TPL[k].e+' '+TPL[k].t+'</button>'}).join('')+'</div></section>';
  h+=WS.pages.length?'<h3>صفحاتك</h3>'+WS.pages.map(function(q){return '<section class="card ws-card"><a href="#/space" data-open="'+q.id+'"><b>'+q.e+' '+esc(q.t)+'</b></a> <span class="meta">'+(q.type==='db'?q.rows.length+' صف':'ملاحظة')+'</span></section>'}).join(''):'<div class="note">لسه مفيش صفحات. اختار قالب.</div>';
  h+='<p><button class="btn" id="wsx">تصدير JSON</button> <button class="btn" id="wsi">استيراد</button></p><p class="fine">النسخة الأولى: بتشتغل بدون إنترنت. مفيهاش تعاون لحظي أو formulas أو relations زي Notion الحقيقي.</p>'}
 else{h+='<p><button class="btn" id="wsb">← كل الصفحات</button> <button class="btn" id="wsd">احذف الصفحة</button></p><section class="card ws-card"><input class="wsT" id="wst" value="'+esc(p.e+' '+p.t)+'" aria-label="عنوان"/>';
  h+='<div class="hsel">'+(p.tags||[]).map(function(t,i){return '<button class="chip on" data-tg="'+i+'">#'+esc(t)+' ✕</button>'}).join('')+'<button class="chip" id="wstag">+ تاج</button></div>';
  if(p.type==='doc')h+=docHtml(p);else h+=dbHtml(p);h+='</section>'}
 R.innerHTML=h;bind(p)}
function docHtml(p){var h='';p.blocks.forEach(function(b){h+='<div class="wsb'+(b.k==='todo'&&b.d?' dn':'')+'">'+(b.k==='todo'?'<button class="ck" data-bt="'+b.id+'"><span>'+(b.d?'✓':'')+'</span></button>':'')+'<textarea class="wsx '+b.k+'" data-bx="'+b.id+'" rows="1" placeholder="'+(b.k==='h'?'عنوان':'اكتب هنا')+'">'+esc(b.t)+'</textarea><button class="hx" data-bd="'+b.id+'">✕</button></div>'});
 return h+'<div class="hsel"><button class="chip" data-ba="p">+ نص</button><button class="chip" data-ba="h">+ عنوان</button><button class="chip" data-ba="todo">+ قايمة مهام</button></div>'}
function selCol(p,ty){return p.cols.filter(function(c){return c.ty===ty})[0]}
function cell(p,r,c){var v=r.v[c.id];
 if(c.ty==='check')return '<input type="checkbox" data-c="'+r.id+'|'+c.id+'"'+(v?' checked':'')+'>';
 if(c.ty==='select')return '<select data-c="'+r.id+'|'+c.id+'"><option value="">-</option>'+c.o.map(function(o){return '<option'+(v===o?' selected':'')+'>'+esc(o)+'</option>'}).join('')+'</select>';
 return '<input data-c="'+r.id+'|'+c.id+'" type="'+(c.ty==='number'?'number':c.ty==='date'?'date':'text')+'" value="'+esc(v)+'">'}
function dbHtml(p){var h='<div class="hsel">'+[['table','جدول'],['list','قايمة'],['board','لوحة'],['cal','تقويم']].map(function(v){return '<button class="chip'+(p.view===v[0]?' on':'')+'" data-v="'+v[0]+'">'+v[1]+'</button>'}).join('')+'</div>';
 if(p.view==='table'){h+='<div class="hgrid"><table class="wst"><tr>'+p.cols.map(function(c){return '<th>'+esc(c.n)+'</th>'}).join('')+'<th></th></tr>'+p.rows.map(function(r){return '<tr>'+p.cols.map(function(c){return '<td>'+cell(p,r,c)+'</td>'}).join('')+'<td><button class="hx" data-rd="'+r.id+'">✕</button></td></tr>'}).join('')+'</table></div>'}
 else if(p.view==='list'){h+=p.rows.map(function(r){var ck=selCol(p,'check');return '<div class="peek">'+(ck?cell(p,r,ck)+' ':'')+esc(r.v[p.cols[0].id]||'(بدون عنوان)')+'</div>'}).join('')||'<div class="note">مفيش صفوف.</div>'}
 else if(p.view==='board'){var s=selCol(p,'select');if(!s)h+='<div class="note">اللوحة محتاجة عمود اختيار.</div>';else h+='<div class="wsboard">'+s.o.concat(['']).map(function(o){return '<div class="wscol"><b>'+(o||'بدون حالة')+'</b>'+p.rows.filter(function(r){return (r.v[s.id]||'')===o}).map(function(r){return '<div class="wscd">'+esc(r.v[p.cols[0].id]||'(بدون عنوان)')+'<div>'+cell(p,r,s)+'</div></div>'}).join('')+'</div>'}).join('')+'</div>'}
 else{var d=selCol(p,'date');if(!d)h+='<div class="note">التقويم محتاج عمود تاريخ.</div>';else{var g={};p.rows.forEach(function(r){var k=r.v[d.id]||'بدون تاريخ';(g[k]=g[k]||[]).push(r)});h+=Object.keys(g).sort().map(function(k){return '<div class="peek"><b>'+esc(k)+'</b>'+g[k].map(function(r){return '<div>• '+esc(r.v[p.cols[0].id]||'(بدون عنوان)')+'</div>'}).join('')+'</div>'}).join('')||'<div class="note">مفيش صفوف.</div>'}}
 return h+'<p><button class="btn pri" id="wsr">+ صف جديد</button></p>'}
function bind(p){
 R.querySelectorAll('[data-new]').forEach(function(b){b.onclick=function(){var q=mkPage(b.getAttribute('data-new'));WS.pages.push(q);WS.cur=q.id;save();render()}});
 R.querySelectorAll('[data-open]').forEach(function(b){b.onclick=function(e){e.preventDefault();WS.cur=b.getAttribute('data-open');save();render()}});
 var x=R.querySelector('#wsb');if(x)x.onclick=function(){WS.cur=null;save();render()};
 x=R.querySelector('#wsd');if(x)x.onclick=function(){if(confirm('تحذف الصفحة دي؟')){WS.pages=WS.pages.filter(function(q){return q.id!==p.id});WS.cur=null;save();render()}};
 x=R.querySelector('#wst');if(x)x.onchange=function(){var v=x.value.trim();var m=v.match(/^(\S+)\s+(.*)$/);if(m&&/[^\u0000-\u007f]/.test(m[1])&&m[1].length<=4){p.e=m[1];p.t=m[2]}else p.t=v;save()};
 x=R.querySelector('#wstag');if(x)x.onclick=function(){var t=prompt('اسم التاج');if(t){p.tags.push(t.trim());save();render()}};
 R.querySelectorAll('[data-tg]').forEach(function(b){b.onclick=function(){p.tags.splice(+b.getAttribute('data-tg'),1);save();render()}});
 if(p){
  R.querySelectorAll('[data-ba]').forEach(function(b){b.onclick=function(){p.blocks.push({id:uid(),k:b.getAttribute('data-ba'),t:'',d:0});save();render()}});
  R.querySelectorAll('[data-bx]').forEach(function(t){var b=p.blocks.filter(function(z){return z.id===t.getAttribute('data-bx')})[0];t.oninput=function(){b.t=t.value;t.style.height='auto';t.style.height=t.scrollHeight+'px';save()};t.style.height=Math.max(28,t.scrollHeight)+'px'});
  R.querySelectorAll('[data-bt]').forEach(function(t){t.onclick=function(){var b=p.blocks.filter(function(z){return z.id===t.getAttribute('data-bt')})[0];b.d=b.d?0:1;save();render()}});
  R.querySelectorAll('[data-bd]').forEach(function(t){t.onclick=function(){p.blocks=p.blocks.filter(function(z){return z.id!==t.getAttribute('data-bd')});save();render()}});
  R.querySelectorAll('[data-v]').forEach(function(b){b.onclick=function(){p.view=b.getAttribute('data-v');save();render()}});
  x=R.querySelector('#wsr');if(x)x.onclick=function(){p.rows.push({id:uid(),v:{}});save();render()};
  R.querySelectorAll('[data-rd]').forEach(function(b){b.onclick=function(){p.rows=p.rows.filter(function(r){return r.id!==b.getAttribute('data-rd')});save();render()}});
  R.querySelectorAll('[data-c]').forEach(function(i){i.onchange=function(){var a=i.getAttribute('data-c').split('|'),r=p.rows.filter(function(z){return z.id===a[0]})[0];r.v[a[1]]=i.type==='checkbox'?i.checked:i.value;save();if(p.view!=='table')render()}})}
 x=R.querySelector('#wsx');if(x)x.onclick=function(){var b=new Blob([JSON.stringify(WS)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='my-space.json';a.click()};
 x=R.querySelector('#wsi');if(x)x.onclick=function(){var t=prompt('الصق محتوى ملف التصدير');if(t){try{var o=JSON.parse(t);if(o&&o.pages){WS=o;save();render()}}catch(e){alert('الملف مش صالح')}}};
}
window.vSpace=function(view){R=view;render()};
})();
