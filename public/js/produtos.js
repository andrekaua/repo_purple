let produtos = [];
const produto_nome = document.getElementById('produto');
const preco_unitario = document.getElementById('preco_unitario');
const vendido = document.getElementById('vendido');
const meta_venda = document.getElementById('meta_venda');
const notification = document.getElementById('notificacao');
const tabelaProdutos = document.getElementById('tabela_produtos').getElementsByTagName('tbody')[0];
const idEvento = sessionStorage.getItem("evento_id");

const edit_nome = document.getElementById('edit_nome');
const edit_valor = document.getElementById('edit_valor');
const edit_vendido = document.getElementById('edit_vendido');
const edit_meta = document.getElementById('edit_meta');
const edit_index = document.getElementById('edit');
const edicao = document.getElementById('edicao');

const quantidadeItens = document.getElementById('quantidade-itens');
const valorTotal = document.getElementById('valor-total');

// Atualiza a tabela de produtos
function atualizarTabelaProdutos() {
    tabelaProdutos.innerHTML = "";
    let total = 0;
    for (let i = 0; i < produtos.length; i++) {
        const prod = produtos[i];
        const row = tabelaProdutos.insertRow();
        row.insertCell(0).textContent = prod.nome;
        row.insertCell(1).textContent = prod.valor.toFixed(2);
        row.insertCell(2).textContent = prod.vendido;
        row.insertCell(3).textContent = prod.meta;
        const acoes = row.insertCell(4);
        acoes.innerHTML = `
            <button onclick="editarProduto(${i})" class="edit-expense">Editar</button>
            <button onclick="excluirProduto(${i})" class="delete-expense">Excluir</button>
        `;
        total += prod.valor;
    }
    quantidadeItens.textContent = produtos.length;
    valorTotal.textContent = total.toFixed(2);
}

// Total
function calcularTotal() {
    return produtos.reduce((soma, prod) => soma + prod.valor, 0);
}

// Quantidade de produtos
function quantidadeProdutos() {
    return produtos.length;
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

// Adicionar produto
function adicionar_produto() {
    const nome = produto_nome.value.trim();
    const valor = parseFloat(preco_unitario.value);
    const qtd_vendido = parseInt(vendido.value);
    const meta = parseInt(meta_venda.value);

    if (!nome || isNaN(valor) || valor < 0 || isNaN(qtd_vendido) || qtd_vendido < 0 || isNaN(meta) || meta < 0) {
        mostrarNotificacao("Preencha todos os campos corretamente!", false);
        return;
    }

    produtos.push({ nome, valor, vendido: qtd_vendido, meta });
    mostrarNotificacao("Produto cadastrado com sucesso!", true);

    atualizarTabelaProdutos();
    produto_nome.value = "";
    preco_unitario.value = "";
    vendido.value = "";
    meta_venda.value = "";
}

// Excluir produto
function excluirProduto(index) {
    produtos.splice(index, 1);
    atualizarTabelaProdutos();
    mostrarNotificacao("Produto excluído com sucesso!", false);
}

// Editar produto (abre modal de edição)
function editarProduto(index) {
    const prod = produtos[index];
    edit_nome.value = prod.nome;
    edit_valor.value = prod.valor;
    edit_vendido.value = prod.vendido;
    edit_meta.value = prod.meta;
    edit_index.value = index;
    edicao.style.display = 'block';
}

// Salvar edição
document.getElementById('salvar_edicao').onclick = function() {
    const index = parseInt(edit_index.value);
    const nome = edit_nome.value.trim();
    const valor = parseFloat(edit_valor.value);
    const vendido = parseInt(edit_vendido.value);
    const meta = parseInt(edit_meta.value);

    if (!nome || isNaN(valor) || valor < 0 || isNaN(vendido) || vendido < 0 || isNaN(meta) || meta < 0) {
        mostrarNotificacao("Preencha corretamente todos os campos de edição!", false);
        return;
    }

    produtos[index] = { nome, valor, vendido, meta };

    atualizarTabelaProdutos();
    edicao.style.display = 'none';
    mostrarNotificacao("Produto editado com sucesso!", true);
};

// Cancelar edição
document.getElementById('cancelar_edicao').onclick = function() {
    edicao.style.display = 'none';
};

// Inicialmente esconde a área de edição
edicao.style.display = 'none';

// Função para validação antes de avançar
function cadastrar_produtos() {
    if (produtos.length === 0) {
        mostrarNotificacao("Adicione pelo menos um produto antes de avançar!", false);
        return false;
    }

    mostrarNotificacao("Produtos validados! Pronto para avançar!", true);

    // Monte os dados corretamente
    const dados_produtos = {
        produtos: produtos,
        quantidade: quantidadeProdutos(),
        total: calcularTotal(),
        evento_id: idEvento
    };
    
    console.log('Dados enviados:', dados_produtos);

    fetch("/produtos/cadastrar_produtos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados_produtos)
    })
    .then(resposta => {
        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar produtos!");
        }
        return resposta.json();
    })
    .then(resposta => {
        console.log("Resposta do servidor:", resposta);
        mostrarNotificacao("Produtos cadastrados com sucesso!", true);
        window.location.href = "tipo-de-ingresso.html";
    })
    .catch(erro => {
        console.error("Erro:", erro);
        mostrarNotificacao("Erro ao cadastrar produtos. Por favor, tente novamente.", false);
    });

    return false;
}