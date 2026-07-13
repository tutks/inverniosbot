const botmanager = require("./modules/botmanager");

botmanager.start();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Bot de minecraf activo");
});

app.listen(PORT, () => {
    console.log('servidor web escuchando en el puerto ${PORT}');
});