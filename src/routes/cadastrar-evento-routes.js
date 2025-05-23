var express = require("express");
var router = express.Router();

var criar_evento = require("../controllers/criar_evento-controller");

router.post("/criar_evento", function (req, res) {
    criar_evento.cadastrarEvento(req, res);
});

module.exports = router;
