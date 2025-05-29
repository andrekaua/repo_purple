var ingressoModel = require("../models/ingresso-model");

function cadastrar_ingressos(req, res) {
    const { ingressos, quantidade, total, evento_id } = req.body;

    if (!Array.isArray(ingressos) || ingressos.length === 0) {
        return res.status(400).send("Nenhum ingresso enviado!");
    }
    if (!evento_id) {
        return res.status(400).send("Evento não informado!");
    }

    ingressoModel.cadastrarVariosIngressos(ingressos, quantidade, total, evento_id)
        .then(resultado => {
            res.json({
                message: "Ingressos cadastrados com sucesso!",
                resultado
            });
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json("Erro ao cadastrar os ingressos!");
        });
}

// Buscar ingressos por evento
function buscar_ingressos(req, res) {
    const evento_id = req.params.evento_id;

    if (!evento_id) {
        return res.status(400).send("ID do evento não informado!");
    }

    ingressoModel.buscarIngressosPorEvento(evento_id)
        .then(resultado => {
            res.json(resultado);
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json("Erro ao buscar ingressos!");
        });
}

module.exports = {
    cadastrar_ingressos,
    buscar_ingressos
};