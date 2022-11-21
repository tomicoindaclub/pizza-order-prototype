const orderSummaryElement = document.querySelector(".ordered");

// fetch function ami az orders.json-t kéri le

const fetchOrder = async () => {
  return fetch("/orders").then((res) => res.json());
};

// komponensek amiket feltöltünk majd a fetch-ből kapott adatokkal

const orderCardComponent = function (pizzaName, amount) {
  return `
<div class="order-card">
    <p>- ${pizzaName}</p>
    <p class="order-amount">${amount} db</p>
</div>
`;
};

const orderDetailsComponent = function (name, address, phone, email) {
  return `
<div class="details-card">
    <h2>Vásárló adatai:</h2>
    <p>${name}</p>
    <p>${address}</p>
    <p>${phone}</p>
    <p>${email}</p>
</div>
`;
};

// itt kezeljük le hogy a kapott adatokat megjelenítsük az oldalon

async function loadEvent() {
  const order = await fetchOrder();
  // ezzel a sorral van megoldva hogy mindig az utolsó rendelés legyen kiolvasva
  const lastOrderIndex = order.length - 1;
  const orderItems = order[lastOrderIndex].order.orderArray;

  for (let i = 0; i < orderItems.length; i++) {
    orderSummaryElement.insertAdjacentHTML(
      "beforeend",
      orderCardComponent(
        order[lastOrderIndex].order.orderArray[i].pizza,
        order[lastOrderIndex].order.orderArray[i].amount
      )
    );
  }

  orderSummaryElement.insertAdjacentHTML(
    "beforeend",
    orderDetailsComponent(
      order[lastOrderIndex].name,
      order[lastOrderIndex].address,
      order[lastOrderIndex].phone,
      order[lastOrderIndex].email
    )
  );
}

window.addEventListener("loaded", loadEvent());
