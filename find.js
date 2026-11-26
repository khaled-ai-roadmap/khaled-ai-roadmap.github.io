(function(){
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
window.vFind=function(view){
var F=window.FIND,rows=F.rows,govs=[],sps=[];
rows.forEach(function(r){if(govs.indexOf(r[3])<0)govs.push(r[3]);if(sps.indexOf(r[2])<0)sps.push(r[2])});
govs.sort(function(a,b){return a.localeCompare(b,'ar')});sps.sort(function(a,b){return a.localeCompare(b,'ar')});
var g0=localStorage.getItem('learnhub.find.g')||'',s0=localStorage.getItem('learnhub.find.s')||'';
view.innerHTML='<a class="back" href="#/">← المهارات</a><h2>دليل مراكز تدريب الأطباء المعتمدة (البورد المصري)</h2>'+
'<div class="note">اللي تحت لقطة بتاريخ '+F.date+' من القايمة الرسمية للمجلس الصحي المصري: <a href="'+F.src+'" target="_blank" rel="noopener">الصفحة الرسمية</a>. اللقطة ممكن تكون ناقصة (قراية آلية للصفحة، وفيه محافظات مش ظاهرة فيها)، والقايمة بتتغير (اعتماد، مواعيد، أماكن)، فتأكد من الصفحة الرسمية قبل أي قرار. مش ترتيب ولا تقييم للأفضل، ومش ضمان قبول في أي مكان. التمريض مستبعد. التصنيف (A/B/C/دوران) زي ما هو في القايمة، شوف معناه في الموقع الرسمي.</div>'+
'<div class="card"><label>المحافظة <select id="fg"><option value="">كل المحافظات</option>'+govs.map(function(g){return '<option'+(g===g0?' selected':'')+'>'+esc(g)+'</option>'}).join('')+'</select></label> '+
'<label>التخصص <select id="fs"><option value="">كل التخصصات</option>'+sps.map(function(g){return '<option'+(g===s0?' selected':'')+'>'+esc(g)+'</option>'}).join('')+'</select></label></div><div id="fr"></div>';
function draw(){var g=document.getElementById('fg').value,s=document.getElementById('fs').value;localStorage.setItem('learnhub.find.g',g);localStorage.setItem('learnhub.find.s',s);
var m=rows.filter(function(r){return(!g||r[3]===g)&&(!s||r[2]===s)});
document.getElementById('fr').innerHTML='<p>'+m.length+' نتيجة</p>'+(m.length?m.slice(0,200).map(function(r){return '<div class="card"><b>'+esc(r[0])+'</b><div>'+esc(r[2])+'</div><div class="mut">'+esc(r[3])+' · '+esc(r[1])+' · تصنيف: '+esc(r[4])+'</div></div>'}).join(''):'<div class="note">مفيش نتيجة بالاختيار ده في اللقطة. جرّب محافظة أو تخصص تاني، أو راجع الصفحة الرسمية.</div>');}
document.getElementById('fg').onchange=draw;document.getElementById('fs').onchange=draw;draw();};
})();
