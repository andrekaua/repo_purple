var entradaDadosModel = require("../models/criar_evento_model");

function buscar_eventos(req, res) {
    entradaDadosModel.buscarEventos()
        .then(resultado => {
            res.json(resultado);
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json("Erro ao buscar eventos!");
        });
}

module.exports = {
    buscar_eventos
};