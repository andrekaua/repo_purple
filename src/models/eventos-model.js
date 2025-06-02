var database = require("../database/config");

function buscarEventos() {
    var instrucaoSql = `
        SELECT id, nome, data, local, meta_receita, meta_lucro, organizador_id, imagem
        FROM eventos
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarEventos
};