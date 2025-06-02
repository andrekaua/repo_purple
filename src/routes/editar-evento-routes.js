const express = require("express");
const router = express.Router();
const editarEventoController = require("../controllers/editar-evento-controller");

// Buscar todos os dados do evento
router.get("/buscar/:id", editarEventoController.buscarEvento);

// Atualizar dados do evento
router.put("/atualizar_evento/:id", editarEventoController.atualizarEvento);

// Atualizar gastos
router.put("/atualizar_gastos/:id", editarEventoController.atualizarGastos);

// Atualizar produtos
router.put("/atualizar_produtos/:id", editarEventoController.atualizarProdutos);

// Atualizar ingressos
router.put("/atualizar_ingressos/:id", editarEventoController.atualizarIngressos);

module.exports = router;