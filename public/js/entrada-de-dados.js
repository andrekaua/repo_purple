// Array para armazenar todos os gastos
let listaGastos = [];

// Função para adicionar gastos à tabela
function adicionar_gastos() {
    // Obter os valores dos campos
    let gasto_nome = document.getElementById("gasto_nome").value;
    let gasto_valor = parseFloat(document.getElementById("gasto_valor").value);
    
    // Validar os dados
    if (gasto_nome.trim() === "" || isNaN(gasto_valor) || gasto_valor <= 0) {
        alert("Por favor, preencha todos os campos corretamente!");
        return;
    }
    
    // Criar um objeto para o gasto
    let gasto = {
        nome: gasto_nome,
        valor: gasto_valor
    };
    
    // Adicionar o gasto ao array
    listaGastos.push(gasto);
    
    // Atualizar a tabela
    atualizarTabela();
    
    // Limpar os campos após adicionar
    document.getElementById("gasto_nome").value = "";
    document.getElementById("gasto_valor").value = "";
}

// Função para atualizar a tabela de gastos
function atualizarTabela() {
    let tabela = document.getElementById("tabela_gastos");
    
    // Limpar a tabela (exceto o cabeçalho)
    while (tabela.rows.length > 1) {
        tabela.deleteRow(1);
    }
    
    // Variável para calcular o total
    let total = 0;
    
    // Adicionar cada gasto à tabela
    for (let i = 0; i < listaGastos.length; i++) {
        let gasto = listaGastos[i];
        
        // Criar uma nova linha
        let novaLinha = tabela.insertRow();
        
        // Inserir células
        let celNome = novaLinha.insertCell(0);
        let celValor = novaLinha.insertCell(1);
        let celAcoes = novaLinha.insertCell(2);
        
        // Adicionar os dados às células
        celNome.textContent = gasto.nome;
        celValor.textContent = gasto.valor.toFixed(2);
        
        // Adicionar botões de editar e excluir
        celAcoes.innerHTML = `
            <button onclick="editarGasto(${i})">Editar</button>
            <button onclick="excluirGasto(${i})">Excluir</button>
        `;
        
        // Somar ao total
        total += gasto.valor;
    }
    
    // Atualizar o valor total
    document.getElementById("valor-total").textContent = total.toFixed(2);
}

// Função para editar um gasto
function editarGasto(indice) {
    let gasto = listaGastos[indice];
    
    // Preencher os campos com os valores do gasto
    document.getElementById("gasto_nome").value = gasto.nome;
    document.getElementById("gasto_valor").value = gasto.valor;
    
    // Remover o gasto da lista (será adicionado novamente quando o usuário clicar em Adicionar)
    listaGastos.splice(indice, 1);
    
    // Atualizar a tabela
    atualizarTabela();
}

// Função para excluir um gasto
function excluirGasto(indice) {
    // Confirmar antes de excluir
    if (confirm("Tem certeza que deseja excluir este gasto?")) {
        // Remover o gasto da lista
        listaGastos.splice(indice, 1);
        
        // Atualizar a tabela
        atualizarTabela();
    }
}

// Função para cadastrar todos os gastos
function cadastrar_gastos() {
    // Verificar se há gastos para cadastrar
    if (listaGastos.length === 0) {
        alert("Adicione pelo menos um gasto antes de avançar!");
        return false;
    }
    
    // Criar um objeto com todos os gastos
    let dados = {
        gastos: listaGastos,
        total: calcularTotal()
    };
    
    // Converter para JSON
    let dadosJSON = JSON.stringify(dados);
    
    // Aqui você enviaria os dados para o servidor
    console.log("Dados prontos para enviar:", dadosJSON);
    
    // Para salvar temporariamente no localStorage (apenas para demonstração)
    localStorage.setItem("dadosGastos", dadosJSON);
    
    alert("Gastos cadastrados com sucesso!");
    return true;    
}

// Função para calcular o total dos gastos
function calcularTotal() {
    let total = 0;
    for (let gasto of listaGastos) {
        total += gasto.valor;
    }
    return total;
}

// Inicializar a tabela quando a página carregar
window.onload = function() {
    // Verificar se há dados salvos no localStorage
    let dadosSalvos = localStorage.getItem("dadosGastos");
    if (dadosSalvos) {
        let dados = JSON.parse(dadosSalvos);
        listaGastos = dados.gastos;
        atualizarTabela();
    }
};

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