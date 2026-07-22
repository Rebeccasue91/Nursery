function createNurseryPickPlant() {
  const type = document.getElementById("nurseryPickType").value;
  const size = document.getElementById("nurseryPickSize").value;

  const spreadByType = {
    "Flowering Shrub": 5,
    "Privacy Shrub": 6,
    "Cactus Accent": 4,
    "Agave Accent": 5,
    "Groundcover": 3,
    "Shade Tree": 20
  };

  selected = {
    id: "NP-" + Date.now(),
    name: "Nursery Pick: " + type,
    category: type,
    price: 0,
    qty: 999,
    sun: "full",
    water: "low",
    w: spreadByType[type] || 5,
    h: spreadByType[type] || 5,
    img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300",
    nurseryPick: true,
    requestedSize: size
  };

  selectedPlacedId = null;
  renderDetails();
  renderGrid();

  alert("Nursery Pick selected. Click the grid where you want it placed.");
}
