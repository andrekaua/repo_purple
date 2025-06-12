function botao() {
    const opcao = document.getElementById('opcao');
    opcao.style.display = opcao.style.display == 'block' ? 'none' : 'block';
}

function adicionarEvento(dadosEvento) {
    const eventosGrid = document.getElementById('eventosGrid');
    let dataFormatada = '';
    if (dadosEvento.data) {
        let data;
        if (dadosEvento.data.length > 10) {
            data = new Date(dadosEvento.data);
        } else {
            data = new Date(dadosEvento.data + 'T00:00:00Z');
        }
        if (!isNaN(data.getTime())) {
            dataFormatada = data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        } else {
            dataFormatada = dadosEvento.data;
        }
    }
    let nomeDisplay = dadosEvento.nome ? dadosEvento.nome.toUpperCase() : 'EVENTO';
    let imagemHTML = '';
    if (dadosEvento.imagem) {
        imagemHTML = `
            <div class="evento-imagem-wrapper">
                <img src="${dadosEvento.imagem}" alt="Imagem do Evento" class="img-evento">
                <div class="evento-overlay">
                    <span class="evento-data">${dadosEvento.data ? dataFormatada : ''}</span>
                </div>
            </div>
        `;
    } else {
        imagemHTML = `
            <div class="evento-imagem-wrapper">
                <div class="img-evento-placeholder">Sem imagem</div>
                <div class="evento-overlay">
                    <span class="evento-data">${dadosEvento.data ? dataFormatada : ''}</span>
                </div>
            </div>
        `;
    }
    const eventoHTML = `
        <div class="evento-card" data-id="${dadosEvento.id}">
            ${imagemHTML}
            <div class="evento-info">
                <div class="evento-nome">${dadosEvento.nome || 'Nome do Evento'}</div>
                <div class="evento-local">${dadosEvento.local || 'Local do Evento'}</div>
            </div>
        </div>
    `;
    eventosGrid.insertAdjacentHTML('beforeend', eventoHTML);
    const novoCard = eventosGrid.lastElementChild;
    adicionarEventListenersCard(novoCard);
    novoCard.addEventListener('click', function() {
        window.location.href = `dashboard/dashboard.html?id=${dadosEvento.id}`;
    });
}

function adicionarEventListenersCard(card) {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
}

document.getElementById('pesquisa').addEventListener('input', function(e) {
    const termoBusca = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.evento-card');
    cards.forEach(card => {
        const nomeEvento = card.querySelector('.evento-nome').textContent.toLowerCase();
        const localEvento = card.querySelector('.evento-local').textContent.toLowerCase();
        const dataEvento = card.querySelector('.evento-data') ? card.querySelector('.evento-data').textContent.toLowerCase() : '';
        if (nomeEvento.includes(termoBusca) || localEvento.includes(termoBusca) || dataEvento.includes(termoBusca)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

function carregarEventos() {
    const organizador_id = localStorage.getItem('organizador_id');
    if (!organizador_id) {
        alert('Usuário não autenticado. Faça login novamente.');
        window.location.href = '/login.html';
        return;
    }
    fetch(`/evento/buscar_eventos?organizador_id=${organizador_id}`)
        .then(resposta => {
            if (!resposta.ok) throw new Error("Erro ao buscar eventos!");
            return resposta.json();
        })
        .then(eventos => {
            document.getElementById('eventosGrid').innerHTML = "";
            eventos.forEach(evento => adicionarEvento(evento));
        })
        .catch(erro => {
            console.error("Erro ao carregar eventos:", erro);
        });
}

window.onload = carregarEventos;