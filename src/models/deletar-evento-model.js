const database = require("../database/config");

async function deletarEvento(evento_id, organizador_id) {
    // Deleta todos os dados relacionados ao evento (gastos, produtos, ingressos)
    await database.executar("DELETE FROM gastos WHERE evento_id = ?", [evento_id]);
    await database.executar("DELETE FROM produtos WHERE evento_id = ?", [evento_id]);
    await database.executar("DELETE FROM ingressos WHERE evento_id = ?", [evento_id]);
    //  deleta o evento se for do organizador correto
    const resultado = await database.executar("DELETE FROM eventos WHERE id = ? AND organizador_id = ?", [evento_id, organizador_id]);
    return resultado;
}

module.exports = {
    deletarEvento
};
