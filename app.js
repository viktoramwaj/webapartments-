
// V7-fix3 — без слова "photo" в коде.
// Изображения лежат в img/<ID>/1.jpeg … 12.jpeg. На карточке показываем 1.jpeg.
// Галерея открывается у всех: если нет файлов — показывается SVG-заглушка.

const ITEMS = [
  { corp:'6', id:'601', title:'Корпус 6, апартамент 601 • 1 спальня • Терраса', size:55, guests:3, floor:0, price:90 },
  { corp:'6', id:'602', title:'Корпус 6, апартамент 602 • 1 спальня • Терраса', size:55, guests:5, floor:0, price:100 },
  { corp:'6', id:'603', title:'Корпус 6, апартамент 603 • 1 спальня • Терраса', size:55, guests:3, floor:0, price:80 },
  { corp:'6', id:'605', title:'Корпус 6, апартамент 605 • 1 спальня • Балкон', size:55, guests:2, floor:1, price:70 },
  { corp:'6', id:'606', title:'Корпус 6, апартамент 606 • 1 спальня • Балкон', size:55, guests:3, floor:1, price:90 },
  { corp:'6', id:'609', title:'Корпус 6, апартамент 609 • 1 спальня • Балкон', size:55, guests:2, floor:2, price:70 },
  { corp:'20', id:'201', title:'Корпус 20, апартамент 201 • 2 спальни • Терраса', size:90, guests:4, floor:0, price:90 },
  { corp:'20', id:'202', title:'Корпус 20, апартамент 202 • 2 спальни • Терраса', size:90, guests:6, floor:0, price:120 },
  { corp:'20', id:'203', title:'Корпус 20, апартамент 203 • 2 спальни • Балкон', size:90, guests:6, floor:1, price:120 },
  { corp:'20', id:'204', title:'Корпус 20, апартамент 204 • 2 спальни • Балкон', size:90, guests:4, floor:1, price:90 },
  { corp:'20', id:'205', title:'Корпус 20, апартамент 205 • 2 спальни • Балкон', size:90, guests:4, floor:2, price:90 },
  { corp:'20', id:'206', title:'Корпус 20, апартамент 206 • 2 спальни • Балкон', size:90, guests:4, floor:2, price:120 },
];

function mainImgPath(id){ return `img/${id}/1.jpeg`; }
function galleryList(id){ return Array.from({length:12}, (_,i)=>`img/${id}/${i+1}.jpeg`); }

function stubSVG(id){
  const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='750'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='%2313c2b9'/><stop offset='1' stop-color='%237df0e7'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,Segoe UI,Roboto' font-size='56' fill='#042524' opacity='.85'>${id}</text></svg>`);
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}

function render(){
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  ITEMS.forEach(a => {
    const main = mainImgPath(a.id);
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <div class="imgbox"><img alt="${a.title}" src="${main}" onerror="this.src='${stubSVG(a.id)}'"/></div>
      <div class="card-body">
        <h3>${a.title}</h3>
        <p class="muted">Площадь ${a.size} м² • до ${a.guests} гостей • Этаж ${a.floor}</p>
        <div class="price">от $${a.price} / ночь</div>
        <div class="actions">
          <a class="btn" href="#contact">Связаться</a>
          <button class="btn ghost" data-open="${a.id}">Галерея</button>
        </div>
      </div>`;
    grid.appendChild(el);
  });
  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', ()=>openGallery(btn.getAttribute('data-open')));
  });
}

let gList=[], gIdx=0, gName='';
function openGallery(id){
  gList = galleryList(id);
  gIdx = 0;
  const apt = ITEMS.find(x=>x.id===id);
  gName = `Корпус ${apt.corp}, апартамент ${id}`;
  const img = document.getElementById('gImg');
  img.onerror = ()=>{ img.onerror=null; img.src = stubSVG(id); document.getElementById('gTitle').textContent = gName + ' — 1/1'; };
  document.getElementById('gTitle').textContent = gName + ' — 1/' + gList.length;
  img.src = gList[0];
  document.getElementById('gallery').classList.add('open');
}

function step(dir){
  if(!gList.length) return;
  const img = document.getElementById('gImg');
  gIdx = (gIdx + dir + gList.length) % gList.length;
  document.getElementById('gTitle').textContent = gName + ' — ' + (gIdx+1) + '/' + gList.length;
  img.onerror = ()=>{ img.onerror=null; img.src = stubSVG(gName.split(' ').pop()); };
  img.src = gList[gIdx];
}

function closeGal(){ document.getElementById('gallery').classList.remove('open'); }

document.addEventListener('DOMContentLoaded',()=>{
  render();
  document.getElementById('prev').onclick=()=>step(-1);
  document.getElementById('next').onclick=()=>step(1);
  document.getElementById('close').onclick=closeGal;
  document.getElementById('gallery').addEventListener('click',e=>{ if(e.target.id==='gallery') closeGal(); });
  document.getElementById('year').textContent=new Date().getFullYear();
});
