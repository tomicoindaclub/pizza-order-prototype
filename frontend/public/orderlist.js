const orderSummaryElement = document.querySelector(".ordered");

const fetchOrder = async () => {
  return fetch("/orders").then((res) => res.json());
};

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

async function loadEvent() {
  const orders = await fetchOrder();

  for (let i = 0; i < orders.length; i++) {
    orderSummaryElement.insertAdjacentHTML(
      "beforeend",
      orderCardComponent(
        orders[i].order.orderArray[i].pizza,
        orders[i].order.orderArray[i].amount
      )
    );
    orderSummaryElement.insertAdjacentHTML(
      "beforeend",
      orderDetailsComponent(
        orders[i].name,
        orders[i].address,
        orders[i].phone,
        orders[i].email
      )
    );
  }
}

window.addEventListener("loaded", loadEvent());
