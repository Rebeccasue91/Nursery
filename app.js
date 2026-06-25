
let selected = plants[0];
let selectedPlacedId = null;
let placed = [];
let season = "summer";
let growthYear = 0;

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
