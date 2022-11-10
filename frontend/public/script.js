const rootElement = document.querySelector("#root");
const menuList = document.querySelector(".pizzas");
const orderList = document.querySelector(".ordered-pizzas");

const menuComponent = function (id, pic, pizzaName, ingredients) {
  return `
<div class="pizza-card" id=${id}>
    <img src="${pic}" alt="" />
    <span>
        <h2>${pizzaName}</h2>
            <p>${ingredients}</p>
    </span>
    <form action="">
        <input
            class="quantity"
            type="number"
            id="input${id}"
            name="quantity"
            min="0"
            max="10"
        />
        <input id="btn${id}" class="kosar-button" type="button" value="kosárba" />
    </form>
</div>`;
};

const orderComponent = function (id, pic, pizzaName, amount) {
  return `
<div class="order-pizza-card" id=${id}>
    <img src="${pic}" alt="" />
    <span>
        <h2>${pizzaName}</h2>
            
    </span>
    <form>
        <h2 class="amount">${amount} db</h2>
    </form>
</div>
`;
};

const fetchMenu = async () => {
  return fetch("/menu").then((res) => res.json());
};

async function loadEvent() {
  const menu = await fetchMenu();

  for (let i = 0; i < menu.length; i++) {
    menuList.insertAdjacentHTML(
      "beforeend",
      menuComponent(
        menu[i].id,
        menu[i].pic,
        menu[i].pizzaName,
        menu[i].ingredients
      )
    );
  }

  const buttons = document.querySelectorAll(".kosar-button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", async function () {
      let itemID = parseInt(this.id.substring(3));
      let orderAmount = document.querySelector("#input" + itemID).value;

      const menu = await fetchMenu();

      for (let i = 0; i < menu.length; i++) {
        if (itemID === menu[i].id) {
          orderList.insertAdjacentHTML(
            "beforeend",
            orderComponent(
              menu[i].id,
              menu[i].pic,
              menu[i].pizzaName,
              orderAmount
            )
          );
        }
      }
    });
  }
}

rootElement.addEventListener("loaded", loadEvent());

const orderButton = document.querySelector(".order-button");
orderButton.addEventListener("click", async function () {
  const menu = await fetchMenu();
  let orderItems = document.querySelectorAll(".order-pizza-card");

  let orderSummary = {
    name: document.querySelector(".name").value,
    phone: document.querySelector(".phone").value,
    email: document.querySelector(".email").value,
    address: document.querySelector(".address").value,
    order: {},
  };

  let orderArray = [];



//   for (let i = 0; i < orderItems.length; i++) {
//     let itemID = parseInt(orderItems[i].id);
//     let itemAmountString = document.querySelector(".amount").textContent;
//     let itemAmount = itemAmountString.slice(0, 1);
//     console.log(itemID);
//     console.log(itemAmount);

//     // let orderArray = {
//     //   1: {
//     //     id: itemID,
//     //     amount: itemAmount,
//     //   },
//     //   2: {
//     //     id: itemID,
//     //     amount: itemAmount,
//     //   },
//     // };
//   }
// });
