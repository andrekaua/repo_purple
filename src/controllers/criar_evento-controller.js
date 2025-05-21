var entradaDadosModel = require("../models/criar_evento_model");

function cadastrarEvento(req, res) {
    var organizador_id = req.body.organizador_id;
    var nome = req.body.nome;
    var data = req.body.data;
    var local = req.body.local;
    var meta_receita = req.body.meta_receita;
    var meta_lucro = req.body.meta_lucro;

    if (nome == undefined) {
        res.status(400).send("O nome do evento está undefined!");
    } else if (data == undefined) {
        res.status(400).send("A data do evento está undefined!");
    } else if (organizador_id == undefined) {
        res.status(400).send("O ID do organizador está undefined!");
    } else {
        local = local || "";
        meta_receita = meta_receita || 0;
        meta_lucro = meta_lucro || 0;

        entradaDadosModel.cadastrarEvento(nome, data, local, meta_receita, meta_lucro, organizador_id)
            .then(function (resultado) {
                const evento_id = resultado.insertId; // <-- CORRIGIDO
                res.json({
                    message: "Evento cadastrado com sucesso!",
                    evento_id: evento_id
                });
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao cadastrar o evento! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    cadastrarEvento
};