const database = require("../database/config")

// busca todos os dados do evento, tipo evento, gastos, produtos e ingressos
async function buscarEventoCompleto(evento_id) {
    // pega o evento pelo id
    const eventoRows = await database.executar(
        `SELECT id, nome, imagem, data, local, capacidade, meta_lucro FROM eventos WHERE id = ?`, [evento_id]
    )
    if (!eventoRows.length) return null

    // pega os gastos desse evento
    const gastos = await database.executar(
        `SELECT id, nome, valor, quantidade, total FROM gastos WHERE evento_id = ?`, [evento_id]
    )
    // pega os produtos desse evento
    const produtos = await database.executar(
        `SELECT id, nome, valor, vendido, meta, quantidade, total FROM produtos WHERE evento_id = ?`, [evento_id]
    )
    // pega os ingressos desse evento
    const ingressos = await database.executar(
        `SELECT id, tipo, preco, quantidade_disponivel, vendido, meta, quantidade, total FROM ingressos WHERE evento_id = ?`, [evento_id]
    )

    // vai retornar tudo junto retorna tudo junto
    const evento = eventoRows[0]
    return {
        id: evento.id,
        nome: evento.nome,
        imagem: evento.imagem,
        data: evento.data,
        local: evento.local,
        capacidade: evento.capacidade,
        lucro_desejado: evento.meta_lucro,
        gastos,
        produtos,
        ingressos
    }
}

// atualiza os dados básicos do evento
function atualizarEvento(evento_id, nome, data, local, capacidade, meta_lucro, imagem) {
    // faz o update no banco
    return database.executar(
        `UPDATE eventos SET nome=?, data=?, local=?, capacidade=?, meta_lucro=?, imagem=? WHERE id=?`,
        [nome, data, local, capacidade, meta_lucro, imagem, evento_id]
    )
}

// atualiza os gastos do evento (deleta tudo e insere de novo)
// O para que serve o .map (criar um novo array a partir de um array existente)
async function atualizarGastos(evento_id, gastos) {
    await database.executar(`DELETE FROM gastos WHERE evento_id = ?`, [evento_id])
    if (!gastos.length) return
    const values = gastos.map(g => [evento_id, g.nome, g.valor, g.quantidade || 1, g.total || g.valor])
    await database.executar(
        `INSERT INTO gastos (evento_id, nome, valor, quantidade, total) VALUES ?`,
        [values]
    )
    
}

// atualiza os produtos do evento (deleta tudo e insere de novo)
// O para que serve o .map (criar um novo array a partir de um array existente)
async function atualizarProdutos(evento_id, produtos) {
    await database.executar(`DELETE FROM produtos WHERE evento_id = ?`, [evento_id])
    if (!produtos.length) return
    const values = produtos.map(p => [
        evento_id, p.nome, p.valor, p.vendido || 0, p.meta || 0, p.quantidade || 1, p.total || p.valor
    ])
    await database.executar(
        `INSERT INTO produtos (evento_id, nome, valor, vendido, meta, quantidade, total) VALUES ?`,
        [values]
    )
}

// atualiza os ingressos do evento (deleta tudo e insere de novo)
async function atualizarIngressos(evento_id, ingressos) {
    await database.executar(`DELETE FROM ingressos WHERE evento_id = ?`, [evento_id])
    if (!ingressos.length) return
    const values = ingressos.map(i => [
        evento_id, i.tipo, i.preco, i.quantidade_disponivel, i.vendido || 0, i.meta || 0, i.quantidade || 1, i.total || i.preco
    ])
    await database.executar(
        `INSERT INTO ingressos (evento_id, tipo, preco, quantidade_disponivel, vendido, meta, quantidade, total) VALUES ?`,
        [values]
    )
}

module.exports = {
    buscarEventoCompleto,
    atualizarEvento,
    atualizarGastos,
    atualizarProdutos,
    atualizarIngressos
}