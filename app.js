(function(){
'use strict';
var D=window.DATA, KEY='learnhub.v2', cur='ai', W, DAYS;
function C(){return D.courses[cur]}
var SEQ=[],ALL=[];
function hpd(){var c=((S||{}).hpdc||{})[cur];return Math.max(1,Math.min(10,+c||+((S||{}).hpd)||3))}
function setH(v){S.hpdc=S.hpdc||{};S.hpdc[cur]=v}function setD(v){S.dpwc=S.dpwc||{};S.dpwc[cur]=v}
function buildSeq(){SEQ=[];var L=C().labels;W.forEach(function(w,wi){var ph=C().phases.filter(function(p){return p.id===w.p})[0],k=0;
 for(var d=0;d<5;d++){var t=w.topics[Math.min(w.topics.length-1,Math.floor(d*w.topics.length/5))];
  [{k:'learn',e:'📖',t:'اتعلّم: '+t.t,links:t.links},{k:'do',e:'🛠️',t:L.d.replace('{t}',t.t)},{k:'rev',e:'✍️',t:L.r}].forEach(function(b){SEQ.push({wi:wi,ph:ph,topic:t,b:b,id:cur+':'+wi+':'+(k++)})})}
 var pj=w.proj?C().projects[w.proj]:null;
 (pj?[{k:'proj',e:'🧪',t:L.p+pj.t+' (ابدأ أو كمّل)'},{k:'proj',e:'💻',t:L.p2},{k:'rev',e:'📝',t:L.p3}]:[{k:'rev',e:'🔁',t:'راجع مواضيع الأسبوع كلها (ملخصاتك)'},{k:'do',e:'🛠️',t:L.x},{k:'rev',e:'📝',t:'اكتب 5 أسطر: إيه اللي اتعلمته الأسبوع ده'}]).forEach(function(b){SEQ.push({wi:wi,ph:ph,topic:null,project:pj,b:b,id:cur+':'+wi+':'+(k++)})})})}
function fromW(){return ((S&&S.from)||{})[cur]||0}
function calcDays(){DAYS=Math.max(1,Math.ceil(SEQ.length/hpd()))}
function setCur(k){cur=k;W=C().weeks;buildSeq();var f=fromW();if(f)SEQ=SEQ.filter(function(x){return x.wi>=f});var g=goalOf();if(g&&g.w!=='all'){var set={};g.w.forEach(function(n){set[n-1]=1});SEQ=SEQ.filter(function(x){return set[x.wi]})}var sk=((S&&S.skip)||{})[k]||[];if(sk.length){SEQ=SEQ.filter(function(x){return sk.indexOf(W[x.wi].p)<0})}calcDays()}
function goalOf(){var gl=C().goals||[],id=((S&&S.goal)||{})[cur]||'full';return gl.filter(function(g){return g.id===id})[0]||null}
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
var AR=function(d,o){return pd(d).toLocaleDateString((window.hubLang&&({ar:'ar-EG',en:'en-GB',fr:'fr-FR',es:'es-ES',de:'de-DE'})[window.hubLang.cur])||'ar-EG',o)};
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
function dpw(){var c=((S||{}).dpwc||{})[cur];return Math.max(3,Math.min(7,+c||+((S||{}).dpw)||6))}
function calEnd(days){return Math.ceil(days*7/dpw())}
var PACES=[['fast','🔥','مكثف',6,7,'نهاية سريعة، محتاج انضباط عالي وراحة كافية'],['mid','⚖️','متوسط',3,6,'الأنسب لمعظم الناس'],['calm','🌿','هادي',2,5,'بدون ضغط، يناسب الدراسة أو الشغل']];
function curPace(){var p=PACES.filter(function(x){return x[3]===hpd()&&x[4]===dpw()})[0];return p?p[0]:'custom'}
function todayN(){var n=Math.floor(diffDays(ds(new Date()),S.start[cur])*dpw()/7)+1;return Math.max(1,Math.min(DAYS,n))}
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
 h+=dayCard(n,true)+companionCard()+checkin();
 var tot=totals(),end=addDays(start,calEnd(DAYS)-1);
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
 h+='<p><a class="btn pri" href="#/ready">💼 جاهز للشغل؟ قايمة التوظيف</a> <a class="btn" href="#/books">📖 كتب مقترحة</a></p><h3>الأوسمة</h3><div class="badges">';
 BADGES.concat(phaseBadges()).forEach(function(b){var ok=b[2]();h+='<div class="bd'+(ok?' on':'')+'" title="'+esc(b[3])+'"><span>'+(ok?b[0]:'🔒')+'</span><b>'+esc(b[1])+'</b><small>'+esc(b[3])+'</small></div>'});
 h+='</div>';view.innerHTML=h}
function vQuiz(id){var ph=C().phases.filter(function(p){return p.id===id})[0],qs=C().quizzes[id];if(!ph||!qs){location.hash='#/plan';return}
 var h=header()+'<a class="back" href="#/plan">← الخطة</a><h2>Quiz: '+esc(ph.t)+'</h2><p class="sub">'+qs.length+' أسئلة. اختار الإجابة وبعدين اضغط تصحيح.</p><form id="qf">';
 qs.forEach(function(q,i){h+='<section class="card"><b>'+(i+1)+'. '+esc(q[0])+'</b>';q[1].forEach(function(o,j){h+='<label class="opt"><input type="radio" name="q'+i+'" value="'+j+'"><span>'+esc(o)+'</span></label>'});h+='<div class="exp" id="e'+i+'"></div></section>'});
 h+='<button class="btn pri" type="submit">تصحيح</button><div id="res"></div></form>';view.innerHTML=h;
 $('#qf').addEventListener('submit',function(e){e.preventDefault();var sc=0;qs.forEach(function(q,i){var v=document.querySelector('input[name=q'+i+']:checked'),ok=v&&+v.value===q[2];if(ok)sc++;var ex=$('#e'+i);ex.className='exp '+(ok?'ok':'bad');ex.textContent=(ok?'صح ✓ ':'الصح: '+q[1][q[2]]+'. ')+q[3]});
  var k=cur+':'+id,old=S.quiz[k]||{best:0};S.quiz[k]={best:Math.max(old.best,sc),total:qs.length,last:sc};save();
  $('#res').innerHTML='<div class="note">درجتك '+sc+' من '+qs.length+(sc===qs.length?' 🎉 ممتاز':sc>=qs.length/2?' 👍 كويس، راجع الغلط':' 💪 راجع المواضيع وأعد المحاولة')+'</div>';$('#res').scrollIntoView({behavior:'smooth',block:'center'})})}
function vHub(){var h='<div class="hero">'+LOGO+'<h1>مركز المهارات</h1><p>مسارات من الصفر للاحتراف، بمصادر مجانية، وجدول بالساعات اللي تناسبك، وتتبع وتحديات. <a href="#/start">ابدأ بالأسئلة</a></p></div>'+header();
 h+='<h2>المهارات</h2><div class="grid">';
 D.skills.forEach(function(s){var ready=s.status==='ready',tt=ready?withCur(s.id,totals):null;
  h+='<a class="sk'+(ready?'':' soon')+'" style="--c:'+s.color+'" href="#/'+(ready?'open/'+s.id:'skill/'+s.id)+'"><span class="em">'+ico(s.id)+'</span><b>'+esc(s.name)+'</b><small>'+esc(s.short)+'</small><span class="tag">'+(ready?'جاهز · '+pct(tt.c,tt.t)+'%':'جاري البناء')+'</span></a>'});
 h+='</div><p><a class="btn" href="#/space">🗂️ مساحتي</a> <a class="btn" href="#/compare">📊 قارن المهارات والدخل</a> <a class="btn" href="#/about">ℹ️ كلام صريح وتفاصيل</a></p>';
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
function instHtml(){var st=window.hubInstallState||{};if(st.standalone)return '<section class="card"><h3>تطبيق</h3><p class="sub">أنت شغال من التطبيق المثبت بالفعل.</p></section>';return '<section class="card"><h3>ثبّت الموقع كتطبيق (مجاني)</h3><p class="sub">أندرويد وكروم/إيدج على اللابتوب: دوس الزرار. آيفون: من سفاري دوس زر المشاركة ثم "إضافة إلى الشاشة الرئيسية". التقدم بتاعك محفوظ على جهازك ومش بيتمسح مع التحديثات. بعد أول فتح بيشتغل أوفلاين لما الملفات تتخزن (الروابط الخارجية والخط محتاجين نت).</p><button class="btn pri" id="instbtn">تثبيت التطبيق</button></section>'}
function vSettings(){var h=header()+'<h2>الإعدادات والنسخ الاحتياطي</h2>';
 h+='<section class="card"><h3>اسمك</h3><input id="nm" class="inp" value="'+esc(S.name)+'" placeholder="خالد"></section>';
h+='<section class="card"><h3>🧭 أسئلة المسار</h3><p class="sub">غيّر هدفك ووقتك ومستواك والمراحل اللي عايزها لمسار ده.</p><a class="btn pri" href="#/q/'+cur+'">غيّر إجاباتك</a></section>'+instHtml()+dlHtml()+pairHtml();
 h+='<section class="card"><h3>هدفك</h3><p class="sub">مش لازم تخلص المسار كله. اختار الهدف، وارفعه لما تحب. تقدمك بيفضل محفوظ.</p><div class="hsel">'+(C().goals||[]).map(function(g){var n=g.w==='all'?W.length:g.w.length;return '<button class="chip'+((goalOf()||{}).id===g.id?' on':'')+'" data-goal="'+g.id+'">'+g.e+' '+g.name+' · '+n+' أسبوع</button>'}).join('')+'</div><div class="meta">'+esc((goalOf()||{}).note||'')+'</div><div class="meta">الوقت = ساعات الهدف ÷ ساعاتك في اليوم. ده تقدير للساعات المخططة مش وعد بنتيجة.</div></section>';
 h+='<section class="card"><h3>سرعتك</h3><p class="sub">اختار سرعة جاهزة أو عدّل الساعات بنفسك. الجدول والتواريخ بيتحسبوا تاني.</p><div class="hsel">'+PACES.map(function(p){return '<button class="chip'+(curPace()===p[0]?' on':'')+'" data-pace="'+p[0]+'">'+p[1]+' '+p[2]+' · '+p[3]+' س × '+p[4]+' أيام</button>'}).join('')+'</div><div class="meta">'+PACES.map(function(p){return p[1]+' '+p[2]+': '+p[5]}).join('<br>')+'</div><div class="meta">لا السرعة العالية بتضمن إتقان، ولا الهادية بتقلل الفايدة. الاستمرارية أهم.</div></section>';
 h+='<section class="card"><h3>ساعاتك في اليوم</h3><p class="sub">غيّرها في أي وقت. تقدمك بيفضل زي ما هو والجدول بيتحسب تاني.</p><div class="hsel">'+[1,2,3,4,5,6,8].map(function(x){return '<button class="chip'+(x===hpd()?' on':'')+'" data-h="'+x+'">'+x+' س</button>'}).join('')+'</div><div class="meta">'+Object.keys(D.courses).map(function(k){return withCur(k,function(){return esc(C().name)+': '+SEQ.length+' ساعة، '+DAYS+' يوم دراسة، تخلص بعد '+calEnd(DAYS)+' يوم تقويم (حوالي '+Math.round(calEnd(DAYS)/30.4*10)/10+' شهر)'})}).join('<br>')+'</div></section>';
 h+='<section class="card"><h3>ارفع أو نزّل مستواك</h3><p class="sub">اختار المرحلة اللي تبدأ منها في أي وقت، وتقدمك القديم بيفضل محفوظ. لو عندك أساس، اعمل اختبار المرحلة من صفحة الخطة، ولو نجحت ابدأ من اللي بعدها.</p><select id="frm" class="inp">'+C().phases.map(function(p){return '<option value="'+(p.w[0]-1)+'"'+(fromW()===p.w[0]-1?' selected':'')+'>'+esc(p.e+' '+p.t)+'</option>'}).join('')+'</select></section>';
 h+='<section class="card"><h3>تاريخ بداية الخطة</h3><p class="sub">اليوم 1 هو التاريخ ده. نهاية الخطة بعد '+DAYS+' يوم.</p><input id="sd" type="date" class="inp" value="'+S.start[cur]+'"><button class="btn" id="sdn">ابدأ من النهاردة</button><div class="meta">نهاية الخطة: '+AR(addDays(S.start[cur],calEnd(DAYS)-1),{day:'numeric',month:'long',year:'numeric'})+'</div></section>';
 h+='<section class="card"><h3>تذكير يومي</h3><p class="sub">الموقع ثابت ومش بيبعت إشعارات. نزّل ملف تقويم (ICS) وافتحه على موبايلك، هيضيف تذكير يومي في تطبيق التقويم.</p><input id="rt" type="time" class="inp" value="'+esc(S.remind)+'"><button class="btn pri" id="ics">تنزيل التذكير اليومي</button></section>';
 h+='<section class="card"><h3>نسخة احتياطية</h3><p class="sub">تقدمك محفوظ على الجهاز ده والمتصفح ده بس. لو مسحت بيانات المتصفح هيضيع. صدّر ملف واحتفظ بيه.</p><button class="btn pri" id="exp">تصدير التقدم (ملف)</button> <label class="btn">استيراد ملف<input id="imp" type="file" accept="application/json,.json" hidden></label><div id="impm" class="meta"></div></section>';
 h+='<section class="card"><h3>مسح كل شيء</h3><button class="btn danger" id="rst">مسح التقدم</button></section>';
 view.innerHTML=h;
 $('#nm').addEventListener('change',function(e){S.name=e.target.value.trim().slice(0,30);save()});
 document.querySelectorAll('[data-pair]').forEach(function(b){b.addEventListener('click',function(){S.pair=S.pair||{};var a=S.pair[cur]||[],k=b.getAttribute('data-pair'),i=a.indexOf(k);if(i>=0)a.splice(i,1);else a.push(k);S.pair[cur]=a;save();vSettings()})});
 document.querySelectorAll('[data-dlm]').forEach(function(b){b.addEventListener('click',function(){S.dlm=S.dlm||{};S.dlm[cur]=+b.getAttribute('data-dlm');save();vSettings()})});
 document.querySelectorAll('[data-dlg]').forEach(function(b){b.addEventListener('click',function(){S.goal=S.goal||{};S.goal[cur]=b.getAttribute('data-dlg');save();setCur(cur);vSettings()})});
 document.querySelectorAll('[data-goal]').forEach(function(b){b.addEventListener('click',function(){S.goal=S.goal||{};S.goal[cur]=b.getAttribute('data-goal');save();setCur(cur);vSettings()})});
 document.querySelectorAll('[data-pace]').forEach(function(b){b.addEventListener('click',function(){var p=PACES.filter(function(x){return x[0]===b.getAttribute('data-pace')})[0];setH(p[3]);setD(p[4]);save();setCur(cur);vSettings()})});
 document.querySelectorAll('[data-h]').forEach(function(b){b.addEventListener('click',function(){setH(+b.getAttribute('data-h'));save();setCur(cur);vSettings()})});
 $('#frm').addEventListener('change',function(e){S.from=S.from||{};S.from[cur]=+e.target.value;save();setCur(cur);vSettings()});
 $('#sd').addEventListener('change',function(e){if(e.target.value){S.start[cur]=e.target.value;save();vSettings()}});
 $('#sdn').addEventListener('click',function(){S.start[cur]=ds(new Date());save();vSettings()});
 $('#rt').addEventListener('change',function(e){S.remind=e.target.value||'20:00';save()});
 $('#ics').addEventListener('click',function(){var t=(S.remind||'20:00').split(':'),d=S.start[cur].replace(/-/g,'');var ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//learning-hub//AR','BEGIN:VEVENT','UID:daily@learning-hub','DTSTAMP:20260101T000000Z','DTSTART:'+d+'T'+t[0]+t[1]+'00','DTEND:'+d+'T'+(('0'+((+t[0]+hpd())%24)).slice(-2))+t[1]+'00','RRULE:FREQ=DAILY;COUNT='+calEnd(DAYS),'SUMMARY:'+hpd()+' ساعات مذاكرة ('+C().name+')','DESCRIPTION:افتح الموقع واعمل مهام النهاردة','BEGIN:VALARM','TRIGGER:-PT10M','ACTION:DISPLAY','DESCRIPTION:وقت المذاكرة','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');dl('daily-reminder.ics',ics,'text/calendar')});
 $('#exp').addEventListener('click',function(){dl('learning-progress-'+ds(new Date())+'.json',JSON.stringify(S,null,1),'application/json')});
 $('#imp').addEventListener('change',function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var o=JSON.parse(r.result);if(!o||typeof o!=='object'||!o.done||!o.start)throw 0;if(!confirm('ده هيستبدل تقدمك الحالي. تكمل؟'))return;S=o;load2();save();$('#impm').textContent='تم الاستيراد ✓'}catch(x){$('#impm').textContent='الملف ده مش نسخة تقدم صحيحة.'}};r.readAsText(f)});
 $('#rst').addEventListener('click',function(){if(confirm('متأكد؟ ده هيمسح كل التقدم.')&&confirm('تأكيد أخير: مسح نهائي؟')){localStorage.removeItem(KEY);S=load();save();vSettings()}})}
function load2(){S.v=2;S.start=S.start||{};S.done=S.done||{};S.proj=S.proj||{};S.quiz=S.quiz||{};S.log=S.log||{};S.name=S.name||'';S.remind=S.remind||'20:00';S.cur=S.cur&&D.courses[S.cur]?S.cur:'ai';Object.keys(D.courses).forEach(function(k){if(!S.start[k])S.start[k]=ds(new Date())});setCur(S.cur)}
function dl(name,txt,mime){var b=new Blob([txt],{type:mime+';charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)}
// ---- router
function go(){var h=location.hash.replace(/^#\/?/,''),p=h.split('/');route=p[0]||'';
 document.querySelectorAll('.tabs a').forEach(function(a){var r=a.getAttribute('data-r');a.setAttribute('aria-current',(r===route||(r===''&&route===''))?'page':'false')});
 if(route==='open'){var k=p[1];if(D.courses[k]){S.cur=k;save();setCur(k)}S.qd=S.qd||{};location.replace(S.qd[k]?'#/today':'#/q/'+k);return}
 if(route==='q'){var k2=p[1];if(D.courses[k2]&&k2!==cur){S.cur=k2;save();setCur(k2)}vQ();return}
 ({'':vHub,today:vToday,plan:function(){vPlan(p[1])},projects:vProjects,wins:vWins,quiz:function(){vQuiz(p[1])},compare:vCompare,about:vAbout,settings:vSettings,habits:vHabits,place:vPlace,start:vStart,ready:vReady,books:vBooks,space:function(){window.vSpace(view)},skill:function(){vSkill(p[1])}}[route]||vHub)();
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
 h+='<section class="card"><h3>3. سرعتك</h3><div class="hsel">'+PACES.map(function(p){return '<button class="chip'+(o.h===p[3]&&(o.d||dpw())===p[4]?' on':'')+'" data-op="'+p[0]+'">'+p[1]+' '+p[2]+'</button>'}).join('')+'</div><p class="sub">أو اختار الساعات بنفسك:</p><div class="hsel">'+[1,2,3,4,5,6,8].map(function(x){return '<button class="chip'+(x===o.h?' on':'')+'" data-oh="'+x+'">'+x+' س</button>'}).join('')+'</div></section>';
 var picks=GOALS.filter(function(g){return o.g.indexOf(g[0])>-1});
 if(picks.length){var hh=o.h,tot=0,dd=o.d||dpw(),d0=ds(new Date());h+='<section class="card"><h3>ترتيبي المقترح</h3><p class="sub">واحد بعد التاني، بـ '+hh+' ساعة يوميا:</p>';
  picks.forEach(function(g){var sk=D.skills.filter(function(s){return s.id===g[0]})[0],ready=sk&&sk.status==='ready',hrs=ready?D.courses[g[0]].weeks.length*18:0,days=ready?Math.ceil(hrs/hh):0;
   h+='<div class="peek">'+g[1]+' '+esc(g[2])+': '+(ready?hrs+' ساعة، حوالي '+days+' يوم (يخلص '+AR(addDays(d0,Math.ceil((tot+days)*7/dd)),{day:'numeric',month:'long',year:'numeric'})+')':'جاري البناء')+'</div>';tot+=days});
  h+='<p class="sub">الأرقام تقدير للساعات المخططة، مش ضمان لمستوى أو وظيفة. '+(o.lv==='zero'?'وانت بادئ من الصفر، فابدأ بأول مرحلة.':'وبما إن عندك أساس، اعمل اختبار المراحل وابدأ من مرحلة أعلى من الإعدادات.')+'</p><button class="btn pri" id="obgo">طبّق وابدأ</button></section>'}
 view.innerHTML=h}
document.addEventListener('click',function(e){var b=e.target.closest('[data-g],[data-l],[data-oh],[data-op],#obgo');if(!b||route!=='start')return;S.ob=S.ob||{g:[],lv:'zero',h:hpd()};var o=S.ob;
 if(b.id==='obgo'){S.hpd=o.h;if(o.d)S.dpw=o.d;save();var f=o.g.filter(function(k){return D.courses[k]})[0];if(f){S.cur=f;save();setCur(f)}location.hash='#/today';return}
 if(b.hasAttribute('data-g')){var k=b.getAttribute('data-g'),i=o.g.indexOf(k);if(i>-1)o.g.splice(i,1);else o.g.push(k)}
 if(b.hasAttribute('data-l'))o.lv=b.getAttribute('data-l');if(b.hasAttribute('data-oh'))o.h=+b.getAttribute('data-oh');if(b.hasAttribute('data-op')){var pp=PACES.filter(function(x){return x[0]===b.getAttribute('data-op')})[0];o.h=pp[3];o.d=pp[4]}save();vStart()});

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

// ---- adaptive check-in
function ciList(){S.ci=S.ci||{};var a=[];Object.keys(S.ci).forEach(function(k){var v=S.ci[k];if(v.c===cur)a.push({d:k.split('|')[0],r:v.r})});a.sort(function(x,y){return x.d<y.d?-1:1});return a}
function curPhaseIx(){var P=C().phases,t=SEQ.filter(function(x){return !isDone(x.id)})[0],wi=t?t.wi:W.length-1,ix=0;P.forEach(function(p,i){if(wi+1>=p.w[0]&&wi+1<=p.w[1])ix=i});return ix}
function suggestion(){var l=ciList().slice(-5);if(l.length<3)return null;var last=l[l.length-1].d;if((S.sg||{})[cur]===last)return null;var hard=l.filter(function(x){return x.r===1}).length,easy=l.filter(function(x){return x.r===3}).length,P=C().phases,ix=curPhaseIx(),acts=[];
 if(hard>=3){var m='الأيام الأخيرة كانت صعبة. ممكن تهدّي: قلل الساعات أو ارجع مرحلة.';if(hpd()>1)acts.push(['hpd',hpd()-1,'قلل لـ '+(hpd()-1)+' ساعة']);if(ix>0)acts.push(['ph',P[ix-1].w[0]-1,'ارجع لمرحلة: '+P[ix-1].t]);return{m:m,a:acts,k:last}}
 if(easy>=3){var m2='الأيام اللي فاتت كانت سهلة. ممكن ترفع مستواك: زوّد الساعات أو انتقل لمرحلة أعلى.';if(hpd()<8)acts.push(['hpd',hpd()+1,'زوّد لـ '+(hpd()+1)+' ساعة']);if(ix<P.length-1&&P[ix+1].id!=='aix')acts.push(['ph',P[ix+1].w[0]-1,'ابدأ مرحلة: '+P[ix+1].t]);return{m:m2,a:acts,k:last}}return null}
function checkin(){var td=ds(new Date()),k=td+'|'+cur,v=(S.ci||{})[k],h='<section class="card"><h3>إزاي كان يومك؟</h3><div class="hsel">'+[[1,'😓 صعب'],[2,'🙂 تمام'],[3,'😎 سهل']].map(function(o){return '<button class="chip'+(v&&v.r===o[0]?' on':'')+'" data-ci="'+o[0]+'">'+o[1]+'</button>'}).join('')+'</div><div class="meta">إجاباتك بتتحفظ على جهازك وبتساعد الموقع يقترح تعديل. الاقتراح مجرد اقتراح وتقدر ترفضه أو تعدّل بنفسك من الإعدادات.</div>',sg=suggestion();
 if(sg)h+='<div class="note">'+esc(sg.m)+'<div class="hsel">'+sg.a.map(function(a,i){return '<button class="chip" data-sg="'+i+'">'+esc(a[2])+'</button>'}).join('')+'<button class="chip" data-sgx="1">تجاهل</button></div></div>';
 return h+'</section>'}
document.addEventListener('click',function(e){var b=e.target.closest('[data-ci],[data-sg],[data-sgx]');if(!b)return;
 if(b.hasAttribute('data-ci')){S.ci=S.ci||{};S.ci[ds(new Date())+'|'+cur]={c:cur,r:+b.getAttribute('data-ci')};save();var y=window.scrollY;go();window.scrollTo(0,y);return}
 var sg=suggestion();if(!sg)return;S.sg=S.sg||{};
 if(b.hasAttribute('data-sg')){var a=sg.a[+b.getAttribute('data-sg')];if(a[0]==='hpd')setH(a[1]);else{S.from=S.from||{};S.from[cur]=a[1]}setCur(cur);toast('اتعدّل الجدول. تقدر ترجع من الإعدادات')}
 S.sg[cur]=sg.k;save();go()});

function goalHours(g){return (g.w==='all'?W.length:g.w.length)*18}
function dlHtml(){var m=+((S.dlm||{})[cur])||0,gl=C().goals||[],h='<section class="card"><h3>عايز تبدأ شغل خلال كام شهر؟</h3><p class="sub">اختار المدة والموقع يقترح أنسب هدف بسرعتك الحالية ('+hpd()+' س × '+dpw()+' أيام). ده تخطيط مش وعد بوظيفة.</p><div class="hsel">'+[2,3,4,6,9,12].map(function(x){return '<button class="chip'+(m===x?' on':'')+'" data-dlm="'+x+'">'+x+' شهور</button>'}).join('')+'</div>';
 if(m){var cal=m*30.4,fit=null,rows=gl.map(function(g){var d=Math.ceil(goalHours(g)/hpd()*7/dpw());if(d<=cal)fit=g;return g.e+' '+g.name+': '+goalHours(g)+' ساعة، حوالي '+Math.round(d/30.4*10)/10+' شهر'});
  h+='<div class="meta">'+rows.join('<br>')+'</div>';
  if(fit)h+='<div class="note">في '+m+' شهور تقدر توصل لـ: '+fit.e+' '+esc(fit.name)+'. <button class="chip" data-dlg="'+fit.id+'">اضبط الهدف</button></div>';
  else{var g0=gl[0],need=Math.ceil(goalHours(g0)*7/dpw()/cal);h+='<div class="note warn">المدة دي قصيرة على "'+esc(g0.name)+'" بسرعتك الحالية. محتاج حوالي '+need+' ساعة يوميا (بـ '+dpw()+' أيام في الأسبوع)، وده ثقيل. الأفضل تطوّل المدة أو تقلل الهدف. <button class="chip" data-dlg="'+g0.id+'">اضبط الحد الأدنى وكمّل</button></div>'}
  h+='<div class="meta">لو اخترت وقت قصير، المشاريع والتطبيق العملي أهم من عدد الموضوعات.</div>'}
 return h+'</section>'}

function pairList(){S.pair=S.pair||{};return S.pair[cur]||[]}
function nextDayOf(id){return withCur(id,function(){for(var k=1;k<=DAYS;k++){var p=dayProg(k);if(p.c<p.t){var di=dayInfo(k);return {k:k,days:DAYS,t:di.topic?di.topic.t:(di.project?di.project.t:'مراجعة'),ph:di.ph.e+' '+di.ph.t,name:C().name,e:C().e}}}return {done:1,name:C().name,e:C().e}})}
function companionCard(){var pl=pairList().filter(function(k){return k!==cur&&D.courses[k]});if(!pl.length)return '';
 var h='<section class="card"><h3>🤝 رفيق مهارتك</h3><div class="meta">نص ساعة يوميا أو ساعتين في الأسبوع بجانب مهارتك. بيساعدك تسوّق لنفسك وتكمل.</div>';
 pl.forEach(function(k){var x=nextDayOf(k);h+='<div class="peek">'+x.e+' '+esc(x.name)+': '+(x.done?'خلصت كل المطلوب 🎉':'يوم '+x.k+' من '+x.days+' · '+esc(x.t)+' <br><a href="#/open/'+k+'"><b>افتح ←</b></a>')+'</div>'});
 return h+'<div class="meta">لما تفتح الرفيق، ارجع لمهارتك من الصفحة الرئيسية.</div></section>'}
function pairHtml(){var pl=pairList(),opts=[['biz','💡','Business Mastery'],['mind','🏔️','Mindset والنجاح']].filter(function(o){return o[0]!==cur&&D.courses[o[0]]});if(!opts.length)return '';
 var h='<section class="card"><h3>🤝 اربط مهارتك بالبيزنس والـ Mindset</h3><p class="sub">عشان تسوّق لنفسك وتبيع مهارتك وتكمل بانتظام. بتظهر في صفحة "النهارده" كرفيق للمهارة.</p><div class="hsel">';
 opts.forEach(function(o){h+='<button class="chip'+(pl.indexOf(o[0])>=0?' on':'')+'" data-pair="'+o[0]+'">'+o[1]+' '+o[2]+'</button>'});return h+'</div></section>'}
function booksHtml(){var b=C().books;if(!b||!b.length)return '<div class="note">قايمة الكتب لمسار ده لسه هتتضاف.</div>';
 var h='<div class="note"><b>الكتب اختيارية</b>الكتب دي بتكمّل المسار، وكلها موجودة فعلا (اتأكدت من Open Library). المسار نفسه مجاني، فلو مش هتشتري، الكتب المجانية والبدائل مكتوبة جنب كل كتاب. ماحطيتش أي روابط تحميل غير قانوني.</div>';
 b.forEach(function(x){h+='<section class="card"><h3>📖 '+esc(x[0])+'</h3><div class="meta">'+esc(x[1])+'</div><p>'+esc(x[2])+'</p><div class="meta">مكانه في المسار: '+esc(x[3])+' · '+(x[4]==='free'?'🆓 مجاني وقانوني':'💵 مدفوع')+'</div><div class="meta">بديل مجاني: '+esc(x[5])+'</div></section>'});return h}
function vBooks(){view.innerHTML=header()+'<a class="back" href="#/">← المهارات</a><h2>كتب مقترحة: '+esc(C().name)+'</h2>'+booksHtml()}

var QS=null;
function qInit(){var ph=C().phases,f=fromW(),fp=0;ph.forEach(function(p,i){if(p.w[0]-1<=f)fp=i});return {goal:((S.goal||{})[cur])||'full',h:hpd(),d:dpw(),from:fp,skip:((S.skip||{})[cur]||[]).slice(),qa:Object.assign({},((S.qa||{})[cur])||{}),c:cur}}
function chipQ(k,v,on,l){return '<button class="chip'+(on?' on':'')+'" data-qk="'+k+'" data-qv="'+esc(String(v))+'">'+esc(l)+'</button>'}
function vQ(){if(!QS||QS.c!==cur)QS=qInit();var c=C(),ph=c.phases,gl=c.goals||[],h=header()+'<a class="back" href="#/">← المهارات</a><h2>🧭 خلّي المسار على مقاسك: '+esc(c.name)+'</h2><p class="sub">كل إجابة تقدر تغيّرها في أي وقت من الإعدادات. مفيش اختيار نهائي.</p>';
 h+='<section class="card"><h3>1. عايز توصل لإيه؟</h3><div class="hsel">'+gl.map(function(g){return chipQ('goal',g.id,QS.goal===g.id,g.e+' '+g.name)}).join('')+'</div><div class="meta">'+esc((gl.filter(function(g){return g.id===QS.goal})[0]||{note:''}).note)+'</div></section>';
 h+='<section class="card"><h3>2. وقتك في اليوم</h3><div class="hsel">'+[1,2,3,4,6].map(function(x){return chipQ('h',x,QS.h===x,x+' ساعة')}).join('')+'</div><div class="meta">أيام في الأسبوع:</div><div class="hsel">'+[3,4,5,6,7].map(function(x){return chipQ('d',x,QS.d===x,x+' أيام')}).join('')+'</div></section>';
 h+='<section class="card"><h3>3. مستواك دلوقتي</h3><div class="hsel">'+ph.map(function(p,i){return chipQ('from',i,QS.from===i,(i===0?'من الأول: ':'أبدأ من: ')+p.e+' '+p.t)}).join('')+'</div><div class="meta">مش متأكد؟ <a href="#/place">اعمل اختبار تحديد المستوى</a>.</div></section>';
 h+='<section class="card"><h3>4. مراحل مش عايزها دلوقتي</h3><div class="hsel">'+ph.map(function(p){return chipQ('skip',p.id,QS.skip.indexOf(p.id)>=0,(QS.skip.indexOf(p.id)>=0?'مستبعدة: ':'')+p.e+' '+p.t)}).join('')+'</div><div class="meta">تقدر ترجعها وقت ما تحب.</div></section>';
 (c.qs||[]).forEach(function(q,qi){h+='<section class="card"><h3>'+(5+qi)+'. '+esc(q.t)+'</h3><div class="hsel">'+q.o.map(function(o,oi){return chipQ('qa'+qi,oi,QS.qa[q.id]===oi,o.l)}).join('')+'</div></section>'});
 h+='<p><button class="btn pri" id="qgo">احفظ وابدأ</button> <button class="btn" id="qskip">تخطي (الإعداد الافتراضي)</button></p><p class="fine">الأرقام تقديرات. لو لقيت المسار سهل أو صعب، غيّره من هنا أو من الإعدادات.</p>';
 view.innerHTML=h;
 document.querySelectorAll('[data-qk]').forEach(function(b){b.addEventListener('click',function(){var k=b.getAttribute('data-qk'),v=b.getAttribute('data-qv');
  if(k==='goal')QS.goal=v;else if(k==='h')QS.h=+v;else if(k==='d')QS.d=+v;else if(k==='from')QS.from=+v;
  else if(k==='skip'){var i=QS.skip.indexOf(v);if(i>=0)QS.skip.splice(i,1);else QS.skip.push(v)}
  else if(k.indexOf('qa')===0){var q=(c.qs||[])[+k.slice(2)];QS.qa[q.id]=+v}
  var y=window.scrollY;vQ();window.scrollTo(0,y)})});
 $('#qgo').addEventListener('click',function(){S.goal=S.goal||{};S.goal[cur]=QS.goal;setH(QS.h);setD(QS.d);S.from=S.from||{};S.from[cur]=ph[QS.from]?ph[QS.from].w[0]-1:0;S.skip=S.skip||{};S.skip[cur]=QS.skip;S.qa=S.qa||{};S.qa[cur]=QS.qa;
  (c.qs||[]).forEach(function(q){var o=q.o[QS.qa[q.id]];if(o&&o.e){if(o.e.goal)S.goal[cur]=o.e.goal;if(o.e.skip)o.e.skip.forEach(function(x){if(S.skip[cur].indexOf(x)<0)S.skip[cur].push(x)});if(o.e.h)setH(o.e.h)}});
  S.qd=S.qd||{};S.qd[cur]=1;save();setCur(cur);QS=null;toast('تم ضبط المسار على مقاسك');location.hash='#/today'});
 $('#qskip').addEventListener('click',function(){S.qd=S.qd||{};S.qd[cur]=1;save();QS=null;location.hash='#/today'})}
var ICS={"med": "<path d=\"M12 3v18M3 12h18\"/><circle cx=\"12\" cy=\"12\" r=\"9\"/>", "res": "<path d=\"M6 18h12M8 21h8M9 14a5 5 0 0 0 6-1M14 4l4 4-6 6-4-4zM8 10l-2 2\"/>", "ai": "<path d=\"M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2\"/><rect x=\"6\" y=\"6\" width=\"12\" height=\"12\" rx=\"2\"/><rect x=\"10\" y=\"10\" width=\"4\" height=\"4\"/>", "cyber": "<path d=\"M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z\"/><path d=\"M9 12l2 2 4-4\"/>", "cloud": "<path d=\"M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z\"/>", "web": "<path d=\"M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14\"/>", "data": "<path d=\"M4 20V10M10 20V4M16 20v-8M22 20H2\"/>", "uiux": "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\"/><path d=\"M4 9h16M9 9v11\"/>", "graphic": "<path d=\"M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2-.6-1.3.2-2.5 1.6-2.5H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3z\"/><circle cx=\"8\" cy=\"11\" r=\"1\"/><circle cx=\"12\" cy=\"7.5\" r=\"1\"/><circle cx=\"16\" cy=\"11\" r=\"1\"/>", "mkt": "<path d=\"M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1zM16 9a4 4 0 0 1 0 6\"/>", "video": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"M10 9l5 3-5 3z\"/>", "biz": "<rect x=\"3\" y=\"7\" width=\"18\" height=\"13\" rx=\"2\"/><path d=\"M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18\"/>", "mind": "<path d=\"M3 20l6-11 4 6 3-4 5 9z\"/>", "lang": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18\"/>"};
function ico(id){var p=ICS[id]||ICS.lang;return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'}
var LOGO='<div class="logo"><svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 5-9 5-9-5z"/><path d="M7 11v5c0 1.5 2.2 3 5 3s5-1.5 5-3v-5"/></svg></div>';
function toast(m){var t=$('#toast');t.textContent=m;t.className='show';setTimeout(function(){t.className=''},2600)}
setCur(S.cur||'ai');window.addEventListener('hashchange',go);go();
})();
/* v3 */

(function(){var re=/(^|[\s(\/])و(?=[A-Za-z])/g,re2=/([A-Za-z0-9+#.)])و(?=\s|$)/g;
function fx(root){var w=document.createTreeWalker(root,4,null),n,a=[];while(n=w.nextNode())a.push(n);a.forEach(function(t){var v=t.nodeValue;if(v.indexOf('و')<0)return;var r=v.replace(/([A-Za-z0-9#.)])\s+و\s*(?=[A-Za-z])/g,'$1 + ').replace(re,'$1و ').replace(re2,'$1 و');if(r!==v)t.nodeValue=r})}
function run(){if(window.hubLang&&window.hubLang.cur!=='ar')return;fx(document.body)}
if(window.MutationObserver){var busy=0,o=new MutationObserver(function(){if(busy)return;busy=1;setTimeout(function(){run();busy=0},30)});o.observe(document.body,{childList:true,subtree:true})}
run()})();

(function(){if('serviceWorker' in navigator&&location.protocol.indexOf('http')===0){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})}
var dp=null;window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;var b=document.getElementById('instbtn');if(b)b.hidden=false});
window.hubInstall=function(){if(dp){dp.prompt();dp=null;return true}return false};
var ios=/iphone|ipad|ipod/i.test(navigator.userAgent),sa=window.matchMedia&&matchMedia('(display-mode: standalone)').matches||navigator.standalone;
window.hubInstallState={ios:ios,standalone:!!sa}})();

document.addEventListener('click',function(e){if(e.target&&e.target.id==='instbtn'){if(!window.hubInstall())alert('لو الزرار ما اشتغلش: من قائمة المتصفح اختار "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".')}});

(function(){var P={'🔥':'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z','⭐':'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z','★':'F','☆':'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z','🔗':'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71','✓':'M20 6 9 17l-5-5','🏆':'M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z','📖':'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z','🧪':'M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2M8.5 2h7','📝':'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z','💡':'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4','🛠':'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z','💼':'M2 7h20v14H2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16','⚡':'M13 2 3 14h9l-1 8 10-12h-9z','🧭':'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z','🎯':'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z','🤖':'M12 8V4H8M4 8h16v12H4zM2 14h2M20 14h2M15 13v2M9 13v2','🌱':'M7 20h10M10 20c5.5-2.5.8-6.4 3-10M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8zM14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z','👑':'M2 4l3 12h14l3-12-6 7-4-7-4 7zM5 20h14','🔒':'M5 11h14v10H5zM7 11V7a5 5 0 0 1 10 0v4','⛰':'M8 3l4 8 5-5 5 15H2z','📌':'M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z'};
var A={'🌟':'⭐','🎉':'⭐','💯':'⭐','🏅':'🏆','📚':'📖','✍':'📝','🚀':'⚡','🧳':'💼','🥚':'🌱','🐣':'🌱','🌿':'🌱','🧠':'💡','🔁':'⚡'};
var keys=Object.keys(P).concat(Object.keys(A));var re=new RegExp('('+keys.map(function(k){return k}).join('|')+')\uFE0F?','g');
function svg(c){c=A[c]||c;var d=P[c];var fill=d==='F';if(fill)d=P['☆'];return '<svg viewBox="0 0 24 24" width="1.1em" height="1.1em" style="vertical-align:-.2em" fill="'+(fill?'currentColor':'none')+'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+d+'"/></svg>'}
function pass(root){var w=document.createTreeWalker(root,4,null),n,a=[];while(n=w.nextNode())a.push(n);a.forEach(function(t){var p=t.parentNode;if(!p||/^(SCRIPT|STYLE|OPTION|SELECT|TEXTAREA|PRE|TITLE)$/.test(p.tagName))return;var v=t.nodeValue;re.lastIndex=0;if(!re.test(v))return;re.lastIndex=0;var sp=document.createElement('span');sp.className='ei';sp.innerHTML=v.replace(/[&<]/g,function(c){return c==='&'?'&amp;':'&lt;'}).replace(re,function(m,c){return svg(c)});p.replaceChild(sp,t)})}
var busy=0;function go2(){if(busy)return;busy=1;setTimeout(function(){pass(document.body);busy=0},40)}
if(window.MutationObserver)new MutationObserver(go2).observe(document.body,{childList:true,subtree:true});go2()})();
