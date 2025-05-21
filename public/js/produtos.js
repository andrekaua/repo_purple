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

// Função para atualizar a tabela de produtos
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

// Função para cadastrar todos os produtos no servidor
function cadastrar_produtos() {
    if (listaProdutos.length === 0) {
        alert("Adicione pelo menos um produto antes de avançar!");
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
        produtos: listaProdutos
    };

    // Enviar dados para o servidor via fetch API
    fetch("/entrada-dados/cadastrarProdutos", {
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
            throw new Error("Erro ao cadastrar produtos!");
        }
    })
    .then(resposta => {
        console.log("Resposta do servidor:", resposta);
        alert("Produtos cadastrados com sucesso!");
        
        // Limpar a lista após cadastro bem-sucedido
        listaProdutos = [];
        atualizarTabelaProdutos();
        
    })
    .catch(erro => {
        console.error("Erro:", erro);
        alert("Erro ao cadastrar produtos. Por favor, tente novamente.");
    });

    return true;
}
