var produtoModel = require("../models/produto-model");

function cadastrar_produtos(req, res) {
    const { produtos, quantidade, total, evento_id } = req.body;

    if (!Array.isArray(produtos) || produtos.length === 0) {
        return res.status(400).send("Nenhum produto enviado!");
    }
    if (!evento_id) {
        return res.status(400).send("Evento não informado!");
    }

    produtoModel.cadastrarVariosProdutos(produtos, quantidade, total, evento_id)
        .then(resultado => {
            res.json({
                message: "Produtos cadastrados com sucesso!",
                resultado
            });
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json("Erro ao cadastrar os produtos!");
        });
}

// Buscar produtos por evento
function buscar_produtos(req, res) {
    const evento_id = req.params.evento_id;

    if (!evento_id) {
        return res.status(400).send("ID do evento não informado!");
    }

    produtoModel.buscarProdutosPorEvento(evento_id)
        .then(resultado => {
            res.json(resultado);
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json("Erro ao buscar produtos!");
        });
}

module.exports = {
    cadastrar_produtos,
    buscar_produtos
};