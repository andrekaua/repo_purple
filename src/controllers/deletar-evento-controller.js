const deletarEventoModel = require("../models/deletar-evento-model");

async function deletarEvento(req, res) {
    const evento_id = req.params.id;
    // O organizador_id deve ser validado (por segurança, pode vir do session/cookie, mas aqui vamos pegar do localStorage via frontend)
    const organizador_id = req.query.organizador_id;
    if (!evento_id || !organizador_id) {
        return res.status(400).json({ error: "ID do evento e do organizador são obrigatórios." });
    }
    try {
        const resultado = await deletarEventoModel.deletarEvento(evento_id, organizador_id);
        if (resultado.affectedRows === 0) {
            return res.status(403).json({ error: "Evento não encontrado ou você não tem permissão para deletar." });
        }
        res.status(200).json({ message: "Evento deletado com sucesso!" });
    } catch (error) {
        console.error("Erro ao deletar evento:", error);
        res.status(500).json({ error: "Erro ao deletar evento.", details: error.message });
    }
}

module.exports = {
    deletarEvento
};
