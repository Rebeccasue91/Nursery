let selected = plants[0];
let selectedPlacedId = null;
let placed = [];
let season = "summer";
let growthYear = 0;

function initApp() {
  renderPlantList();
  renderDetails();
  renderGrid();
}

initApp();
