// Галерея и карточки
document.addEventListener("DOMContentLoaded", () => {
  const cardsEl = document.getElementById("cards");
  const APARTMENTS = [
    {id:"601", corp:"6", photos:["/img/601/1.jpeg","/img/601/2.jpeg"]},
    {id:"602", corp:"6", photos:["/img/602/1.jpeg","/img/602/2.jpeg"]},
    {id:"603", corp:"6", photos:["/img/603/1.jpeg","/img/603/2.jpeg"]},
    {id:"202", corp:"20", photos:["/img/202/1.jpeg","/img/202/2.jpeg"]}
  ];

  function render(){
    cardsEl.innerHTML = "";
    APARTMENTS.forEach(a => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>Апартамент ${a.id}</h3>
        <img src="${a.photos[0]}" style="width:100%;max-width:400px"/>
      `;
      cardsEl.appendChild(card);
    });
  }
  render();
});
