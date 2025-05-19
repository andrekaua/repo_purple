// Array para armazenar todos os produtos
let listaProdutos = [];

// Função para adicionar produtos à lista
function adicionar_produto() {
    // Obter os valores dos campos
    let nome = document.getElementById("produto").value;
    let preco_unitario = parseFloat(document.getElementById("preco_unitario").value);
    let vendido = parseInt(document.getElementById("vendido").value);
    let meta_venda = parseInt(document.getElementById("meta_venda").value);

    // Validar os dados
    if (
        nome.trim() === "" ||
        isNaN(preco_unitario) || preco_unitario <= 0 ||
        isNaN(vendido) || vendido < 0 ||
        isNaN(meta_venda) || meta_venda < 0
    ) {
        alert("Por favor, preencha todos os campos corretamente!");
        return;
    }

    // Criar um objeto para o produto
    let produto = {
        nome,
        preco_unitario,
        vendido,
        meta_venda
    };

    // Adicionar o produto ao array
    listaProdutos.push(produto);

    // Atualizar a tabela (se houver)
    atualizarTabelaProdutos();

    // Limpar os campos após adicionar
    document.getElementById("produto").value = "";
    document.getElementById("preco_unitario").value = "";
    document.getElementById("vendido").value = "";
    document.getElementById("meta_venda").value = "";
}

// Função para atualizar a tabela de produtos (adicione uma tabela no HTML se quiser visualizar)
function atualizarTabelaProdutos() {
    let tabela = document.getElementById("tabela_produtos");
    if (!tabela) return; // Se não existir tabela, não faz nada

    // Limpar a tabela (exceto o cabeçalho)
    while (tabela.rows.length > 1) {
        tabela.deleteRow(1);
    }

    // Adicionar cada produto à tabela
    for (let i = 0; i < listaProdutos.length; i++) {
        let produto = listaProdutos[i];

        let novaLinha = tabela.insertRow();

        let celNome = novaLinha.insertCell(0);
        let celPreco = novaLinha.insertCell(1);
        let celVendido = novaLinha.insertCell(2);
        let celMeta = novaLinha.insertCell(3);
        let celAcoes = novaLinha.insertCell(4);

        celNome.textContent = produto.nome;
        celPreco.textContent = produto.preco_unitario.toFixed(2);
        celVendido.textContent = produto.vendido;
        celMeta.textContent = produto.meta_venda;

        celAcoes.innerHTML = `
            <button onclick="editarProduto(${i})">Editar</button>
            <button onclick="excluirProduto(${i})">Excluir</button>
        `;
    }
}

// Função para editar um produto
function editarProduto(indice) {
    let produto = listaProdutos[indice];

    document.getElementById("produto").value = produto.nome;
    document.getElementById("preco_unitario").value = produto.preco_unitario;
    document.getElementById("vendido").value = produto.vendido;
    document.getElementById("meta_venda").value = produto.meta_venda;

    listaProdutos.splice(indice, 1);
    atualizarTabelaProdutos();
}

// Função para excluir um produto
function excluirProduto(indice) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        listaProdutos.splice(indice, 1);
        atualizarTabelaProdutos();
    }
}

// Função para cadastrar todos os produtos
function cadastrar_produtos() {
    if (listaProdutos.length === 0) {
        alert("Adicione pelo menos um produto antes de avançar!");
        return false;
    }

    let dados = {
        produtos: listaProdutos
    };

    let dadosJSON = JSON.stringify(dados);

    // Aqui você enviaria os dados para o servidor
    console.log("Dados prontos para enviar:", dadosJSON);

    // Salvar temporariamente no localStorage
    localStorage.setItem("dadosProdutos", dadosJSON);

    alert("Produtos cadastrados com sucesso!");
    return true;
}

// Inicializar a lista quando a página carregar
window.onload = function() {
    let dadosSalvos = localStorage.getItem("dadosProdutos");
    if (dadosSalvos) {
        let dados = JSON.parse(dadosSalvos);
        listaProdutos = dados.produtos || [];
        atualizarTabelaProdutos();
    }
    
};