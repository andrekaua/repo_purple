var express = require("express");
var router = express.Router();
var produtoController = require("../controllers/produto-controller");

router.post("/cadastrar_produtos", produtoController.cadastrar_produtos);

module.exports = router;