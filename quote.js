function buildQuoteText() {
  const projectName = document.getElementById("projectName").value || "Untitled Project";
  const address = document.getElementById("address").value || "No address entered";
  const hoa = document.getElementById("hoa").value || "Not specified";

  const exactPlantTotal = placed
    .filter(plant => !plant.nurseryPick)
    .reduce((sum, plant) => sum + plant.price, 0);

  const counts = {};

  placed.forEach(plant => {
    const key = plant.nurseryPick
      ? `${plant.name} (${plant.requestedSize || "size TBD"})`
      : plant.name;

    if (!counts[key]) {
      counts[key] = {
        qty: 0,
        price: plant.price,
        nurseryPick: plant.nurseryPick
      };
    }

    counts[key].qty++;
  });

  let plantList = "";

  Object.keys(counts).forEach(name => {
    const item = counts[name];

    if (item.nurseryPick) {
      plantList += `${item.qty} x ${name} - Price TBD by nursery\n`;
    } else {
      plantList += `${item.qty} x ${name} - $${(item.qty * item.price).toLocaleString()}\n`;
    }
  });

  return `
Landscape Design Quote Request

Project: ${projectName}
Address: ${address}
HOA: ${hoa}
Season View: ${season}
Growth Preview Year: ${growthYear}

Requested Plants:
${plantList || "No plants placed yet."}

Estimated Exact-Plant Total: $${exactPlantTotal.toLocaleString()}
Nursery Pick items require nursery pricing.

Customer Notes:
`;
}

function requestQuote() {
  const quoteText = buildQuoteText();

  const subject = encodeURIComponent("Landscape Design Quote Request");
  const body = encodeURIComponent(quoteText);

  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function printDesign() {
  window.print();
}
