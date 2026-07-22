const hoaRules = {
  "Dove Mountain": {
    approvedCategories: ["Cactus", "Shrub", "Agave", "Tree", "Groundcover"],
    notes: "Use desert-adapted, low-water plants. Final approval should be confirmed with the HOA."
  },
  "Gladden Farms": {
    approvedCategories: ["Cactus", "Shrub", "Agave", "Tree", "Groundcover"],
    notes: "Low-water desert landscaping is generally appropriate. Final approval should be confirmed."
  },
  "Continental Ranch": {
    approvedCategories: ["Cactus", "Shrub", "Agave", "Tree", "Groundcover"],
    notes: "Arid-climate plants are preferred. Confirm final plant list with HOA."
  },
  "Rancho Vistoso": {
    approvedCategories: ["Cactus", "Shrub", "Agave", "Tree"],
    notes: "Desert-adapted plants are preferred. Some groundcovers may require approval."
  },
  "Saguaro Bloom": {
    approvedCategories: ["Cactus", "Shrub", "Agave", "Tree", "Groundcover"],
    notes: "Use low-water plants compatible with Marana desert landscaping."
  },
  "Not Sure": {
    approvedCategories: ["Cactus", "Shrub", "Agave", "Tree", "Groundcover"],
    notes: "HOA not selected. Recommendations should be verified before installation."
  }
};

function getCurrentHoaRule() {
  const hoa = document.getElementById("hoa").value;
  return hoaRules[hoa] || hoaRules["Not Sure"];
}

function isHoaCompatible(plant) {
  const rule = getCurrentHoaRule();
  return rule.approvedCategories.includes(plant.category);
}
