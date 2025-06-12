var database = require("../database/config");

function cadastrarVariosProdutos(produtos, quantidade, total, evento_id) {
    if (!Array.isArray(produtos) || produtos.length === 0) {
        return Promise.reject("Nenhum produto para inserir.");
    }

    const valores = produtos.map(p => {
        const nomeEscapado = p.nome.replace(/'/g, "''");
        return `(${evento_id}, '${nomeEscapado}', ${p.valor}, ${p.vendido || 0}, ${p.meta || 0}, ${quantidade}, ${total})`;
    }).join(", ");

    const instrucao = `
        INSERT INTO produtos (evento_id, nome, valor, vendido, meta, quantidade, total)
        VALUES ${valores};
    `;
    
    console.log("SQL Query:", instrucao);
    return database.executar(instrucao);
}

function buscarProdutosPorEvento(evento_id) {
    const instrucao = `
        SELECT nome, valor, vendido, meta, quantidade, total
        FROM produtos
        WHERE evento_id = ${evento_id}
    `;
    return database.executar(instrucao);
}

module.exports = {
    cadastrarVariosProdutos,
    buscarProdutosPorEvento
};