/* Рабочий скрипт для карточек и галереи
   Фото берутся из /img/<ID>/1.jpeg … 12.jpeg
   Для квартир без своих фото — подставляются снимки 601.
*/
(() => {
  const FALLBACK_ID = '601';
  // Данные (взяты из твоей последней версии ru‑v5b)
  const APARTMENTS = [
    {corp:'20', id:'201', bedrooms:2, floor:0, outdoor:'terrace', beds:'2 single + 1 king + 1 sofa', guests:4, size:90, price:90, desc:'2 спальни • 90 м² • до 4 гостей'},
    {corp:'20', id:'202', bedrooms:2, floor:0, outdoor:'terrace', beds:'2 single + 2 king + 1 sofa', guests:6, size:90, price:120, desc:'2 спальни • 90 м² • до 6 гостей'},
    {corp:'20', id:'203', bedrooms:2, floor:1, outdoor:'balcony', beds:'2 single + 1 double + 1 king + 1 sofa', guests:6, size:90, price:120, desc:'2 спальни • 90 м² • до 6 гостей'},
    {corp:'20', id:'204', bedrooms:2, floor:1, outdoor:'balcony', beds:'2 single + 1 king + 1 sofa', guests:4, size:90, price:90, desc:'2 спальни • 90 м² • до 4 гостей'},
    {corp:'20', id:'205', bedrooms:2, floor:2, outdoor:'balcony', beds:'2 single + 1 king + 1 sofa', guests:4, size:90, price:90, desc:'2 спальни • 90 м² • до 4 гостей'},
    {corp:'20', id:'206', bedrooms:2, floor:2, outdoor:'balcony', beds:'2 single + 1 king + 1 sofa', guests:4, size:90, price:120, desc:'2 спальни • 90 м² • до 4 гостей'},
    {corp:'6', id:'601', bedrooms:1, floor:0, outdoor:'terrace', beds:'1 king + 1 sofa', guests:3, size:55, price:90, desc:'1 спальня • 55 м² • до 3 гостей'},
    {corp:'6', id:'602', bedrooms:1, floor:0, outdoor:'terrace', beds:'1 single + 2 double', guests:5, size:55, price:100, desc:'1 спальня • 55 м² • до 5 гостей'},
    {corp:'6', id:'603', bedrooms:1, floor:0, outdoor:'terrace', beds:'1 king + 1 sofa', guests:3, size:55, price:80, desc:'1 спальня • 55 м² • до 3 гостей'},
    {corp:'6', id:'605', bedrooms:1, floor:1, outdoor:'balcony', beds:'1 double', guests:2, size:55, price:70, desc:'1 спальня • 55 м² • до 2 гостей'},
    {corp:'6', id:'606', bedrooms:1, floor:1, outdoor:'balcony', beds:'1 double', guests:3, size:55, price:90, desc:'1 спальня • 55 м² • до 3 гостей'},
    {corp:'6', id:'609', bedrooms:1, floor:2, outdoor:'balcony', beds:'1 single + 1 double', guests:2, size:55, price:70, desc:'1 спальня • 55 м² • до 2 гостей'},
  ];

  // Утилиты -------------------------------------------------
  const $ = (sel, root=document) => root.querySelector(sel);

  function imgUrl(id, n){ return `/img/${id}/${n}.jpeg`; }

  // Установка src с фолбэком на 601
  function setImgWithFallback(img, id, n){
    img.onerror = null; // сбросим предыдущий onerror, если был
    img.src = imgUrl(id, n);
    img.onerror = () => { img.onerror = null; img.src = imgUrl(FALLBACK_ID, n); };
  }

  // Рендер карточек ----------------------------------------
  const cardsEl = $('#cards');
  function renderCards(list){
    cardsEl.innerHTML = '';
    list.forEach(a => {
      const title = `Корпус ${a.corp}, апартамент ${a.id} • ${a.bedrooms===2?'2 спальни':'1 спальня'} • ${a.outdoor==='balcony'?'Балкон':a.outdoor==='terrace'?'Терраса':'—'}`;
      const el = document.createElement('article');
      el.className = 'card';
      el.innerHTML = `
        <div class="photo"><img id="m-${a.id}" alt="${title}" style="width:100%;height:100%;object-fit:cover"/></div>
        <div class="card-body">
          <h3>${title}</h3>
          <p>${a.desc||''}</p>
          <div class="price">от $${a.price} / ночь</div>
          <div class="actions">
            <button class="btn" data-open="${a.id}">Открыть фото</button>
          </div>
        </div>
      `;
      cardsEl.appendChild(el);
      // главная картинка = 1.jpeg с фолбэком
      const mainImg = $(`#m-${a.id}`, el);
      setImgWithFallback(mainImg, a.id, 1);
    });

    // обработчики открытия галереи
    cardsEl.querySelectorAll('[data-open]').forEach(btn=>{
      btn.addEventListener('click', e => openGallery(e.currentTarget.getAttribute('data-open')));
    });
  }

  // Галерея ------------------------------------------------
  const modal = $('#gallery');
  const gImg = $('#gImg');
  const gTitle = $('#gTitle');
  let currId = null;
  let idx = 1; // 1..12

  function openGallery(id){
    currId = id;
    idx = 1;
    updateGallery();
    modal.classList.add('open');
  }

  function updateGallery(){
    gTitle.textContent = `Апартамент ${currId} — ${idx}/12`;
    setImgWithFallback(gImg, currId, idx);
  }

  $('#prev').onclick = () => { if(!currId) return; idx = idx<=1 ? 12 : idx-1; updateGallery(); };
  $('#next').onclick = () => { if(!currId) return; idx = idx>=12 ? 1 : idx+1; updateGallery(); };
  $('#close').onclick = () => modal.classList.remove('open');
  $('#gallery').addEventListener('click', e => { if(e.target===modal) modal.classList.remove('open'); });

  // Год в футере
  document.getElementById('year').textContent = new Date().getFullYear();

  // ПЕРВИЧНЫЙ РЕНДЕР
  renderCards(APARTMENTS);
})();
