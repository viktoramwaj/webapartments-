/* app.js — главная грузит только 1.jpeg; галерея — все фото */
(function(){
  'use strict';

  const APARTMENTS = [
    {corp:'20', id:'201', dir:'201'},
    {corp:'20', id:'202', dir:'202'},
    {corp:'20', id:'203', dir:'203'},
    {corp:'20', id:'204', dir:'204'},
    {corp:'20', id:'205', dir:'205'},
    {corp:'20', id:'206', dir:'206'},
    {corp:'6', id:'601', dir:'601'},
    {corp:'6', id:'602', dir:'602'},
    {corp:'6', id:'603', dir:'603'},
    {corp:'6', id:'605', dir:'605'},
    {corp:'6', id:'606', dir:'606'},
    {corp:'6', id:'609', dir:'609'}
  ];

  const PHOTOS_BASE = 'img';
  function buildDirList(a, max=50){
    if(!a.dir) return [];
    const base = `${PHOTOS_BASE}/${a.dir}`;
    return Array.from({length:max}, (_,i)=> `${base}/${i+1}.jpeg`);
  }
  function listPhotos(a){ return buildDirList(a); }
  function mainPhoto(a){ return `${PHOTOS_BASE}/${a.dir}/1.jpeg`; }

  const cardsEl = document.getElementById('cards');
  function renderCards(list){
    cardsEl.innerHTML = '';
    list.forEach(a => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <div class="photo"><img src="${mainPhoto(a)}" alt="Апартамент ${a.id}"></div>
        <h3>Корпус ${a.corp}, апартамент ${a.id}</h3>
      `;
      div.querySelector('.photo').addEventListener('click', ()=> openGallery(a));
      cardsEl.appendChild(div);
    });
  }

  const modal = document.getElementById('gallery');
  const gImg = document.getElementById('gImg');
  const gTitle = document.getElementById('gTitle');
  let gIds = []; let gIdx = 0; let gName = '';

  function openGallery(a, idx=0){
    const ph = listPhotos(a);
    gIds = ph.length ? ph : [];
    gIdx = Math.max(0, Math.min(idx, gIds.length-1));
    gName = `Корпус ${a.corp}, апартамент ${a.id}`;
    updateGallery();
    modal.classList.add('open');
  }
  function updateGallery(){
    gTitle.textContent = `${gName} — ${gIdx+1}/${gIds.length}`;
    gImg.src = gIds[gIdx];
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