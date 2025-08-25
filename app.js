(() => {
  const FALLBACK_ID = '601';
  const PHOTOS = {
    '601': ['img/601/1.jpeg','img/601/2.jpeg'],
    '602': ['img/602/1.jpeg','img/602/2.jpeg'],
    '603': ['img/603/1.jpeg','img/603/2.jpeg'],
    '202': ['img/202/1.jpeg','img/202/2.jpeg']
  };
  const APARTMENTS = [{corp:'6',id:'601',bedrooms:1,floor:0,outdoor:'terrace',price:90,desc:'1 спальня'}];
  const $ = (s,r=document)=>r.querySelector(s);
  function photosFor(id){return PHOTOS[id]||PHOTOS[FALLBACK_ID];}
  const cardsEl=$('#cards');
  function renderCards(list){cardsEl.innerHTML='';list.forEach(a=>{cardsEl.innerHTML+=`<article><h3>${a.id}</h3></article>`});}
  const modal=$('#gallery'),gImg=$('#gImg'),gTitle=$('#gTitle');let currId=null,idx=0;
  function openGallery(id){currId=id;idx=0;updateGallery();modal.style.display='flex';}
  function updateGallery(){
    const p=photosFor(currId);
    const total=p.length||1;
    const showAt=(i)=>{
      idx=i%total;
      const src0=p[idx];
      gTitle.textContent=`Апартамент ${currId} — ${idx+1}/${total}`;
      let triedAlt=false;
      gImg.onerror=()=>{
        if(!triedAlt){
          triedAlt=true;
          if(src0.endsWith('.jpeg')) gImg.src=src0.slice(0,-5)+'.jpg';
          else if(src0.endsWith('.jpg')) gImg.src=src0.slice(0,-4)+'.jpeg';
          else skip();
        } else {
          skip();
        }
      };
      gImg.onload=()=>{gImg.onerror=null;};
      gImg.src=src0;
      function skip(){
        gImg.onerror=null;
        if(total<=1) return;
        showAt((idx+1)%total);
      }
    };
    showAt(idx);
  }
  document.getElementById('year').textContent=new Date().getFullYear();
  renderCards(APARTMENTS);
})();