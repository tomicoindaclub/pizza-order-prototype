const rootElement = document.querySelector("#pizzalist-container");
const menuList = document.querySelector(".pizzalist");

const menuComponent = function (id, pic, pizzaName, ingredients) {
  return `
<div class="pizza-card" id=${id}>
    <img src="${pic}" alt="" />
    <span>
        <h2>${pizzaName}</h2>
            <p>${ingredients}</p>
    </span>
    <button class="edit-button" id="btn${id}">Szerkesztés</button>
</div>`;
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
    buttons[i].addEventListener("click", async () => {
      // gombokkal valahogy le kell kezelni hogy az adott pizzának ami a json-ből lekért eredmény (itt egy menu nevű tömb) hányadik eleme, majd annak az elemnek a kulcsérték-ét módosítani kell, pl gombnyomásra megváltozik annak az elemnek a HTML-je és input mezők lesznek ahová új értékeket tudunk írni és ezután visszaküldeni az új értékeket
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
  }).then(window.location.reload());
});
