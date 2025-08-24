/* Надёжная версия.
   - Контакты внизу (#contact).
   - Фото подключаются ПРЯМО из img/<ID>/<N>.jpeg (относительные пути).
   - Для квартир без своих фото подставляются фото 601 (фолбэк).
*/
(() => {
  const FALLBACK_ID = '601';

  // Полный список карточек; фото явно задано только тем, у кого есть свои папки
  const APARTMENTS = [
    // Корпус 20 (2BR)
    {corp:'20', id:'201', bedrooms:2, floor:0, outdoor:'terrace', price:90,  desc:'2 спальни • 90 м² • до 4 гостей', photos:[]},
    {corp:'20', id:'202', bedrooms:2, floor:0, outdoor:'terrace', price:120, desc:'2 спальни • 90 м² • до 6 гостей', photos:['img/202/1.jpeg', 'img/202/2.jpeg', 'img/202/3.jpeg', 'img/202/4.jpeg', 'img/202/5.jpeg', 'img/202/6.jpeg', 'img/202/7.jpeg', 'img/202/8.jpeg', 'img/202/9.jpeg', 'img/202/10.jpeg', 'img/202/11.jpeg', 'img/202/12.jpeg']},
    {corp:'20', id:'203', bedrooms:2, floor:1, outdoor:'balcony', price:120, desc:'2 спальни • 90 м² • до 6 гостей', photos:[]},
    {corp:'20', id:'204', bedrooms:2, floor:1, outdoor:'balcony', price:90,  desc:'2 спальни • 90 м² • до 4 гостей', photos:[]},
    {corp:'20', id:'205', bedrooms:2, floor:2, outdoor:'balcony', price:90,  desc:'2 спальни • 90 м² • до 4 гостей', photos:[]},
    {corp:'20', id:'206', bedrooms:2, floor:2, outdoor:'balcony', price:120, desc:'2 спальни • 90 м² • до 4 гостей', photos:[]},

    // Корпус 6 (1BR)
    {corp:'6', id:'601', bedrooms:1, floor:0, outdoor:'terrace', price:90,  desc:'1 спальня • 55 м² • до 3 гостей', photos:['img/601/1.jpeg', 'img/601/2.jpeg', 'img/601/3.jpeg', 'img/601/4.jpeg', 'img/601/5.jpeg', 'img/601/6.jpeg', 'img/601/7.jpeg', 'img/601/8.jpeg', 'img/601/9.jpeg', 'img/601/10.jpeg', 'img/601/11.jpeg', 'img/601/12.jpeg']},
    {corp:'6', id:'602', bedrooms:1, floor:0, outdoor:'terrace', price:100, desc:'1 спальня • 55 м² • до 5 гостей', photos:['img/602/1.jpeg', 'img/602/2.jpeg', 'img/602/3.jpeg', 'img/602/4.jpeg', 'img/602/5.jpeg', 'img/602/6.jpeg', 'img/602/7.jpeg', 'img/602/8.jpeg', 'img/602/9.jpeg', 'img/602/10.jpeg', 'img/602/11.jpeg', 'img/602/12.jpeg']},
    {corp:'6', id:'603', bedrooms:1, floor:0, outdoor:'terrace', price:80,  desc:'1 спальня • 55 м² • до 3 гостей', photos:['img/603/1.jpeg', 'img/603/2.jpeg', 'img/603/3.jpeg', 'img/603/4.jpeg', 'img/603/5.jpeg', 'img/603/6.jpeg', 'img/603/7.jpeg', 'img/603/8.jpeg', 'img/603/9.jpeg', 'img/603/10.jpeg', 'img/603/11.jpeg', 'img/603/12.jpeg']},
    {corp:'6', id:'605', bedrooms:1, floor:1, outdoor:'balcony', price:70,  desc:'1 спальня • 55 м² • до 2 гостей', photos:[]},
    {corp:'6', id:'606', bedrooms:1, floor:1, outdoor:'balcony', price:90,  desc:'1 спальня • 55 м² • до 3 гостей', photos:[]},
    {corp:'6', id:'609', bedrooms:1, floor:2, outdoor:'balcony', price:70,  desc:'1 спальня • 55 м² • до 2 гостей', photos:[]}
  ];

  // Утилиты
  const $ = (s, r=document) => r.querySelector(s);
  function imgUrl(id, n) { return `img/${id}/${n}.jpeg`; }

  // Ставим src с фолбэком на 601
  function setImgWithFallback(img, id, n){
    img.onerror = null;
    img.src = imgUrl(id, n);
    img.onerror = () => { img.onerror = null; img.src = imgUrl(FALLBACK_ID, n); };
  }

  // Рендер карточек
  const cardsEl = $('#cards');
  function renderCards(list){
    cardsEl.innerHTML = '';
    list.forEach(a => {
      const title = `Корпус ${a.corp}, апартамент ${a.id} • ${a.bedrooms===2?'2 спальни':'1 спальня'} • ${a.outdoor==='balcony'?'Балкон':'Терраса'}`;
      const el = document.createElement('article');
      el.className = 'card';
      el.innerHTML = `
        <div class="photo"><img id="m-${a.id}" alt="${title}" style="width:100%;height:100%;object-fit:cover"/></div>
        <div class="thumbs">${(a.photos && a.photos.length ? a.photos : ['img/601/1.jpeg', 'img/601/2.jpeg', 'img/601/3.jpeg', 'img/601/4.jpeg', 'img/601/5.jpeg', 'img/601/6.jpeg', 'img/601/7.jpeg', 'img/601/8.jpeg', 'img/601/9.jpeg', 'img/601/10.jpeg', 'img/601/11.jpeg', 'img/601/12.jpeg']).slice(0,6).map((p,i)=>`<img alt="thumb ${i+1}" src="${p}" data-id="${a.id}" data-idx="${i}">`).join('')} </div>
        <div class="card-body">
          <h3>${title}</h3>
          <p>${a.desc||''}</p>
          <div class="price">от $${a.price} / ночь</div>
          <div class="actions"><button class="btn" data-open="${a.id}">Открыть фото</button></div>
        </div>`;
      cardsEl.appendChild(el);
      // Главная картинка: если есть свои фото — 1.jpeg, иначе фолбэк 601
      setImgWithFallback($('#m-'+a.id, el), (a.photos && a.photos.length ? a.id : FALLBACK_ID), 1);
    });

    // Обработчики
    cardsEl.querySelectorAll('[data-open]').forEach(btn=>{
      btn.addEventListener('click', e => openGallery(e.currentTarget.getAttribute('data-open')));
    });
  }

  // Галерея
  const modal = $('#gallery'); const gImg = $('#gImg'); const gTitle = $('#gTitle');
  let currId = null; let idx = 1;
  function openGallery(id){
    currId = id; idx = 1; updateGallery();
    modal.classList.add('open');
  }
  function updateGallery(){
    gTitle.textContent = `Апартамент ${currId} — ${idx}/12`;
    // Если у этой квартиры нет своих фото — подставим 601
    const useId = APARTMENTS.find(a=>a.id===currId)?.photos?.length ? currId : FALLBACK_ID;
    setImgWithFallback(gImg, useId, idx);
  }
  $('#prev').onclick = () => { if(!currId) return; idx = idx<=1 ? 12 : idx-1; updateGallery(); };
  $('#next').onclick = () => { if(!currId) return; idx = idx>=12 ? 1 : idx+1; updateGallery(); };
  $('#close').onclick = () => modal.classList.remove('open');
  $('#gallery').addEventListener('click', e => { if(e.target===modal) modal.classList.remove('open'); });

  // Год в футере
  document.getElementById('year').textContent = new Date().getFullYear();

  // Рендер
  renderCards(APARTMENTS);
})();
