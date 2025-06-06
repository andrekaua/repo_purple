var express = require("express");
var router = express.Router();

var criar_evento = require("../controllers/criar_evento-controller");

router.post("/criar_evento", function (req, res) {
    criar_evento.cadastrarEvento(req, res);
});

router.get("/buscar_eventos", criar_evento.buscar_eventos);

module.exports = router;
