var entradaDadosModel = require("../models/entrada-dados-model");

function cadastrarGastos(req, res) {
    var evento_id = req.body.evento_id;
    var gastos = req.body.gastos;

    console.log("Dados recebidos no controller:", {
        evento_id: evento_id,
        gastos: gastos
    });

    if (evento_id == undefined) {
        res.status(400).send("O ID do evento está undefined!");
    } else if (gastos == undefined || !Array.isArray(gastos) || gastos.length === 0) {
        res.status(400).send("Gastos inválidos ou não fornecidos!");
    } else {
        const promises = [];
        
        for (let gasto of gastos) {
            promises.push(
                entradaDadosModel.cadastrarGastos(
                    evento_id,
                    gasto.nome,
                    gasto.valor,
                    gasto.descricao || '' 
                )
            );
        }
        
        Promise.all(promises)
            .then(function (resultados) {
                res.json({
                    message: "Gastos cadastrados com sucesso!",
                    resultados: resultados
                });
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao cadastrar os gastos! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function cadastrarIngressos(req, res) {
    var evento_id = req.body.evento_id;
    var ingressos = req.body.ingressos;

    if (evento_id == undefined) {
        res.status(400).send("O ID do evento está undefined!");
    } else if (ingressos == undefined || !Array.isArray(ingressos) || ingressos.length === 0) {
        res.status(400).send("Ingressos inválidos ou não fornecidos!");
    } else {
        const promises = [];
        
        for (let ingresso of ingressos) {
            promises.push(
                entradaDadosModel.cadastrarIngressos(
                    evento_id,
                    ingresso.tipo,
                    ingresso.preco,
                    ingresso.quantidade,
                    ingresso.vendido
                )
            );
        }
        
        Promise.all(promises)
            .then(function (resultados) {
                res.json({
                    message: "Ingressos cadastrados com sucesso!",
                    resultados: resultados
                });
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao cadastrar os ingressos! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function cadastrarProdutos(req, res) {
    var evento_id = req.body.evento_id;
    var produtos = req.body.produtos;

    if (evento_id == undefined) {
        res.status(400).send("O ID do evento está undefined!");
    } else if (produtos == undefined || !Array.isArray(produtos) || produtos.length === 0) {
        res.status(400).send("Produtos inválidos ou não fornecidos!");
    } else {
        const promises = [];
        
        for (let produto of produtos) {
            promises.push(
                entradaDadosModel.cadastrarProdutos(
                    evento_id,
                    produto.nome,
                    produto.preco_unitario,
                    produto.vendido
                )
            );
        }
        
        Promise.all(promises)
            .then(function (resultados) {
                res.json({
                    message: "Produtos cadastrados com sucesso!",
                    resultados: resultados
                });
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao cadastrar os produtos! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function cadastrarEvento(req, res) {
    var organizador_id = req.body.organizador_id;
    var nome = req.body.nome;
    var data = req.body.data;
    var local = req.body.local;
    var meta_receita = req.body.meta_receita;
    var meta_lucro = req.body.meta_lucro;

    if (organizador_id == undefined) {
        res.status(400).send("O ID do organizador está undefined!");
    } else if (nome == undefined) {
        res.status(400).send("O nome do evento está undefined!");
    } else if (data == undefined) {
        res.status(400).send("A data do evento está undefined!");
    } else {
        local = local || "";
        meta_receita = meta_receita || 0;
        meta_lucro = meta_lucro || 0;
        
        entradaDadosModel.cadastrarEvento(organizador_id, nome, data, local, meta_receita, meta_lucro)
            .then(function (resultado) {
                const evento_id = resultado[0].id;
                
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
    cadastrarGastos,
    cadastrarIngressos,
    cadastrarProdutos,
    cadastrarEvento
}