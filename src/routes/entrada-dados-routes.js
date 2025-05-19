var express = require("express");
var router = express.Router();

var entradaDadosController = require("../controllers/entrada-dados-controllers");

// Rota para cadastrar um novo evento
router.post("/cadastrarEvento", function (req, res) {
    entradaDadosController.cadastrarEvento(req, res);
});

// Rota para cadastrar gastos
router.post("/cadastrarGastos", function (req, res) {
    entradaDadosController.cadastrarGastos(req, res);
});

// Rota para cadastrar ingressos
router.post("/cadastrarIngressos", function (req, res) {
    entradaDadosController.cadastrarIngressos(req, res);
});

// Rota para cadastrar produtos adicionais
router.post("/cadastrarProdutos", function (req, res) {
    entradaDadosController.cadastrarProdutos(req, res);
});

module.exports = router;