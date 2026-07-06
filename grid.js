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

function renderGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = `<div class="house">HOUSE</div>`;

  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 30; x++) {
      const cell = document.createElement("div");
      cell.className = "cell " + sunClass(x, y);

      cell.onclick = () => placePlant(x, y);
      cell.ondragover = event => event.preventDefault();
      cell.ondrop = event => dropPlant(event, x, y);

      grid.appendChild(cell);
    }
  }

  placed.forEach(p => {
    const scale = growthScale(growthYear);
    const size = Math.max(1.2, footprintSize(p) * scale);

    const footprint = document.createElement("div");
    footprint.className = "footprint";
    footprint.style.left = `${p.x * 24}px`;
    footprint.style.top = `${p.y * 24}px`;
    footprint.style.width = `${size * 24}px`;
    footprint.style.height = `${size * 24}px`;
    grid.appendChild(footprint);

    const dot = document.createElement("div");
    dot.className = `plant ${selectedPlacedId === p.placeId ? "selected" : ""}`;
    dot.style.left = `${p.x * 24}px`;
    dot.style.top = `${p.y * 24}px`;
    dot.style.width = `${Math.max(28, size * 24)}px`;
    dot.style.height = `${Math.max(28, size * 24)}px`;
    dot.innerText = p.name.split(" ")[0];

    dot.draggable = true;
    dot.ondragstart = event => startDragPlacedPlant(event, p.placeId);

    dot.onclick = event => {
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

function placePlant(x, y) {
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

  if (!confirmSunWarning(candidate, x, y)) {
    return;
  }

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
  event.preventDefault();

  const rawData = event.dataTransfer.getData("text/plain");

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

    if (!confirmSunWarning(candidate, x, y)) {
      return;
    }

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

    if (!confirmSunWarning(plant, x, y)) {
      plant.x = oldX;
      plant.y = oldY;
      return;
    }

    selectedPlacedId = plant.placeId;
    selected = plants.find(item => item.id === plant.id);
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

function updateSummary() {
  document.getElementById("count").innerText = placed.length;

  const total = placed.reduce((sum, p) => sum + p.price, 0);
  document.getElementById("total").innerText = "$" + total.toLocaleString();

  const counts = {};
  placed.forEach(p => {
    counts[p.name] = (counts[p.name] || 0) + 1;
  });

  document.getElementById("quoteList").innerHTML = Object.keys(counts)
    .map(name => {
      const plant = plants.find(p => p.name === name);
      return `
        <div class="quote-row">
          <span>${counts[name]} × ${name}</span>
          <strong>$${(counts[name] * plant.price).toLocaleString()}</strong>
        </div>
      `;
    })
    .join("");
}
