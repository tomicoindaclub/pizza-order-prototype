const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

app.listen(9000, (_) => console.log("127.0.0.1:9000"));

app.use("/public", express.static(`${__dirname}/../frontend/public`));

app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.post("/order-pizza", (req, res) => {});
