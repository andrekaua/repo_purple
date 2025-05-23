var entradaDadosModel = require("../models/gastos-model");

function cadastrar_gastos(req, res) {
    const { gastos, qntdd_gastos, total_gastos, evento_id } = req.body;

    if (!Array.isArray(gastos) || gastos.length === 0) {
        return res.status(400).send("Nenhum gasto enviado!");
    }
    if (!evento_id) {
        return res.status(400).send("Evento não informado!");
    }

    entradaDadosModel.cadastrarVariosGastos(gastos, qntdd_gastos, total_gastos, evento_id)
        .then(resultado => {
            res.json({
                message: "Gastos cadastrados com sucesso!",
                resultado
            });
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json("Erro ao cadastrar os gastos!");
        });
}

module.exports = {
    cadastrar_gastos
};