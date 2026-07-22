function plantHoaStatus(plant) {
  if (typeof isHoaCompatible !== "function") {
    return "HOA status unknown";
  }

  return isHoaCompatible(plant) ? "✅ HOA compatible" : "⚠️ Verify HOA approval";
}

function renderPlantList() {
  const search = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("category").value;
  const plantList = document.getElementById("plantList");

  plantList.innerHTML = "";

  const filtered = plants.filter(p =>
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search)
  );

  filtered.forEach(plant => {
    const card = document.createElement("div");
    card.className = "plant-card";

    if (selected && selected.id === plant.id) {
      card.classList.add("selected");
    }

    card.draggable = true;

    card.onclick = () => {
      selectPlant(plant.id);
    };

    card.ondragstart = event => {
      startDragPlant(event, plant.id);
    };

    const img = document.createElement("img");
    img.src = plant.img;
    img.alt = plant.name;

    const info = document.createElement("div");

    info.innerHTML = `
      <strong>${plant.name}</strong><br>
      <span class="small">${plant.category} | Qty: ${plant.qty}</span><br>
      <span class="small">☀ ${plant.sun} | 💧 ${plant.water}</span><br>
      <span class="small">Mature: ${plant.h}' H x ${plant.w}' W</span><br>
      <span class="small">${plantHoaStatus(plant)}</span><br>
      <strong>$${plant.price}</strong>
    `;

    card.appendChild(img);
    card.appendChild(info);
    plantList.appendChild(card);
  });
}

function selectPlant(id) {
  selected = plants.find(p => p.id === id);
  selectedPlacedId = null;

  renderPlantList();
  renderDetails();
  renderGrid();
}

function renderDetails() {
  const hoaRule = typeof getCurrentHoaRule === "function" ? getCurrentHoaRule() : null;
  const details = document.getElementById("details");

  if (!selected) {
    details.innerHTML = "<p>No plant selected.</p>";
    return;
  }

  details.innerHTML = "";

  const img = document.createElement("img");
  img.src = selected.img;
  img.alt = selected.name;
  img.style.width = "100%";
  img.style.height = "150px";
  img.style.objectFit = "cover";
  img.style.borderRadius = "10px";

  const content = document.createElement("div");

  content.innerHTML = `
    <h3>${selected.name}</h3>
    <p>Inventory #: ${selected.id}</p>
    <p>Category: ${selected.category}</p>
    <p>Price: ${selected.nurseryPick ? "TBD" : "$" + selected.price}</p>
    <p>Available: ${selected.qty}</p>
    <p>Sun: ${selected.sun}</p>
    <p>Water: ${selected.water}</p>
    <p>Mature size: ${selected.h}' high x ${selected.w}' wide</p>
    <p><strong>${plantHoaStatus(selected)}</strong></p>
    <p class="small">${hoaRule ? hoaRule.notes : ""}</p>
  `;

  details.appendChild(img);
  details.appendChild(content);
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
