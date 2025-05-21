var express = require("express");
var router = express.Router();

var entradaDadosController = require("../controllers/criar_evento-controller");

router.post("/criar_evento", function (req, res) {
    entradaDadosController.cadastrarEvento(req, res);
});

module.exports = router;
