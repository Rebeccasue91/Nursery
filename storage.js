function saveDesign() {
  const design = {
    projectName: document.getElementById("projectName").value,
    address: document.getElementById("address").value,
    hoa: document.getElementById("hoa").value,
    season,
    growthYear,
    placed,
    propertyProfile
  };

  localStorage.setItem("desertRootsDesign", JSON.stringify(design));
  alert("Design saved on this device.");
}

function loadDesign() {
  const saved = localStorage.getItem("desertRootsDesign");

  if (!saved) {
    alert("No saved design found on this device.");
    return;
  }

  const design = JSON.parse(saved);

  document.getElementById("projectName").value = design.projectName || "";
  document.getElementById("address").value = design.address || "";
  document.getElementById("hoa").value = design.hoa || "Not Sure";

  season = design.season || "summer";
  growthYear = design.growthYear || 0;
  placed = design.placed || [];

  if (design.propertyProfile) {
    propertyProfile = design.propertyProfile;
  }

  document.getElementById("growthSlider").value = growthYear;
  document.getElementById("yearLabel").innerText =
    growthYear === 0 ? "Today" : growthYear + " years";

  renderGrid();
  renderPlantList();
  renderDetails();

  alert("Design loaded.");
}
  alert("Design loaded.");
}
