let listaIngressos = [];

// Função para adicionar ingressos à lista
function adicionar_ingresso() {
    // Obter os valores dos campos
    let tipo = document.getElementById("tipo_ingresso").value;
    let preco = parseFloat(document.getElementById("preco").value);
    let quantidade = parseInt(document.getElementById("quantidade").value);
    let vendido = parseInt(document.getElementById("vendido").value);
    let meta_venda = parseInt(document.getElementById("meta_venda").value);

    // Validar os dados
    if (
        tipo.trim() === "" ||
        isNaN(preco) || preco <= 0 ||
        isNaN(quantidade) || quantidade < 0 ||
        isNaN(vendido) || vendido < 0 ||
        isNaN(meta_venda) || meta_venda < 0
    ) {
        alert("Por favor, preencha todos os campos corretamente!");
        return;
    }

    // Criar um objeto para o ingresso
    let ingresso = {
        tipo,
        preco,
        quantidade,
        vendido,
        meta_venda
    };

    // Adicionar o ingresso ao array
    listaIngressos.push(ingresso);

    // Atualizar a tabela (se houver)
    atualizarTabelaIngressos();

    // Limpar os campos após adicionar
    document.getElementById("tipo_ingresso").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("vendido").value = "";
    document.getElementById("meta_venda").value = "";
}

// Função para atualizar a tabela de ingressos
function atualizarTabelaIngressos() {
    let tabela = document.getElementById("tabela_ingressos");
    if (!tabela) return; // Se não existir tabela, não faz nada

    // Limpar a tabela (exceto o cabeçalho)
    while (tabela.rows.length > 1) {
        tabela.deleteRow(1);
    }

    // Adicionar cada ingresso à tabela
    for (let i = 0; i < listaIngressos.length; i++) {
        let ingresso = listaIngressos[i];

        let novaLinha = tabela.insertRow();

        let celTipo = novaLinha.insertCell(0);
        let celPreco = novaLinha.insertCell(1);
        let celQuantidade = novaLinha.insertCell(2);
        let celVendido = novaLinha.insertCell(3);
        let celMeta = novaLinha.insertCell(4);
        let celAcoes = novaLinha.insertCell(5);

        celTipo.textContent = ingresso.tipo;
        celPreco.textContent = ingresso.preco.toFixed(2);
        celQuantidade.textContent = ingresso.quantidade;
        celVendido.textContent = ingresso.vendido;
        celMeta.textContent = ingresso.meta_venda;

        celAcoes.innerHTML = `
            <button onclick="editarIngresso(${i})">Editar</button>
            <button onclick="excluirIngresso(${i})">Excluir</button>
        `;
    }
}

// Função para editar um ingresso
function editarIngresso(indice) {
    let ingresso = listaIngressos[indice];

    document.getElementById("tipo_ingresso").value = ingresso.tipo;
    document.getElementById("preco").value = ingresso.preco;
    document.getElementById("quantidade").value = ingresso.quantidade;
    document.getElementById("vendido").value = ingresso.vendido;
    document.getElementById("meta_venda").value = ingresso.meta_venda;

    listaIngressos.splice(indice, 1);
    atualizarTabelaIngressos();
}

// Função para excluir um ingresso
function excluirIngresso(indice) {
    if (confirm("Tem certeza que deseja excluir este ingresso?")) {
        listaIngressos.splice(indice, 1);
        atualizarTabelaIngressos();
    }
}

// Função para cadastrar todos os ingressos no servidor
function cadastrar_ingressos() {
    if (listaIngressos.length === 0) {
        alert("Adicione pelo menos um ingresso antes de avançar!");
        return false;
    }

    // Obter o ID do evento do input ou do localStorage
    const evento_id = document.getElementById("evento_id").value || sessionStorage.getItem("evento_id");
    
    if (!evento_id) {
        alert("É necessário ter um evento cadastrado primeiro!");
        return false;
    }

    let dados = {
        evento_id: evento_id,
        ingressos: listaIngressos
    };

    // Enviar dados para o servidor via fetch API
    fetch("/entrada-dados/cadastrarIngressos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
    .then(resposta => {
        if (resposta.ok) {
            return resposta.json();
        } else {
            throw new Error("Erro ao cadastrar ingressos!");
        }
    })
    .then(resposta => {
        console.log("Resposta do servidor:", resposta);
        alert("Ingressos cadastrados com sucesso!");
        
        // Limpar a lista após cadastro bem-sucedido
        listaIngressos = [];
        atualizarTabelaIngressos();
        
        // Redirecionar ou continuar para a próxima etapa
        // window.location.href = "proxima-pagina.html";
    })
    .catch(erro => {
        console.error("Erro:", erro);
        alert("Erro ao cadastrar ingressos. Por favor, tente novamente.");
    });

    return true;
}
