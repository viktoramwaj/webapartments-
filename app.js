/* v8.2 — карточки + галерея с fallback по расширению */
(() => {
  const FALLBACK_ID = '601';
  
  const APARTMENTS = [
    {corp:'20', id:'201', bedrooms:2, floor:0, outdoor:'terrace', price:90,  desc:'2 спальни • 90 м² • до 4 гостей', dir: '201'},
    {corp:'20', id:'202', bedrooms:2, floor:0, outdoor:'terrace', price:120, desc:'2 спальни • 90 м² • до 6 гостей', dir: '202'},
    {corp:'20', id:'203', bedrooms:2, floor:1, outdoor:'balcony', price:120, desc:'2 спальни • 90 м² • до 6 гостей', dir: '203'},
    {corp:'20', id:'204', bedrooms:2, floor:1, outdoor:'balcony', price:90,  desc:'2 спальни • 90 м² • до 4 гостей', dir: '204'},
    {corp:'20', id:'205', bedrooms:2, floor:2, outdoor:'balcony', price:90,  desc:'2 спальни • 90 м² • до 4 гостей', dir: '205'},
    {corp:'20', id:'206', bedrooms:2, floor:2, outdoor:'balcony', price:120, desc:'2 спальни • 90 м² • до 4 гостей', dir: '206'},
    {corp:'6', id:'601', bedrooms:1, floor:0, outdoor:'terrace', price:90,  desc:'1 спальня • 55 м² • до 3 гостей', dir: '601'},
    {corp:'6', id:'602', bedrooms:1, floor:0, outdoor:'terrace', price:100, desc:'1 спальня • 55 м² • до 5 гостей', dir: '602'},
    {corp:'6', id:'603', bedrooms:1, floor:0, outdoor:'terrace', price:80,  desc:'1 спальня • 55 м² • до 3 гостей', dir: '603'},
    {corp:'6', id:'605', bedrooms:1, floor:1, outdoor:'balcony', price:70,  desc:'1 спальня • 55 м² • до 2 гостей', dir: '605'},
    {corp:'6', id:'606', bedrooms:1, floor:1, outdoor:'balcony', price:90,  desc:'1 спальня • 55 м² • до 3 гостей', dir: '606'},
    {corp:'6', id:'609', bedrooms:1, floor:2, outdoor:'balcony', price:70,  desc:'1 спальня • 55 м² • до 2 гостей', dir: '609'},
  ];

  const $ = (s, r=document) => r.querySelector(s);
  
  const PHOTOS_BASE = 'img';
  function buildDirList(a, max=50){
    if(!a.dir) return [];
    const base = `${PHOTOS_BASE}/${a.dir}`;
    // Внимание: если фото не .jpeg, поменяйте здесь расширение
    return Array.from({length:max}, (_,i)=> `${base}/${i+1}.jpeg`);
  }
  function listPhotos(a){
    return buildDirList(a);
  }

  // === Утилиты ===
  function placeholderSVG(text){
    const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='750'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='%2313c2b9'/><stop offset='1' stop-color='%237df0e7'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Montserrat, sans-serif' font-weight='800' font-size='56' fill='#042524' opacity='.85'>${text}</text></svg>`);
    return `data:image/svg+xml;charset=utf-8,${svg}`;
  }

  // === Рендер карточек ===
  const cardsEl = $('#cards');
  function title(a){ return `Корпус ${a.corp}, апартамент ${a.id} • ${a.bedrooms===2?'2 спальни':'1 спальня'} • ${a.outdoor==='balcony'?'Балкон':'Терраса'}`; }
  function renderCards(list){
    cardsEl.innerHTML='';
    list.forEach(a=>{
      const p = listPhotos(a);
      const mainImg = (p[0]) ? p[0] : placeholderSVG(`${a.corp}-${a.id}`);
      const el = document.createElement('article');
      el.className='card';
      el.innerHTML = `
        <div class="photo"><img alt="${title(a)}" src="${mainImg}" style="width:100%;height:100%;object-fit:cover"></div>
        <div class="thumbs">${p.slice(0,6).map((src,i)=>`<img alt="thumb ${i+1}" src="${src}" data-id="${a.id}" data-idx="${i}">`).join('')}</div>
        <div class="card-body">
          <h3>${title(a)}</h3>
          <p>${a.desc||''}</p>
          <div class="price">от $${a.price} / ночь</div>
          <div class="actions"><a class="btn primary" href="#contact">Связаться</a></div>
        </div>`;
      cardsEl.appendChild(el);
      
      const main = el.querySelector('.photo img');
      if(main){ main.addEventListener('error', ()=>{ main.src = placeholderSVG(`${a.corp}-${a.id}`); }); }
      el.querySelectorAll('.thumbs img').forEach(t=>{ t.addEventListener('error', ()=>{ t.style.display='none'; }); });

    });
    cardsEl.querySelectorAll('.thumbs img').forEach(img => img.addEventListener('click', (e)=>{
      openGallery(e.target.getAttribute('data-id'), +e.target.getAttribute('data-idx'));
    }));
  }

  // === Галерея ===
  const modal = $('#gallery'), gImg=$('#gImg'), gTitle=$('#gTitle');
  let currId=null, idx=0;
  function openGallery(id, start=0){ currId=id; idx=start||0; updateGallery(); modal.classList.add('open'); }

  function updateGallery(){
    const a = APARTMENTS.find(x=>x.id===currId);
    if (!a) return;
    const p = listPhotos(a);
    const total = p.length;
    const showAt = (i) => {
      idx = (i + total) % total;
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
        showAt(idx + 1);
      }
    };
    showAt(idx);
  }

  $('#prev').onclick = ()=>{ if(!currId) return; const a=APARTMENTS.find(x=>x.id===currId); const p=listPhotos(a); idx=(idx-1+p.length)%p.length; updateGallery(); };
  $('#next').onclick = ()=>{ if(!currId) return; const a=APARTMENTS.find(x=>x.id===currId); const p=listPhotos(a); idx=(idx+1)%p.length; updateGallery(); };
  $('#close').onclick = ()=> modal.classList.remove('open');
  modal.addEventListener('click', e=>{ if(e.target===modal) modal.classList.remove('open'); });

  document.getElementById('year').textContent = new Date().getFullYear();
  renderCards(APARTMENTS);
})();