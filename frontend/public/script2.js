const orderSummaryElement = document.querySelector(".ordered-details");

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
  const orderItems = order[0].order.orderArray;

  for (let i = 0; i < orderItems.length; i++) {
    orderSummaryElement.insertAdjacentHTML(
      "beforeend",
      orderCardComponent(
        order[0].order.orderArray[i].pizza,
        order[0].order.orderArray[i].amount
      )
    );
  }

  orderSummaryElement.insertAdjacentHTML(
    "beforeend",
    orderDetailsComponent(
      order[0].name,
      order[0].address,
      order[0].phone,
      order[0].email
    )
  );
}

window.addEventListener("loaded", loadEvent());
