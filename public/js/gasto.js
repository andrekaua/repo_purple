let gastos = [];
const nome_gasto = document.getElementById('gasto_nome');
const valor_gasto = document.getElementById('gasto_valor');
const notification = document.getElementById('notificacao');
const tabelaGastos = document.getElementById('tabela_gastos').getElementsByTagName('tbody')[0];
const quantidadeItens = document.getElementById('quantidade-itens');
const valorTotal = document.getElementById('valor-total');
const idEvento = sessionStorage.getItem("evento_id");

function atualizarTabela() {
    tabelaGastos.innerHTML = "";
    let total = 0;
    for (let i = 0; i < gastos.length; i++) {
        const gasto = gastos[i];
        const row = tabelaGastos.insertRow();
        row.insertCell(0).textContent = gasto.nome;
        row.insertCell(1).textContent = gasto.valor.toFixed(2);
        const acoes = row.insertCell(2);
        acoes.innerHTML = `
            <button onclick="editarGasto(${i})" class="edit-expense">Editar</button>
            <button onclick="excluirGasto(${i})" class="delete-expense">Excluir</button>
        `;
        total += gasto.valor;
    }
    quantidadeItens.textContent = gastos.length;
    valorTotal.textContent = total.toFixed(2);
}

//quantidade de produto
function quantidade() {
    return gastos.length;
}

//soma dos produtos
function calcularTotal() {
    return gastos.reduce((soma, gasto) => soma + gasto.valor, 0);
}

//notificação - se for certo "true" se for errado "false"
function mostrarNotificacao(msg, sucesso = false) {
    notification.innerHTML = msg;
    notification.style.display = "block";
    notification.style.opacity = "1";
    notification.className = sucesso ? "notification notification-success" : "notification notification-error";
    setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => {
            notification.style.display = "none";
        }, 500);
    }, 2000);
}


//add gasto
function add_gasto() {
    const nome = nome_gasto.value.trim();
    const valor = parseFloat(valor_gasto.value);

    if (!nome || isNaN(valor) || valor < 0) {
        mostrarNotificacao("Erro: preencha todos os campos corretamente para adicionar!", false);
        return;
    }

    gastos.push({ nome, valor });
    mostrarNotificacao("Gasto cadastrado com sucesso!", true);

    atualizarTabela();
    nome_gasto.value = "";
    valor_gasto.value = "";
}

// excluir gasto
function excluirGasto(index) {
    gastos.splice(index, 1);
    atualizarTabela();

    mostrarNotificacao("Gasto excluído com sucesso!", false);
}

// editar 
function editarGasto(index) {
    const gasto = gastos[index];
    document.getElementById('edit_nome').value = gasto.nome;
    document.getElementById('edit_valor').value = gasto.valor;
    document.getElementById('edit').value = index;
    document.getElementById('edicao').style.display = 'block';
}

// Salva o edit
document.getElementById('salvar_edicao').onclick = function() {
    const index = document.getElementById('edit').value;
    const nome = document.getElementById('edit_nome').value.trim();
    const valor = parseFloat(document.getElementById('edit_valor').value);

    if (!nome || isNaN(valor) || valor < 0) {
        notification.innerHTML = "Erro ao editar gasto!";
        return;
    }

    gastos[index] = { nome, valor };
    atualizarTabela();
    document.getElementById('edicao').style.display = 'none';
    mostrarNotificacao("Gasto editado com sucesso!", true);
};

//cancela  a edição
document.getElementById('cancelar_edicao').onclick = function() {
    document.getElementById('edicao').style.display = 'none';
};

// cadastrar gastos
function cadastrar_gastos() {
    let qtd = quantidade();
    console.log("Quantidade de gastos:", qtd);

    let total = calcularTotal();
    console.log("Total atual:", total);

    //validações 
    if (gastos.length === 0) {
        mostrarNotificacao("Adicione pelo menos um gasto antes de avançar!", false);
        return false;
    }

    const dados_gastos = {
    gastos: gastos,
    qntdd_gastos: qtd,
    total_gastos: total,
    evento_id: idEvento 
    };

    console.log("Dados dos gastos:", dados_gastos);

    fetch("/gasto/cadastrar_gastos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados_gastos)
    })
    .then(resposta => {
        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar gastos!");
        }
        return resposta.json();
    })
    .then(resposta => {
        console.log("Resposta do servidor:", resposta);
        mostrarNotificacao("Gastos cadastrados com sucesso!", true);
        setTimeout(() => {
            window.location.href = "produto-adicionais.html";
        }, 1000); // Aguarda 1 segundo para mostrar a notificação
    })
    .catch(erro => {
        console.error("Erro:", erro);
        alert("Erro ao cadastrar gastos. Por favor, tente novamente.");
    });

    return false;

    mostrarNotificacao("Gastos validados! Pronto para avançar!", true);
    return true;
}