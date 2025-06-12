var database = require("../database/config")

// cadastrar um evento novo no banco
function cadastrarEvento(nome, data, local, capacidade, meta_receita, meta_lucro, organizador_id, imagem) {
    console.log("cadastrarEvento no model - dados recebidos:", nome, data, local, capacidade, meta_receita, meta_lucro, organizador_id, imagem)

    var instrucaoSql = "INSERT INTO eventos (nome, data, local, capacidade, meta_receita, meta_lucro, organizador_id, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    return database.executar(instrucaoSql, [nome, data, local, capacidade, meta_receita, meta_lucro, organizador_id, imagem])
}

// buscar eventos de um organizador
function buscarEventos(organizador_id) {
    var instrucaoSql = `
        SELECT id, nome, data, local, meta_receita, meta_lucro, organizador_id, imagem
        FROM eventos
        WHERE organizador_id = ?
    `
    return database.executar(instrucaoSql, [organizador_id])
}

module.exports = {
    cadastrarEvento,
    buscarEventos
}