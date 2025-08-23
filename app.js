/* app.js — Главная грузит только 1.jpeg; остальные фото — только в галерее */
(function(){
  'use strict';

  // ==== ДАННЫЕ ====
  const APARTMENTS = [
    {corp:'20', id:'201', dir:'201', bedrooms:2, floor:0, outdoor:'terrace', beds:'2 single + 1 king + 1 sofa', guests:4, size:90, price:90, desc:'2 спальни • 90 м² • до 4 гостей'},
    {corp:'20', id:'202', dir:'202', bedrooms:2, floor:0, outdoor:'terrace', beds:'2 single + 2 king + 1 sofa', guests:6, size:90, price:120, desc:'2 спальни • 90 м² • до 6 гостей'},
    {corp:'20', id:'203', dir:'203', bedrooms:2, floor:1, outdoor:'balcony', beds:'2 single + 1 double + 1 king + 1 sofa', guests:6, size:90, price:120, desc:'2 спальни • 90 м² • до 6 гостей'},
    {corp:'20', id:'204', dir:'204', bedrooms:2, floor:1, outdoor:'balcony', beds:'2 single + 1 king + 1 sofa', guests:4, size:90, price:90, desc:'2 спальни • 90 м² • до 4 гостей'},
    {corp:'20', id:'205', dir:'205', bedrooms:2, floor:2, outdoor:'balcony', beds:'2 single + 1 king + 1 sofa', guests:4, size:90, price:90, desc:'2 спальни • 90 м² • до 4 гостей'},
    {corp:'20', id:'206', dir:'206', bedrooms:2, floor:2, outdoor:'balcony', beds:'2 single + 1 king + 1 sofa', guests:4, size:90, price:120, desc:'2 спальни • 90 м² • до 4 гостей'},
    {corp:'6',  id:'601', dir:'601', bedrooms:1, floor:0, outdoor:'terrace', beds:'1 king + 1 sofa', guests:3, size:55, price:90, desc:'1 спальня • 55 м² • до 3 гостей'},
    {corp:'6',  id:'602', dir:'602', bedrooms:1, floor:0, outdoor:'terrace', beds:'1 single + 2 double', guests:5, size:55, price:100, desc:'1 спальня • 55 м² • до 5 гостей'},
    {corp:'6',  id:'603', dir:'603', bedrooms:1, floor:0, outdoor:'terrace', beds:'1 king + 1 sofa', guests:3, size:55, price:80, desc:'1 спальня • 55 м² • до 3 гостей'},
    {corp:'6',  id:'605', dir:'605', bedrooms:1, floor:1, outdoor:'balcony', beds:'1 double', guests:2, size:55, price:70, desc:'1 спальня • 55 м² • до 2 гостей'},
    {corp:'6',  id:'606', dir:'606', bedrooms:1, floor:1, outdoor:'balcony', beds:'1 double', guests:3, size:55, price:90, desc:'1 спальня • 55 м² • до 3 гостей'},
    {corp:'6',  id:'609', dir:'609', bedrooms:1, floor:2, outdoor:'balcony', beds:'1 single + 1 double', guests:2, size:55, price:70, desc:'1 спальня • 55 м² • до 2 гостей'},
  ];

  // ==== Фото ====
  const PHOTOS_BASE = 'img'; // папка с фото

  // Главная: только 1.jpeg
  function mainPhoto(a){
    return `${PHOTOS_BASE}/${a.dir}/1.jpeg`;
  }

  // Галерея: создаём список путей ТОЛЬКО при открытии модалки
  function buildDirList(a, max=50){
    const base = `${PHOTOS_BASE}/${a.dir}`;
    return Array.from({length:max}, (_,i)=> `${base}/${i+1}.jpeg`);
  }

  function placeholderSVG(text){
    const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='750'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='%2313c2b9'/><stop offset='1' stop-color='%237df0e7'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,Segoe UI,Roboto' font-size='56' fill='#042524' opacity='.85'>${text}</text></svg>`);
    return `data:image/svg+xml;charset=utf-8,${svg}`;
  }

  function titleOf(a){
    return `Корпус ${a.corp}, апартамент ${a.id} • ${a.bedrooms===2?'2 спальни':'1 спальня'} • ${a.outdoor==='balcony'?'Балкон':a.outdoor==='terrace'?'Терраса':'Без балкона'}`;
  }

  // ==== Рендер карточек (только одно <img> на карточку) ====
  const cardsEl = document.getElementById('cards');
  function renderCards(list){
    cardsEl.innerHTML = '';
    list.forEach(a => {
      const article = document.createElement('article');
      article.className = 'card';
      article.dataset.corp = a.corp;
      article.dataset.id = a.id;
      const src = mainPhoto(a);
      article.innerHTML = `
        <div class="photo">
          <img loading="lazy" decoding="async" alt="${titleOf(a)}" src="${src}" style="width:100%;height:100%;object-fit:cover">
        </div>
        <div class="card-body">
          <h3>${titleOf(a)}</h3>
          <p>${a.desc||''}</p>
          <div class="tags">
            <span class="tag">Корпус ${a.corp}</span>
            <span class="tag">${a.size||'?'} м²</span>
            <span class="tag">до ${a.guests} гостей</span>
            <span class="tag">Этаж: ${a.floor}</span>
            <span class="tag">Кровати: ${a.beds||'—'}</span>
          </div>
          <div class="price">от $${a.price} / ночь</div>
          <div class="actions">
            <a class="btn" href="#contact">Связаться</a>
            <button class="btn ghost details">Детали</button>
          </div>
          <div class="notice" hidden>
            <b>Детали:</b>
            <ul style="margin:8px 0 0 18px">
              <li>Планировка: ${a.bedrooms===2?'2 спальни + гостиная':'1 спальня + гостиная'}, американская кухня</li>
              <li>Балкон/терраса: ${a.outdoor||'—'}</li>
              <li>Этаж: ${a.floor}</li>
              <li>Кровати: ${a.beds||'—'}</li>
              <li>Оснащение: кухня, кондиционер, Smart TV, Wi‑Fi*</li>
            </ul>
          </div>
        </div>
      `;
      // Только обработчик клика — никаких миниатюр на главной
      article.querySelector('.photo').addEventListener('click', ()=> openGallery(a));

      const btn = article.querySelector('.details');
      const notice = article.querySelector('.notice');
      btn.addEventListener('click', ()=>{ notice.hidden = !notice.hidden; });

      // Если 1.jpeg нет — плейсхолдер
      const img = article.querySelector('img');
      img.addEventListener('error', ()=>{ img.src = placeholderSVG(`${a.corp}-${a.id}`); });

      cardsEl.appendChild(article);
    });
  }

  // ==== Фильтр ====
  function applyFilters(){
    const corp = document.getElementById('building').value;
    const br   = document.getElementById('bedrooms').value;
    const g    = document.getElementById('guests').value;
    const out  = document.getElementById('outdoor').value;
    const fl   = document.getElementById('floor').value;
    const p    = document.getElementById('maxPrice').value;
    const filtered = APARTMENTS.filter(a => {
      const okCorp = corp ? a.corp===corp : true;
      const okBr   = br ? a.bedrooms===+br : true;
      const okG    = g  ? a.guests>=+g : true;
      const okOut  = out? a.outdoor===out : true;
      const okFl   = fl ? (String(a.floor)===fl) : true;
      const okP    = p  ? a.price<=+p : true;
      return okCorp && okBr && okG && okOut && okFl && okP;
    });
    renderCards(filtered);
    location.hash = '#apartments';
  }
  document.getElementById('applyFilters').addEventListener('click', applyFilters);
  document.getElementById('resetBtn').addEventListener('click', ()=> setTimeout(()=> renderCards(APARTMENTS), 0));

  // ==== Галерея (загружает фото только по одному, по мере просмотра) ====
  const modal = document.getElementById('gallery');
  const gImg = document.getElementById('gImg');
  const gTitle = document.getElementById('gTitle');
  let gIds = []; let gIdx = 0; let gName = '';

  function openGallery(a, idx=0){
    gIds = buildDirList(a); // только список строк, без <img> — НИЧЕГО не грузится до установки src
    gIdx = Math.max(0, Math.min(idx, gIds.length-1));
    gName = `Корпус ${a.corp}, апартамент ${a.id}`;
    updateGallery();
    modal.classList.add('open');
  }
  function updateGallery(){
    gTitle.textContent = `${gName} — ${gIdx+1}/${gIds.length}`;
    gImg.src = gIds[gIdx]; // грузим ТОЛЬКО текущую картинку
    gImg.onerror = ()=>{
      // если файла нет — перейти к следующему
      const start = gIdx;
      let next = (gIdx + 1) % gIds.length;
      while(next !== start){
        gIdx = next;
        gImg.onerror = null;
        gImg.src = gIds[gIdx];
        return;
      }
      gImg.onerror = null;
      gImg.src = placeholderSVG(gName);
    };
  }
  document.getElementById('prev').addEventListener('click', ()=>{
    if(!gIds.length) return;
    gIdx = (gIdx - 1 + gIds.length) % gIds.length;
    updateGallery();
  });
  document.getElementById('next').addEventListener('click', ()=>{
    if(!gIds.length) return;
    gIdx = (gIdx + 1) % gIds.length;
    updateGallery();
  });
  document.getElementById('close').addEventListener('click', ()=> modal.classList.remove('open'));
  modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('open'); });

  // ==== Инициализация ====
  document.getElementById('year').textContent = new Date().getFullYear();
  renderCards(APARTMENTS);
})();