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
            id="${id}-input"
            name="quantity"
            min="0"
            max="10"
        />
        <input class="kosar-button" type="button" value="kosárba" />
    </form>
</div>`;
};

const orderComponent = function (id, pic, pizzaName, ingredients, amount) {
  return `
<div class="pizza-card" id=${id}>
    <img src="${pic}" alt="" />
    <span>
        <h2>${pizzaName}</h2>
            <p>${ingredients}</p>
    </span>
    <h2>x${amount}</h2>
</div>`;
};

const fetchMenu = async () => {
  return fetch("/menu").then((res) => res.json());
};

async function loadEvent() {
  const menu = await fetchMenu();
  console.log(menu);

  const menuDataList = menu;

  for (let i = 0; i < menuDataList.length; i++) {
    menuList.insertAdjacentHTML(
      "beforeend",
      menuComponent(
        menuDataList[i].id,
        menuDataList[i].pic,
        menuDataList[i].pizzaName,
        menuDataList[i].ingredients
      )
    );
  }
}

rootElement.addEventListener("loaded", loadEvent());

const addCartButton = document.querySelector(".kosar-button");
addCartButton.addEventListener("click", function () {
  const orderAmount = document.querySelector();
});
