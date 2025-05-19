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