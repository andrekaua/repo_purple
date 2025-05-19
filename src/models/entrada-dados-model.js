var database = require("../database/config")

function cadastrarGastos(evento_id, categoria, valor, descricao) {
    console.log("ACESSEI O GASTOS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrarGastos(): ", evento_id, categoria, valor, descricao);
    
    var instrucaoSql = `
        INSERT INTO gastos (evento_id, categoria, valor, descricao) VALUES (${evento_id}, '${categoria}', ${valor}, '${descricao}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarIngressos(evento_id, tipo, preco, quantidade_total, quantidade_vendida) {
    console.log("ACESSEI O INGRESSOS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrarIngressos(): ", evento_id, tipo, preco, quantidade_total, quantidade_vendida);
    
    var instrucaoSql = `
        INSERT INTO ingressos (evento_id, tipo, preco, quantidade_total, quantidade_vendida) VALUES (${evento_id}, '${tipo}', ${preco}, ${quantidade_total}, ${quantidade_vendida});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarProdutos(evento_id, nome, preco_unitario, quantidade_vendida) {
    console.log("ACESSEI O PRODUTOS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrarProdutos(): ", evento_id, nome, preco_unitario, quantidade_vendida);
    
    var instrucaoSql = `
        INSERT INTO produtos_adicionais (evento_id, nome, preco_unitario, quantidade_vendida) VALUES (${evento_id}, '${nome}', ${preco_unitario}, ${quantidade_vendida});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarEvento(organizador_id, nome, data, local, meta_receita, meta_lucro) {
    console.log("ACESSEI O EVENTOS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrarEvento(): ", organizador_id, nome, data, local, meta_receita, meta_lucro);
    
    var instrucaoSql = `
        INSERT INTO eventos (organizador_id, nome, data, local, meta_receita, meta_lucro) VALUES (${organizador_id}, '${nome}', '${data}', '${local}', ${meta_receita}, ${meta_lucro});
        SELECT LAST_INSERT_ID() as id;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarGastos,
    cadastrarIngressos,
    cadastrarProdutos,
    cadastrarEvento
};