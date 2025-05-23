var database = require("../database/config");

function cadastrarVariosProdutos(produtos, quantidade, total, evento_id) {
    if (!Array.isArray(produtos) || produtos.length === 0) {
        return Promise.reject("Nenhum produto para inserir.");
    }

    const valores = produtos.map(p => 
        `(${evento_id}, '${p.nome}', ${p.preco}, ${p.vendido}, ${p.meta}, ${quantidade}, ${total})`
    ).join(", ");

    const instrucao = `
        INSERT INTO produtos_adicionais (evento_id, nome, preco_unitario, vendido, meta, quantidade, total)
        VALUES ${valores};
    `;
    return database.executar(instrucao);
}

module.exports = {
    cadastrarVariosProdutos
};