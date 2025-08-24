// V7 — Amwaj Apartments (paths fixed to /img/<ID>/<n>.jpeg)

const APARTMENTS = [
  // Корпус 6 (1BR)
  { corp:'6', id:'601', title:'Корпус 6, апартамент 601 • 1 спальня • Терраса', size:55, guests:3, floor:0, price:90, photosCount:12 },
  { corp:'6', id:'602', title:'Корпус 6, апартамент 602 • 1 спальня • Терраса', size:55, guests:5, floor:0, price:100, photosCount:12 },
  { corp:'6', id:'603', title:'Корпус 6, апартамент 603 • 1 спальня • Терраса', size:55, guests:3, floor:0, price:80, photosCount:12 },
  { corp:'6', id:'605', title:'Корпус 6, апартамент 605 • 1 спальня • Балкон', size:55, guests:2, floor:1, price:70, photosCount:0 },
  { corp:'6', id:'606', title:'Корпус 6, апартамент 606 • 1 спальня • Балкон', size:55, guests:3, floor:1, price:90, photosCount:0 },
  { corp:'6', id:'609', title:'Корпус 6, апартамент 609 • 1 спальня • Балкон', size:55, guests:2, floor:2, price:70, photosCount:0 },

  // Корпус 20 (2BR)
  { corp:'20', id:'201', title:'Корпус 20, апартамент 201 • 2 спальни • Терраса', size:90, guests:4, floor:0, price:90, photosCount:0 },
  { corp:'20', id:'202', title:'Корпус 20, апартамент 202 • 2 спальни • Терраса', size:90, guests:6, floor:0, price:120, photosCount:12 },
  { corp:'20', id:'203', title:'Корпус 20, апартамент 203 • 2 спальни • Балкон', size:90, guests:6, floor:1, price:120, photosCount:0 },
  { corp:'20', id:'204', title:'Корпус 20, апартамент 204 • 2 спальни • Балкон', size:90, guests:4, floor:1, price:90, photosCount:0 },
  { corp:'20', id:'205', title:'Корпус 20, апартамент 205 • 2 спальни • Балкон', size:90, guests:4, floor:2, price:90, photosCount:0 },
  { corp:'20', id:'206', title:'Корпус 20, апартамент 206 • 2 спальни • Балкон', size:90, guests:4, floor:2, price:120, photosCount:0 },
];

function imgMainPath(corp, id){
  // на карточке показываем только первое фото 1.jpeg
  return `/img/${id}/1.jpeg`;
}
function buildGalleryList(corp, id, count){
  if (!count || count < 1) return [];
  const arr = [];
  for(let i=1;i<=count;i++){
    arr.push(`/img/${id}/${i}.jpeg`);
  }
  return arr;
}

function placeholder(id){
  const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='750'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='%2313c2b9'/><stop offset='1' stop-color='%237df0e7'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,Segoe UI,Roboto' font-size='56' fill='#042524' opacity='.85'>${id}</text></svg>`);
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}

function renderCards(){
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  APARTMENTS.forEach(a => {
    const hasPhotos = a.photosCount > 0;
    const main = hasPhotos ? imgMainPath(a.corp, a.id) : placeholder(`${a.corp}-${a.id}`);
    const card = document.createElement('article');
    card.className = 'card';
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
          ${hasPhotos ? `<button class="btn ghost" data-open="${a.corp}-${a.id}">Галерея (12)</button>` : `<span class="muted">Фото будут позже</span>`}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // навесить обработчики для галерей
  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const [corp, id] = btn.getAttribute('data-open').split('-');
      openGallery(corp, id);
    });
  });
}

let galleryList = [];
let galleryIdx = 0;
function openGallery(corp, id){
  const a = APARTMENTS.find(x => x.corp===corp && x.id===id);
  if(!a) return;
  galleryList = buildGalleryList(corp, id, a.photosCount);
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
  const title = document.getElementById('gTitle').textContent.split(' — ')[0];
  document.getElementById('gTitle').textContent = title + ' — ' + (galleryIdx+1) + '/' + galleryList.length;
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