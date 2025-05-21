var database = require("../database/config")

function cadastrarEvento(nome, data, local, meta_receita, meta_lucro, organizador_id) {
    console.log("ACESSEI O EVENTOS MODEL \n\n function cadastrarEvento(): ", nome, data, local, meta_receita, meta_lucro, organizador_id);

    var instrucaoSql = "INSERT INTO eventos (nome, data, local, meta_receita, meta_lucro, organizador_id) VALUES (?, ?, ?, ?, ?, ?)";
    console.log("teste");
    return database.executar(instrucaoSql, [nome, data, local, meta_receita, meta_lucro, organizador_id]);
    
}

module.exports = {
    cadastrarEvento
};