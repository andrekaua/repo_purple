var express = require("express");
var router = express.Router();

var cadastrar_gastos = require("../controllers/gastos-controller");

router.post("/cadastrar_gastos", function (req, res) {
    cadastrar_gastos.cadastrar_gastos(req, res);
});

module.exports = router;
