(function(){
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var D='2026-11-26';
// kind: 'p' = صفحة برنامج/وحدة امتياز تحققت منها، 'h' = الصفحة الرئيسية للكلية فقط (برنامج الامتياز غير متحقق منه)
var FAC=[
['طب المنصورة','p','https://medfac.mans.edu.eg/index.php/program-mandatry-ar-01','صفحة برنامج الامتياز الإلزامي (تحققت منها)'],
['طب طنطا','p','https://tin.tanta.edu.eg/emtiaze/Default.aspx','وحدة شئون الامتياز (عنوان وتليفون وإيميل، تحققت منها)'],
['طب طنطا','h','https://med.tanta.edu.eg/','الموقع الرئيسي للكلية'],
['طب أسيوط','p','https://b.aun.edu.eg/medicine/ar/node/39059','خبر رسمي عن يوم تعريفي لأطباء الامتياز (مثال على الصفحة، مش دليل البرنامج)'],
['طب أسيوط','h','https://www.aun.edu.eg/medicine/','الموقع الرئيسي للكلية'],
['طب عين شمس','h','https://med.asu.edu.eg/home/','الموقع الرئيسي، دور على الامتياز جواه (برنامج الامتياز غير متحقق منه)'],
['طب القاهرة (قصر العيني)','h','https://ar.medicine.cu.edu.eg/','الموقع الرئيسي (الموقع بيحجب الفحص الآلي، افتحه بنفسك، والامتياز غير متحقق منه)'],
['طب الأزهر','h','https://www.medicineazhar.edu.eg/','الموقع الرئيسي (الامتياز غير متحقق منه)'],
['طب جامعة الإسكندرية','h','https://www.alexu.edu.eg/','موقع الجامعة (دور على كلية الطب، والامتياز غير متحقق منه)'],
['طب جامعة السويس','h','https://med.suez.edu.eg/','الموقع الرئيسي (الامتياز غير متحقق منه)'],
['طب جامعة بني سويف','h','https://med.bsu.edu.eg/','الموقع الرئيسي (الامتياز غير متحقق منه)']
];
window.vFac=function(view){
var names=[];FAC.forEach(function(r){if(names.indexOf(r[0])<0)names.push(r[0])});
var s0=localStorage.getItem('learnhub.fac')||'';
view.innerHTML='<a class="back" href="#/">← المهارات</a><h2>اختار كليتك</h2><div class="note">دي مش قايمة كاملة، دي الكليات اللي قدرت أتحقق من صفحاتها الرسمية بتاريخ '+D+'. برنامج الامتياز بيختلف من كلية لكلية وبيتغير، فاعتمد على صفحة كليتك. الصفحات اللي مكتوب عليها "غير متحقق" هي الصفحة الرئيسية بس. لو كليتك مش في القايمة، دور في موقعها الرسمي، ومفيش حاجة من هنا بتضمن قبول أو تعيين.</div><div class="card"><label>الكلية <select id="fc"><option value="">اختار</option>'+names.map(function(n){return '<option'+(n===s0?' selected':'')+'>'+esc(n)+'</option>'}).join('')+'</select></label></div><div id="fo"></div><p><a class="btn" href="#/open/car">خريطة الامتياز في مسار المهنة</a> <a class="btn" href="#/find">دليل مراكز التدريب</a></p>';
function draw(){var n=document.getElementById('fc').value;localStorage.setItem('learnhub.fac',n);
document.getElementById('fo').innerHTML=n?FAC.filter(function(r){return r[0]===n}).map(function(r){return '<div class="card"><b>'+(r[1]==='h'?'الصفحة الرئيسية':'صفحة الامتياز')+'</b><div class="mut">'+esc(r[3])+'</div><a href="'+r[2]+'" target="_blank" rel="noopener">فتح الرابط الرسمي</a></div>'}).join(''):'';}
document.getElementById('fc').onchange=draw;draw();};
})();
