var database = require("../database/config");

function cadastrarVariosIngressos(ingressos, quantidade, total, evento_id) {
    if (!Array.isArray(ingressos) || ingressos.length === 0) {
        return Promise.reject("Nenhum ingresso para inserir.");
    }

    const valores = ingressos.map(i =>
        `(${evento_id}, '${i.tipo}', ${i.preco}, ${i.quantidade_disponivel ?? 0}, ${i.vendido ?? 0}, ${i.meta ?? 0}, ${quantidade ?? 0}, ${total ?? 0})`
    ).join(", ");

    const instrucao = `
        INSERT INTO ingressos (evento_id, tipo, preco, quantidade_disponivel, vendido, meta, quantidade, total)
        VALUES ${valores};
    `;
    return database.executar(instrucao);
}

module.exports = {
    cadastrarVariosIngressos
};