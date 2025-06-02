const database = require("../database/config");

// Buscar todos os dados do evento (evento, gastos, produtos, ingressos)
async function buscarEventoCompleto(evento_id) {
    const eventoRows = await database.executar(
        `SELECT id, nome, imagem, data, local, capacidade, meta_lucro FROM eventos WHERE id = ?`, [evento_id]
    );
    if (!eventoRows.length) return null;

    const gastos = await database.executar(
        `SELECT id, nome, valor, quantidade, total FROM gastos WHERE evento_id = ?`, [evento_id]
    );
    const produtos = await database.executar(
        `SELECT id, nome, valor, vendido, meta, quantidade, total FROM produtos WHERE evento_id = ?`, [evento_id]
    );
    const ingressos = await database.executar(
        `SELECT id, tipo, preco, quantidade_disponivel, vendido, meta, quantidade, total FROM ingressos WHERE evento_id = ?`, [evento_id]
    );

    const evento = eventoRows[0];
    return {
        id: evento.id,
        nome: evento.nome,
        imagem: evento.imagem,
        data: evento.data,
        local: evento.local,
        capacidade: evento.capacidade, // agora busca do banco
        lucro_desejado: evento.meta_lucro,
        gastos,
        produtos,
        ingressos
    };
}

// Atualizar dados básicos do evento
function atualizarEvento(evento_id, nome, data, local, capacidade, meta_lucro, imagem) {
    return database.executar(
        `UPDATE eventos SET nome=?, data=?, local=?, capacidade=?, meta_lucro=?, imagem=? WHERE id=?`,
        [nome, data, local, capacidade, meta_lucro, imagem, evento_id]
    );
}

// Atualizar gastos (deletar e inserir novamente)
async function atualizarGastos(evento_id, gastos) {
    await database.executar(`DELETE FROM gastos WHERE evento_id = ?`, [evento_id]);
    if (!gastos.length) return;
    const values = gastos.map(g => [evento_id, g.nome, g.valor, g.quantidade || 1, g.total || g.valor]);
    await database.executar(
        `INSERT INTO gastos (evento_id, nome, valor, quantidade, total) VALUES ?`,
        [values]
    );
}

// Atualizar produtos (deletar e inserir novamente)
async function atualizarProdutos(evento_id, produtos) {
    await database.executar(`DELETE FROM produtos WHERE evento_id = ?`, [evento_id]);
    if (!produtos.length) return;
    const values = produtos.map(p => [
        evento_id, p.nome, p.valor, p.vendido || 0, p.meta || 0, p.quantidade || 1, p.total || p.valor
    ]);
    await database.executar(
        `INSERT INTO produtos (evento_id, nome, valor, vendido, meta, quantidade, total) VALUES ?`,
        [values]
    );
}

// Atualizar ingressos (deletar e inserir novamente)
async function atualizarIngressos(evento_id, ingressos) {
    await database.executar(`DELETE FROM ingressos WHERE evento_id = ?`, [evento_id]);
    if (!ingressos.length) return;
    const values = ingressos.map(i => [
        evento_id, i.tipo, i.preco, i.quantidade_disponivel, i.vendido || 0, i.meta || 0, i.quantidade || 1, i.total || i.preco
    ]);
    await database.executar(
        `INSERT INTO ingressos (evento_id, tipo, preco, quantidade_disponivel, vendido, meta, quantidade, total) VALUES ?`,
        [values]
    );
}

module.exports = {
    buscarEventoCompleto,
    atualizarEvento,
    atualizarGastos,
    atualizarProdutos,
    atualizarIngressos
};