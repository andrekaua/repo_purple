var database = require("../database/config");

function cadastrarVariosIngressos(ingressos, quantidade, total, evento_id) {
    if (!Array.isArray(ingressos) || ingressos.length === 0) {
        return Promise.reject("Nenhum ingresso para inserir.");
    }
    
    const valores = ingressos.map(ing => {
        const tipoEscapado = ing.tipo.replace(/'/g, "''");
        return `(${evento_id}, '${tipoEscapado}', ${ing.preco}, ${ing.quantidade_disponivel}, ${ing.vendido || 0}, ${ing.meta || 0}, ${quantidade}, ${total})`;
    }).join(", ");

    const instrucao = `
        INSERT INTO ingressos (evento_id, tipo, preco, quantidade_disponivel, vendido, meta, quantidade, total)
        VALUES ${valores};
    `;
    
    console.log("SQL Query:", instrucao);
    return database.executar(instrucao);
}

function buscarIngressosPorEvento(evento_id) {
    const instrucao = `
        SELECT tipo, preco, quantidade_disponivel, vendido, meta, quantidade, total
        FROM ingressos
        WHERE evento_id = ${evento_id}
    `;
    return database.executar(instrucao);
}

module.exports = {
    cadastrarVariosIngressos,
    buscarIngressosPorEvento
};