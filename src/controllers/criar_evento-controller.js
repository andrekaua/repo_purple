var entradaDadosModel = require("../models/criar_evento_model");

function cadastrarEvento(req, res) {
    var organizador_id = req.body.organizador_id;
    var nome = req.body.nome;
    var data = req.body.data;
    var local = req.body.local;
    var capacidade = req.body.capacidade; // NOVO
    var meta_receita = req.body.meta_receita;
    var meta_lucro = req.body.meta_lucro;
    var imagem = req.body.imagem;

    console.log("Dados recebidos no controller:", {
        organizador_id,
        nome,
        data,
        local,
        capacidade, // NOVO
        meta_receita,
        meta_lucro,
        imagem
    });

    // Validações obrigatórias
    if (!nome || nome.trim() === "") {
        return res.status(400).json({
            error: "O nome do evento é obrigatório!"
        });
    }
    
    if (!data) {
        return res.status(400).json({
            error: "A data do evento é obrigatória!"
        });
    }
    
    if (!organizador_id) {
        return res.status(400).json({
            error: "O ID do organizador é obrigatório!"
        });
    }

    // Validar se a data não é no passado
    const dataEvento = new Date(data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas a data
    
    if (dataEvento < hoje) {
        return res.status(400).json({
            error: "A data do evento não pode ser no passado!"
        });
    }

    // Valores padrão para campos opcionais
    local = local && local.trim() !== "" ? local.trim() : "";
    meta_receita = meta_receita ? parseFloat(meta_receita) : 0;
    meta_lucro = meta_lucro ? parseFloat(meta_lucro) : 0;
    imagem = imagem && imagem.trim() !== "" ? imagem.trim() : null;

    // Validar valores numéricos
    if (isNaN(meta_receita) || meta_receita < 0) {
        return res.status(400).json({
            error: "Meta de receita deve ser um valor válido!"
        });
    }
    
    if (isNaN(meta_lucro) || meta_lucro < 0) {
        return res.status(400).json({
            error: "Meta de lucro deve ser um valor válido!"
        });
    }
    
    if (isNaN(capacidade) || capacidade <= 0) {
        return res.status(400).json({
            error: "Capacidade deve ser um valor válido!"
        });
    }

    console.log("Dados validados, chamando model...");

    entradaDadosModel.cadastrarEvento(
        nome.trim(),
        data,
        local,
        capacidade, // NOVO
        meta_receita,
        meta_lucro,
        organizador_id,
        imagem
    )
    .then(function (resultado) {
        console.log("Resultado do cadastro:", resultado);
        
        if (resultado && resultado.insertId) {
            const evento_id = resultado.insertId;
            res.status(201).json({
                message: "Evento cadastrado com sucesso!",
                evento_id: evento_id,
                dados: {
                    id: evento_id,
                    nome: nome.trim(),
                    data: data,
                    local: local,
                    meta_receita: meta_receita,
                    meta_lucro: meta_lucro,
                    organizador_id: organizador_id,
                    imagem: imagem
                }
            });
        } else {
            throw new Error("Erro ao obter ID do evento criado");
        }
    })
    .catch(function (erro) {
        console.error("Erro ao cadastrar evento:", erro);
        
        // Verificar se é erro de SQL específico
        if (erro.code === 'ER_DUP_ENTRY') {
            res.status(409).json({
                error: "Já existe um evento com essas informações!"
            });
        } else if (erro.code === 'ER_NO_REFERENCED_ROW_2') {
            res.status(400).json({
                error: "Organizador não encontrado!"
            });
        } else {
            res.status(500).json({
                error: "Erro interno do servidor ao cadastrar evento",
                details: erro.sqlMessage || erro.message
            });
        }
    });
}

function buscar_eventos(req, res) {
    console.log("Buscando eventos...");
    const organizador_id = req.query.organizador_id;
    if (!organizador_id) {
        return res.status(400).json({ error: "organizador_id é obrigatório" });
    }
    entradaDadosModel.buscarEventos(organizador_id)
        .then(resultado => {
            console.log("Eventos encontrados:", resultado.length);
            // Formatar dados para garantir consistência
            const eventosFormatados = resultado.map(evento => ({
                id: evento.id,
                nome: evento.nome || '',
                data: evento.data || null,
                local: evento.local || '',
                meta_receita: parseFloat(evento.meta_receita) || 0,
                meta_lucro: parseFloat(evento.meta_lucro) || 0,
                organizador_id: evento.organizador_id,
                imagem: evento.imagem || null
            }));
            res.status(200).json(eventosFormatados);
        })
        .catch(erro => {
            console.error("Erro ao buscar eventos:", erro);
            res.status(500).json({
                error: "Erro ao buscar eventos!",
                details: erro.sqlMessage || erro.message
            });
        });
}

module.exports = {
    cadastrarEvento,
    buscar_eventos
};