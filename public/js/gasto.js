// Array para armazenar todos os gastos
let listaGastos = [];

// Função para adicionar gastos à tabela
function adicionar_gastos() {
    let gasto_nome = document.getElementById("gasto_nome").value;
    let gasto_valor = parseFloat(document.getElementById("gasto_valor").value);
    
    if (gasto_nome.trim() === "" || isNaN(gasto_valor) || gasto_valor <= 0) {
        alert("Por favor, preencha todos os campos corretamente!");
        return;
    }
    
    let gasto = {
        nome: gasto_nome,
        valor: gasto_valor,
        descricao: "" 
    };
    
    // Adicionar o gasto ao array
    listaGastos.push(gasto);
    
    // Atualizar a tabela
    atualizarTabela();
    
    document.getElementById("gasto_nome").value = "";
    document.getElementById("gasto_valor").value = "";
}

function atualizarTabela() {
    let tabela = document.getElementById("tabela_gastos");
    
    while (tabela.rows.length > 1) {
        tabela.deleteRow(1);
    }
    
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
    
    listaGastos.splice(indice, 1);
    
    // Atualizar a tabela
    atualizarTabela();
}

// Função para excluir um gasto
function excluirGasto(indice) {
    // Confirmar antes de excluir
    if (confirm("Tem certeza que deseja excluir este gasto?")) {
        listaGastos.splice(indice, 1);
        
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
    const eventoIdElement = document.getElementById("evento_id");
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