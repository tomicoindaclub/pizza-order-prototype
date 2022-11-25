const rootElement = document.querySelector("#root");
const menuList = document.querySelector(".pizzas");
const orderList = document.querySelector(".ordered-pizzas");

// komponensek amibe betöltődik a menü lista és a rendelés lista

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
            value="0"
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
        <h2 class="pizza-name${id}">${pizzaName}</h2>
            
    </span>
    <form>
        <h2 class="amount${id}">${amount} db</h2>
    </form>
</div>
`;
};

const deteteItem = document.querySelector(".delete-item");

// fetch function ami behívja a menu.json-t

const fetchMenu = async () => {
  return fetch("/menu").then((res) => res.json());
};

async function loadEvent() {
  const menu = await fetchMenu();

  // fetchből feltöltjük a menü listát amiben csak active status-al rendelkező elemek lesznek

  for (let i = 0; i < menu.length; i++) {
    if (menu[i].isActive === true) {
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
  }

  // menü gombjainak lekezelése

  const buttons = document.querySelectorAll(".kosar-button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", async function () {
      let itemID = parseInt(this.id.substring(3));
      let orderAmount = document.querySelector("#input" + itemID).value;

      const menu = await fetchMenu();

      // ez a rész kezeli le hogy van-e már ilyen pizza, és ha igen akkor megnöveli a mennyiségét a meglévőnek

      const cartItems = document.querySelectorAll(".order-pizza-card");
      for (let i = 0; i < cartItems.length; i++) {
        if (parseInt(cartItems[i].id) === itemID) {
          let currentAmount = cartItems[i].querySelector(
            ".amount" + itemID
          ).textContent;
          let newAmount =
            parseInt(currentAmount.slice(0, 1)) + parseInt(orderAmount);
          return (cartItems[i].querySelector(".amount" + itemID).textContent =
            newAmount + " db");
        }
      }

      if (parseInt(orderAmount) === 0) {
        // ez a rész kiszűri ha 0 db-ot rendelsz
        window.alert("Sajnáljuk, de 0 darab pizzát nem rendelhetsz!");
      } else {
        // ez a rész generálja le a rendelés listát
        for (let i = 0; i < menu.length; i++) {
          if (itemID === menu[i].id) {
            orderList.insertAdjacentHTML(
              "beforeend",
              orderComponent(
                menu[i].id,
                menu[i].pic,
                menu[i].pizzaName,
                orderAmount,
                deteteItem
              )
            );
          }
        }
      }
    });
  }
}

rootElement.addEventListener("loaded", loadEvent());

// ez a rész kezeli le a rendelés leadását

const orderButton = document.querySelector(".order-button");
orderButton.addEventListener("click", function () {
  let orderItems = document.querySelectorAll(".order-pizza-card");

  let orderArray = [];

  // itt nyerjük ki a megrendelt dolgokat

  function itemSort(item) {
    let itemID = parseInt(item.id);
    let itemName = document.querySelector(".pizza-name" + itemID).textContent;
    let itemAmountString = document.querySelector(
      ".amount" + itemID
    ).textContent;
    let itemAmount = itemAmountString.slice(0, 1);

    let itemArray = {
      pizza: itemName,
      amount: itemAmount,
    };

    orderArray.push(itemArray);
  }
  orderItems.forEach(itemSort);

  // itt tároljuk el az egész rendelést

  let orderSummary = {
    name: document.querySelector(".name").value,
    phone: document.querySelector(".phone").value,
    email: document.querySelector(".email").value,
    address: document.querySelector(".address").value,
    order: { orderArray },
  };

  // elküldi POST-al a rendelést az orders.json-ba

  fetch("/order-pizza", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderSummary),
  }).then((res) => console.log(res));

  // tovább irányít az összegző oldalra

  location.href = "/order-complete";
});
