const GRID_COLS = 30;
const GRID_ROWS = 20;
const CELL_SIZE = 24;

function sunClass(x, y) {
  if (season === "summer") {
    if (x < 10) return "full";
    if (x < 22) return "partial";
    return "shade";
  }

  if (season === "winter") {
    if (y < 7) return "shade";
    if (x < 14) return "partial";
    return "full";
  }

  if (x < 9) return "full";
  if (x < 22) return "partial";
  return "shade";
}

function footprintSize(plant) {
  return plant.spread || plant.w || 3;
}

function getPropertyProfile() {
  if (typeof propertyProfile !== "undefined") {
    return propertyProfile;
  }

  return {
    houseLeft: 275,
    houseTop: 145,
    houseWidth: 190,
    houseHeight: 120,
    label: "HOUSE"
  };
}

function renderGrid() {
  const grid = document.getElementById("grid");
  const profile = getPropertyProfile();

  grid.innerHTML = "";

  grid.ondragover = event => event.preventDefault();
  grid.ondrop = event => {
    event.preventDefault();

    const rect = grid.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((event.clientY - rect.top) / CELL_SIZE);

    if (x < 0 || y < 0 || x >= GRID_COLS || y >= GRID_ROWS) return;

    dropPlant(event, x, y);
  };

  for (let y = 0; y < GRID_ROWS; y++) {
    for (let x = 0; x < GRID_COLS; x++) {
      const cell = document.createElement("div");
      cell.className = "cell " + sunClass(x, y);
      cell.onclick = () => placePlant(x, y);
      grid.appendChild(cell);
    }
  }

  const house = document.createElement("div");
  house.className = "house";
  house.style.left = profile.houseLeft + "px";
  house.style.top = profile.houseTop + "px";
  house.style.width = profile.houseWidth + "px";
  house.style.height = profile.houseHeight + "px";
  house.innerText = profile.label || "HOUSE";
  grid.appendChild(house);

  placed.forEach(p => {
    const scale = growthScale(growthYear);
    const size = Math.max(1.2, footprintSize(p) * scale);

    const footprint = document.createElement("div");
    footprint.className = "footprint";
    footprint.style.left = `${p.x * CELL_SIZE}px`;
    footprint.style.top = `${p.y * CELL_SIZE}px`;
    footprint.style.width = `${size * CELL_SIZE}px`;
    footprint.style.height = `${size * CELL_SIZE}px`;
    grid.appendChild(footprint);

    const dot = document.createElement("div");
    dot.className = `plant ${selectedPlacedId === p.placeId ? "selected" : ""}`;
    dot.style.left = `${p.x * CELL_SIZE}px`;
    dot.style.top = `${p.y * CELL_SIZE}px`;
    dot.style.width = `${Math.max(28, size * CELL_SIZE)}px`;
    dot.style.height = `${Math.max(28, size * CELL_SIZE)}px`;
    dot.innerText = p.nurseryPick ? "Pick" : p.name.split(" ")[0];

    dot.draggable = true;
    dot.ondragstart = event => startDragPlacedPlant(event, p.placeId);

    dot.onclick = event => {
      event.stopPropagation();
      selectedPlacedId = p.placeId;
      selected = p.nurseryPick ? p : plants.find(item => item.id === p.id);
      renderPlantList();
      renderDetails();
      renderGrid();
    };

    grid.appendChild(dot);
  });

  updateSummary();
}

function placePlant(x, y) {
  if (!selected) return;

  const candidate = {
    ...selected,
    x,
    y,
    placeId: Date.now() + Math.random()
  };

  if (hasCollision(candidate)) {
    alert("That plant is too close to another plant at mature size.");
    return;
  }

  if (!confirmHoaWarning(candidate)) return;
  if (!confirmSunWarning(candidate, x, y)) return;

  placed.push(candidate);
  selectedPlacedId = candidate.placeId;
  renderGrid();
}

function startDragPlacedPlant(event, placeId) {
  event.stopPropagation();

  event.dataTransfer.setData(
    "text/plain",
    JSON.stringify({
      type: "placed",
      placeId: placeId
    })
  );

  event.dataTransfer.effectAllowed = "move";
}

function dropPlant(event, x, y) {
  const rawData = event.dataTransfer.getData("text/plain");
  if (!rawData) return;

  let data;

  try {
    data = JSON.parse(rawData);
  } catch {
    data = { type: "inventory", id: rawData };
  }

  if (data.type === "inventory") {
    const plant = plants.find(p => p.id === data.id);
    if (!plant) return;

    const candidate = {
      ...plant,
      x,
      y,
      placeId: Date.now() + Math.random()
    };

    if (hasCollision(candidate)) {
      alert("That plant is too close to another plant at mature size.");
      return;
    }

    if (!confirmHoaWarning(candidate)) return;
    if (!confirmSunWarning(candidate, x, y)) return;

    selected = plant;
    selectedPlacedId = candidate.placeId;
    placed.push(candidate);
  }

  if (data.type === "placed") {
    const plant = placed.find(p => p.placeId === data.placeId);
    if (!plant) return;

    const oldX = plant.x;
    const oldY = plant.y;

    plant.x = x;
    plant.y = y;

    if (hasCollision(plant, plant.placeId)) {
      plant.x = oldX;
      plant.y = oldY;
      alert("That move would crowd another plant at mature size.");
      return;
    }

    if (!confirmHoaWarning(plant) || !confirmSunWarning(plant, x, y)) {
      plant.x = oldX;
      plant.y = oldY;
      return;
    }

    selectedPlacedId = plant.placeId;
    selected = plant.nurseryPick ? plant : plants.find(item => item.id === plant.id);
  }

  renderPlantList();
  renderDetails();
  renderGrid();
}

function hasCollision(candidate, ignorePlaceId = null) {
  const candidateSize = footprintSize(candidate);

  return placed.some(existing => {
    if (existing.placeId === ignorePlaceId) return false;

    const existingSize = footprintSize(existing);

    return (
      candidate.x < existing.x + existingSize &&
      candidate.x + candidateSize > existing.x &&
      candidate.y < existing.y + existingSize &&
      candidate.y + candidateSize > existing.y
    );
  });
}

function isSunCompatible(plant, x, y) {
  const zone = sunClass(x, y);

  if (plant.sun === "full" && zone === "shade") return false;
  if (plant.sun === "partial" && zone === "full") return false;
  if (plant.sun === "shade" && zone !== "shade") return false;

  return true;
}

function confirmSunWarning(plant, x, y) {
  if (isSunCompatible(plant, x, y)) return true;

  const zone = sunClass(x, y);

  return confirm(
    `${plant.name} may not be ideal here.\n\n` +
    `Plant prefers: ${plant.sun} sun\n` +
    `This grid area is: ${zone}\n\n` +
    `Place it anyway?`
  );
}

function confirmHoaWarning(plant) {
  if (typeof isHoaCompatible !== "function") return true;
  if (isHoaCompatible(plant)) return true;

  const hoa = document.getElementById("hoa").value;

  return confirm(
    `${plant.name} may not be approved for ${hoa}.\n\n` +
    `Final HOA approval should be verified.\n\n` +
    `Place it anyway?`
  );
}

function deleteSelected() {
  if (!selectedPlacedId) {
    alert("Click a placed plant on the grid first.");
    return;
  }

  placed = placed.filter(p => p.placeId !== selectedPlacedId);
  selectedPlacedId = null;
  renderGrid();
}

function resetDesign() {
  if (confirm("Clear the entire design?")) {
    placed = [];
    selectedPlacedId = null;
    renderGrid();
  }
}
