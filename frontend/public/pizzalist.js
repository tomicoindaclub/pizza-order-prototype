const rootElement = document.querySelector("#pizzalist-container");
const menuList = document.querySelector(".pizzalist");

const activeMenuComponent = function (id, pic, pizzaName, ingredients) {
  return `
<div class="pizza-card" id="${id}">
    <p>ID: ${id}</p>
    <img src="${pic}" alt="" />
    <span>
        <h2>${pizzaName}</h2>
            <p>${ingredients}</p>
    </span>
    <button class="edit-button" id="btn${id}">Szerkesztés</button>
    <button class="delete-button" id="delete${id}">Törlés</button>
    <input type="checkbox" id="chcek-${id}" name="${pizzaName}" checked />
    
    <label for="${pizzaName}">Aktív?</label>
</div>`;
};

const inactiveMenuComponent = function (id, pic, pizzaName, ingredients) {
  return `
  <div class="pizza-card" id="${id}">
      <p>ID: ${id}</p>
      <img src="${pic}" alt="" />
      <span>
          <h2>${pizzaName}</h2>
              <p>${ingredients}</p>
      </span>
      <button class="edit-button" id="btn${id}">Szerkesztés</button>
      <button class="delete-button" id="delete${id}">Törlés</button>
      <input type="checkbox" id="chcek-${id}" name="${pizzaName}" />
      <label for="${pizzaName}">Aktív?</label>
  </div>`;
};

const editedMenuComponent = function (id, pizzaName, ingredients) {
  return `
     <div class="form">
          <form action="">
            <input type="text" name="id"  value="${id}"/>
            <input type="text" name="pizzaName"  value="${pizzaName}"/>
            <input type="text" name="ingredients"  value="${ingredients}"/>
            <label class="upload-button">
              <input type="file" />
              Kép feltöltése
            </label>
            <input type="file" name="pic" />
          </form>
      <button class="save-button" id="save${id}">Mentés</button>
      <input type="checkbox" id="check-${id}" name="${pizzaName}" />
      <label for="${pizzaName}">Aktív?</label> `;
};

const fetchMenu = async () => {
  return fetch("/menu").then((res) => res.json());
};

let selectedItemCard;

async function loadEvent() {
  const menu = await fetchMenu();

  for (let i = 0; i < menu.length; i++) {
    if (menu[i].isActive === true) {
      menuList.insertAdjacentHTML(
        "beforeend",
        activeMenuComponent(
          menu[i].id,
          menu[i].pic,
          menu[i].pizzaName,
          menu[i].ingredients
        )
      );
    } else {
      menuList.insertAdjacentHTML(
        "beforeend",
        inactiveMenuComponent(
          menu[i].id,
          menu[i].pic,
          menu[i].pizzaName,
          menu[i].ingredients
        )
      );
    }
  }

  const buttons = document.querySelectorAll(".edit-button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", async function () {
      // gombokkal valahogy le kell kezelni hogy az adott pizzának ami a json-ből lekért eredmény (itt egy menu nevű tömb) hányadik eleme, majd annak az elemnek a kulcsérték-ét módosítani kell, pl gombnyomásra megváltozik annak az elemnek a HTML-je és input mezők lesznek ahová új értékeket tudunk írni és ezután visszaküldeni az új értékeket

      let itemID = parseInt(this.id.substring(3));
      let itemCards = document.querySelectorAll(".pizza-card");
      itemCards.forEach((selected) => {
        if (parseInt(selected.id) === itemID) {
          selectedItemCard = selected;
        }
      });

      menuItems = await fetchMenu();
      menuItems.forEach((editedItem) => {
        if (parseInt(editedItem.id) === itemID) {
          selectedItemCard.innerHTML = editedMenuComponent(
            editedItem.id,
            editedItem.pizzaName,
            editedItem.ingredients
          );
        }
      });
    });
  }
}

rootElement.addEventListener("loaded", loadEvent());

const formElement = document.querySelector("form");
formElement.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append("id", formElement.querySelector('input[name="id"]').value);
  formData.append(
    "pizzaName",
    formElement.querySelector('input[name="pizzaName"]').value
  );
  formData.append(
    "ingredients",
    formElement.querySelector('input[name="ingredients"]').value
  );
  formData.append(
    "pic",
    formElement.querySelector('input[name="pic"]').files[0]
  );

  fetch("/add-pizza", {
    method: "POST",
    body: formData,
  }).then();
});
