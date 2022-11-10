const orderSummaryElement = document.querySelector(".ordered");

const fetchOrder = async () => {
  return fetch("/orders").then((res) => res.json());
};

const orderCardComponent = function (pizzaName, amount) {
  return `
<div class="order-card">
    <p>${pizzaName}</p>
    <p>${amount} db</p>
</div>
`;
};

const orderDetailsComponent = function (name, address, phone, email) {
  return `
<div class="details-card">
    <p>${name}</p>
    <p>${address}</p>
    <p>${phone}</p>
    <p>${email}</p>
</div>
`;
};

async function loadEvent() {
  const order = await fetchOrder();
  const orderItems = order.order.orderArray;

  for (let i = 0; i < orderItems.length; i++) {
    orderSummaryElement.insertAdjacentHTML(
      "beforeend",
      orderCardComponent(
        order.order.orderArray.pizza,
        order.order.orderArray.amount
      )
    );
  }

  orderSummaryElement.insertAdjacentHTML(
    "beforeend",
    orderDetailsComponent(order.name, order.address, order.phone, order.email)
  );
}

window.addEventListener("loaded", loadEvent());
