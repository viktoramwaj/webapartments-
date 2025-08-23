/* app.js — главная грузит только 1.jpeg; галерея — все фото. 601 = dir:'601' */
(function(){
  'use strict';

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

  const PHOTOS_BASE = 'img'; // .jpeg строго

  // Главное фото — только 1.jpeg
  function mainPhoto(a){ return `${PHOTOS_BASE}/${a.dir}/1.jpeg`; }
  // Полный список для галереи — создаём только при открытии
  function buildDirList(a, max=50){
    const base = `${PHOTOS_BASE}/${a.dir}`;
    return Array.from({length:max}, (_,i)=> `${base}/${i+1}.jpeg`);
  }
  function placeholderSVG(text){
    const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='750'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='%2313c2b9'/><stop offset='1' stop-color='%237df0e7'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,Segoe UI,Roboto' font-size='56' fill='#042524' opacity='.85'>${text}</text></svg>`);
    return `data:image/svg+xml;charset=utf-8,${svg}`;
  }

  // Рендер карточек — НЕТ миниатюр, только одно <img>
  const cardsEl = document.getElementById('cards');
  function renderCards(list){
    cardsEl.innerHTML = '';
    list.forEach(a => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="photo">
          <img alt="Корпус ${a.corp}, апартамент ${a.id}" src="${mainPhoto(a)}">
        </div>
        <h3>Корпус ${a.corp}, апартамент ${a.id} · ${a.bedrooms===2?'2 спальни':'1 спальня'}</h3>
      `;
      // Открыть галерею по клику
      card.querySelector('.photo').addEventListener('click', ()=> openGallery(a));
      // Плейсхолдер если 1.jpeg отсутствует
      const img = card.querySelector('img');
      img.addEventListener('error', ()=>{ img.src = placeholderSVG(`${a.corp}-${a.id}`); });
      cardsEl.appendChild(card);
    });
  }

  // Галерея — грузим по одному изображению
  const modal = document.getElementById('gallery');
  const gImg  = document.getElementById('gImg');
  const gTitle= document.getElementById('gTitle');
  let gIds = []; let gIdx = 0; let gName = '';

  function openGallery(a, idx=0){
    gIds = buildDirList(a);
    gIdx = Math.max(0, Math.min(idx, gIds.length-1));
    gName = `Корпус ${a.corp}, апартамент ${a.id}`;
    updateGallery();
    modal.classList.add('open');
  }
  function updateGallery(){
    gTitle.textContent = `${gName} — ${gIdx+1}/${gIds.length}`;
    gImg.src = gIds[gIdx];
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
  modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.classList.remove('open'); });

  renderCards(APARTMENTS);
})();