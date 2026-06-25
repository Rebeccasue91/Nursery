
const plants = [
  {id:"SG-104", name:"Saguaro", category:"Cactus", price:425, qty:3, sun:"full", water:"very low", w:10, h:35, img:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=300"},
  {id:"TS-201", name:"Texas Sage", category:"Shrub", price:38, qty:24, sun:"full", water:"low", w:5, h:5, img:"https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=300"},
  {id:"RY-302", name:"Red Yucca", category:"Shrub", price:34, qty:18, sun:"full", water:"low", w:3, h:3, img:"https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300"},
  {id:"AG-220", name:"Agave Americana", category:"Agave", price:95, qty:9, sun:"full", water:"very low", w:8, h:6, img:"https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=300"},
  {id:"LA-118", name:"Lantana", category:"Groundcover", price:24, qty:30, sun:"full", water:"medium", w:3, h:2, img:"https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=300"},
  {id:"PV-401", name:"Palo Verde", category:"Tree", price:185, qty:5, sun:"full", water:"low", w:25, h:25, img:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300"},
  {id:"DW-411", name:"Desert Willow", category:"Tree", price:145, qty:7, sun:"full", water:"low", w:20, h:25, img:"https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=300"}
];

let selected = plants[0];
let selectedPlacedId = null;
let placed = [];
let season = "summer";
let growthYear = 0;

function renderPlantList(){
  const search = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("category").value;

  const filtered = plants.filter(p =>
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search)
  );

  document.getElementById("plantList").innerHTML = filtered.map(p => `
    <div class="plant-card ${selected.id === p.id ? 'selected' : ''}" onclick="selectPlant('${p.id}')">
      <img src="${p.img}">
      <div>
        <strong>${p.name}</strong><br>
        <span class="small">${p.category} | Qty: ${p.qty}</span><br>
        <span class="small">☀ ${p.sun} | 💧 ${p.water}</span><br>
        <span class="small">Mature: ${p.h}' H x ${p.w}' W</span><br>
        <strong>$${p.price}</strong>
      </div>
    </div>
  `).join("");
}

function selectPlant(id){
  selected = plants.find(p => p.id === id);
  selectedPlacedId = null;
  renderPlantList();
  renderDetails();
  renderGrid();
}

function renderDetails(){
  document.getElementById("details").innerHTML = `
    <img src="${selected.img}" style="width:100%;height:150px;object-fit:cover;border-radius:10px">
    <h3>${selected.name}</h3>
    <p>Inventory #: ${selected.id}</p>
    <p>Category: ${selected.category}</p>
    <p>Price: $${selected.price}</p>
    <p>Available: ${selected.qty}</p>
    <p>Sun: ${selected.sun}</p>
    <p>Water: ${selected.water}</p>
    <p>Mature size: ${selected.h}' high x ${selected.w}' wide</p>
  `;
}

function sunClass(x,y){
  if(season === "summer"){
    if(x < 10) return "full";
    if(x < 22) return "partial";
    return "shade";
  }
  if(season === "winter"){
    if(y < 7) return "shade";
    if(x < 14) return "partial";
    return "full";
  }
  if(x < 9) return "full";
  if(x < 22) return "partial";
  return "shade";
}

function renderGrid(){
  const grid = document.getElementById("grid");
  grid.innerHTML = `<div class="house">HOUSE</div>`;

  for(let y=0; y<20; y++){
    for(let x=0; x<30; x++){
      const cell = document.createElement("div");
      cell.className = "cell " + sunClass(x,y);
      cell.onclick = () => placePlant(x,y);
      grid.appendChild(cell);
    }
  }

  placed.forEach(p => {
    const scale = growthScale(growthYear);
    const fw = Math.max(1.2, p.w * scale);
    const fh = Math.max(1.2, p.h * scale);

    const footprint = document.createElement("div");
    footprint.className = "footprint";
    footprint.style.left = `${p.x*24}px`;
    footprint.style.top = `${p.y*24}px`;
    footprint.style.width = `${fw*24}px`;
    footprint.style.height = `${fh*24}px`;
    grid.appendChild(footprint);

    const dot = document.createElement("div");
    dot.className = `plant ${selectedPlacedId === p.placeId ? 'selected' : ''}`;
    dot.style.left = `${p.x*24}px`;
    dot.style.top = `${p.y*24}px`;
    dot.style.width = `${Math.max(28, fw*24)}px`;
    dot.style.height = `${Math.max(28, fh*24)}px`;
    dot.innerText = p.name.split(" ")[0];
    dot.onclick = (event) => {
      event.stopPropagation();
      selectedPlacedId = p.placeId;
      selected = plants.find(item => item.id === p.id);
      renderPlantList();
      renderDetails();
      renderGrid();
    };
    grid.appendChild(dot);
  });

  updateSummary();
}

function placePlant(x,y){
  placed.push({...selected, x, y, placeId: Date.now() + Math.random()});
  renderGrid();
}

function growthScale(year){
  if(year < 2) return .25;
  if(year < 5) return .45;
  if(year < 10) return .7;
  if(year < 15) return .9;
  return 1;
}

function setGrowth(value){
  growthYear = Number(value);
  document.getElementById("yearLabel").innerText = growthYear === 0 ? "Today" : growthYear + " years";
  renderGrid();
}

function setSeason(value, btn){
  season = value;
  document.querySelectorAll(".season button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderGrid();
}

function deleteSelected(){
  if(!selectedPlacedId){
    alert("Click a placed plant on the grid first.");
    return;
  }
  placed = placed.filter(p => p.placeId !== selectedPlacedId);
  selectedPlacedId = null;
  renderGrid();
}

function resetDesign(){
  if(confirm("Clear the entire design?")){
    placed = [];
    selectedPlacedId = null;
    renderGrid();
  }
}

function updateSummary(){
  document.getElementById("count").innerText = placed.length;

  const total = placed.reduce((sum,p) => sum + p.price, 0);
  document.getElementById("total").innerText = "$" + total.toLocaleString();

  const counts = {};
  placed.forEach(p => counts[p.name] = (counts[p.name] || 0) + 1);

  document.getElementById("quoteList").innerHTML = Object.keys(counts).map(name => {
    const plant = plants.find(p => p.name === name);
    return `
      <div class="quote-row">
        <span>${counts[name]} × ${name}</span>
        <strong>$${(counts[name] * plant.price).toLocaleString()}</strong>
      </div>
    `;
  }).join("");
}

renderPlantList();
renderDetails();
renderGrid();
