const rootElement = document.querySelector("#pizzalist-container");
const menuListElement = document.querySelector(".pizzalist");

//komponensek

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
  //bekérjük a menu.json-t és abból feltöltjük a komponenseket

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

  //szerkesztés gpmbok lekezelése

  const editButtons = document.querySelectorAll(".edit-button");
  for (let i = 0; i < editButtons.length; i++) {
    editButtons[i].addEventListener("click", async function () {
      //gomb HTML ID-jából kiolvassuk az ID-t ami egyezik a menu.json-ban az id-val

      let itemID = parseInt(this.id.substring(3));

      //vizsgálat hogy egyszerre csak egyet lehessen szerkeszteni

      if (prevItemID != itemID && prevItemID != undefined) {
        window.alert("Már szerkesztesz egy pizzát!");
        return;
      }

      //megnézzük hogy melyik kártyának a HTML-jét kell majd cserélni

      let itemCards = document.querySelectorAll(".pizza-card");
      itemCards.forEach((selected) => {
        if (parseInt(selected.id) === itemID) {
          selectedItemCard = selected;
        }
      });

      //kicseréljük a HTML-t és az inputokba beletesszük az adott item értékeit

      menuItems = await fetchMenu();

      menuItems.forEach((editedItem) => {
        if (parseInt(editedItem.id) === itemID) {
          selectedItemCard.innerHTML = editedMenuComponent(
            editedItem.id,
            editedItem.pizzaName,
            editedItem.ingredients
          );
          editedMenuItemArray = editedItem;
          prevItemID = itemID;
        }
      });

      //mentés lekezelése

      let pizzaStatus;

      let saveButton = document.querySelector(".save-button-input");
      saveButton.addEventListener("click", (event) => {
        event.preventDefault();

        let editedPizzaElement = document.querySelector(".pizza-card-edit");

        //kimentett értékek eltárolása

        let modifiedItemArray = {
          isActive: editedPizzaElement.querySelector('input[name="isActive"]')
            .checked,
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

        //beolvasott menu.json-ból kapott tömb frissítése az adott elem új értékeivel

        menuItems.forEach((item) => {
          if (item.id === itemID) {
            item.isActive = modifiedItemArray.isActive;
            item.id = modifiedItemArray.id;
            item.pizzaName = modifiedItemArray.pizzaName;
            item.ingredients = modifiedItemArray.ingredients;
            item.pic = modifiedItemArray.pic;
          }
        });

        //kép mentése

        formData = new FormData();
        formData.append(
          "newImg",
          editedPizzaElement.querySelector('input[name="newImg"]').files[0]
        );

        //fetch ami a JSON-t küldi azaz a frissített menu.json-t

        fetch("/edit-pizza", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(menuItems),
        });

        //fetch ami a képet küldi

        fetch("/edit-pizza-img", {
          method: "POST",
          body: formData,
        }).then(window.location.reload());
      });
    });
  }

  //törlés gombok lekezelése

  const deleteButtons = document.querySelectorAll(".delete-button");
  for (let j = 0; j < deleteButtons.length; j++) {
    deleteButtons[j].addEventListener("click", async function () {
      //gomb HTML ID-jából kiolvassuk az ID-t ami egyezik a menu.json-ban az id-val

      let deleteItemID = parseInt(this.id.substring(6));

      //beolvassuk a menu.json-t majd végig iterálunk rajta amíg meg nem találjuk az egyező ID-t, ha ez megvan akkor az adott elemét a tömbenk töröljük

      menuItems = await fetchMenu();

      for (let k = 0; k < menuItems.length; k++) {
        if (parseInt(menuItems[k].id) === deleteItemID) {
          menuItems.splice(k, 1);
        }
      }

      //frissített menu visszaküldése

      fetch("/delete-pizza", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menuItems),
      }).then(window.location.reload());
    });
  }
}

rootElement.addEventListener("loaded", loadEvent());

//új elem hozzáadása a menu.json-hoz

const formElement = document.querySelector("form");
formElement.addEventListener("submit", (event) => {
  event.preventDefault();

  //adatok tárolása és mentése FormData-ba

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

  // FormData küldése

  fetch("/add-pizza", {
    method: "POST",
    body: formData,
  }).then(window.location.reload());
});
