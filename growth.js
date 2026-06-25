function growthScale(year){
  if(year < 2) return .25;
  if(year < 5) return .45;
  if(year < 10) return .7;
  if(year < 15) return .9;
  return 1;
}

function setGrowth(value){
  growthYear = Number(value);
  document.getElementById("yearLabel").innerText = growthYear === 0 ? "Today" : growthYear + " years";
  renderGrid();
}

function setSeason(value, btn){
  season = value;
  document.querySelectorAll(".season button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderGrid();
}
