// V7 (fix) — Галерея открывается для всех квартир.
// Предзагрузка 1..12.jpeg: собираем только реально существующие фото.
// На карточке по-прежнему показываем только 1.jpeg.

const APARTMENTS = [
  // Корпус 6 (1BR)
  { corp:'6', id:'601', title:'Корпус 6, апартамент 601 • 1 спальня • Терраса', size:55, guests:3, floor:0, price:90, photosCount:12 },
  { corp:'6', id:'602', title:'Корпус 6, апартамент 602 • 1 спальня • Терраса', size:55, guests:5, floor:0, price:100, photosCount:12 },
  { corp:'6', id:'603', title:'Корпус 6, апартамент 603 • 1 спальня • Терраса', size:55, guests:3, floor:0, price:80, photosCount:12 },
  { corp:'6', id:'605', title:'Корпус 6, апартамент 605 • 1 спальня • Балкон', size:55, guests:2, floor:1, price:70, photosCount:12 },
  { corp:'6', id:'606', title:'Корпус 6, апартамент 606 • 1 спальня • Балкон', size:55, guests:3, floor:1, price:90, photosCount:12 },
  { corp:'6', id:'609', title:'Корпус 6, апартамент 609 • 1 спальня • Балкон', size:55, guests:2, floor:2, price:70, photosCount:12 },

  // Корпус 20 (2BR)
  { corp:'20', id:'201', title:'Корпус 20, апартамент 201 • 2 спальни • Терраса', size:90, guests:4, floor:0, price:90, photosCount:12 },
  { corp:'20', id:'202', title:'Корпус 20, апартамент 202 • 2 спальни • Терраса', size:90, guests:6, floor:0, price:120, photosCount:12 },
  { corp:'20', id:'203', title:'Корпус 20, апартамент 203 • 2 спальни • Балкон', size:90, guests:6, floor:1, price:120, photosCount:12 },
  { corp:'20', id:'204', title:'Корпус 20, апартамент 204 • 2 спальни • Балкон', size:90, guests:4, floor:1, price:90, photosCount:12 },
  { corp:'20', id:'205', title:'Корпус 20, апартамент 205 • 2 спальни • Балкон', size:90, guests:4, floor:2, price:90, photosCount:12 },
  { corp:'20', id:'206', title:'Корпус 20, апартамент 206 • 2 спальни • Балкон', size:90, guests:4, floor:2, price:120, photosCount:12 },
];

function imgMainPath(corp, id){ return `images/${id}/1.jpeg`; }

function placeholder(id){
  const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='750'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='%2313c2b9'/><stop offset='1' stop-color='%237df0e7'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,Segoe UI,Roboto' font-size='56' fill='#042524' opacity='.85'>${id}</text></svg>`);
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}

// Предзагрузка списка 1..12 и отбор успешно загруженных
function preloadExistingImages(id, max=12){
  const candidates = Array.from({length:max}, (_,i)=>`images/${id}/${i+1}.jpeg`);
  return Promise.allSettled(candidates.map(src => new Promise((res, rej)=>{
    const im = new Image();
    im.onload = ()=>res(src);
    im.onerror = ()=>rej(src);
    im.src = src;
  }))).then(results => results.filter(r=>r.status==='fulfilled').map(r=>r.value));
}

function renderCards(){
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  APARTMENTS.forEach(a => {
    const card = document.createElement('article');
    card.className = 'card';
    const main = imgMainPath(a.corp, a.id);
    card.innerHTML = `
      <div class="photo">
        <img alt="${a.title}" src="${main}" onerror="this.src='${placeholder(a.id)}'" />
      </div>
      <div class="card-body">
        <h3>${a.title}</h3>
        <p class="muted">Площадь ${a.size} м² • до ${a.guests} гостей • Этаж ${a.floor}</p>
        <div class="price">от $${a.price} / ночь</div>
        <div class="actions">
          <a class="btn" href="#contact">Связаться</a>
          <button class="btn ghost" data-open="${a.corp}-${a.id}">Галерея</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const [corp, id] = btn.getAttribute('data-open').split('-');
      const ok = await preloadExistingImages(id, 12);
      openGallery(corp, id, ok);
    });
  });
}

let galleryList = [];
let galleryIdx = 0;
function openGallery(corp, id, list){
  galleryList = (list && list.length) ? list : [placeholder(`${corp}-${id}`)];
  galleryIdx = 0;
  const title = `Корпус ${corp}, апартамент ${id}`;
  document.getElementById('gTitle').textContent = title + ' — 1/' + galleryList.length;
  document.getElementById('gImg').src = galleryList[0];
  document.getElementById('gallery').classList.add('open');
}

function navGallery(step){
  if(!galleryList.length) return;
  galleryIdx = (galleryIdx + step + galleryList.length) % galleryList.length;
  document.getElementById('gImg').src = galleryList[galleryIdx];
  const baseTitle = document.getElementById('gTitle').textContent.split(' — ')[0];
  document.getElementById('gTitle').textContent = baseTitle + ' — ' + (galleryIdx+1) + '/' + galleryList.length;
}

function closeGallery(){ document.getElementById('gallery').classList.remove('open'); }

// init
document.addEventListener('DOMContentLoaded', () => {
  renderCards();
  document.getElementById('prev').addEventListener('click', () => navGallery(-1));
  document.getElementById('next').addEventListener('click', () => navGallery(1));
  document.getElementById('close').addEventListener('click', closeGallery);
  document.getElementById('gallery').addEventListener('click', (e)=>{ if(e.target.id==='gallery') closeGallery(); });
  document.getElementById('year').textContent = new Date().getFullYear();
});