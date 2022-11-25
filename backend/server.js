const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const fileUpload = require("express-fileupload");

app.use(express.json());

app.use(fileUpload());

app.listen(9000, (_) => console.log("127.0.0.1:9000"));

app.use("/public", express.static(`${__dirname}/../frontend/public`));

app.use("/data/img", express.static(`${__dirname}/../backend/data/img`));

app.get("/pizzalist", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/pizzalist.html`));
});

app.get("/orderlist", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/orderlist.html`));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.get("/order-complete", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/summary.html`));
});

app.get("/menu", (req, res) => {
  fs.readFile(`${__dirname}/data/menu.json`, function (err, data) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    } else {
      studentData = JSON.parse(data);
      return res.send(studentData);
    }
  });
});

app.get("/orders", (req, res) => {
  fs.readFile(`${__dirname}/data/orders.json`, function (err, data) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    } else {
      studentData = JSON.parse(data);
      return res.send(studentData);
    }
  });
});

app.post("/order-pizza", (req, res) => {
  console.log(req.body);

  const fileData = req.body;
  const uploadPath = path.join(`${__dirname}/data/orders.json`);

  console.log(fileData);

  fs.readFile(`${__dirname}/data/orders.json`, function (err, data) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    } else {
      const orders = JSON.parse(data);
      orders.push(fileData);
      fs.writeFile(uploadPath, JSON.stringify(orders, null, 2), (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        } else {
          return res.send("ORDER SENT!");
        }
      });
    }
  });
});

app.post("/add-pizza", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const newPizzaImg = req.files.pic;

  const newPizzaData = {
    isActive: true,
    id: req.body.id,
    pizzaName: req.body.pizzaName,
    ingredients: req.body.ingredients,
    pic: `/data/img/${req.files.pic.name}`,
  };

  newPizzaImg.mv(`${__dirname}/data/img/${newPizzaImg.name}`, (err) => {
    if (err) {
      console.log(err);
    }
  });

  fs.readFile(`${__dirname}/data/menu.json`, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let menuData = JSON.parse(data);
      menuData.push(newPizzaData);

      fs.writeFile(
        `${__dirname}/data/menu.json`,
        JSON.stringify(menuData, null, 4),
        (err) => {
          if (err) {
            console.log(err);
          } else {
            return res.json(newPizzaData);
          }
        }
      );
    }
  });
});

app.post("/edit-pizza", (req, res) => {
  const newMenu = req.body;
  const uploadPath = path.join(`${__dirname}/data/menu.json`);

  fs.writeFile(uploadPath, JSON.stringify(newMenu, null, 2), (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  });
});

app.post("/edit-pizza-img", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  const editedPizzaImg = req.files.newImg;

  editedPizzaImg.mv(`${__dirname}/data/img/${editedPizzaImg.name}`, (err) => {
    if (err) {
      console.log(err);
    }
  });
});

app.delete("/delete-pizza", (req, res) => {
  const newMenu = req.body;
  const uploadPath = path.join(`${__dirname}/data/menu.json`);

  fs.writeFile(uploadPath, JSON.stringify(newMenu, null, 2), (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  });
});
