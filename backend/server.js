const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

app.use(express.json());

app.listen(9000, (_) => console.log("127.0.0.1:9000"));

app.use("/public", express.static(`${__dirname}/../frontend/public`));

app.use("/data/img", express.static(`${__dirname}/../backend/data/img`));

app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.get("/order-complete", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index2.html`));
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
