/* app.js — без inline-скриптов, совместим с CSP */
(function(){
  'use strict';

  // ==== ДАННЫЕ ====
  const APARTMENTS = [
    {corp:'20', id:'201', bedrooms:2, floor:0, outdoor:'terrace', beds:'2 single + 1 king + 1 sofa', guests:4, size:90, price:90, desc:'2 спальни • 90 м² • до 4 гостей', badges:[], photos:[]},
    {corp:'20', id:'202', bedrooms:2, floor:0, outdoor:'terrace', beds:'2 single + 2 king + 1 sofa', guests:6, size:90, price:120, desc:'2 спальни • 90 м² • до 6 гостей', badges:[], photos:[], dir:'202'},
    {corp:'20', id:'203', bedrooms:2, floor:1, outdoor:'balcony', beds:'2 single + 1 double + 1 king + 1 sofa', guests:6, size:90, price:120, desc:'2 спальни • 90 м² • до 6 гостей', badges:[], photos:[]},
    {corp:'20', id:'204', bedrooms:2, floor:1, outdoor:'balcony', beds:'2 single + 1 king + 1 sofa', guests:4, size:90, price:90, desc:'2 спальни • 90 м² • до 4 гостей', badges:[], photos:[]},
    {corp:'20', id:'205', bedrooms:2, floor:2, outdoor:'balcony', beds:'2 single + 1 king + 1 sofa', guests:4, size:90, price:90, desc:'2 спальни • 90 м² • до 4 гостей', badges:[], photos:[]},
    {corp:'20', id:'206', bedrooms:2, floor:2, outdoor:'balcony', beds:'2 single + 1 king + 1 sofa', guests:4, size:90, price:120, desc:'2 спальни • 90 м² • до 4 гостей', badges:[], photos:[]},
    {corp:'6', id:'601', bedrooms:1, floor:0, outdoor:'terrace', beds:'1 king + 1 sofa', guests:3, size:55, price:90, desc:'1 спальня • 55 м² • до 3 гостей', badges:[], photos:[], dir:'601'},
    {corp:'6', id:'602', bedrooms:1, floor:0, outdoor:'terrace', beds:'1 single + 2 double', guests:5, size:55, price:100, desc:'1 спальня • 55 м² • до 5 гостей', badges:[], photos:[], dir:'602'},
    {corp:'6', id:'603', bedrooms:1, floor:0, outdoor:'terrace', beds:'1 king + 1 sofa', guests:3, size:55, price:80, desc:'1 спальня • 55 м² • до 3 гостей', badges:[], photos:[], dir:'603'},
    {corp:'6', id:'605', bedrooms:1, floor:1, outdoor:'balcony', beds:'1 double', guests:2, size:55, price:70, desc:'1 спальня • 55 м² • до 2 гостей', badges:[], photos:[]},
    {corp:'6', id:'606', bedrooms:1, floor:1, outdoor:'balcony', beds:'1 double', guests:3, size:55, price:90, desc:'1 спальня • 55 м² • до 3 гостей', badges:[], photos:[]},
    {corp:'6', id:'609', bedrooms:1, floor:2, outdoor:'balcony', beds:'1 single + 1 double', guests:2, size:55, price:70, desc:'1 спальня • 55 м² • до 2 гостей', badges:[], photos:[]},
  ];

  // ==== Фото из папок ====
  const PHOTOS_BASE = 'photos';
  function buildDirList(a, max=50){
    if(!a.dir) return [];
    const base = `${PHOTOS_BASE}/${a.dir}`;
    return Array.from({length:max}, (_,i)=> `${base}/${i+1}.jpeg`);
  }
  function listPhotos(a){
    const fromData = (a.photos||[]).filter(Boolean);
    return fromData.length ? fromData : buildDirList(a);
  }
  function placeholderSVG(text){
    const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='750'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='%2313c2b9'/><stop offset='1' stop-color='%237df0e7'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,Segoe UI,Roboto' font-size='56' fill='#042524' opacity='.85'>${text}</text></svg>`);
    return `data:image/svg+xml;charset=utf-8,${svg}`;
  }
  function titleOf(a){
    return `Корпус ${a.corp}, апартамент ${a.id} • ${a.bedrooms===2?'2 спальни':'1 спальня'} • ${a.outdoor==='balcony'?'Балкон':a.outdoor==='terrace'?'Терраса':'Без балкона'}`;
  }

  // ==== Рендер карточек ====
  const cardsEl = document.getElementById('cards');
  function renderCards(list){
    cardsEl.innerHTML = '';
    list.forEach(a => {
      const ph = listPhotos(a);
      const main = ph[0] || placeholderSVG(`${a.corp}-${a.id}`);
      const article = document.createElement('article');
      article.className = 'card';
      article.dataset.corp = a.corp;
      article.dataset.bedrooms = a.bedrooms;
      article.dataset.floor = a.floor;
      article.dataset.outdoor = a.outdoor;
      article.dataset.price = a.price;
      article.dataset.guests = a.guests;
      article.innerHTML = `
        <div class="photo"><img alt="${titleOf(a)}" src="${main}" style="width:100%;height:100%;object-fit:cover"></div>
        ${(ph.length)? `<div class="thumbs">${ph.map((p,i)=>`<img alt="thumb ${i+1}" src="${p}" data-idx="${i}">`).join('')}</div>` : `<div class="thumbs"><img alt="placeholder" src="${placeholderSVG(a.id)}" data-idx="0"></div>`}
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
      // обработка ошибок картинок
      article.querySelectorAll('img').forEach(img=>{
        img.addEventListener('error', ()=>{ img.style.display='none'; });
      });
      // клик по превью -> галерея
      article.querySelectorAll('.thumbs img').forEach(img=>{
        img.addEventListener('click', ()=> openGallery(a, +img.dataset.idx));
      });
      // детали
      const btn = article.querySelector('.details');
      const notice = article.querySelector('.notice');
      btn.addEventListener('click', ()=>{
        notice.hidden = !notice.hidden;
      });
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
  document.getElementById('resetBtn').addEventListener('click', (e)=>{
    // нативный reset уже сбрасывает селекты; просто перерисуем все карточки
    setTimeout(()=> renderCards(APARTMENTS), 0);
  });

  // ==== Галерея ====
  const modal = document.getElementById('gallery');
  const gImg = document.getElementById('gImg');
  const gTitle = document.getElementById('gTitle');
  let gIds = []; let gIdx = 0; let gName = '';

  function openGallery(a, idx=0){
    const ph = listPhotos(a);
    gIds = ph.length ? ph : [placeholderSVG(`${a.corp}-${a.id}`)];
    gIdx = Math.max(0, Math.min(idx, gIds.length-1));
    gName = `Корпус ${a.corp}, апартамент ${a.id}`;
    gTitle.textContent = `${gName} — ${gIdx+1}/${gIds.length}`;
    gImg.src = gIds[gIdx];
    modal.classList.add('open');
  }

  document.getElementById('prev').addEventListener('click', ()=>{
    if(!gIds.length) return;
    gIdx = (gIdx - 1 + gIds.length) % gIds.length;
    gTitle.textContent = `${gName} — ${gIdx+1}/${gIds.length}`;
    gImg.src = gIds[gIdx];
  });
  document.getElementById('next').addEventListener('click', ()=>{
    if(!gIds.length) return;
    gIdx = (gIdx + 1) % gIds.length;
    gTitle.textContent = `${gName} — ${gIdx+1}/${gIds.length}`;
    gImg.src = gIds[gIdx];
  });
  document.getElementById('close').addEventListener('click', ()=> modal.classList.remove('open'));
  modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('open'); });

  // ==== Инициализация ====
  document.getElementById('year').textContent = new Date().getFullYear();
  renderCards(APARTMENTS);
})();