document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tilauslomake");
  const hintaElementti = document.getElementById("hinta");
  const yhteenveto = document.getElementById("yhteenveto");

  let taytteet = [];
  let lisukkeet = [];
  let kokonaishinta = 0;

  function paivitaHinta() {
    kokonaishinta = 0;
    taytteet = [];
    lisukkeet = [];

    // Koko
    const kokoInput = form.querySelector('input[name="koko"]:checked');
    if (kokoInput) {
      const price = parseFloat(kokoInput.dataset.price);
      if (!isNaN(price)) kokonaishinta += price;
    }

    // Täytteet
    form.querySelectorAll('input[name="tayte"]:checked').forEach((el) => {
      taytteet.push(el.parentElement.textContent.trim());
      kokonaishinta += 1;
    });

    // Lisukkeet
    form.querySelectorAll('input[name="lisuke"]:checked').forEach((el) => {
      const price = parseFloat(el.dataset.price);
      if (!isNaN(price)) kokonaishinta += price;
      lisukkeet.push(el.parentElement.textContent.trim());
    });

    // Toimitus
    const toimitusInput = form.querySelector('input[name="toimitus"]:checked');
    if (toimitusInput) {
      const price = parseFloat(toimitusInput.dataset.price);
      if (!isNaN(price)) kokonaishinta += price;
    }

    hintaElementti.textContent = kokonaishinta.toFixed(2) + " €";
  }

  form.addEventListener("change", paivitaHinta);

  document.getElementById("naytaTilaus").addEventListener("click", () => {
    const nimi = document.getElementById("nimi").value.trim() || "(Ei annettu)";
    const koko =
      form
        .querySelector('input[name="koko"]:checked')
        ?.parentElement.textContent.trim() || "(ei valittu)";
    const toimitus =
      form
        .querySelector('input[name="toimitus"]:checked')
        ?.parentElement.textContent.trim() || "(ei valittu)";

    yhteenveto.innerHTML = `
      <h3>Tilausyhteenveto</h3>
      <p><strong>Asiakas:</strong> ${nimi}</p>
      <p><strong>Pannukakku:</strong> ${koko}</p>
      <p><strong>Täytteet:</strong> ${taytteet.join(", ") || "(ei valittu)"}</p>
      <p><strong>Lisukkeet:</strong> ${
        lisukkeet.join(", ") || "(ei valittu)"
      }</p>
      <p><strong>Toimitustapa:</strong> ${toimitus}</p>
      <p><strong>Kokonaishinta:</strong> ${hintaElementti.textContent}</p>
    `;
  });

  document.getElementById("vahvistaTilaus").addEventListener("click", () => {
    const customerName = document.getElementById("nimi").value.trim();
    if (!customerName) {
      alert("Anna asiakkaan nimi.");
      return;
    }

    const selectedPancake =
      form
        .querySelector('input[name="koko"]:checked')
        ?.parentElement.textContent.trim() || "Ei valittu";
    const deliveryMethod =
      form
        .querySelector('input[name="toimitus"]:checked')
        ?.parentElement.textContent.trim() || "Ei valittu";

    const order = {
      id: Date.now(),
      customerName,
      selectedPancake,
      toppings: [...taytteet],
      extras: [...lisukkeet],
      deliveryMethod,
      totalPrice: kokonaishinta,
      status: "waiting",
    };

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    alert("Tilaus tallennettu!");
    form.reset();
    paivitaHinta();
    yhteenveto.innerHTML = "";
  });

  paivitaHinta(); // Käynnistä hintalaskenta alussa
});
