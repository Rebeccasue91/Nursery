const hoaRules = {
  "Dove Mountain": {
    approvedPlantIds: ["SG-104", "TS-201", "RY-302", "AG-220", "LA-118", "PV-401", "DW-411", "GB-510", "DS-610", "FD-720"],
    notes: "Prototype rule set. Final HOA approval should be verified before installation."
  },

  "Gladden Farms": {
    approvedPlantIds: ["SG-104", "TS-201", "RY-302", "AG-220", "LA-118", "PV-401", "DW-411", "GB-510", "DS-610", "FD-720"],
    notes: "Prototype rule set. Low-water desert landscaping should still be verified with the HOA."
  },

  "Continental Ranch": {
    approvedPlantIds: ["SG-104", "TS-201", "RY-302", "AG-220", "LA-118", "PV-401", "DW-411", "GB-510", "DS-610", "FD-720"],
    notes: "Prototype rule set. Arid-climate plants should still be verified with the HOA."
  },

  "Rancho Vistoso": {
    approvedPlantIds: ["SG-104", "TS-201", "RY-302", "AG-220", "PV-401", "DW-411", "GB-510", "DS-610", "FD-720"],
    notes: "Prototype rule set. Some groundcovers may require verification."
  },

  "Saguaro Bloom": {
    approvedPlantIds: ["SG-104", "TS-201", "RY-302", "AG-220", "LA-118", "PV-401", "DW-411", "GB-510", "DS-610", "FD-720"],
    notes: "Prototype rule set. Low-water Marana plants should still be verified."
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
  if (plant.nurseryPick) return true;

  const rule = getCurrentHoaRule();
  return rule.approvedPlantIds.includes(plant.id);
}

function handleHoaChange() {
  renderPlantList();
  renderDetails();
  renderGrid();
}
