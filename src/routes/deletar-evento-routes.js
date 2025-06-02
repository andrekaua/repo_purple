const express = require("express");
const router = express.Router();
const deletarEventoController = require("../controllers/deletar-evento-controller");

// DELETE /evento/deletar_evento/:id?organizador_id=123
router.delete("/deletar_evento/:id", deletarEventoController.deletarEvento);

module.exports = router;
