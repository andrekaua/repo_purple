// Variáveis globais para armazenar os dados
let eventoAtual = {};
let gastosAtuais = [];
let produtosAtuais = [];
let ingressosAtuais = [];

// Função para obter o ID do evento da URL
function obterEventoId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Carregar dados do evento 
document.addEventListener('DOMContentLoaded', function() {
    const eventoId = obterEventoId();
    if (eventoId) {
        carregarDadosEvento(eventoId);
    } else {
        alert('ID do evento não encontrado na URL!');
    }
});

// Carregar todos os dados do evento
function carregarDadosEvento(eventoId) {
    fetch(`/editar-evento/buscar/${eventoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar dados do evento');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos:', data); 
            
            if (data && data.length > 0) {
                const evento = data[0];
                eventoAtual = evento;

                // Popular campos do evento
                popularCamposEvento(evento);

                // Popular tabelas (agora já são arrays)
                gastosAtuais = evento.gastos || [];
                produtosAtuais = evento.produtos || [];
                ingressosAtuais = evento.ingressos || [];

                atualizarTabelaGastos();
                atualizarTabelaProdutos();
                atualizarTabelaIngressos();
            } else {
                alert('Evento não encontrado!');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar dados do evento: ' + error.message);
        });
}

// Popular formulário
function popularCamposEvento(evento) {
    document.getElementById('nome').value = evento.nome || '';
    
    // Formatar data corretamente
    if (evento.data) {
        const data = new Date(evento.data);
        const dataFormatada = data.toISOString().split('T')[0];
        document.getElementById('data').value = dataFormatada;
    }
    
    document.getElementById('local').value = evento.local || '';
    document.getElementById('capacidade').value = evento.capacidade || '';
    document.getElementById('lucro').value = evento.lucro_desejado || evento.meta_lucro || '';
}

// Atualizar gastos
function atualizarTabelaGastos() {
    const tbody = document.querySelector('#tabela_gastos tbody');
    tbody.innerHTML = '';

    gastosAtuais.forEach((gasto, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${gasto.nome}</td>
            <td>R$ ${parseFloat(gasto.valor || 0).toFixed(2)}</td>
            <td>
                <button onclick="editarGasto(${index})" class="btn-editar">Editar</button>
                <button onclick="removerGasto(${index})" class="btn-remover">Remover</button>
            </td>
        `;
    });
}

// Atualizar produtos
function atualizarTabelaProdutos() {
    const tbody = document.querySelector('#tabela_produtos tbody');
    tbody.innerHTML = '';

    produtosAtuais.forEach((produto, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${produto.nome}</td>
            <td>R$ ${parseFloat(produto.preco || produto.valor || 0).toFixed(2)}</td>
            <td>${produto.vendido || 0}</td>
            <td>${produto.meta || 0}</td>
            <td>
                <button onclick="editarProduto(${index})" class="btn-editar">Editar</button>
                <button onclick="removerProduto(${index})" class="btn-remover">Remover</button>
            </td>
        `;
    });
}

// Atualizar ingressos
function atualizarTabelaIngressos() {
    const tbody = document.querySelector('#tabela_ingressos tbody');
    tbody.innerHTML = '';

    ingressosAtuais.forEach((ingresso, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${ingresso.tipo}</td>
            <td>R$ ${parseFloat(ingresso.preco || 0).toFixed(2)}</td>
            <td>${ingresso.quantidade_disponivel || 0}</td>
            <td>${ingresso.vendido || 0}</td>
            <td>${ingresso.meta || 0}</td>
            <td>
                <button onclick="editarIngresso(${index})" class="btn-editar">Editar</button>
                <button onclick="removerIngresso(${index})" class="btn-remover">Remover</button>
            </td>
        `;
    });
}

// Funções dos popups
function abrirPopup(id) {
    document.getElementById(id).style.display = 'block';
}

function fecharPopup(id) {
    document.getElementById(id).style.display = 'none';
    limparCamposPopup(id);
}

function limparCamposPopup(id) {
    const popup = document.getElementById(id);
    if (!popup) return;
    const inputs = popup.querySelectorAll('input, select');
    inputs.forEach(input => input.value = '');
}

// Salvar  gasto
function salvarNovoGasto() {
    const nome = document.getElementById('novo_gasto_nome').value;
    const valor = parseFloat(document.getElementById('novo_gasto_valor').value);

    if (!nome || isNaN(valor)) {
        alert('Preencha todos os campos!');
        return;
    }

    gastosAtuais.push({ nome, valor });
    atualizarTabelaGastos();
    fecharPopup('popup_gasto');
}

// Salvar  produto
function salvarNovoProduto() {
    const nome = document.getElementById('novo_produto_nome').value;
    const preco = parseFloat(document.getElementById('novo_produto_preco').value);
    const vendido = parseInt(document.getElementById('novo_produto_vendido').value) || 0;
    const meta = parseInt(document.getElementById('novo_produto_meta').value) || 0;

    if (!nome || isNaN(preco)) {
        alert('Preencha nome e preço!');
        return;
    }

    produtosAtuais.push({ nome, preco, vendido, meta });
    atualizarTabelaProdutos();
    fecharPopup('popup_produto');
}

// Salvar  ingresso
function salvarNovoIngresso() {
    // Adiciona opções fixas para o tipo de ingresso
    const tipoInput = document.getElementById('novo_ingresso_tipo');
    if (tipoInput.tagName.toLowerCase() !== 'select') {
        // Substitui o input por um select se ainda não for
        const select = document.createElement('select');
        select.id = 'novo_ingresso_tipo';
        select.innerHTML = `
            <option value="">Selecione o tipo de ingresso</option>
            <option value="Ingresso Pista">Ingresso Pista</option>
            <option value="Ingresso Front">Ingresso Front</option>
            <option value="Ingresso Camarote">Ingresso Camarote</option>
            <option value="Ingresso Backstage">Ingresso Backstage</option>
            <option value="Ingresso Estudante">Ingresso Estudante</option>
            <option value="Ingresso Meia-Entrada">Ingresso Meia-Entrada</option>
            <option value="Ingresso VIP">Ingresso VIP</option>
        `;
        tipoInput.parentNode.replaceChild(select, tipoInput);
    }
    const tipo = document.getElementById('novo_ingresso_tipo').value;
    const preco = parseFloat(document.getElementById('novo_ingresso_preco').value);
    const quantidade_disponivel = parseInt(document.getElementById('novo_ingresso_qtd').value);
    const vendido = parseInt(document.getElementById('novo_ingresso_vendido').value) || 0;
    const meta = parseInt(document.getElementById('novo_ingresso_meta').value) || 0;

    if (!tipo || isNaN(preco) || isNaN(quantidade_disponivel)) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }

    ingressosAtuais.push({ tipo, preco, quantidade_disponivel, vendido, meta });
    atualizarTabelaIngressos();
    fecharPopup('popup_ingresso');
    limparCamposPopup('popup_ingresso');
}

// Funções de edição
function editarGasto(index) {
    const gasto = gastosAtuais[index];
    document.getElementById('novo_gasto_nome').value = gasto.nome;
    document.getElementById('novo_gasto_valor').value = gasto.valor;

    const btnSalvar = document.querySelector('#popup_gasto .edit-actions button:last-child');
    btnSalvar.onclick = () => {
        const nome = document.getElementById('novo_gasto_nome').value;
        const valor = parseFloat(document.getElementById('novo_gasto_valor').value);

        if (!nome || isNaN(valor)) {
            alert('Preencha todos os campos!');
            return;
        }

        gastosAtuais[index] = { ...gastosAtuais[index], nome, valor };
        atualizarTabelaGastos();
        fecharPopup('popup_gasto');
        btnSalvar.onclick = salvarNovoGasto;
    };

    abrirPopup('popup_gasto');
}

function editarProduto(index) {
    const produto = produtosAtuais[index];
    document.getElementById('novo_produto_nome').value = produto.nome;
    document.getElementById('novo_produto_preco').value = produto.preco || produto.valor;
    document.getElementById('novo_produto_vendido').value = produto.vendido || 0;
    document.getElementById('novo_produto_meta').value = produto.meta || 0;

    const btnSalvar = document.querySelector('#popup_produto .edit-actions button:last-child');
    btnSalvar.onclick = () => {
        const nome = document.getElementById('novo_produto_nome').value;
        const preco = parseFloat(document.getElementById('novo_produto_preco').value);
        const vendido = parseInt(document.getElementById('novo_produto_vendido').value) || 0;
        const meta = parseInt(document.getElementById('novo_produto_meta').value) || 0;

        if (!nome || isNaN(preco)) {
            alert('Preencha nome e preço!');
            return;
        }

        produtosAtuais[index] = { ...produtosAtuais[index], nome, preco, vendido, meta };
        atualizarTabelaProdutos();
        fecharPopup('popup_produto');
        btnSalvar.onclick = salvarNovoProduto;
    };

    abrirPopup('popup_produto');
}

function editarIngresso(index) {
    const ingresso = ingressosAtuais[index];
    document.getElementById('novo_ingresso_tipo').value = ingresso.tipo;
    document.getElementById('novo_ingresso_preco').value = ingresso.preco;
    document.getElementById('novo_ingresso_qtd').value = ingresso.quantidade_disponivel;
    document.getElementById('novo_ingresso_vendido').value = ingresso.vendido || 0;
    document.getElementById('novo_ingresso_meta').value = ingresso.meta || 0;

    const btnSalvar = document.querySelector('#popup_ingresso .edit-actions button:last-child');
    btnSalvar.onclick = () => {
        const tipo = document.getElementById('novo_ingresso_tipo').value;
        const preco = parseFloat(document.getElementById('novo_ingresso_preco').value);
        const quantidade_disponivel = parseInt(document.getElementById('novo_ingresso_qtd').value);
        const vendido = parseInt(document.getElementById('novo_ingresso_vendido').value) || 0;
        const meta = parseInt(document.getElementById('novo_ingresso_meta').value) || 0;

        if (!tipo || isNaN(preco) || isNaN(quantidade_disponivel)) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }

        ingressosAtuais[index] = { ...ingressosAtuais[index], tipo, preco, quantidade_disponivel, vendido, meta };
        atualizarTabelaIngressos();
        fecharPopup('popup_ingresso');
        btnSalvar.onclick = salvarNovoIngresso;
    };

    abrirPopup('popup_ingresso');
}

// Funções de remoção
function removerGasto(index) {
    if (confirm('Tem certeza que deseja remover este gasto?')) {
        gastosAtuais.splice(index, 1);
        atualizarTabelaGastos();
    }
}

function removerProduto(index) {
    if (confirm('Tem certeza que deseja remover este produto?')) {
        produtosAtuais.splice(index, 1);
        atualizarTabelaProdutos();
    }
}

function removerIngresso(index) {
    if (confirm('Tem certeza que deseja remover este ingresso?')) {
        ingressosAtuais.splice(index, 1);
        atualizarTabelaIngressos();
    }
}

// Funções de salvamento no servidor
document.getElementById('salvar_evento').addEventListener('click', function() {
    const eventoId = obterEventoId();
    const inputImagem = document.getElementById('imagem');
    let imagemUrl = eventoAtual.imagem || null; // valor atual

    function enviarAtualizacao(imagemFinal) {
        const dados = {
            nome: document.getElementById('nome').value,
            data: document.getElementById('data').value,
            local: document.getElementById('local').value,
            capacidade: parseInt(document.getElementById('capacidade').value),
            lucro: parseFloat(document.getElementById('lucro').value),
            imagem: imagemFinal // novo ou atual
        };

        if (!dados.nome || !dados.data || !dados.local || isNaN(dados.capacidade) || isNaN(dados.lucro)) {
            alert('Preencha todos os campos do evento!');
            return;
        }

        fetch(`/editar-evento/atualizar_evento/${eventoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor');
            }
            return response.json();
        })
        .then(data => {
            alert('Evento atualizado com sucesso!');
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao salvar evento: ' + error.message);
        });
    }

    if (inputImagem && inputImagem.files && inputImagem.files[0]) {
        const formData = new FormData();
        formData.append('imagem', inputImagem.files[0]);
        fetch('/upload/imagem-evento', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            enviarAtualizacao(data.imageUrl);
        })
        .catch(() => {
            alert('Erro ao fazer upload da imagem!');
        });
    } else {
        enviarAtualizacao(imagemUrl);
    }
});

document.getElementById('salvar_gastos').addEventListener('click', function() {
    const eventoId = obterEventoId();

    fetch(`/editar-evento/atualizar_gastos/${eventoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gastos: gastosAtuais })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        return response.json();
    })
    .then(data => {
        alert('Gastos atualizados com sucesso!');
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao salvar gastos: ' + error.message);
    });
});

document.getElementById('salvar_produtos').addEventListener('click', function() {
    const eventoId = obterEventoId();

    fetch(`/editar-evento/atualizar_produtos/${eventoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ produtos: produtosAtuais })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        return response.json();
    })
    .then(data => {
        alert('Produtos atualizados com sucesso!');
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao salvar produtos: ' + error.message);
    });
});

document.getElementById('salvar_ingressos').addEventListener('click', function() {
    const eventoId = obterEventoId();

    fetch(`/editar-evento/atualizar_ingressos/${eventoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ingressos: ingressosAtuais })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        return response.json();
    })
    .then(data => {
        alert('Ingressos atualizados com sucesso!');
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao salvar ingressos: ' + error.message);
    });
});