function criar_evento() {
    console.log("Iniciando criação de evento...");
    const nome = document.getElementById("nome").value.trim();
    const data = document.getElementById("data").value;
    const capacidade = document.getElementById("capacidade").value;
    const lucro = document.getElementById("lucro").value;
    const local = document.getElementById("local").value.trim();
    const inputImagem = document.getElementById('imagem');

    const dadosUsuarios = sessionStorage.getItem("dados_usuarios");
    if (!dadosUsuarios) {
        alert("Erro: Dados do usuário não encontrados. Faça login novamente.");
        return false;
    }
    let organizador_id;
    try {
        const parsedDados = JSON.parse(dadosUsuarios);
        if (Array.isArray(parsedDados) && parsedDados.length > 0) {
            organizador_id = parsedDados[0].id;
        } else if (parsedDados.id) {
            organizador_id = parsedDados.id;
        } else {
            throw new Error("ID do organizador não encontrado");
        }
    } catch (error) {
        console.error("Erro ao parsear dados do usuário:", error);
        alert("Erro: Dados do usuário inválidos. Faça login novamente.");
        return false;
    }
    console.log("ID do organizador:", organizador_id);

    if (!nome) {
        alert("Por favor, preencha o nome do evento!");
        document.getElementById("nome").focus();
        return false;
    }
    if (!data) {
        alert("Por favor, selecione a data do evento!");
        document.getElementById("data").focus();
        return false;
    }
    if (!capacidade || capacidade <= 0) {
        alert("Por favor, informe uma capacidade válida!");
        document.getElementById("capacidade").focus();
        return false;
    }
    if (!lucro || lucro <= 0) {
        alert("Por favor, informe um valor de lucro válido!");
        document.getElementById("lucro").focus();
        return false;
    }

    function enviarEvento(imagemUrl) {
        const capacidadeNum = parseFloat(capacidade);
        const lucroNum = parseFloat(lucro);
        const meta_receita = capacidadeNum * lucroNum;
        const dados = {
            organizador_id: organizador_id,
            imagem: imagemUrl || null,
            nome: nome,
            data: data,
            local: local || "",
            capacidade: capacidadeNum,
            meta_receita: meta_receita,
            meta_lucro: lucroNum
        };
        console.log("Dados do evento a serem enviados:", dados);
        const botaoSubmit = document.querySelector('button[type="submit"]') || document.querySelector('input[type="submit"]');
        if (botaoSubmit) {
            botaoSubmit.disabled = true;
            botaoSubmit.textContent = "Criando evento...";
        }
        fetch("/evento/criar_evento", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        })
        .then(resposta => {
            console.log("Status da resposta:", resposta.status);
            if (!resposta.ok) {
                return resposta.text().then(text => {
                    throw new Error(`Erro ${resposta.status}: ${text}`);
                });
            }
            return resposta.json();
        })
        .then(resposta => {
            console.log("Resposta do servidor:", resposta);
            if (resposta.evento_id) {
                sessionStorage.setItem("evento_id", resposta.evento_id);
                alert("Evento cadastrado com sucesso!");
                window.location.href = "gastos-do-evento.html";
            } else {
                throw new Error("ID do evento não retornado pelo servidor");
            }
        })
        .catch(erro => {
            console.error("Erro ao cadastrar evento:", erro);
            alert("Erro ao cadastrar evento: " + erro.message + "\nPor favor, tente novamente.");
        })
        .finally(() => {
            if (botaoSubmit) {
                botaoSubmit.disabled = false;
                botaoSubmit.textContent = "Criar Evento";
            }
        });
    }

    if (inputImagem && inputImagem.files && inputImagem.files[0]) {
        const formData = new FormData();
        formData.append('imagem', inputImagem.files[0]);
        fetch('/upload/imagem-evento', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            enviarEvento(data.imageUrl);
        })
        .catch(() => {
            alert('Erro ao fazer upload da imagem!');
        });
    } else {
        enviarEvento(null);
    }
    return false; 
}

function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
        return false;
    }
}

function previewImagem() {
    const imagemUrl = document.getElementById("imagem").value.trim();
    const previewContainer = document.getElementById("preview-imagem");
    
    if (previewContainer) {
        if (imagemUrl && isValidUrl(imagemUrl)) {
            previewContainer.innerHTML = `
                <img src="${imagemUrl}" 
                     alt="Preview da imagem" 
                     style="max-width: 200px; max-height: 150px; object-fit: cover; border-radius: 8px;"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <p style="display: none; color: red; font-size: 12px;">Erro ao carregar imagem</p>
            `;
        } else {
            previewContainer.innerHTML = "";
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const campoImagem = document.getElementById("imagem");
    if (campoImagem) {
        campoImagem.addEventListener('input', previewImagem);
        campoImagem.addEventListener('blur', previewImagem);
    }
    
    const campoCapacidade = document.getElementById("capacidade");
    const campoLucro = document.getElementById("lucro");
    
    if (campoCapacidade) {
        campoCapacidade.addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
        });
    }
    
    if (campoLucro) {
        campoLucro.addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
        });
    }
    
    const campoData = document.getElementById("data");
    if (campoData) {
        const hoje = new Date().toISOString().split('T')[0];
        campoData.min = hoje;
    }
});