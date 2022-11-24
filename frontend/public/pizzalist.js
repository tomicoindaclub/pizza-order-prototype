const rootElement = document.querySelector("#pizzalist-container");
const menuListElement = document.querySelector(".pizzalist");

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
    <div class="checkbox-div">
      <input  class="checkbox" type="checkbox" id="chcek-${id}" name="${pizzaName}" checked />
    
      <label class="checkbox-label" for="${pizzaName}">Aktív</label>
    </div>
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
      <div class="checkbox-div">
      <input class="checkbox" type="checkbox" id="chcek-${id}" name="${pizzaName}" />
      <label class="checkbox-label" for="${pizzaName}">Aktív</label>
      </div>
  </div>`;
};

const editedMenuComponent = function (id, pizzaName, ingredients) {
  return `
     <div class="pizza-card-edit" id="${id}">
          <form class="edit-form">
            <input class="id-input" type="text" name="id"  value="${id}"/>
            <input type="text" name="pizzaName"  value="${pizzaName}"/>
            <input type="text" name="ingredients"  value="${ingredients}"/>
            <label class="upload-button">
              <input type="file" name="newImg"/>
              Kép feltöltése
            </label>
            <button class="save-button-input">Mentés</button>
          </form>
      
      <div class="checkbox-div">
      <input class="checkbox" type="checkbox" id="check-${id}" name="isActive" />
      <label class="checkbox-label" for="${pizzaName}">Aktív?</label> 
      </div>`;
};

const fetchMenu = async () => {
  return fetch("/menu").then((res) => res.json());
};

let selectedItemCard;
let prevItemID;
let editedMenuItemArray = [];

async function loadEvent() {
  const menu = await fetchMenu();

  for (let i = 0; i < menu.length; i++) {
    if (menu[i].isActive === true) {
      menuListElement.insertAdjacentHTML(
        "beforeend",
        activeMenuComponent(
          menu[i].id,
          menu[i].pic,
          menu[i].pizzaName,
          menu[i].ingredients
        )
      );
    } else {
      menuListElement.insertAdjacentHTML(
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

  //ehhez hasonlóan kellene lekezelni a delete gombokat

  const buttons = document.querySelectorAll(".edit-button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", async function () {
      //ehhez hasonlóan kapsz ID-t a gombról amivel tudsz keresni a menu,json-ban
      let itemID = parseInt(this.id.substring(3));

      if (prevItemID != itemID && prevItemID != undefined) {
        window.alert("Már szerkesztesz egy pizzát!");
        return;
      }

      let itemCards = document.querySelectorAll(".pizza-card");
      itemCards.forEach((selected) => {
        if (parseInt(selected.id) === itemID) {
          selectedItemCard = selected;
        }
      });

      //ehhez hasonlóan behívod a menu.json-t és alatta .forEach ami végiglépked az elemein és az if-ben a vizsgálat alapján kapod meg melyik eleme a tömbnek amit törölni kell

      menuItems = await fetchMenu();

      menuItems.forEach((editedItem) => {
        if (parseInt(editedItem.id) === itemID) {
          // ide majd az kell hogy a kiválasztott elemét annak a tömbnek amin megyünk végig kitöröljük

          selectedItemCard.innerHTML = editedMenuComponent(
            editedItem.id,
            editedItem.pizzaName,
            editedItem.ingredients
          );
          editedMenuItemArray = editedItem;
          prevItemID = itemID;
        }
      });

      let pizzaStatus;

      let saveButton = document.querySelector(".save-button-input");
      saveButton.addEventListener("click", (event) => {
        event.preventDefault();

        let editedPizzaElement = document.querySelector(".pizza-card-edit");
        if (
          editedPizzaElement.querySelector('input[name="isActive"]').value ===
          "on"
        ) {
          pizzaStatus = true;
        } else {
          pizzaStatus = false;
        }

        let modifiedItemArray = {
          isActive: pizzaStatus,
          id: parseInt(
            editedPizzaElement.querySelector('input[name="id"]').value
          ),
          pizzaName: editedPizzaElement.querySelector('input[name="pizzaName"]')
            .value,
          ingredients: editedPizzaElement.querySelector(
            'input[name="ingredients"]'
          ).value,
          pic: `/data/img/${
            editedPizzaElement.querySelector('input[name="newImg"]').files[0]
              .name
          }`,
        };

        menuItems.forEach((item) => {
          if (item.id === itemID) {
            item.isActive = modifiedItemArray.isActive;
            item.id = modifiedItemArray.id;
            item.pizzaName = modifiedItemArray.pizzaName;
            item.ingredients = modifiedItemArray.ingredients;
            item.pic = modifiedItemArray.pic;
            console.log(item);
          }
        });

        formData = new FormData();
        formData.append(
          "newImg",
          editedPizzaElement.querySelector('input[name="newImg"]').files[0]
        );

        //  /delete-pizza fetchel küldöd vissza backendre

        fetch("/edit-pizza", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(menuItems),
        });

        console.dir(editedPizzaElement.querySelector('input[name="newImg"]'));

        fetch("/edit-pizza-img", {
          method: "POST",
          body: formData,
        }).then(window.location.reload());
      });
    });
  }
}

// delete gombok lekezelése ezen a sor alá

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
