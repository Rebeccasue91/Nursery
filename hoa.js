const hoaRules = {
  "Dove Mountain": {
    approvedPlantIds: ["SG-104", "TS-201", "RY-302", "AG-220", "LA-118", "PV-401", "DW-411", "GB-510", "DS-610", "FD-720"],
    notes: "Prototype rule set: desert-adapted, low-water plants are shown as compatible. Final HOA approval should be verified."
  },

  "Gladden Farms": {
    approvedPlantIds: ["SG-104", "TS-201", "RY-302", "AG-220", "LA-118", "PV-401", "DW-411", "GB-510", "DS-610", "FD-720"],
    notes: "Prototype rule set: low-water desert landscaping is shown as compatible. Final HOA approval should be verified."
  },

  "Continental Ranch": {
    approvedPlantIds: ["SG-104", "TS-201", "RY-302", "AG-220", "LA-118", "PV-401", "DW-411", "GB-510", "DS-610", "FD-720"],
    notes: "Prototype rule set: arid-climate plants are shown as compatible. Final HOA approval should be verified."
  },

  "Rancho Vistoso": {
    approvedPlantIds: ["SG-104", "TS-201", "RY-302", "AG-220", "PV-401", "DW-411", "GB-510", "DS-610", "FD-720"],
    notes: "Prototype rule set: most desert trees, cactus, agaves, and shrubs are shown as compatible. Some groundcovers may need verification."
  },

  "Saguaro Bloom": {
    approvedPlantIds: ["SG-104", "TS-201", "RY-302", "AG-220", "LA-118", "PV-401", "DW-411", "GB-510", "DS-610", "FD-720"],
    notes: "Prototype rule set: low-water plants compatible with Marana desert landscaping are shown as compatible."
  },

  "Not Sure": {
    approvedPlantIds: ["SG-104", "TS-201", "RY-302", "AG-220", "LA-118", "PV-401", "DW-411", "GB-510", "DS-610", "FD-720"],
    notes: "HOA not selected. Plant recommendations should be verified before installation."
  }
};

function getCurrentHoaRule() {
  const hoa = document.getElementById("hoa").value;
  return hoaRules[hoa] || hoaRules["Not Sure"];
}

function isHoaCompatible(plant) {
  const rule = getCurrentHoaRule();
  return rule.approvedPlantIds.includes(plant.id);
}

function handleHoaChange() {
  renderPlantList();
  renderDetails();
  renderGrid();
}
