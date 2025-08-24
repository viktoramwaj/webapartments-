/* Финальная версия.
   - Контакты внизу (#contact).
   - Фото: img/<ID>/<N>.jpeg (ОТНОСИТЕЛЬНО без ведущего '/'), чтобы работало на GitHub Pages.
   - Для 601/602/603/202 заданы реальные массивы 1..12.
   - Для остальных карточек превью и галерея берут фото из 601 (фолбэк).
*/
(() => {
  const FALLBACK_ID = '601';
  const PHOTOS = {
    '601': ['img/601/1.jpeg', 'img/601/2.jpeg', 'img/601/3.jpeg', 'img/601/4.jpeg', 'img/601/5.jpeg', 'img/601/6.jpeg', 'img/601/7.jpeg', 'img/601/8.jpeg', 'img/601/9.jpeg', 'img/601/10.jpeg', 'img/601/11.jpeg', 'img/601/12.jpeg'],
    '602': ['img/602/1.jpeg', 'img/602/2.jpeg', 'img/602/3.jpeg', 'img/602/4.jpeg', 'img/602/5.jpeg', 'img/602/6.jpeg', 'img/602/7.jpeg', 'img/602/8.jpeg', 'img/602/9.jpeg', 'img/602/10.jpeg', 'img/602/11.jpeg', 'img/602/12.jpeg'],
    '603': ['img/603/1.jpeg', 'img/603/2.jpeg', 'img/603/3.jpeg', 'img/603/4.jpeg', 'img/603/5.jpeg', 'img/603/6.jpeg', 'img/603/7.jpeg', 'img/603/8.jpeg', 'img/603/9.jpeg', 'img/603/10.jpeg', 'img/603/11.jpeg', 'img/603/12.jpeg'],
    '202': ['img/202/1.jpeg', 'img/202/2.jpeg', 'img/202/3.jpeg', 'img/202/4.jpeg', 'img/202/5.jpeg', 'img/202/6.jpeg', 'img/202/7.jpeg', 'img/202/8.jpeg', 'img/202/9.jpeg', 'img/202/10.jpeg', 'img/202/11.jpeg', 'img/202/12.jpeg']
  };

  // Полный список карточек можно расширять — фотки подставятся автоматически
  const APARTMENTS = [
    {corp:'20', id:'201', bedrooms:2, floor:0, outdoor:'terrace', price:90,  desc:'2 спальни • 90 м² • до 4 гостей'},
    {corp:'20', id:'202', bedrooms:2, floor:0, outdoor:'terrace', price:120, desc:'2 спальни • 90 м² • до 6 гостей'},
    {corp:'20', id:'203', bedrooms:2, floor:1, outdoor:'balcony', price:120, desc:'2 спальни • 90 м² • до 6 гостей'},
    {corp:'20', id:'204', bedrooms:2, floor:1, outdoor:'balcony', price:90,  desc:'2 спальни • 90 м² • до 4 гостей'},
    {corp:'20', id:'205', bedrooms:2, floor:2, outdoor:'balcony', price:90,  desc:'2 спальни • 90 м² • до 4 гостей'},
    {corp:'20', id:'206', bedrooms:2, floor:2, outdoor:'balcony', price:120, desc:'2 спальни • 90 м² • до 4 гостей'},
    {corp:'6', id:'601', bedrooms:1, floor:0, outdoor:'terrace', price:90,  desc:'1 спальня • 55 м² • до 3 гостей'},
    {corp:'6', id:'602', bedrooms:1, floor:0, outdoor:'terrace', price:100, desc:'1 спальня • 55 м² • до 5 гостей'},
    {corp:'6', id:'603', bedrooms:1, floor:0, outdoor:'terrace', price:80,  desc:'1 спальня • 55 м² • до 3 гостей'},
    {corp:'6', id:'605', bedrooms:1, floor:1, outdoor:'balcony', price:70,  desc:'1 спальня • 55 м² • до 2 гостей'},
    {corp:'6', id:'606', bedrooms:1, floor:1, outdoor:'balcony', price:90,  desc:'1 спальня • 55 м² • до 3 гостей'},
    {corp:'6', id:'609', bedrooms:1, floor:2, outdoor:'balcony', price:70,  desc:'1 спальня • 55 м² • до 2 гостей'}
  ];

  const $ = (s, r=document) => r.querySelector(s);
  function photosFor(id) { return PHOTOS[id] || PHOTOS[FALLBACK_ID]; }

  const cardsEl = $('#cards');
  function renderCards(list){
    cardsEl.innerHTML = '';
    list.forEach(a => {
      const title = `Корпус ${a.corp}, апартамент ${a.id} • ${a.bedrooms===2?'2 спальни':'1 спальня'} • ${a.outdoor==='balcony'?'Балкон':'Терраса'}`;
      const p = photosFor(a.id);
      const el = document.createElement('article');
      el.className = 'card';
      el.innerHTML = `
        <div class="photo"><img alt="${title}" src="${p[0]}" style="width:100%;height:100%;object-fit:cover"></div>
        <div class="thumbs">${p.slice(0,6).map((src,i)=>`<img alt="thumb ${i+1}" src="${src}" data-id="${a.id}" data-idx="${i}">`).join('')}</div>
        <div class="card-body">
          <h3>${title}</h3>
          <p>${a.desc||''}</p>
          <div class="price">от $${a.price} / ночь</div>
          <div class="actions"><button class="btn" data-open="${a.id}">Открыть фото</button></div>
        </div>`;
      cardsEl.appendChild(el);
    });
    cardsEl.querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click', e => openGallery(e.currentTarget.getAttribute('data-open'))));
  }

  // Галерея
  const modal = $('#gallery'); const gImg = $('#gImg'); const gTitle = $('#gTitle');
  let currId = null; let idx = 0;
  function openGallery(id){ currId = id; idx = 0; updateGallery(); modal.style.display='flex'; }

  // === ИСПРАВЛЕНО: автоподмена .jpeg⇄.jpg и пропуск битых кадров ===
  function updateGallery(){
    const p = photosFor(currId);
    const total = p.length || 1;

    const showAt = (i) => {
      idx = i % total;
      const src0 = p[idx];
      gTitle.textContent = `Апартамент ${currId} — ${idx+1}/${total}`;

      let triedAlt = false;
      gImg.onerror = () => {
        // Попробовать альтернативное расширение
        if (!triedAlt) {
          triedAlt = True = true
          if (src0.endsWith('.jpeg')) gImg.src = src0.slice(0, -5) + '.jpg';
          else if (src0.endsWith('.jpg')) gImg.src = src0.slice(0, -4) + '.jpeg';
          else skip();
        } else {
          skip();
        }
      };
      gImg.onload = () => { gImg.onerror = null; };

      gImg.src = src0;

      function skip(){
        gImg.onerror = null;
        if (total <= 1) return; // нечего листать
        showAt((idx + 1) % total); // перейти к следующему изображению
      }
    };

    showAt(idx);
  }

  $('#prev').onclick = () => { if(!currId) return; const p = photosFor(currId); idx = (idx-1+p.length)%p.length; updateGallery(); };
  $('#next').onclick = () => { if(!currId) return; const p = photosFor(currId); idx = (idx+1)%p.length; updateGallery(); };
  $('#close').onclick = () => modal.style.display='none';
  $('#gallery').addEventListener('click', e => { if(e.target===modal) modal.style.display='none'; });

  document.getElementById('year').textContent = new Date().getFullYear();
  renderCards(APARTMENTS);
})();
