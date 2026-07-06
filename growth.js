function growthScale(year) {
  if (year < 2) return 0.25;
  if (year < 5) return 0.45;
  if (year < 10) return 0.7;
  if (year < 15) return 0.9;
  return 1;
}

function setGrowth(value) {
  growthYear = Number(value);

  let label = "Today";

  if (growthYear > 0) {
    label = growthYear + " years";
  }

  document.getElementById("yearLabel").innerText = label;

  renderGrid();
}

function setSeason(value, btn) {
  season = value;

  document.querySelectorAll(".season button").forEach(button => {
    button.classList.remove("active");
  });

  btn.classList.add("active");

  renderGrid();
}
