function buildQuoteText() {
  const projectName = document.getElementById("projectName").value || "Untitled Project";
  const address = document.getElementById("address").value || "No address entered";
  const hoa = document.getElementById("hoa").value || "Not specified";

  const total = placed.reduce((sum, plant) => sum + plant.price, 0);

  const counts = {};
  placed.forEach(plant => {
    if (!counts[plant.name]) {
      counts[plant.name] = {
        qty: 0,
        price: plant.price
      };
    }
    counts[plant.name].qty++;
  });

  let plantList = "";

  Object.keys(counts).forEach(name => {
    plantList += `${counts[name].qty} x ${name} - $${counts[name].qty * counts[name].price}\n`;
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

Estimated Plant Total: $${total.toLocaleString()}

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
