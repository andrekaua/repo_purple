let ingressos = [];
const tipo_ingresso = document.getElementById('tipo_ingresso');
const preco = document.getElementById('preco');
const quantidade = document.getElementById('quantidade');
const vendido = document.getElementById('vendido');
const meta_venda = document.getElementById('meta_venda');
const notification = document.getElementById('notificacao');
const tabelaIngressos = document.getElementById('tabela_ingressos').getElementsByTagName('tbody')[0];
const idEvento = sessionStorage.getItem("evento_id");

const edit_tipo = document.getElementById('edit_tipo');
const edit_preco = document.getElementById('edit_preco');
const edit_quantidade = document.getElementById('edit_quantidade');
const edit_vendido = document.getElementById('edit_vendido');
const edit_meta = document.getElementById('edit_meta');
const edit_index = document.getElementById('edit');
const edicao = document.getElementById('edicao');

const quantidadeItens = document.getElementById('quantidade-itens');
const valorTotal = document.getElementById('valor-total');

// Atualiza a tabela de ingressos
function atualizarTabelaIngressos() {
    tabelaIngressos.innerHTML = "";
    let total = 0;
    for (let i = 0; i < ingressos.length; i++) {
        const ing = ingressos[i];
        const row = tabelaIngressos.insertRow();
        row.insertCell(0).textContent = ing.tipo;
        row.insertCell(1).textContent = parseFloat(ing.preco).toFixed(2);
        row.insertCell(2).textContent = ing.quantidade_disponivel;
        row.insertCell(3).textContent = ing.vendido;
        row.insertCell(4).textContent = ing.meta;
        const acoes = row.insertCell(5);
        acoes.innerHTML = `
            <button onclick="editarIngresso(${i})" class="edit-expense">Editar</button>
            <button onclick="excluirIngresso(${i})" class="delete-expense">Excluir</button>
        `;
        total += parseFloat(ing.preco);
    }
    quantidadeItens.textContent = ingressos.length;
    valorTotal.textContent = total.toFixed(2);
}

// Total
function calcularTotal() {
    return ingressos.reduce((soma, ing) => soma + parseFloat(ing.preco), 0);
}

// Quantidade de ingressos
function quantidadeIngressos() {
    return ingressos.length;
}

// Notificação
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

// Adicionar ingresso
function adicionar_ingresso() {
    const tipo = tipo_ingresso.value.trim();
    const precoValor = parseFloat(preco.value);
    const qtd_disponivel = parseInt(quantidade.value);
    const qtd_vendido = parseInt(vendido.value);
    const meta = parseInt(meta_venda.value);

    if (!tipo || isNaN(precoValor) || precoValor < 0 || isNaN(qtd_disponivel) || qtd_disponivel < 0 || isNaN(qtd_vendido) || qtd_vendido < 0 || isNaN(meta) || meta < 0) {
        mostrarNotificacao("Preencha todos os campos corretamente!", false);
        return;
    }

    // Verificar se vendido não é maior que disponível
    if (qtd_vendido > qtd_disponivel) {
        mostrarNotificacao("Quantidade vendida não pode ser maior que a disponível!", false);
        return;
    }

    ingressos.push({ 
        tipo, 
        preco: precoValor, 
        quantidade_disponivel: qtd_disponivel, 
        vendido: qtd_vendido, 
        meta 
    });
    
    mostrarNotificacao("Ingresso cadastrado com sucesso!", true);

    atualizarTabelaIngressos();
    tipo_ingresso.value = "";
    preco.value = "";
    quantidade.value = "";
    vendido.value = "";
    meta_venda.value = "";
}

// Excluir ingresso
function excluirIngresso(index) {
    ingressos.splice(index, 1);
    atualizarTabelaIngressos();
    mostrarNotificacao("Ingresso excluído com sucesso!", false);
}

// Editar ingresso (abre modal de edição)
function editarIngresso(index) {
    const ing = ingressos[index];
    edit_tipo.value = ing.tipo;
    edit_preco.value = ing.preco;
    edit_quantidade.value = ing.quantidade_disponivel;
    edit_vendido.value = ing.vendido;
    edit_meta.value = ing.meta;
    edit_index.value = index;
    edicao.style.display = 'block';
}

// Salvar edição
document.getElementById('salvar_edicao').onclick = function() {
    const index = parseInt(edit_index.value);
    const tipo = edit_tipo.value.trim();
    const precoValor = parseFloat(edit_preco.value);
    const qtd_disponivel = parseInt(edit_quantidade.value);
    const qtd_vendido = parseInt(edit_vendido.value);
    const meta = parseInt(edit_meta.value);

    if (!tipo || isNaN(precoValor) || precoValor < 0 || isNaN(qtd_disponivel) || qtd_disponivel < 0 || isNaN(qtd_vendido) || qtd_vendido < 0 || isNaN(meta) || meta < 0) {
        mostrarNotificacao("Preencha corretamente todos os campos de edição!", false);
        return;
    }

    // Verificar se vendido não é maior que disponível
    if (qtd_vendido > qtd_disponivel) {
        mostrarNotificacao("Quantidade vendida não pode ser maior que a disponível!", false);
        return;
    }

    ingressos[index] = {
        tipo,
        preco: precoValor,
        quantidade_disponivel: qtd_disponivel,
        vendido: qtd_vendido,
        meta
    };

    atualizarTabelaIngressos();
    edicao.style.display = 'none';
    mostrarNotificacao("Ingresso editado com sucesso!", true);
};

// Cancelar edição
document.getElementById('cancelar_edicao').onclick = function() {
    edicao.style.display = 'none';
};

// Inicialmente esconde a área de edição
edicao.style.display = 'none';

// Função para validação antes de avançar
function cadastrar_ingressos() {
    if (ingressos.length === 0) {
        mostrarNotificacao("Adicione pelo menos um ingresso antes de avançar!", false);
        return false;
    }

    mostrarNotificacao("Ingressos validados! Pronto para avançar!", true);

    // Monte os dados corretamente
    const dados_ingressos = {
        ingressos: ingressos,
        quantidade: quantidadeIngressos(),
        total: calcularTotal(),
        evento_id: idEvento
    };
    
    console.log('Dados enviados:', dados_ingressos);

    fetch("/ingressos/cadastrar_ingressos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados_ingressos)
    })
    .then(resposta => {
        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar ingressos!");
        }
        return resposta.json();
    })
    .then(resposta => {
        console.log("Resposta do servidor:", resposta);
        mostrarNotificacao("Ingressos cadastrados com sucesso!", true);
        window.location.href = "eventos.html";
    })
    .catch(erro => {
        console.error("Erro:", erro);
        mostrarNotificacao("Erro ao cadastrar ingressos. Por favor, tente novamente.", false);
    });

    return false;
}

// Inicializar tabela
atualizarTabelaIngressos();