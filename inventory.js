function renderPlantList() {
  const search = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("category").value;

  const filtered = plants.filter(p =>
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search)
  );

  document.getElementById("plantList").innerHTML = filtered.map(p => `
    <div 
      class="plant-card ${selected.id === p.id ? "selected" : ""}" 
      onclick="selectPlant('${p.id}')"
      draggable="true"
      ondragstart="startDragPlant(event, '${p.id}')"
    >
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

function selectPlant(id) {
  selected = plants.find(p => p.id === id);
  selectedPlacedId = null;

  renderPlantList();
  renderDetails();
  renderGrid();
}

function renderDetails() {
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

function startDragPlant(event, id) {
  selected = plants.find(p => p.id === id);

  event.dataTransfer.setData(
    "text/plain",
    JSON.stringify({
      type: "inventory",
      id: id
    })
  );

  event.dataTransfer.effectAllowed = "copy";

  renderPlantList();
  renderDetails();
}
