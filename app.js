/* v8.2 — карточки + галерея с fallback по расширению */
(() => {
  const FALLBACK_ID = '601';
  const PHOTOS = {
    '601': Array.from({length:12}, (_,i)=>`img/601/${i+1}.jpeg`),
    '602': Array.from({length:12}, (_,i)=>`img/602/${i+1}.jpeg`),
    '603': Array.from({length:12}, (_,i)=>`img/603/${i+1}.jpeg`),
    '202': Array.from({length:12}, (_,i)=>`img/202/${i+1}.jpeg`),
  };

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
    {corp:'6', id:'609', bedrooms:1, floor:2, outdoor:'balcony', price:70,  desc:'1 спальня • 55 м² • до 2 гостей'},
  ];

  const $ = (s, r=document) => r.querySelector(s);
  function photosFor(id){ return PHOTOS[id] || PHOTOS[FALLBACK_ID]; }

  const cardsEl = $('#cards');
  function title(a){ return `Корпус ${a.corp}, апартамент ${a.id} • ${a.bedrooms===2?'2 спальни':'1 спальня'} • ${a.outdoor==='balcony'?'Балкон':'Терраса'}`; }
  function renderCards(list){
    cardsEl.innerHTML='';
    list.forEach(a=>{
      const p = photosFor(a.id);
      const el = document.createElement('article');
      el.className='card';
      el.innerHTML = `
        <div class="photo"><img alt="${title(a)}" src="${p[0]}" style="width:100%;height:100%;object-fit:cover"></div>
        <div class="thumbs">${p.slice(0,6).map((src,i)=>`<img alt="thumb ${i+1}" src="${src}" data-id="${a.id}" data-idx="${i}">`).join('')}</div>
        <div class="card-body">
          <h3>${title(a)}</h3>
          <p>${a.desc||''}</p>
          <div class="price">от $${a.price} / ночь</div>
          <div class="actions"><button class="btn" data-open="${a.id}">Открыть фото</button></div>
        </div>`;
      cardsEl.appendChild(el);
    });
    cardsEl.querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click',(e)=>openGallery(e.currentTarget.getAttribute('data-open'))));
    cardsEl.querySelectorAll('.thumbs img').forEach(img => img.addEventListener('click', (e)=>{
      openGallery(e.target.getAttribute('data-id'), +e.target.getAttribute('data-idx'));
    }));
  }

  // --- Галерея ---
  const modal = $('#gallery'), gImg=$('#gImg'), gTitle=$('#gTitle');
  let currId=null, idx=0;
  function openGallery(id, start=0){ currId=id; idx=start||0; updateGallery(); modal.classList.add('open'); }

  function updateGallery(){
    const p = photosFor(currId);
    const total = p.length || 1;
    const showAt = (i) => {
      idx = i % total;
      const src0 = p[idx];
      gTitle.textContent = `Апартамент ${currId} — ${idx+1}/${total}`;
      let triedAlt = false;
      gImg.onerror = () => {
        if(!triedAlt){
          triedAlt = true;
          if (src0.endsWith('.jpeg')) gImg.src = src0.slice(0,-5) + '.jpg';
          else if (src0.endsWith('.jpg')) gImg.src = src0.slice(0,-4) + '.jpeg';
          else skip();
        } else skip();
      };
      gImg.onload = () => { gImg.onerror = null; };
      gImg.src = src0;
      function skip(){
        gImg.onerror = null;
        if (total <= 1) return;
        showAt((idx+1)%total);
      }
    };
    showAt(idx);
  }

  $('#prev').onclick = ()=>{ if(!currId) return; const p=photosFor(currId); idx=(idx-1+p.length)%p.length; updateGallery(); };
  $('#next').onclick = ()=>{ if(!currId) return; const p=photosFor(currId); idx=(idx+1)%p.length; updateGallery(); };
  $('#close').onclick = ()=> modal.classList.remove('open');
  modal.addEventListener('click', e=>{ if(e.target===modal) modal.classList.remove('open'); });

  document.getElementById('year').textContent = new Date().getFullYear();
  renderCards(APARTMENTS);
})();
