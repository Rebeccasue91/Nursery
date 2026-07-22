let propertyProfile = {
  houseLeft: 275,
  houseTop: 145,
  houseWidth: 190,
  houseHeight: 120,
  label: "HOUSE"
};

function analyzeAddress() {
  const address = document.getElementById("address").value.trim();

  if (!address) {
    alert("Enter an address first.");
    return;
  }

  const seed = address.length;

  propertyProfile = {
    houseLeft: 220 + (seed % 5) * 18,
    houseTop: 110 + (seed % 4) * 18,
    houseWidth: 160 + (seed % 4) * 20,
    houseHeight: 100 + (seed % 3) * 20,
    label: "HOUSE"
  };

  alert("Prototype property layout generated from address.");
  renderGrid();
}
