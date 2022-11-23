const orderSummaryElement = document.querySelector(".orderlist");

const fetchOrder = async () => {
  return fetch("/orders").then((res) => res.json());
};

const orderItemsComponent = function (pizzaName, amount) {
  return `
<div class="order-items-card">
    <p>- ${pizzaName}</p>
    <p class="order-amount">${amount} db</p>
</div>
`;
};

const orderDetailsComponent = function (name, address, phone, email) {
  return `
<div class="order-details-card">
    <h2>Vásárló adatai:</h2>
    <p>${name}</p>
    <p>${address}</p>
    <p>${phone}</p>
    <p>${email}</p>
</div>
`;
};

const orderCardComponent = `<div class="order-card"></div>`;

async function loadOrders() {
  const orders = await fetchOrder();

  orders.forEach(() => {
    orderSummaryElement.insertAdjacentHTML("beforeend", orderCardComponent);
  });

  let orderCardsHTML = document.querySelectorAll(".order-card");

  for (let i = 0; i < orderCardsHTML.length; i++) {
    orderCardsHTML[i].insertAdjacentHTML(
      "beforeend",
      orderDetailsComponent(
        orders[i].name,
        orders[i].address,
        orders[i].phone,
        orders[i].email
      )
    );

    let orderItems = orders[i].order.orderArray;

    for (let j = 0; j < orderItems.length; j++) {
      orderCardsHTML[i].insertAdjacentHTML(
        "beforeend",
        orderItemsComponent(orderItems[j].pizza, orderItems[j].amount)
      );
    }
  }
}

window.addEventListener("loaded", loadOrders());
