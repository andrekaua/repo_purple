var express = require("express");
var router = express.Router();
var ingressosController = require("../controllers/ingresso-controller");

router.post("/cadastrar_ingressos", ingressosController.cadastrar_ingressos);

module.exports = router;