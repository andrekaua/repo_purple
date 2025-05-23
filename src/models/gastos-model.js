var database = require("../database/config");

function cadastrarVariosGastos(gastos, qntdd_gastos, total_gastos, evento_id) {
    if (!Array.isArray(gastos) || gastos.length === 0) {
        return Promise.reject("Nenhum gasto para inserir.");
    }

    // Monta os valores para o INSERT
    const valores = gastos.map(g => 
        `(${evento_id}, '${g.nome}', ${g.valor}, ${qntdd_gastos}, ${total_gastos})`
    ).join(", ");

    const instrucao = `
        INSERT INTO gastos (evento_id, nome, valor, quantidade, total)
        VALUES ${valores};
    `;
    return database.executar(instrucao);
}

module.exports = {
    cadastrarVariosGastos
};