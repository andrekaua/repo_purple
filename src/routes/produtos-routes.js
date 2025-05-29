var express = require("express");
var router = express.Router();
var produtoController = require("../controllers/produto-controller");

router.post("/cadastrar_produtos", produtoController.cadastrar_produtos);

router.get("/buscar_produtos/:evento_id", produtoController.buscar_produtos);

module.exports = router;