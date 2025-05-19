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
        valor: gasto_valor,
        descricao: ""  // Adicionando campo de descrição, pode ser vazio
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

// Função para cadastrar todos os gastos no servidor
function cadastrar_gastos() {
    // Verificar se há gastos para cadastrar
    if (listaGastos.length === 0) {
        alert("Adicione pelo menos um gasto antes de avançar!");
        return false;
    }
    
    // Obter o ID do evento do input ou do localStorage
    const evento_id = document.getElementById("evento_id").value || sessionStorage.getItem("evento_id");
    
    if (!evento_id) {
        alert("É necessário ter um evento cadastrado primeiro!");
        return false;
    }
    
    // Criar um objeto com todos os gastos
    let dados = {
        evento_id: evento_id,
        gastos: listaGastos
    };
    
    // Enviar dados para o servidor via fetch API
    fetch("/entrada-dados/cadastrarGastos", {
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
            throw new Error("Erro ao cadastrar gastos!");
        }
    })
    .then(resposta => {
        console.log("Resposta do servidor:", resposta);
        alert("Gastos cadastrados com sucesso!");
        
        // Limpar a lista após cadastro bem-sucedido
        listaGastos = [];
        atualizarTabela();
        
        // Redirecionar ou continuar para a próxima etapa
        // window.location.href = "proxima-pagina.html";
    })
    .catch(erro => {
        console.error("Erro:", erro);
        alert("Erro ao cadastrar gastos. Por favor, tente novamente.");
    });
    
    return true;
}

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
        
        // Redirecionar ou continuar para a próxima etapa
        // window.location.href = "proxima-pagina.html";
    })
    .catch(erro => {
        console.error("Erro:", erro);
        alert("Erro ao cadastrar produtos. Por favor, tente novamente.");
    });

    return true;
}

// Função para cadastrar um novo evento
function cadastrar_evento() {
    // Obter os valores dos campos do evento
    const organizador_id = sessionStorage.getItem("organizador_id");
    const nome = document.getElementById("nome_evento").value;
    const data = document.getElementById("data_evento").value;
    const local = document.getElementById("local_evento").value;
    const meta_receita = parseFloat(document.getElementById("meta_receita").value || 0);
    const meta_lucro = parseFloat(document.getElementById("meta_lucro").value || 0);
    
    // Validar os dados
    if (!organizador_id) {
        alert("É necessário estar logado como organizador!");
        return false;
    }
    
    if (!nome || !data) {
        alert("Nome e data do evento são obrigatórios!");
        return false;
    }
    
    // Criar objeto com os dados do evento
    let dados = {
        organizador_id: organizador_id,
        nome: nome,
        data: data,
        local: local,
        meta_receita: meta_receita,
        meta_lucro: meta_lucro
    };
    
    // Enviar dados para o servidor via fetch API
    fetch("/entrada-dados/cadastrarEvento", {
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
            throw new Error("Erro ao cadastrar evento!");
        }
    })
    .then(resposta => {
        console.log("Resposta do servidor:", resposta);
        
        // Guardar o ID do evento para uso posterior
        const evento_id = resposta.evento_id;
        sessionStorage.setItem("evento_id", evento_id);
        
        if (document.getElementById("evento_id")) {
            document.getElementById("evento_id").value = evento_id;
        }
        
        alert("Evento cadastrado com sucesso! ID: " + evento_id);
        
        // Pode redirecionar ou habilitar elementos na página
        // window.location.href = "gastos.html";
        // ou
        // document.getElementById("secao-gastos").style.display = "block";
    })
    .catch(erro => {
        console.error("Erro:", erro);
        alert("Erro ao cadastrar evento. Por favor, tente novamente.");
    });
    
    return true;
}

// Função para carregar dados do usuário ao iniciar a página
function carregarDadosUsuario() {
    // Verificar se há um usuário logado
    const usuarioId = sessionStorage.getItem("organizador_id");
    const usuarioNome = sessionStorage.getItem("NOME_USUARIO"); // Corrigido aqui

    if (usuarioId && usuarioNome) {
        // Atualizar elementos da interface, se necessário
        const elementoUsuario = document.getElementById("usuario-logado");
        if (elementoUsuario) {
            elementoUsuario.textContent = "Olá, " + usuarioNome;
        }
    } else {
        // Redirecionar para a página de login se não estiver logado
        alert("É necessário fazer login para acessar esta página.");
        window.location.href = "/login.html";
    }
}

// Inicializar quando a página carregar
window.onload = function() {
    // Verificar login
    carregarDadosUsuario();
    
    // Carregar dados salvos no localStorage (se houver)
    let dadosGastos = localStorage.getItem("dadosGastos");
    if (dadosGastos) {
        let dados = JSON.parse(dadosGastos);
        listaGastos = dados.gastos || [];
        atualizarTabela();
    }
    
    let dadosIngressos = localStorage.getItem("dadosIngressos");
    if (dadosIngressos) {
        let dados = JSON.parse(dadosIngressos);
        listaIngressos = dados.ingressos || [];
        atualizarTabelaIngressos();
    }
    
    let dadosProdutos = localStorage.getItem("dadosProdutos");
    if (dadosProdutos) {
        let dados = JSON.parse(dadosProdutos);
        listaProdutos = dados.produtos || [];
        atualizarTabelaProdutos();
    }
};