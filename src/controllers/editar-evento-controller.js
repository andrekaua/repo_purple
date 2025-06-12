const editarEventoModel = require("../models/editar-evento-model");

// Buscar todos os dados do evento
exports.buscarEvento = async (req, res) => {
    const id = req.params.id;
    try {
        console.log('Buscando evento com ID:', id);
        
        const evento = await editarEventoModel.buscarEventoCompleto(id);
        if (!evento) {
            console.log('Evento não encontrado');
            return res.status(404).json({ erro: "Evento não encontrado" });
        }
        
        console.log('Evento encontrado:', evento);
        res.json([evento]);
    } catch (err) {
        console.error('Erro ao buscar evento:', err);
        res.status(500).json({ erro: "Erro ao buscar evento", detalhes: err.message });
    }
};

// Atualizar dados do evento
exports.atualizarEvento = async (req, res) => {
    const id = req.params.id;
    const { nome, data, local, capacidade, lucro } = req.body;
    
    try {
        console.log('Atualizando evento:', { id, nome, data, local, capacidade, lucro });
        
        await editarEventoModel.atualizarEvento(id, nome, data, local, capacidade, lucro);
        res.json({ mensagem: "Evento atualizado com sucesso!" });
    } catch (err) {
        console.error('Erro ao atualizar evento:', err);
        res.status(500).json({ erro: "Erro ao atualizar evento", detalhes: err.message });
    }
};

// Atualizar gastos
exports.atualizarGastos = async (req, res) => {
    const id = req.params.id;
    const { gastos } = req.body;
    
    try {
        console.log('Atualizando gastos:', { id, gastos });
        
        await editarEventoModel.atualizarGastos(id, gastos || []);
        res.json({ mensagem: "Gastos atualizados com sucesso!" });
    } catch (err) {
        console.error('Erro ao atualizar gastos:', err);
        res.status(500).json({ erro: "Erro ao atualizar gastos", detalhes: err.message });
    }
};

// Atualizar produtos
exports.atualizarProdutos = async (req, res) => {
    const id = req.params.id;
    const { produtos } = req.body;
    
    try {
        console.log('Atualizando produtos:', { id, produtos });
        
        await editarEventoModel.atualizarProdutos(id, produtos || []);
        res.json({ mensagem: "Produtos atualizados com sucesso!" });
    } catch (err) {
        console.error('Erro ao atualizar produtos:', err);
        res.status(500).json({ erro: "Erro ao atualizar produtos", detalhes: err.message });
    }
};

// Atualizar ingressos
exports.atualizarIngressos = async (req, res) => {
    const id = req.params.id;
    const { ingressos } = req.body;
    
    try {
        console.log('Atualizando ingressos:', { id, ingressos });
        
        await editarEventoModel.atualizarIngressos(id, ingressos || []);
        res.json({ mensagem: "Ingressos atualizados com sucesso!" });
    } catch (err) {
        console.error('Erro ao atualizar ingressos:', err);
        res.status(500).json({ erro: "Erro ao atualizar ingressos", detalhes: err.message });
    }
};