const express = require("express");
const router = express.Router();
const deletarEventoController = require("../controllers/deletar-evento-controller");

router.delete("/deletar_evento/:id", deletarEventoController.deletarEvento);

module.exports = router;
