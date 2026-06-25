/**
 * 活動公告資料設定檔
 * ─────────────────────────────────────────
 * 活動資料由後台管理系統自動寫入 _data/events.json
 * 直接修改此檔案或透過後台 /admin 介面管理皆可
 */

var EVENTS = [];

// 從 _data/events.json 載入（後台儲存的資料）
// 本地開啟時 fetch 會失敗，自動使用備用資料
function _loadEvents(callback) {
  fetch('_data/events.json?v=' + Date.now())
    .then(function(r){ return r.json(); })
    .then(function(data){
      EVENTS = ((data && data.list) ? data.list : (Array.isArray(data) ? data : [])).map(function(ev){
        return {
          url:   ev.link  || ev.url  || '',
          tag:   ev.tag   || '活動',
          title: ev.title || '',
          desc:  ev.subtitle || ev.desc || '',
          date:  ev.date  || '',
          pin:   !!ev.pin,
        };
      });
      callback();
    })
    .catch(function(){
      // fetch 失敗時使用備用資料（本地預覽用）
      EVENTS = [
        { url:'event-worldcup.html',     tag:'活動', title:'⚽ 世足聯歡慶',           desc:'新增世足球員梅西・C羅・活動BOSS世足球・彩票兌換豐厚好禮・06/20維修後～07/20維修前', date:'2026-06-20', pin:true },
        { url:'event-summer.html', tag:'活動', title:'💦沁涼消暑大作戰💦', desc:'消暑冰霜・消暑西瓜・沁涼項鍊・燥熱的炎魔BOSS・活動時間 07/01~07/31', date:'2026-07-01', pin:true },
        { url:'event-worldcup-bet.html', tag:'活動', title:'⚽ 世足2026競猜活動',     desc:'押注贏藍鑽・冠亞軍最高130倍・單場勝平負猜分賠率豐厚・06/20維修後～07/20維修前',       date:'2026-06-20', pin:true },
        { url:'event-class-change.html', tag:'服務', title:'🔄 轉職／轉換武器服務', desc:'簡易轉職 1500$ · 完整轉職 3000$，技能裝備對應變更，聯絡客服即可申請', date:'2026-06-11', pin:true },
        { url:'event-dragon-boat.html', tag:'活動', title:'🐙消滅海怪🐙 拯救屈原', desc:'端午節活動・消滅海怪・討伐屈原的魂魄・活動時間 06/01~06/30', date:'2026-06-01', pin:true },
        { url:'events.html',      tag:'活動', title:'開局紅變＋紅娃活動',           desc:'登入就送英雄變身＋娃娃，開局加碼稀有＋7武器，自帶魔武！！練功必備', date:'2026-05-15', pin:true },
        { url:'event-line.html',  tag:'禮包', title:'預約 LINE 禮包',                desc:'加入官方 LINE 社群預約，開服即可領取專屬新手好禮',                   date:'2026-05-12' },
        { url:'event-58hero.html',tag:'活動', title:'58衝拿英雄神武再送發財金',      desc:'衝到58等送英雄神武＋3000藍鑽發財金，打寶才會爽！',                   date:'2026-05-26', pin:true },
      ];
      callback();
    });
}

function _sortEvents(arr) {
  return arr.slice().sort(function(a,b){
    if(a.pin && !b.pin) return -1;
    if(!a.pin && b.pin) return 1;
    return (b.date||'').localeCompare(a.date||'');
  });
}

function renderEventNav(){
  var nav = document.getElementById('eventNav');
  if(!nav) return;
  var sorted = _sortEvents(EVENTS);
  var current = location.pathname.split('/').pop() || 'index.html';
  var idx = sorted.findIndex(function(ev){ return ev.url === current; });
  if(idx === -1) return;
  var prev = idx > 0 ? sorted[idx-1] : null;
  var next = idx < sorted.length-1 ? sorted[idx+1] : null;
  nav.innerHTML = '<div class="feature-nav-btns">'
    + (prev ? '<a href="'+prev.url+'" class="btn-outline">← '+prev.title+'</a>' : '<span></span>')
    + (next ? '<a href="'+next.url+'" class="btn-outline">'+next.title+' →</a>' : '<span></span>')
    + '</div>';
}

function renderEventList(){
  var list = document.getElementById('eventList');
  if(!list) return;
  var sorted = _sortEvents(EVENTS);
  if(!sorted.length){
    list.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px 0">目前沒有進行中的活動</p>';
    return;
  }
  list.innerHTML = sorted.map(function(ev){
    return '<a href="'+ev.url+'" class="event-item">'
      +'<span class="event-tag tag-'+(ev.tag||'其他')+'">'+(ev.tag||'其他')+'</span>'
      +'<div class="event-info">'
      +'<div class="event-title">'+ev.title+'</div>'
      +'<div class="event-desc">'+(ev.desc||'')+'</div>'
      +'</div>'
      +'<span class="event-arrow">→</span>'
      +'</a>';
  }).join('');
}

function renderAnnouncements(){
  var grid = document.getElementById('annGrid');
  if(!grid) return;
  var sorted = _sortEvents(EVENTS).slice(0,4);
  if(!sorted.length){
    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px 0">目前沒有公告</p>';
    return;
  }
  grid.innerHTML = sorted.map(function(ev){
    var pinMark = ev.pin ? '<span style="color:#f2d06b;margin-right:4px;font-size:.75em">📌</span>' : '';
    return '<a class="ann-card" href="'+ev.url+'">'
      +'<div class="ann-card-meta">'
      +'<span class="ann-tag tag-'+(ev.tag||'活動')+'">'+(ev.tag||'活動')+'</span>'
      +'<span class="ann-date">'+(ev.date||'')+'</span>'
      +'</div>'
      +'<div class="ann-card-title">'+pinMark+ev.title+'</div>'
      +'<div class="ann-card-excerpt">'+(ev.desc||'')+'</div>'
      +'<div class="ann-card-more">閱讀更多 →</div>'
      +'</a>';
  }).join('');
}

document.addEventListener('DOMContentLoaded', function(){
  _loadEvents(function(){
    renderEventList();
    renderEventNav();
    renderAnnouncements();
  });
});
