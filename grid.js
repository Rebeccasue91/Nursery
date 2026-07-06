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
      cell.ondragover = (event) => event.preventDefault();
      cell.ondrop = (event) => dropPlant(event, x, y);
      grid.appendChild(cell);
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
function dropPlant(event, x, y){
  event.preventDefault();

  const plantId = event.dataTransfer.getData("text/plain");
  const plant = plants.find(p => p.id === plantId);

  if(!plant) return;

  selected = plant;
  placed.push({...plant, x, y, placeId: Date.now() + Math.random()});

  renderPlantList();
  renderDetails();
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
