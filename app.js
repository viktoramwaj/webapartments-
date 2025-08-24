// === ДАННЫЕ ===
  const APARTMENTS = [
    {corp:'20', id:'201', bedrooms:2, floor:0, outdoor:'terrace', beds:'2 single + 1 king + 1 sofa', guests:4, size:90, price:90, desc:'2 спальни • 90 м² • до 4 гостей', badges:[], photos:[], dir:'201'},
    {corp:'20', id:'202', bedrooms:2, floor:0, outdoor:'terrace', beds:'2 single + 2 king + 1 sofa', guests:6, size:90, price:120, desc:'2 спальни • 90 м² • до 6 гостей', badges:[], photos:[], dir:'202'},
    {corp:'20', id:'203', bedrooms:2, floor:1, outdoor:'balcony', beds:'2 single + 1 double + 1 king + 1 sofa', guests:6, size:90, price:120, desc:'2 спальни • 90 м² • до 6 гостей', badges:[], photos:[], dir:'203'},
    {corp:'20', id:'204', bedrooms:2, floor:1, outdoor:'balcony', beds:'2 single + 1 king + 1 sofa', guests:4, size:90, price:90, desc:'2 спальни • 90 м² • до 4 гостей', badges:[], photos:[], dir:'204'},
    {corp:'20', id:'205', bedrooms:2, floor:2, outdoor:'balcony', beds:'2 single + 1 king + 1 sofa', guests:4, size:90, price:90, desc:'2 спальни • 90 м² • до 4 гостей', badges:[], photos:[], dir:'205'},
    {corp:'20', id:'206', bedrooms:2, floor:2, outdoor:'balcony', beds:'2 single + 1 king + 1 sofa', guests:4, size:90, price:120, desc:'2 спальни • 90 м² • до 4 гостей', badges:[], photos:[], dir:'206'},
    {corp:'6', id:'601', bedrooms:1, floor:0, outdoor:'terrace', beds:'1 king + 1 sofa', guests:3, size:55, price:90, desc:'1 спальня • 55 м² • до 3 гостей', badges:[], photos:[], dir:'601'},
    {corp:'6', id:'602', bedrooms:1, floor:0, outdoor:'terrace', beds:'1 single + 2 double', guests:5, size:55, price:100, desc:'1 спальня • 55 м² • до 5 гостей', badges:[], photos:[], dir:'602'},
    {corp:'6', id:'603', bedrooms:1, floor:0, outdoor:'terrace', beds:'1 king + 1 sofa', guests:3, size:55, price:80, desc:'1 спальня • 55 м² • до 3 гостей', badges:[], photos:[], dir:'603'},
    {corp:'6', id:'605', bedrooms:1, floor:1, outdoor:'balcony', beds:'1 double', guests:2, size:55, price:70, desc:'1 спальня • 55 м² • до 2 гостей', badges:[], photos:[], dir:'605'},
    {corp:'6', id:'606', bedrooms:1, floor:1, outdoor:'balcony', beds:'1 double', guests:3, size:55, price:90, desc:'1 спальня • 55 м² • до 3 гостей', badges:[], photos:[], dir:'606'},
    {corp:'6', id:'609', bedrooms:1, floor:2, outdoor:'balcony', beds:'1 single + 1 double', guests:2, size:55, price:70, desc:'1 спальня • 55 м² • до 2 гостей', badges:[], photos:[], dir:'609'},
  ];

  // === Фото из папок на хостинге ===
  const PHOTOS_BASE = 'img';
  function buildDirList(a, max=50){
    if(!a.dir) return [];
    const base = `${PHOTOS_BASE}/${a.dir}`;
    // Внимание: если фото не .jpeg, поменяйте здесь расширение
    return Array.from({length:max}, (_,i)=> `${base}/${i+1}.jpeg`);
  }
  function listPhotos(a){
    const fromData = (a.photos||[]).filter(Boolean);
    return fromData.length ? fromData : buildDirList(a);
  }
  
  // === Утилиты ===
  function placeholderSVG(text){
    const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='750'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='%2313c2b9'/><stop offset='1' stop-color='%237df0e7'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Montserrat, sans-serif' font-weight='800' font-size='56' fill='#042524' opacity='.85'>${text}</text></svg>`);
    return `data:image/svg+xml;charset=utf-8,${svg}`;
  }

  // === Рендер карточек ===
  const cardsEl = document.getElementById('cards');
  function renderCards(list){
    cardsEl.innerHTML = '';
    if(list.length === 0){
        cardsEl.innerHTML = '<p style="text-align:center;color:#cde7e3;">По вашему запросу ничего не найдено.</p>';
        return;
    }
    list.forEach(a => {
      const title = `Корпус ${a.corp}, апартамент ${a.id} • ${a.bedrooms===2?'2 спальни':'1 спальня'}`;
      const ph = listPhotos(a);
      const mainImg = (ph[0]) ? ph[0] : placeholderSVG(`${a.corp}-${a.id}`);
      const el = document.createElement('article');
      el.className = 'card';
      el.innerHTML = `
        <div class="photo">
          <img alt="${title}" src="${mainImg}" style="width:100%;height:100%;object-fit:cover"/>
        </div>
        ${(ph.length > 0) ? `<div class="thumbs">${ph.map((p,i)=>`<img alt="thumb ${i+1}" src="${p}" data-corp="${a.corp}" data-id="${a.id}" data-idx="${i}">`).join('')}</div>` : ''}
        <div class="card-body">
          <h3>${title}</h3>
          <p>${a.desc||''}</p>
          <div class="price">от $${a.price} / ночь</div>
          <div style="margin-top:12px">
            <a class="btn primary" href="#contact">Связаться</a>
          </div>
        </div>
      `;
      cardsEl.appendChild(el);

      const main = el.querySelector('.photo img');
      if(main){ main.addEventListener('error', ()=>{ main.src = placeholderSVG(`${a.corp}-${a.id}`); }); }
      el.querySelectorAll('.thumbs img').forEach(t=>{ t.addEventListener('error', ()=>{ t.style.display='none'; }); });
    });
    cardsEl.querySelectorAll('.thumbs img').forEach(img=>{
      img.addEventListener('click', (e)=> openGallery(
        e.target.getAttribute('data-corp'),
        e.target.getAttribute('data-id'),
        +e.target.getAttribute('data-idx')
      ));
    });
  }

  // === Фильтр ===
  const bedroomsFilter = document.getElementById('bedrooms');
  const maxPriceFilter = document.getElementById('maxPrice');
  const applyBtn = document.getElementById('apply-filters');
  const resetBtn = document.getElementById('reset-filters');
  
  function applyFilters(){
      const bedrooms = bedroomsFilter.value;
      const maxPrice = maxPriceFilter.value;
      const filtered = APARTMENTS.filter(a => {
        const matchesBedrooms = bedrooms === '' || a.bedrooms === parseInt(bedrooms);
        const matchesPrice = maxPrice === '' || a.price <= parseInt(maxPrice);
        return matchesBedrooms && matchesPrice;
      });
      renderCards(filtered);
  }
  
  applyBtn.addEventListener('click', applyFilters);
  resetBtn.addEventListener('click', ()=>{
      document.getElementById('bedrooms').value = '';
      document.getElementById('maxPrice').value = '';
      renderCards(APARTMENTS);
  });

  // === Галерея ===
  const modal = document.getElementById('gallery');
  const gImg = document.getElementById('gImg');
  const gTitle = document.getElementById('gTitle');
  let gIds = []; let gIdx = 0; let gName = '';

  function openGallery(corp, id, idx=0){
    const a = APARTMENTS.find(x=>x.corp===corp && x.id===id);
    if(!a) return;
    const title = `Корпус ${a.corp}, апартамент ${a.id}`;
    const ph = listPhotos(a);
    gIds = ph.length ? ph : [placeholderSVG(`${a.corp}-${a.id}`)];
    gIdx = Math.max(0, Math.min(idx, gIds.length-1));
    gName = title;
    gTitle.textContent = gName + ' — ' + (gIdx+1) + '/' + gIds.length;
    gImg.src = gIds[gIdx];
    modal.classList.add('open');
  }

  function updateGallery(step) {
    if (!gIds.length) return;
    gIdx = (gIdx + step + gIds.length) % gIds.length;
    gTitle.textContent = gName + ' — ' + (gIdx + 1) + '/' + gIds.length;
    gImg.src = gIds[gIdx];
  }

  document.getElementById('prev').onclick = () => updateGallery(-1);
  document.getElementById('next').onclick = () => updateGallery(1);
  document.getElementById('close').onclick = ()=> modal.classList.remove('open');
  document.getElementById('gallery').addEventListener('click', (e)=>{ if(e.target===modal) modal.classList.remove('open'); });

  // Год в футере
  document.getElementById('year').textContent = new Date().getFullYear();

  // Первичная отрисовка
  renderCards(APARTMENTS);