var database = require("../database/config")

function cadastrarEvento(nome, data, local, meta_receita, meta_lucro, organizador_id, imagem) {
    console.log("ACESSEI O EVENTOS MODEL \n\n function cadastrarEvento(): ", nome, data, local, meta_receita, meta_lucro, organizador_id, imagem);

    var instrucaoSql = "INSERT INTO eventos (nome, data, local, meta_receita, meta_lucro, organizador_id, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)";
    return database.executar(instrucaoSql, [nome, data, local, meta_receita, meta_lucro, organizador_id, imagem]);
}

module.exports = {
    cadastrarEvento
};