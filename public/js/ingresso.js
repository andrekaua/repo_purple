// Array para armazenar todos os ingressos
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

// Função para atualizar a tabela de ingressos (adicione uma tabela no HTML se quiser visualizar)
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

// Função para cadastrar todos os ingressos
function cadastrar_ingressos() {
    if (listaIngressos.length === 0) {
        alert("Adicione pelo menos um ingresso antes de avançar!");
        return false;
    }

    let dados = {
        ingressos: listaIngressos
    };

    let dadosJSON = JSON.stringify(dados);

    // Aqui você enviaria os dados para o servidor
    console.log("Dados prontos para enviar:", dadosJSON);

    // Salvar temporariamente no localStorage
    localStorage.setItem("dadosIngressos", dadosJSON);

    alert("Ingressos cadastrados com sucesso!");
    return true;
}

// Inicializar a lista quando a página carregar
window.onload = function() {
    let dadosSalvos = localStorage.getItem("dadosIngressos");
    if (dadosSalvos) {
        let dados = JSON.parse(dadosSalvos);
        listaIngressos = dados.ingressos || [];
        atualizarTabelaIngressos();
    }
};