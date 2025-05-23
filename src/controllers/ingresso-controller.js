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

module.exports = {
    cadastrar_ingressos
};