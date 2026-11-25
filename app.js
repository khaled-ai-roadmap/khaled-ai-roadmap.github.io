(function(){
'use strict';
var D=window.DATA, KEY='learnhub.v2', cur='ai', W, DAYS;
function C(){return D.courses[cur]}
var SEQ=[],ALL=[];
function hpd(){return Math.max(1,Math.min(10,+((S||{}).hpd)||3))}
function buildSeq(){SEQ=[];var L=C().labels;W.forEach(function(w,wi){var ph=C().phases.filter(function(p){return p.id===w.p})[0],k=0;
 for(var d=0;d<5;d++){var t=w.topics[Math.min(w.topics.length-1,Math.floor(d*w.topics.length/5))];
  [{k:'learn',e:'📖',t:'اتعلّم: '+t.t,links:t.links},{k:'do',e:'🛠️',t:L.d.replace('{t}',t.t)},{k:'rev',e:'✍️',t:L.r}].forEach(function(b){SEQ.push({wi:wi,ph:ph,topic:t,b:b,id:cur+':'+wi+':'+(k++)})})}
 var pj=w.proj?C().projects[w.proj]:null;
 (pj?[{k:'proj',e:'🧪',t:L.p+pj.t+' (ابدأ أو كمّل)'},{k:'proj',e:'💻',t:L.p2},{k:'rev',e:'📝',t:L.p3}]:[{k:'rev',e:'🔁',t:'راجع مواضيع الأسبوع كلها (ملخصاتك)'},{k:'do',e:'🛠️',t:L.x},{k:'rev',e:'📝',t:'اكتب 5 أسطر: إيه اللي اتعلمته الأسبوع ده'}]).forEach(function(b){SEQ.push({wi:wi,ph:ph,topic:null,project:pj,b:b,id:cur+':'+wi+':'+(k++)})})})}
function fromW(){return ((S&&S.from)||{})[cur]||0}
function calcDays(){DAYS=Math.max(1,Math.ceil(SEQ.length/hpd()))}
function setCur(k){cur=k;W=C().weeks;buildSeq();var f=fromW();if(f)SEQ=SEQ.filter(function(x){return x.wi>=f});calcDays()}
function withCur(k,fn){var o=cur;setCur(k);var r=fn();setCur(o);return r}
function each(fn){var o=cur;Object.keys(D.courses).forEach(function(k){setCur(k);fn(k)});setCur(o)}
var LV=[[0,'🥚','بيضة'],[100,'🐣','كتكوت فضولي'],[300,'🌱','بذرة بتكبر'],[700,'🚀','منطلق'],[1300,'🧠','مبرمج صغير'],[2200,'🔥','متحمس محترف'],[3600,'⚡','مهندس صاعد'],[5500,'🏆','خبير'],[8000,'👑','جاهز للشغل'],[11000,'🌟','أسطورة']];
var S=load();
function load(){var s;try{s=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
 if(!s||typeof s!=='object')s={};
 s.v=2;s.start=s.start||{};s.done=s.done||{};s.proj=s.proj||{};s.quiz=s.quiz||{};s.log=s.log||{};s.name=s.name||'';s.remind=s.remind||'20:00';
 s.cur=s.cur&&D.courses[s.cur]?s.cur:'ai';Object.keys(D.courses).forEach(function(k){if(!s.start[k])s.start[k]=ds(new Date())});return s}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function ds(d){var z=new Date(d.getTime()-d.getTimezoneOffset()*6e4);return z.toISOString().slice(0,10)}
function pd(s){var a=s.split('-');return new Date(+a[0],+a[1]-1,+a[2])}
function addDays(s,n){var d=pd(s);d.setDate(d.getDate()+n);return ds(d)}
function diffDays(a,b){return Math.round((pd(a)-pd(b))/864e5)}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function $(s,r){return (r||document).querySelector(s)}
var AR=function(d,o){return pd(d).toLocaleDateString('ar-EG',o)};
// ---- model
function dayInfo(n){var h=hpd(),it=SEQ.slice((n-1)*h,n*h),f=it[0]||SEQ[SEQ.length-1],tp=null,pj=null;it.forEach(function(x){if(!tp&&x.topic)tp=x.topic;if(!pj&&x.project)pj=x.project});
 return{n:n,wi:f.wi,w:W[f.wi],ph:f.ph,topic:tp,project:pj,blocks:it.map(function(x){return{k:x.b.k,e:x.b.e,t:x.b.t,links:x.b.links,id:x.id}})}}
function isDone(id){return !!S.done[id]}
function toggle(id){var d=ds(new Date());if(S.done[id]){delete S.done[id];S.log[d]=Math.max(0,(S.log[d]||1)-1);if(!S.log[d])delete S.log[d]}else{S.done[id]=Date.now();S.log[d]=(S.log[d]||0)+1}save()}
function dayProg(n){var di=dayInfo(n),c=0;di.blocks.forEach(function(b){if(isDone(b.id))c++});return{c:c,t:di.blocks.length}}
function rngProg(f){var c=0,t=0;SEQ.forEach(function(x){if(f(x)){t++;if(isDone(x.id))c++}});return{c:c,t:t}}
function totals(){return rngProg(function(){return true})}
function phaseProg(ph){return rngProg(function(x){return x.wi+1>=ph.w[0]&&x.wi+1<=ph.w[1]})}
function weekProg(wi){return rngProg(function(x){return x.wi===wi})}
var PJ_STEPS=['فهمت الفكرة وكتبت الـ brief','الكود شغال','التقييم والنتايج','README احترافي','Demo أو نشر','منشور على GitHub'];
function pjState(id){var a=S.proj[cur+':'+id]||[];var c=0;for(var i=0;i<6;i++)if(a[i])c++;return c}
function pjStatus(c){return c===0?['لسه','#9aa0a6']:c===6?['منشور 🎉','#2f9e8f']:['شغال','#f2994a']}
function quizXp(){var x=0;for(var k in S.quiz)x+=(S.quiz[k].best||0)*10;return x}
function allBlocks(){var s=0;each(function(){s+=totals().c});return s}
function xp(){var t=allBlocks()*10,p=0;for(var k in S.proj){for(var i=0;i<6;i++)if(S.proj[k][i])p+=25}return t+p+quizXp()}
function level(x){var i=0;for(var j=0;j<LV.length;j++)if(x>=LV[j][0])i=j;var nx=LV[i+1];return{i:i,e:LV[i][1],name:LV[i][2],cur:LV[i][0],next:nx?nx[0]:null}}
function streak(){var d=ds(new Date()),s=0;if(!S.log[d])d=addDays(d,-1);while(S.log[d]){s++;d=addDays(d,-1)}return s}
function bestStreak(){var ks=Object.keys(S.log).sort(),b=0,c=0,p=null;ks.forEach(function(k){c=(p&&diffDays(k,p)===1)?c+1:1;if(c>b)b=c;p=k});return b}
function todayN(){var n=diffDays(ds(new Date()),S.start[cur])+1;return Math.max(1,Math.min(DAYS,n))}
function published(){var c=0;each(function(){C().projectOrder.forEach(function(id){if(pjState(id)===6)c++})});return c}
var BADGES=[
 ['🌟','أول خطوة',function(){return allBlocks()>=1},'خلّص أول مهمة'],
 ['🔟','10 مهام',function(){return allBlocks()>=10},'10 مهام مكتملة'],
 ['💯','100 مهمة',function(){return allBlocks()>=100},'100 مهمة مكتملة'],
 ['🔥','3 أيام ورا بعض',function(){return bestStreak()>=3},'سلسلة 3 أيام'],
 ['🔥','أسبوع كامل',function(){return bestStreak()>=7},'سلسلة 7 أيام'],
 ['🏅','شهر كامل',function(){return bestStreak()>=30},'سلسلة 30 يوم'],
 ['📚','أول أسبوع مكتمل',function(){var ok=false;each(function(){for(var i=0;i<W.length;i++){var p=weekProg(i);if(p.c===p.t)ok=true}});return ok},'أكمل كل مهام أسبوع'],
 ['🧪','أول مشروع منشور',function(){return published()>=1},'مشروع واحد بكل الخطوات'],
 ['🧳','5 مشاريع منشورة',function(){return published()>=5},'5 مشاريع كاملة'],
 ['💼','10 مشاريع منشورة',function(){return published()>=10},'بورتفوليو قوي'],
 ['🎯','أول Quiz',function(){return Object.keys(S.quiz).length>=1},'خلّص quiz'],
 ['🧠','Quiz كامل 6/6',function(){for(var k in S.quiz)if(S.quiz[k].best>=6)return true;return false},'درجة كاملة'],
 ['⛰️','نص الطريق',function(){var t=totals();return withCur('ai',function(){var t=totals();return t.c>=t.t/2})},'50% من الخطة'],
 ['👑','خلصت الخطة',function(){return withCur('ai',function(){var t=totals();return t.c>=t.t})},'100% من الخطة']
];
function phaseBadges(){var r=[];each(function(k){C().phases.forEach(function(ph){r.push([ph.e,k.toUpperCase()+': '+ph.t,function(){return withCur(k,function(){var p=phaseProg(ph);return p.c===p.t})},'أكمل مرحلة '+ph.n])})});return r}
// ---- views
var view=$('#view'),route='';
function pct(c,t){return t?Math.round(c/t*100):0}
function bar(p,col){return '<div class="bar"><i style="width:'+p+'%'+(col?';background:'+col:'')+'"></i></div>'}
function header(){var x=xp(),lv=level(x),st=streak();
 var pp=lv.next?pct(x-lv.cur,lv.next-lv.cur):100;
 return '<div class="top"><div class="chips"><a class="chip" href="#/" style="text-decoration:none;color:inherit">'+C().e+' '+esc(C().name)+' ▾</a><span class="chip">'+lv.e+' '+esc(lv.name)+'</span><span class="chip">⭐ '+x+' XP</span><span class="chip">🔥 '+st+' يوم</span></div>'+bar(pp,'#ffb703')+'</div>'}
function links(ls){return ls.map(function(l){return '<a class="lnk" href="'+esc(l[1])+'" target="_blank" rel="noopener">🔗 '+esc(l[0])+'</a>'}).join('')}
function blockRow(n,i,b){var id=b.id,d=isDone(id);
 return '<div class="blk'+(d?' done':'')+'"><button class="ck" data-t="'+id+'" aria-pressed="'+d+'" aria-label="علّم كمكتمل"><span>'+(d?'✓':'')+'</span></button><div class="bt"><div class="bh">'+b.e+' '+esc(b.t)+'</div>'+(b.links?'<div class="lks">'+links(b.links)+'</div>':'')+'</div></div>'}
function dayCard(n,big){var di=dayInfo(n),p=dayProg(n);
 var head=di.topic?'📌 '+esc(di.topic.t):'🧪 '+(di.project?esc(di.project.t):'يوم مراجعة');
 return '<section class="card'+(big?' big':'')+'"><div class="meta">اليوم '+n+' من '+DAYS+' · أسبوع '+(di.wi+1)+' · '+esc(di.ph.e+' '+di.ph.t)+'</div><h2>'+head+'</h2>'+bar(pct(p.c,p.t))+'<div class="meta">'+p.c+' من '+p.t+' ساعة خلصت</div>'+askAI(di)+di.blocks.map(function(b,i){return blockRow(n,i,b)}).join('')+'</section>'}
function vToday(){var n=todayN(),start=S.start[cur],td=ds(new Date()),before=diffDays(td,start)<0;
 var h=header()+'<div class="hello"><div class="owl">🦉</div><div><b>'+(S.name?'أهلا يا '+esc(S.name):'أهلا يا بطل')+'</b><div class="sub">'+AR(td,{weekday:'long',day:'numeric',month:'long'})+'</div></div></div>';
 if(before)h+='<div class="note">الخطة هتبدأ يوم '+AR(start,{day:'numeric',month:'long'})+'. تقدر تبدأ النهاردة من <a href="#/settings">الإعدادات</a>.</div>';
 var missed=0,first=null;for(var k=1;k<n;k++){var p=dayProg(k);if(p.c<p.t){missed++;if(!first)first=k}}
 if(missed>0)h+='<div class="note warn">متأخر في '+missed+' يوم. مفيش مشكلة: كمّل من آخر نقطة. <a href="#/plan/'+(dayInfo(first).wi)+'">افتح اليوم الفايت</a> أو انقل تاريخ البداية من <a href="#/settings">الإعدادات</a>.</div>';
 h+=dayCard(n,true);
 var tot=totals(),end=addDays(start,DAYS-1);
 h+='<div class="row2"><div class="mini"><b>'+pct(tot.c,tot.t)+'%</b><span>من الخطة كلها</span></div><div class="mini"><b>'+AR(end,{day:'numeric',month:'short',year:'numeric'})+'</b><span>نهاية الخطة المحددة</span></div></div>';
 if(n<DAYS){h+='<h3>الجاي</h3>';for(var j=n+1;j<=Math.min(DAYS,n+2);j++){var di=dayInfo(j);h+='<div class="peek">'+(j-n===1?'بكرة':'بعد بكرة')+': '+(di.topic?'📌 '+esc(di.topic.t):'🧪 مشروع أو مراجعة')+'</div>'}}
 h+='<p class="fine">الموقع ثابت ومفيهوش إشعارات. للتذكير اليومي نزّل ملف التقويم من <a href="#/settings">الإعدادات</a>.</p>';
 view.innerHTML=h}
function vPlan(arg){var h=header(),wi=arg!==''&&arg!=null?+arg:null;
 if(wi!==null&&!isNaN(wi)&&W[wi]){var w=W[wi],ph=C().phases.filter(function(p){return p.id===w.p})[0],p=weekProg(wi);
  h+='<a class="back" href="#/plan">← كل المراحل</a><h2>أسبوع '+(wi+1)+': '+esc(w.title)+'</h2><div class="meta">'+esc(ph.e+' '+ph.t)+' · '+p.c+' من '+p.t+'</div>'+bar(pct(p.c,p.t));
  for(var n=wi*7+1;n<=wi*7+7;n++)h+=dayCard(n,false);
  h+='<div class="pager">'+(wi>0?'<a class="btn" href="#/plan/'+(wi-1)+'">← الأسبوع اللي قبله</a>':'<span></span>')+(wi<W.length-1?'<a class="btn" href="#/plan/'+(wi+1)+'">الأسبوع اللي بعده →</a>':'')+'</div>';
  view.innerHTML=h;return}
 h+='<h2>الخطة: '+W.length+' أسبوع</h2><p class="sub">3 ساعات يوميا. 5 أيام تعلم، يوم تطبيق ومشروع، يوم راحة.</p>';
 C().phases.forEach(function(ph){var p=phaseProg(ph),q=S.quiz[cur+':'+ph.id];
  h+='<section class="card"><div class="ph"><span class="em">'+ph.e+'</span><div><h3>'+ph.n+'. '+esc(ph.t)+'</h3><div class="meta">أسابيع '+ph.w[0]+' إلى '+ph.w[1]+' · '+p.c+' من '+p.t+'</div></div></div>'+bar(pct(p.c,p.t),'#2f9e8f')+'<p class="sub">'+esc(ph.goal)+'</p><div class="weeks">';
  for(var i=ph.w[0]-1;i<ph.w[1];i++){var wp=weekProg(i);h+='<a class="wk'+(wp.c===wp.t?' full':'')+'" href="#/plan/'+i+'"><b>'+(i+1)+'</b><span>'+esc(W[i].title)+'</span></a>'}
  h+='</div><a class="btn pri" href="#/quiz/'+ph.id+'">🎯 Quiz المرحلة'+(q?' (أحسن درجة '+q.best+'/'+q.total+')':'')+'</a></section>'});
 view.innerHTML=h}
function vProjects(){var h=header()+'<h2>مشاريعك</h2><p class="sub">البورتفوليو بيتبني بالشغل الفعلي. مشروع واحد منشور بـ README كويس أحسن من خمسة ناقصين.</p><div class="note"><b>عدد المنشور: '+published()+' من '+C().projectOrder.length+'</b> علّم الخطوات بالترتيب وانت بتخلصها.</div>';
 C().projectOrder.forEach(function(id){var p=C().projects[id],a=S.proj[cur+':'+id]||[],c=pjState(id),st=pjStatus(c);
  h+='<section class="card"><div class="ph"><div><h3>'+esc(p.t)+'</h3><div class="meta">أسبوع '+p.week+' · '+esc(p.lvl)+' · دبلومة: '+esc(p.dip)+'</div></div><span class="stat" style="background:'+st[1]+'">'+st[0]+'</span></div>'+bar(pct(c,6),st[1])+
  '<dl><dt>الفكرة</dt><dd>'+esc(p.b)+'</dd><dt>التسليم</dt><dd>'+esc(p.d)+'</dd><dt>الداتا</dt><dd>'+esc(p.data)+'</dd></dl>';
  PJ_STEPS.forEach(function(s,i){h+='<div class="blk'+(a[i]?' done':'')+'"><button class="ck" data-p="'+id+':'+i+'" aria-pressed="'+!!a[i]+'"><span>'+(a[i]?'✓':'')+'</span></button><div class="bt"><div class="bh">'+esc(s)+'</div></div></div>'});
  h+='</section>'});
 h+='<section class="card"><h3>قالب README (انسخه)</h3><pre id="rd">'+esc(D.info.readme)+'</pre><button class="btn pri" id="cprd">نسخ القالب</button></section>';
 view.innerHTML=h}
function vWins(){var x=xp(),lv=level(x),tot=totals(),h=header()+'<h2>إنجازاتي</h2>';
 h+='<section class="card big center"><div class="bigem">'+lv.e+'</div><h3>المستوى '+(lv.i+1)+': '+esc(lv.name)+'</h3><div class="meta">'+x+' XP'+(lv.next?' · الجاي عند '+lv.next:'')+'</div></section>';
 h+='<div class="row2"><div class="mini"><b>'+tot.c+'</b><span>ساعة مذاكرة اتسجلت</span></div><div class="mini"><b>'+streak()+'</b><span>سلسلة الأيام</span></div><div class="mini"><b>'+bestStreak()+'</b><span>أطول سلسلة</span></div><div class="mini"><b>'+published()+'</b><span>مشاريع منشورة</span></div></div>';
 h+='<p><a class="btn pri" href="#/ready">💼 جاهز للشغل؟ قايمة التوظيف</a></p><h3>الأوسمة</h3><div class="badges">';
 BADGES.concat(phaseBadges()).forEach(function(b){var ok=b[2]();h+='<div class="bd'+(ok?' on':'')+'" title="'+esc(b[3])+'"><span>'+(ok?b[0]:'🔒')+'</span><b>'+esc(b[1])+'</b><small>'+esc(b[3])+'</small></div>'});
 h+='</div>';view.innerHTML=h}
function vQuiz(id){var ph=C().phases.filter(function(p){return p.id===id})[0],qs=C().quizzes[id];if(!ph||!qs){location.hash='#/plan';return}
 var h=header()+'<a class="back" href="#/plan">← الخطة</a><h2>Quiz: '+esc(ph.t)+'</h2><p class="sub">'+qs.length+' أسئلة. اختار الإجابة وبعدين اضغط تصحيح.</p><form id="qf">';
 qs.forEach(function(q,i){h+='<section class="card"><b>'+(i+1)+'. '+esc(q[0])+'</b>';q[1].forEach(function(o,j){h+='<label class="opt"><input type="radio" name="q'+i+'" value="'+j+'"><span>'+esc(o)+'</span></label>'});h+='<div class="exp" id="e'+i+'"></div></section>'});
 h+='<button class="btn pri" type="submit">تصحيح</button><div id="res"></div></form>';view.innerHTML=h;
 $('#qf').addEventListener('submit',function(e){e.preventDefault();var sc=0;qs.forEach(function(q,i){var v=document.querySelector('input[name=q'+i+']:checked'),ok=v&&+v.value===q[2];if(ok)sc++;var ex=$('#e'+i);ex.className='exp '+(ok?'ok':'bad');ex.textContent=(ok?'صح ✓ ':'الصح: '+q[1][q[2]]+'. ')+q[3]});
  var k=cur+':'+id,old=S.quiz[k]||{best:0};S.quiz[k]={best:Math.max(old.best,sc),total:qs.length,last:sc};save();
  $('#res').innerHTML='<div class="note">درجتك '+sc+' من '+qs.length+(sc===qs.length?' 🎉 ممتاز':sc>=qs.length/2?' 👍 كويس، راجع الغلط':' 💪 راجع المواضيع وأعد المحاولة')+'</div>';$('#res').scrollIntoView({behavior:'smooth',block:'center'})})}
function vHub(){var h='<div class="hero"><div class="owl big">🦉</div><h1>مركز المهارات</h1><p>مسارات من الصفر للاحتراف، بمصادر مجانية، وجدول بالساعات اللي تناسبك، وتتبع وتحديات. <a href="#/start">ابدأ بالأسئلة</a></p></div>'+header();
 h+='<h2>المهارات</h2><div class="grid">';
 D.skills.forEach(function(s){var ready=s.status==='ready',tt=ready?withCur(s.id,totals):null;
  h+='<a class="sk'+(ready?'':' soon')+'" style="--c:'+s.color+'" href="#/'+(ready?'open/'+s.id:'skill/'+s.id)+'"><span class="em">'+s.e+'</span><b>'+esc(s.name)+'</b><small>'+esc(s.short)+'</small><span class="tag">'+(ready?'جاهز · '+pct(tt.c,tt.t)+'%':'جاري البناء')+'</span></a>'});
 h+='</div><p><a class="btn" href="#/compare">📊 قارن المهارات والدخل</a> <a class="btn" href="#/about">ℹ️ كلام صريح وتفاصيل</a></p>';
 view.innerHTML=h}
function vSkill(id){var s=D.skills.filter(function(x){return x.id===id})[0];if(!s){location.hash='#/';return}
 view.innerHTML=header()+'<a class="back" href="#/">← المهارات</a><div class="card big center"><div class="bigem">'+s.e+'</div><h2>'+esc(s.name)+'</h2><p>'+esc(s.desc)+'</p><div class="note warn"><b>لسه بنبنيه</b>المسار الكامل (خطوات + روابط + Quiz + مشاريع) لسه مش جاهز. الجاهز دلوقتي: مسار AI Engineering. هنضيف الباقي واحدة واحدة.</div></div>'+incomeCard(s)}
function stars(n){return '★★★★★'.slice(0,n)+'☆☆☆☆☆'.slice(0,5-n)}
function incomeCard(s){return '<section class="card"><h3>الدخل والملاءمة للشغل الريموت</h3><dl><dt>الأسعار على Upwork</dt><dd>'+esc(s.income.txt)+'</dd><dt>الملاءمة للريموت</dt><dd>'+stars(s.remote)+' '+esc(s.remoteWhy)+'</dd><dt>المصدر</dt><dd><a href="'+esc(s.income.url)+'" target="_blank" rel="noopener">'+esc(s.income.name)+'</a></dd></dl></section>'}
function vCompare(){var h=header()+'<a class="back" href="#/">← المهارات</a><h2>مقارنة المهارات</h2><div class="note"><b>اقرا ده الأول</b>الأرقام دي أسعار معلنة (بالساعة) لفريلانسرز ليهم أرباح فوق 10 آلاف دولار على Upwork، يعني ناس ناجحين بالفعل. المبتدئ من مصر غالبا بيبدأ أقل من كده بكتير، وأول شهور ممكن تبقى بدون دخل. الأرقام مش وعد.</div><div class="tbl">';
 D.skills.filter(function(s){return s.income}).forEach(function(s){h+='<section class="card"><div class="ph"><span class="em">'+s.e+'</span><div><h3>'+esc(s.name)+'</h3><div class="meta">ريموت: '+stars(s.remote)+'</div></div></div><p>'+esc(s.income.txt)+'</p><p class="sub">'+esc(s.why)+'</p><a class="lnk" href="'+esc(s.income.url)+'" target="_blank" rel="noopener">🔗 '+esc(s.income.name)+'</a></section>'});
 h+='</div><h2>ليه اخترنا العشرة دول؟</h2><ol>'+D.info.why.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ol><p class="fine">تقييم الملاءمة للريموت (النجوم) رأينا نحن مش رقم رسمي.</p>';view.innerHTML=h}
function vAbout(){var i=D.info,h=header()+'<a class="back" href="#/">← المهارات</a><h2>كلام صريح</h2>';
 h+='<section class="card"><h3>الخطة دي كفاية؟</h3>'+i.honest.map(function(x){return '<p>'+x+'</p>'}).join('')+'</section>';
 h+='<section class="card"><h3>مراجعة الفجوات مقابل الخرايط المعروفة</h3><p class="sub">قارنّا بالقوائم المنشورة في roadmap.sh للـ AI Engineer وMLOps وAI Data Scientist (قرينا الشجرة نفسها يوم 25 نوفمبر 2026).</p>'+i.audit.map(function(a){return '<div class="aud"><b>'+esc(a[0])+'</b><p>'+esc(a[1])+'</p></div>'}).join('')+'<a class="lnk" href="https://roadmap.sh/ai-engineer" target="_blank" rel="noopener">🔗 roadmap.sh/ai-engineer</a><a class="lnk" href="https://roadmap.sh/mlops" target="_blank" rel="noopener">🔗 roadmap.sh/mlops</a><a class="lnk" href="https://roadmap.sh/ai-data-scientist" target="_blank" rel="noopener">🔗 roadmap.sh/ai-data-scientist</a></section>';
 h+='<h2>منح ومجاني</h2>'+i.schol.map(function(x){return '<section class="card"><h3>'+esc(x.n)+'</h3><dl><dt>الحالة</dt><dd>'+esc(x.st)+'</dd><dt>الشروط</dt><dd>'+esc(x.el)+'</dd></dl><a class="lnk" href="'+esc(x.u)+'" target="_blank" rel="noopener">🔗 '+esc(x.un)+'</a>'+(x.u2?'<a class="lnk" href="'+esc(x.u2)+'" target="_blank" rel="noopener">🔗 '+esc(x.un2)+'</a>':'')+'</section>'}).join('');
 view.innerHTML=h}
function RL(){return C().ready||D.info.ready}
function rk(i){return cur==='ai'?String(i):cur+':'+i}
function vReady(){S.ready=S.ready||{};var n=0,t=RL().length;RL().forEach(function(r,i){if(S.ready[rk(i)])n++});
 var h=header()+'<a class="back" href="#/wins">← إنجازاتي</a><h2>جاهز للشغل؟</h2><p class="sub">الدراسة وحدها مش كفاية. دي مخرجات التوظيف اللي لازم تخلصها.</p>'+bar(pct(n,t),'#ffb703')+'<div class="meta">'+n+' من '+t+'</div><section class="card">';
 RL().forEach(function(r,i){var d=!!S.ready[rk(i)];h+='<div class="blk'+(d?' done':'')+'"><button class="ck" data-r="'+i+'" aria-pressed="'+d+'"><span>'+(d?'✓':'')+'</span></button><div class="bt"><div class="bh">'+esc(r[0])+'</div><div class="lks">'+links(r[1])+'</div></div></div>'});
 h+='</section><p class="fine">مفيش موقع بيضمن وظيفة. الخطوات دي بتزود فرصك.</p>';view.innerHTML=h}
function vSettings(){var h=header()+'<h2>الإعدادات والنسخ الاحتياطي</h2>';
 h+='<section class="card"><h3>اسمك</h3><input id="nm" class="inp" value="'+esc(S.name)+'" placeholder="خالد"></section>';
h+='<section class="card"><h3>ساعاتك في اليوم</h3><p class="sub">غيّرها في أي وقت. تقدمك بيفضل زي ما هو والجدول بيتحسب تاني.</p><div class="hsel">'+[1,2,3,4,5,6,8].map(function(x){return '<button class="chip'+(x===hpd()?' on':'')+'" data-h="'+x+'">'+x+' س</button>'}).join('')+'</div><div class="meta">'+Object.keys(D.courses).map(function(k){return withCur(k,function(){return esc(C().name)+': '+SEQ.length+' ساعة، تخلص في '+DAYS+' يوم (حوالي '+Math.round(DAYS/30.4*10)/10+' شهر)'})}).join('<br>')+'</div></section>';
 h+='<section class="card"><h3>ابدأ من مرحلة</h3><p class="sub">لو عندك أساس، اعمل اختبار المرحلة من صفحة الخطة، ولو نجحت ابدأ من اللي بعدها.</p><select id="frm" class="inp">'+C().phases.map(function(p){return '<option value="'+(p.w[0]-1)+'"'+(fromW()===p.w[0]-1?' selected':'')+'>'+esc(p.e+' '+p.t)+'</option>'}).join('')+'</select></section>';
 h+='<section class="card"><h3>تاريخ بداية الخطة</h3><p class="sub">اليوم 1 هو التاريخ ده. نهاية الخطة بعد '+DAYS+' يوم.</p><input id="sd" type="date" class="inp" value="'+S.start[cur]+'"><button class="btn" id="sdn">ابدأ من النهاردة</button><div class="meta">نهاية الخطة: '+AR(addDays(S.start[cur],DAYS-1),{day:'numeric',month:'long',year:'numeric'})+'</div></section>';
 h+='<section class="card"><h3>تذكير يومي</h3><p class="sub">الموقع ثابت ومش بيبعت إشعارات. نزّل ملف تقويم (ICS) وافتحه على موبايلك، هيضيف تذكير يومي في تطبيق التقويم.</p><input id="rt" type="time" class="inp" value="'+esc(S.remind)+'"><button class="btn pri" id="ics">تنزيل التذكير اليومي</button></section>';
 h+='<section class="card"><h3>نسخة احتياطية</h3><p class="sub">تقدمك محفوظ على الجهاز ده والمتصفح ده بس. لو مسحت بيانات المتصفح هيضيع. صدّر ملف واحتفظ بيه.</p><button class="btn pri" id="exp">تصدير التقدم (ملف)</button> <label class="btn">استيراد ملف<input id="imp" type="file" accept="application/json,.json" hidden></label><div id="impm" class="meta"></div></section>';
 h+='<section class="card"><h3>مسح كل شيء</h3><button class="btn danger" id="rst">مسح التقدم</button></section>';
 view.innerHTML=h;
 $('#nm').addEventListener('change',function(e){S.name=e.target.value.trim().slice(0,30);save()});
 document.querySelectorAll('[data-h]').forEach(function(b){b.addEventListener('click',function(){S.hpd=+b.getAttribute('data-h');save();setCur(cur);vSettings()})});
 $('#frm').addEventListener('change',function(e){S.from=S.from||{};S.from[cur]=+e.target.value;save();setCur(cur);vSettings()});
 $('#sd').addEventListener('change',function(e){if(e.target.value){S.start[cur]=e.target.value;save();vSettings()}});
 $('#sdn').addEventListener('click',function(){S.start[cur]=ds(new Date());save();vSettings()});
 $('#rt').addEventListener('change',function(e){S.remind=e.target.value||'20:00';save()});
 $('#ics').addEventListener('click',function(){var t=(S.remind||'20:00').split(':'),d=S.start[cur].replace(/-/g,'');var ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//learning-hub//AR','BEGIN:VEVENT','UID:daily@learning-hub','DTSTAMP:20260101T000000Z','DTSTART:'+d+'T'+t[0]+t[1]+'00','DTEND:'+d+'T'+(('0'+((+t[0]+hpd())%24)).slice(-2))+t[1]+'00','RRULE:FREQ=DAILY;COUNT='+DAYS,'SUMMARY:'+hpd()+' ساعات مذاكرة ('+C().name+')','DESCRIPTION:افتح الموقع واعمل مهام النهاردة','BEGIN:VALARM','TRIGGER:-PT10M','ACTION:DISPLAY','DESCRIPTION:وقت المذاكرة','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');dl('daily-reminder.ics',ics,'text/calendar')});
 $('#exp').addEventListener('click',function(){dl('learning-progress-'+ds(new Date())+'.json',JSON.stringify(S,null,1),'application/json')});
 $('#imp').addEventListener('change',function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var o=JSON.parse(r.result);if(!o||typeof o!=='object'||!o.done||!o.start)throw 0;if(!confirm('ده هيستبدل تقدمك الحالي. تكمل؟'))return;S=o;load2();save();$('#impm').textContent='تم الاستيراد ✓'}catch(x){$('#impm').textContent='الملف ده مش نسخة تقدم صحيحة.'}};r.readAsText(f)});
 $('#rst').addEventListener('click',function(){if(confirm('متأكد؟ ده هيمسح كل التقدم.')&&confirm('تأكيد أخير: مسح نهائي؟')){localStorage.removeItem(KEY);S=load();save();vSettings()}})}
function load2(){S.v=2;S.start=S.start||{};S.done=S.done||{};S.proj=S.proj||{};S.quiz=S.quiz||{};S.log=S.log||{};S.name=S.name||'';S.remind=S.remind||'20:00';S.cur=S.cur&&D.courses[S.cur]?S.cur:'ai';Object.keys(D.courses).forEach(function(k){if(!S.start[k])S.start[k]=ds(new Date())});setCur(S.cur)}
function dl(name,txt,mime){var b=new Blob([txt],{type:mime+';charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)}
// ---- router
function go(){var h=location.hash.replace(/^#\/?/,''),p=h.split('/');route=p[0]||'';
 document.querySelectorAll('.tabs a').forEach(function(a){var r=a.getAttribute('data-r');a.setAttribute('aria-current',(r===route||(r===''&&route===''))?'page':'false')});
 if(route==='open'){var k=p[1];if(D.courses[k]){S.cur=k;save();setCur(k)}location.replace('#/today');return}
 ({'':vHub,today:vToday,plan:function(){vPlan(p[1])},projects:vProjects,wins:vWins,quiz:function(){vQuiz(p[1])},compare:vCompare,about:vAbout,settings:vSettings,habits:vHabits,place:vPlace,start:vStart,ready:vReady,skill:function(){vSkill(p[1])}}[route]||vHub)();
 if(!p[1]||route==='today')window.scrollTo(0,0)}
document.addEventListener('click',function(e){var b=e.target.closest('[data-t]');
 if(b){var before=level(xp()).i,pos=b.getBoundingClientRect().top;toggle(b.getAttribute('data-t'));var y=window.scrollY;go();window.scrollTo(0,y);var af=level(xp()).i;if(af>before)toast('🎉 مستوى جديد: '+level(xp()).name);return}
 b=e.target.closest('[data-r]');if(b&&b.tagName==='BUTTON'){var ri=rk(b.getAttribute('data-r'));S.ready=S.ready||{};if(S.ready[ri])delete S.ready[ri];else S.ready[ri]=1;save();var y3=window.scrollY;go();window.scrollTo(0,y3);return}
 b=e.target.closest('[data-p]');if(b){var a=b.getAttribute('data-p').split(':'),k=cur+':'+a[0],arr=S.proj[k]||[false,false,false,false,false,false];arr[+a[1]]=!arr[+a[1]];S.proj[k]=arr;save();var y2=window.scrollY;go();window.scrollTo(0,y2);return}
 if(e.target.id==='cprd'){var t=D.info.readme;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){toast('اتنسخ ✓')},function(){var r=document.createRange();r.selectNodeContents($('#rd'));var s=getSelection();s.removeAllRanges();s.addRange(r);toast('حدد النص وانسخه')})}});

// ---- habits
function hList(){S.habits=S.habits||[];return S.habits}
function hDate(n){var d=new Date();d.setDate(d.getDate()-n);return ds(d)}
function hPct(h,n){var c=0;for(var i=0;i<n;i++)if(h.days&&h.days[hDate(i)])c++;return Math.round(c*100/n)}
function hStreak(h){var n=0,i=h.days&&h.days[hDate(0)]?0:1;while(h.days&&h.days[hDate(i)]){n++;i++}return n}
function vHabits(){var H=hList(),h=header()+'<h2>متتبع العادات</h2><p class="sub">اكتب عاداتك وعلّم كل يوم. النسب والرسم بيتحدثوا لوحدهم.</p>';
 h+='<form class="card hf" id="hform"><input id="hnew" maxlength="40" placeholder="عادة جديدة، مثلا: مذاكرة 3 ساعات" aria-label="اسم العادة"><button class="btn pri" type="submit">أضف</button></form>';
 if(!H.length){h+='<section class="card center"><div class="bigem">🌱</div><p>لسه مفيش عادات. ابدأ بعادة واحدة صغيرة.</p></section>';view.innerHTML=h;return}
 var days=[];for(var i=6;i>=0;i--)days.push(hDate(i));
 var tot7=0,tot30=0;H.forEach(function(x){tot7+=hPct(x,7);tot30+=hPct(x,30)});
 h+='<div class="row2"><div class="mini"><b>'+Math.round(tot7/H.length)+'%</b><span>آخر 7 أيام</span></div><div class="mini"><b>'+Math.round(tot30/H.length)+'%</b><span>آخر 30 يوم</span></div></div>';
 h+='<section class="card"><h3>آخر 30 يوم</h3>'+hChart(H)+'<div class="meta">كل عمود = نسبة العادات اللي خلصتها في اليوم ده</div></section>';
 h+='<section class="card"><div class="hgrid"><div class="hrow hhead"><span></span>';days.forEach(function(d){h+='<b>'+AR(d,{day:'numeric'})+'</b>'});h+='<span></span></div>';
 H.forEach(function(x,ix){h+='<div class="hrow"><span class="hn">'+esc(x.name)+'<small>'+hPct(x,30)+'% · سلسلة '+hStreak(x)+'</small></span>';
  days.forEach(function(d){var on=x.days&&x.days[d];h+='<button class="hc'+(on?' on':'')+'" data-hb="'+ix+':'+d+'" aria-label="'+esc(x.name)+' '+d+'" aria-pressed="'+(!!on)+'">'+(on?'✓':'')+'</button>'});
  h+='<button class="hx" data-hd="'+ix+'" aria-label="حذف">✕</button></div>'});
 h+='</div></section><p class="fine">العادات بتتحفظ في متصفحك وبتدخل في التصدير من الإعدادات.</p>';view.innerHTML=h}
function hChart(H){var w=300,hh=90,bw=7,g=3,out='<svg viewBox="0 0 '+w+' '+(hh+14)+'" class="hch" role="img" aria-label="رسم نسبة العادات اليومية">';
 for(var i=0;i<30;i++){var d=hDate(29-i),c=0;H.forEach(function(x){if(x.days&&x.days[d])c++});var p=H.length?c/H.length:0,bh=Math.max(2,p*hh);
  out+='<rect x="'+((29-i)*(bw+g))+'" y="'+(hh-bh)+'" width="'+bw+'" height="'+bh+'" rx="3" fill="'+(p>=1?'#2f9e8f':p>0?'#8fd0c6':'#e6dfd3')+'"><title>'+d+': '+Math.round(p*100)+'%</title></rect>'}
 return out+'</svg>'}
document.addEventListener('submit',function(e){if(e.target.id!=='hform')return;e.preventDefault();var v=$('#hnew').value.trim();if(!v)return;hList().push({name:v,days:{}});save();go()});
document.addEventListener('click',function(e){var b=e.target.closest('[data-hb]');if(b){var a=b.getAttribute('data-hb').split(':'),x=hList()[+a[0]];if(!x)return;x.days=x.days||{};if(x.days[a[1]])delete x.days[a[1]];else x.days[a[1]]=1;save();var y=window.scrollY;go();window.scrollTo(0,y);return}
 b=e.target.closest('[data-hd]');if(b&&confirm('حذف العادة دي وكل سجلها؟')){hList().splice(+b.getAttribute('data-hd'),1);save();go()}});

// ---- onboarding
var GOALS=[['ai','🤖','أشتغل في الـ AI'],['en','🇬🇧','أتقن الإنجليزي'],['biz','💡','أبيع وأبني بيزنس'],['web','💻','أبني مواقع وتطبيقات'],['cyber','🛡️','أمن سيبراني'],['uiux','🎨','تصميم UI/UX'],['mkt','📣','تسويق رقمي'],['de','🇩🇪','أتعلم ألماني']];
function vStart(){var o=S.ob||{g:[],lv:'zero',h:hpd()},h=header()+'<h2>ابدأ من هنا</h2><p class="sub">3 أسئلة والموقع يرتبلك الطريق.</p>';
 h+='<section class="card"><h3>1. إيه اللي يهمك؟ (اختار أكتر من واحد)</h3><div class="hsel">'+GOALS.map(function(g){return '<button class="chip'+(o.g.indexOf(g[0])>-1?' on':'')+'" data-g="'+g[0]+'">'+g[1]+' '+g[2]+'</button>'}).join('')+'</div></section>';
 h+='<section class="card"><h3>2. مستواك دلوقتي</h3><div class="hsel">'+[['zero','من الصفر'],['some','عندي أساس'],['mid','متوسط']].map(function(l){return '<button class="chip'+(o.lv===l[0]?' on':'')+'" data-l="'+l[0]+'">'+l[1]+'</button>'}).join('')+'</div></section>';
 h+='<section class="card"><h3>3. ساعات يوميا</h3><div class="hsel">'+[1,2,3,4,5,6,8].map(function(x){return '<button class="chip'+(x===o.h?' on':'')+'" data-oh="'+x+'">'+x+' س</button>'}).join('')+'</div></section>';
 var picks=GOALS.filter(function(g){return o.g.indexOf(g[0])>-1});
 if(picks.length){var hh=o.h,tot=0,d0=ds(new Date());h+='<section class="card"><h3>ترتيبي المقترح</h3><p class="sub">واحد بعد التاني، بـ '+hh+' ساعة يوميا:</p>';
  picks.forEach(function(g){var sk=D.skills.filter(function(s){return s.id===g[0]})[0],ready=sk&&sk.status==='ready',hrs=ready?D.courses[g[0]].weeks.length*18:0,days=ready?Math.ceil(hrs/hh):0;
   h+='<div class="peek">'+g[1]+' '+esc(g[2])+': '+(ready?hrs+' ساعة، حوالي '+days+' يوم (يخلص '+AR(addDays(d0,tot+days),{day:'numeric',month:'long',year:'numeric'})+')':'جاري البناء')+'</div>';tot+=days});
  h+='<p class="sub">الأرقام تقدير للساعات المخططة، مش ضمان لمستوى أو وظيفة. '+(o.lv==='zero'?'وانت بادئ من الصفر، فابدأ بأول مرحلة.':'وبما إن عندك أساس، اعمل اختبار المراحل وابدأ من مرحلة أعلى من الإعدادات.')+'</p><button class="btn pri" id="obgo">طبّق وابدأ</button></section>'}
 view.innerHTML=h}
document.addEventListener('click',function(e){var b=e.target.closest('[data-g],[data-l],[data-oh],#obgo');if(!b||route!=='start')return;S.ob=S.ob||{g:[],lv:'zero',h:hpd()};var o=S.ob;
 if(b.id==='obgo'){S.hpd=o.h;save();var f=o.g.filter(function(k){return D.courses[k]})[0];if(f){S.cur=f;save();setCur(f)}location.hash='#/today';return}
 if(b.hasAttribute('data-g')){var k=b.getAttribute('data-g'),i=o.g.indexOf(k);if(i>-1)o.g.splice(i,1);else o.g.push(k)}
 if(b.hasAttribute('data-l'))o.lv=b.getAttribute('data-l');if(b.hasAttribute('data-oh'))o.h=+b.getAttribute('data-oh');save();vStart()});

// ---- ask AI
function askAI(di){var t=di.topic?di.topic.t:(di.project?di.project.t:'مراجعة الأسبوع'),q='أنا طالب بتعلم "'+C().name+'" من الصفر. اشرحلي "'+t+'" ببساطة بالعربي المصري مع مثال عملي، وبعدين اسألني 3 أسئلة تمرين وصحح إجاباتي.';
 return '<div class="ask"><span>🤖 عالق؟ انسخ السؤال وافتح:</span> <a href="https://chatgpt.com" target="_blank" rel="noopener" data-ask="'+esc(q)+'">ChatGPT</a><a href="https://gemini.google.com" target="_blank" rel="noopener" data-ask="'+esc(q)+'">Gemini</a><a href="https://claude.ai" target="_blank" rel="noopener" data-ask="'+esc(q)+'">Claude</a></div>'}
document.addEventListener('click',function(e){var a=e.target.closest('[data-ask]');if(!a)return;var t=a.getAttribute('data-ask');try{navigator.clipboard.writeText(t).then(function(){toast('اتنسخ السؤال. الصقه في الشات')},function(){toast('افتح الشات واكتب سؤالك')})}catch(x){toast('افتح الشات واكتب سؤالك')}});
// ---- placement
var PL={i:0,sc:[]};
function plLevels(){return C().phases.filter(function(p){return C().quizzes[p.id]&&p.id!=='aix'&&p.id!=='p7'&&p.w})}
function vPlace(){var L=plLevels(),h=header()+'<h2>اختبار تحديد المستوى</h2><p class="sub">'+esc(C().name)+'. الاختبار بيمشي مرحلة مرحلة وبيقف لما تغلط كتير. ده تقدير، مش شهادة.</p>';
 if(PL.cur!==cur){PL={i:0,sc:[],cur:cur}}
 h+='<p><button class="btn" id="plz">ابدأ من الصفر بدون اختبار</button></p>';
 if(PL.i>=L.length||PL.done){var st=PL.done!==undefined?PL.done:L.length-1;view.innerHTML=h+'<section class="card"><h3>مستواك التقريبي: '+esc(L[st].e+' '+L[st].t)+'</h3><p class="sub">هنبدأ بيك من المرحلة دي.</p><button class="btn pri" id="plgo" data-st="'+st+'">ابدأ من هنا</button> <button class="btn" id="plre">أعد الاختبار</button></section>';bindPl();return}
 var ph=L[PL.i],qs=C().quizzes[ph.id];h+='<p class="meta">مرحلة '+(PL.i+1)+' من '+L.length+': '+esc(ph.t)+'</p><form id="plf">';
 qs.forEach(function(q,i){h+='<section class="card"><b>'+(i+1)+'. '+esc(q[0])+'</b>';q[1].forEach(function(o,j){h+='<label class="opt"><input type="radio" name="q'+i+'" value="'+j+'"><span>'+esc(o)+'</span></label>'});h+='</section>'});
 h+='<button class="btn pri" type="submit">التالي</button></form>';view.innerHTML=h;bindPl();
 var f=$('#plf');if(f)f.addEventListener('submit',function(e){e.preventDefault();var sc=0;qs.forEach(function(q,i){var v=document.querySelector('input[name=q'+i+']:checked');if(v&&+v.value===q[2])sc++});
  if(sc>=qs.length-1){PL.i++}else{PL.done=PL.i}window.scrollTo(0,0);vPlace()})}
function bindPl(){var z=$('#plz');if(z)z.addEventListener('click',function(){S.from=S.from||{};S.from[cur]=0;save();setCur(cur);PL={i:0,sc:[],cur:cur};location.hash='#/today'});
 var g=$('#plgo');if(g)g.addEventListener('click',function(){var L=plLevels(),ph=L[+g.getAttribute('data-st')];S.from=S.from||{};S.from[cur]=ph.w[0]-1;save();setCur(cur);PL={i:0,sc:[],cur:cur};location.hash='#/today'});
 var r=$('#plre');if(r)r.addEventListener('click',function(){PL={i:0,sc:[],cur:cur};vPlace()})}
function toast(m){var t=$('#toast');t.textContent=m;t.className='show';setTimeout(function(){t.className=''},2600)}
setCur(S.cur||'ai');window.addEventListener('hashchange',go);go();
})();
