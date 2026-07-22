function updateSummary() {
  document.getElementById("count").innerText = placed.length;

  const exactPlantTotal = placed
    .filter(p => !p.nurseryPick)
    .reduce((sum, p) => sum + p.price, 0);

  document.getElementById("total").innerText =
    "$" + exactPlantTotal.toLocaleString() + " + TBD";

  const counts = {};

  placed.forEach(p => {
    const key = p.nurseryPick
      ? `${p.name} (${p.requestedSize || "size TBD"})`
      : p.name;

    if (!counts[key]) {
      counts[key] = {
        qty: 0,
        price: p.price,
        nurseryPick: p.nurseryPick
      };
    }

    counts[key].qty++;
  });

  document.getElementById("quoteList").innerHTML = Object.keys(counts)
    .map(name => {
      const item = counts[name];

      const priceText = item.nurseryPick
        ? "TBD"
        : "$" + (item.qty * item.price).toLocaleString();

      return `
        <div class="quote-row">
          <span>${item.qty} × ${name}</span>
          <strong>${priceText}</strong>
        </div>
      `;
    })
    .join("");
}
